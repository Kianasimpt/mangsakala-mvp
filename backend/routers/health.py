from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health", tags=["System"])
def get_health():
    return {
        "status": "ok",
        "service": "mangsakala-api",
        "version": "1.0.0",
        "model_loaded": True,
        "data_loaded": True,
        "timestamp": datetime.now().isoformat()
    }
