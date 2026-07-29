from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import init_db
from app.routers import auth, detections, dashboard

app = FastAPI(title="Smile Detection System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(detections.router, prefix="/api/detect", tags=["detection"])
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])

@app.on_event("startup")
def startup_event() -> None:
    init_db()

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
