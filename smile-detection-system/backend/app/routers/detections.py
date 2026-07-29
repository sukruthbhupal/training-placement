import os
import uuid
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.ai.smile_detector import SmileDetector
from app.database.session import get_db
from app.models.detection import Detection
from app.schemas.detection import DetectionResponse
from app.utils.validators import MAX_FILE_SIZE, is_valid_image

router = APIRouter()


detector = SmileDetector()


class WebcamPayload(BaseModel):
    image_base64: str


@router.post("/image", response_model=DetectionResponse, status_code=status.HTTP_201_CREATED)
async def detect_image(file: UploadFile = File(...), db: Annotated[Session, Depends(get_db)] = None) -> DetectionResponse:
    if not file.filename or not is_valid_image(file.filename):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    upload_dir = Path(os.getenv("UPLOAD_DIR", "./uploads"))
    upload_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    image_path = upload_dir / filename
    image_path.write_bytes(contents)
    result = detector.detect_from_image(str(image_path))
    detection = Detection(filename=filename, confidence=float(sum(face["confidence"] for face in result["faces"]) / max(1, len(result["faces"]))), smile=any(face["smile"] for face in result["faces"]), user_id=1)
    db.add(detection)
    db.commit()
    return DetectionResponse(**result)


@router.post("/webcam", response_model=DetectionResponse)
async def detect_webcam(payload: WebcamPayload, db: Annotated[Session, Depends(get_db)] = None) -> DetectionResponse:
    result = detector.detect_from_base64(payload.image_base64)
    detection = Detection(filename="webcam_capture.jpg", confidence=float(sum(face["confidence"] for face in result["faces"]) / max(1, len(result["faces"]))), smile=any(face["smile"] for face in result["faces"]), user_id=1)
    db.add(detection)
    db.commit()
    return DetectionResponse(**result)
