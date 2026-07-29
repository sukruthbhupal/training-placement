from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_uploads: int
    total_smiles: int
    average_confidence: float
    today_detections: int
    recent_activity: list[dict]
