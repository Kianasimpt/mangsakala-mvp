from fastapi import APIRouter, Query, HTTPException
from datetime import date
from schemas import AlertResponse, EnsoContext

router = APIRouter()

@router.get("/alert", response_model=AlertResponse, tags=["Alert"])
def get_alert(year: int = Query(..., ge=1995, le=2030), region: str = Query("kebumen"), threshold_days: int = Query(14)):
    if region.lower() != "kebumen":
        raise HTTPException(status_code=400, detail="Region not supported")
        
    return AlertResponse(
        year=year,
        region=region,
        alert_active=True,
        severity="medium",
        shift_days=16,
        threshold_days=threshold_days,
        predicted_onset_date=date(year, 11, 8),
        traditional_onset_date=date(year, 10, 22),
        message=f"Onset musim hujan diprediksi mundur 16 hari melewati ambang batas {threshold_days} hari.",
        recommendations=["Tunda penyemaian bibit hingga 25 Oktober", "Siapkan irigasi cadangan"],
        enso_context=EnsoContext(current_phase="el_nino_weak", oni_value=0.8, explanation="Fase El Nino lemah dapat menyebabkan...")
    )