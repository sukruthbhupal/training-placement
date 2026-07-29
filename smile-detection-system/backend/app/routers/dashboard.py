from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.detection import Detection
from app.schemas.dashboard import DashboardResponse

router = APIRouter()


@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(db: Annotated[Session, Depends(get_db)]) -> DashboardResponse:
    detections = db.query(Detection).filter(Detection.user_id == 1).all()
    total_uploads = len(detections)
    total_smiles = sum(1 for item in detections if item.smile)
    average_confidence = round(sum(item.confidence for item in detections) / max(1, total_uploads), 2) if detections else 0.0
    start_of_day = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_detections = sum(1 for item in detections if item.created_at >= start_of_day)
    recent_activity = [
        {"filename": item.filename, "smile": item.smile, "confidence": item.confidence, "created_at": item.created_at.isoformat()}
        for item in sorted(detections, key=lambda i: i.created_at, reverse=True)[:5]
    ]
    return DashboardResponse(total_uploads=total_uploads, total_smiles=total_smiles, average_confidence=average_confidence, today_detections=today_detections, recent_activity=recent_activity)


@router.get("/history")
def history(search: str | None = None, db: Annotated[Session, Depends(get_db)] = None) -> list[dict]:
    query = db.query(Detection).filter(Detection.user_id == 1)
    if search:
        query = query.filter(Detection.filename.contains(search))
    items = query.order_by(Detection.created_at.desc()).all()
    return [{"id": item.id, "filename": item.filename, "confidence": item.confidence, "smile": item.smile, "created_at": item.created_at.isoformat()} for item in items]


@router.delete("/history/{entry_id}")
def delete_history(entry_id: int, db: Annotated[Session, Depends(get_db)] = None) -> dict[str, str]:
    item = db.query(Detection).filter(Detection.id == entry_id, Detection.user_id == 1).first()
    if not item:
        return {"message": "History entry not found"}
    db.delete(item)
    db.commit()
    return {"message": "Deleted"}
