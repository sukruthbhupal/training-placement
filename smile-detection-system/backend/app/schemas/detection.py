from typing import List
from pydantic import BaseModel


class DetectionResult(BaseModel):
    smile: bool
    confidence: float
    bounding_box: List[int]


class DetectionResponse(BaseModel):
    faces: List[DetectionResult]
    timestamp: str


class DetectionCreate(BaseModel):
    filename: str
    confidence: float
    smile: bool
