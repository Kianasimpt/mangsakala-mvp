from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import calendar, drift, alert, health

app = FastAPI(title="Mangsakala MVP API", version="1.0.0")

# CORS Middleware (Sesuai API Contract: Port 5173 & 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler untuk Custom Error Format
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": True, "code": "SERVER_ERROR", "message": str(exc), "details": None}
    )

# Daftarkan semua routers
app.include_router(calendar.router, prefix="/api")
app.include_router(drift.router, prefix="/api")
app.include_router(alert.router, prefix="/api")
app.include_router(health.router, prefix="/api")