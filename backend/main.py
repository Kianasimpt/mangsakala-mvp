import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import alert, calendar, drift, health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    from ml.predictor import _load_all
    logger.info("Server starting — loading model and data...")
    _load_all()
    logger.info("Startup complete")
    yield
    logger.info("Server shutting down")


app = FastAPI(title="Mangsakala MVP API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content={"error": True, "code": "SERVER_ERROR", "message": str(exc), "details": None},
    )


app.include_router(calendar.router, prefix="/api")
app.include_router(drift.router, prefix="/api")
app.include_router(alert.router, prefix="/api")
app.include_router(health.router, prefix="/api")
