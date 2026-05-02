import logging
from datetime import date, timedelta

from fastapi import APIRouter, HTTPException, Query

from ml.predictor import TRADITIONAL_ONSET_DOY, predict_onset
from schemas import AlertResponse, EnsoContext

logger = logging.getLogger(__name__)
router = APIRouter()


def _severity(shift_days: int, threshold: int) -> str:
    abs_s = abs(shift_days)
    if abs_s <= threshold:
        return "none"
    if abs_s < threshold * 1.5:
        return "low"
    if abs_s < threshold * 2:
        return "medium"
    return "high"


def _recommendations(shift_days: int, enso_phase: str) -> list[str]:
    recs: list[str] = []
    if shift_days > 0:
        recs.append(
            f"Tunda penyemaian bibit sekitar {shift_days} hari dari jadwal tradisional"
        )
        if shift_days >= 21:
            recs.append(
                "Pertimbangkan varietas padi genjah untuk mengkompensasi musim yang lebih pendek"
            )
        recs.append("Siapkan sistem irigasi cadangan untuk antisipasi keterlambatan hujan")
    elif shift_days < 0:
        recs.append(
            f"Percepat persiapan lahan — onset diprediksi {abs(shift_days)} hari lebih awal dari tradisional"
        )
        recs.append("Pastikan persediaan benih dan pupuk siap sebelum tanggal tradisional")
    else:
        recs.append("Onset sesuai prediksi tradisional, lanjutkan rencana tanam normal")

    if "el_nino" in enso_phase:
        recs.append(
            "El Niño aktif — lakukan monitoring curah hujan mingguan dan persiapkan irigasi tambahan"
        )
    elif "la_nina" in enso_phase:
        recs.append(
            "La Niña aktif — waspadai curah hujan berlebih dan risiko banjir pada lahan rendah"
        )
    return recs


def _enso_explanation(phase: str, oni: float) -> str:
    if phase == "neutral":
        return (
            f"Kondisi ENSO netral (ONI {oni:+.2f}). "
            "Curah hujan diprediksi mendekati rata-rata historis."
        )
    if "el_nino" in phase:
        strength = phase.replace("el_nino_", "")
        return (
            f"El Niño {strength} (ONI {oni:+.2f}) sedang aktif. "
            "Kondisi ini berkorelasi dengan onset musim hujan yang lebih lambat dan curah hujan di bawah normal."
        )
    strength = phase.replace("la_nina_", "")
    return (
        f"La Niña {strength} (ONI {oni:+.2f}) sedang aktif. "
        "Kondisi ini berkorelasi dengan onset musim hujan lebih awal dan curah hujan di atas normal."
    )


@router.get("/alert", response_model=AlertResponse, tags=["Alert"])
def get_alert(
    year: int = Query(..., ge=1995, le=2030),
    region: str = Query("kebumen"),
    threshold_days: int = Query(14),
):
    if region.lower() != "kebumen":
        raise HTTPException(status_code=400, detail="Region not supported")

    pred = predict_onset(year, region)
    predicted_doy: int = pred["predicted_onset_doy"]
    shift_days: int = predicted_doy - TRADITIONAL_ONSET_DOY
    severity = _severity(shift_days, threshold_days)
    alert_active = abs(shift_days) > threshold_days

    trad_date = date(year, 1, 1) + timedelta(days=TRADITIONAL_ONSET_DOY - 1)
    predicted_date: date = pred["predicted_onset_date"]

    if not alert_active:
        message = (
            f"Onset musim hujan diprediksi normal (selisih {shift_days:+d} hari). "
            "Tidak ada peringatan khusus."
        )
    elif shift_days > 0:
        message = (
            f"Onset musim hujan diprediksi mundur {shift_days} hari "
            f"melewati ambang batas {threshold_days} hari."
        )
    else:
        message = (
            f"Onset musim hujan diprediksi maju {abs(shift_days)} hari "
            f"melewati ambang batas {threshold_days} hari."
        )

    logger.info(
        "alert year=%d shift=%+d severity=%s alert=%s",
        year, shift_days, severity, alert_active,
    )

    return AlertResponse(
        year=year,
        region=region,
        alert_active=alert_active,
        severity=severity,
        shift_days=shift_days,
        threshold_days=threshold_days,
        predicted_onset_date=predicted_date,
        traditional_onset_date=trad_date,
        message=message,
        recommendations=_recommendations(shift_days, pred["enso_phase"]),
        enso_context=EnsoContext(
            current_phase=pred["enso_phase"],
            oni_value=pred["oni_value"],
            explanation=_enso_explanation(pred["enso_phase"], pred["oni_value"]),
        ),
    )
