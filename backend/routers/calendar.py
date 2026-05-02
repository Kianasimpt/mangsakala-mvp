import logging
from datetime import date, datetime, timedelta

from fastapi import APIRouter, HTTPException, Query

from constants import PRANATA_MANGSA
from ml.predictor import TRADITIONAL_ONSET_DOY, predict_onset
from schemas import (
    CalendarMetadata,
    CalendarResponse,
    CurrentMangsa,
    MangsaItem,
    PlantingWindow,
    PredictedOnset,
    RecommendedPlanting,
)

logger = logging.getLogger(__name__)
router = APIRouter()

_MANGSA_META = {
    "Kasa":     ("Sumber Bumi",
                 "Daun-daun berguguran, angin kencang, udara panas dan kering",
                 "Persiapan lahan, pembersihan gulma dan sisa tanaman"),
    "Karo":     ("Bantala Rengka",
                 "Tanah retak-retak, semut memindahkan telur ke tempat lebih tinggi",
                 "Pengolahan tanah kering, perbaikan saluran irigasi"),
    "Katelu":   ("Suta Manut",
                 "Burung bangau terbang migrasi, langit cerah dan biru",
                 "Persiapan benih padi, pembibitan palawija"),
    "Kapat":    ("Waspa Kumembeng Jroning Kalbu",
                 "Pohon randu mulai berbunga, embun pagi mulai terasa",
                 "Persemaian benih padi, persiapan lahan sawah"),
    "Kalima":   ("Pancuran Mas",
                 "Hujan pertama mulai turun, katak mulai bersuara di malam hari",
                 "Tanam padi awal, pemupukan dasar lahan"),
    "Kanem":    ("Rasa Mulya",
                 "Hujan lebat dan intensif, sungai mulai meluap",
                 "Penanaman padi utama, pemeliharaan saluran drainase"),
    "Kapitu":   ("Wisa Kentar ing Maruta",
                 "Puncak musim hujan, angin kencang, kadang banjir",
                 "Pemeliharaan tanaman, pengendalian hama dan penyakit"),
    "Kawolu":   ("Anjrah Jroning Kayun",
                 "Hujan mulai mereda, padi mulai menguning di sawah",
                 "Panen padi, pengeringan dan penyimpanan hasil"),
    "Kasanga":  ("Wedaring Wacana Mulya",
                 "Cuaca cerah kembali, bunga-bunga bermekaran",
                 "Tanam palawija, pengolahan lahan bekas sawah"),
    "Kasadasa": ("Gedhong Minep",
                 "Angin kencang dari selatan, udara mulai terasa panas",
                 "Panen palawija, penanaman sayuran dan hortikultura"),
    "Dhesta":   ("Sotya Sineba",
                 "Udara panas, kemarau mulai terasa, sumber air berkurang",
                 "Persiapan ladang bera, pengairan intensif palawija"),
    "Sadha":    ("Tirta Sah Saking Sasana",
                 "Awal kemarau, sumber air mengering sebagian, rerumputan menguning",
                 "Budidaya tanaman tahan kering, persiapan lahan untuk musim berikutnya"),
}


def _mangsa_year(year: int, month: int) -> int:
    """Mangsa months 1–5 (Jan–May) belong to the Pranata year starting in prior June."""
    return year + 1 if month < 6 else year


def _build_all_mangsa(year: int, shift_days: int) -> list[MangsaItem]:
    result = []
    for m in PRANATA_MANGSA:
        actual_year = _mangsa_year(year, m["start_month"])
        try:
            trad_start = date(actual_year, m["start_month"], m["start_day"])
        except ValueError:
            trad_start = date(actual_year, m["start_month"], 28)
        trad_end = trad_start + timedelta(days=m["duration"] - 1)
        result.append(MangsaItem(
            number=m["number"],
            name=m["name"],
            traditional_start=trad_start,
            traditional_end=trad_end,
            adaptive_start=trad_start + timedelta(days=shift_days),
            adaptive_end=trad_end + timedelta(days=shift_days),
            shift_days=shift_days,
        ))
    return result


def _find_current_mangsa(all_mangsa: list[MangsaItem], today: date) -> MangsaItem:
    for m in all_mangsa:
        if m.adaptive_start <= today <= m.adaptive_end:
            return m
    return min(all_mangsa, key=lambda m: abs((m.adaptive_start - today).days))


def _planting_confidence(shift_days: int) -> str:
    if abs(shift_days) < 7:
        return "high"
    if abs(shift_days) < 14:
        return "medium"
    return "low"


@router.get("/calendar", response_model=CalendarResponse, tags=["Calendar"])
def get_calendar(
    year: int = Query(..., ge=1995, le=2030),
    region: str = Query("kebumen"),
):
    if region.lower() != "kebumen":
        raise HTTPException(status_code=400, detail="Region not supported")

    pred = predict_onset(year, region)
    predicted_doy: int = pred["predicted_onset_doy"]
    onset_date: date = pred["predicted_onset_date"]
    shift_days: int = predicted_doy - TRADITIONAL_ONSET_DOY

    logger.info("calendar year=%d shift=%+d onset=%s", year, shift_days, onset_date)

    all_mangsa = _build_all_mangsa(year, shift_days)
    today = date.today()
    cur = _find_current_mangsa(all_mangsa, today)
    meta = _MANGSA_META.get(cur.name, ("", "", ""))

    current_mangsa = CurrentMangsa(
        number=cur.number,
        name=cur.name,
        traditional_start=cur.traditional_start,
        traditional_end=cur.traditional_end,
        adaptive_start=cur.adaptive_start,
        adaptive_end=cur.adaptive_end,
        shift_days=shift_days,
        javanese_name=meta[0],
        natural_signs=meta[1],
        agricultural_activity=meta[2],
    )

    confidence = _planting_confidence(shift_days)
    primary_start = onset_date + timedelta(days=7)
    primary_end = onset_date + timedelta(days=21)
    alt_start = onset_date + timedelta(days=21)
    alt_end = onset_date + timedelta(days=35)
    alt_conf = "high" if confidence != "high" else "medium"

    recommended_planting = RecommendedPlanting(
        primary_window=PlantingWindow(
            start=primary_start,
            end=primary_end,
            confidence=confidence,
            rationale=(
                f"Jendela tanam optimal 7–21 hari setelah prediksi onset "
                f"({onset_date:%d %b %Y}). Shift {shift_days:+d} hari dari tradisional."
            ),
        ),
        alternative_window=PlantingWindow(
            start=alt_start,
            end=alt_end,
            confidence=alt_conf,
            rationale=(
                "Jendela alternatif 21–35 hari setelah onset; hujan lebih "
                "terbentuk sehingga risiko kekeringan awal lebih rendah."
            ),
        ),
    )

    predicted_onset = PredictedOnset(
        date=onset_date,
        day_of_year=predicted_doy,
        confidence_interval_days=pred["confidence_interval_days"],
        model_mae_days=pred["model_mae_days"],
    )

    return CalendarResponse(
        year=year,
        region=region,
        current_mangsa=current_mangsa,
        all_mangsa=all_mangsa,
        recommended_planting=recommended_planting,
        predicted_onset=predicted_onset,
        metadata=CalendarMetadata(
            model_version="rf-v1.0",
            data_source="CHIRPS + NOAA ONI",
            last_updated=datetime.now(),
        ),
    )
