from datetime import datetime

from fastapi import APIRouter

from ml.predictor import is_loaded

router = APIRouter()


@router.get("/health", tags=["System"])
def get_health():
    loaded = is_loaded()
    return {
        "status": "ok" if loaded else "degraded",
        "service": "mangsakala-api",
        "version": "1.0.0",
        "model_loaded": loaded,
        "data_loaded": loaded,
        "timestamp": datetime.now().isoformat(),
    }
