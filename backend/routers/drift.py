from fastapi import APIRouter, Query, HTTPException
from datetime import date, datetime
from schemas import CalendarResponse, CurrentMangsa, RecommendedPlanting, PlantingWindow, PredictedOnset, CalendarMetadata, MangsaItem

router = APIRouter()

@router.get("/calendar", response_model=CalendarResponse, tags=["Calendar"])
def get_calendar(year: int = Query(..., ge=1995, le=2030), region: str = Query("kebumen")):
    if region.lower() != "kebumen":
        raise HTTPException(status_code=400, detail="Region not supported")
        
    return CalendarResponse(
        year=year,
        region=region,
        current_mangsa=CurrentMangsa(
            number=4, name="Kapat", javanese_name="Sumber Bumi",
            traditional_start=date(year, 9, 19), traditional_end=date(year, 10, 13),
            adaptive_start=date(year, 9, 25), adaptive_end=date(year, 10, 19),
            shift_days=6, natural_signs="Pohon randu mulai berbunga...",
            agricultural_activity="Persiapan lahan..."
        ),
        all_mangsa=[MangsaItem(
            number=4, name="Kapat", traditional_start=date(year, 9, 19), traditional_end=date(year, 10, 13),
            adaptive_start=date(year, 9, 25), adaptive_end=date(year, 10, 19), shift_days=6
        )], # Di MVP dikasih 1 dulu sebagai dummy
        recommended_planting=RecommendedPlanting(
            primary_window=PlantingWindow(start=date(year, 10, 15), end=date(year, 10, 28), confidence="medium", rationale="..."),
            alternative_window=PlantingWindow(start=date(year, 11, 1), end=date(year, 11, 10), confidence="high", rationale="...")
        ),
        predicted_onset=PredictedOnset(date=date(year, 10, 18), day_of_year=291, confidence_interval_days=7, model_mae_days=9.2),
        metadata=CalendarMetadata(model_version="rf-v1.0", data_source="CHIRPS + NOAA ONI", last_updated=datetime(2026, 5, 1, 8, 0, 0))
    )
