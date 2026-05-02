import logging
from datetime import date

from fastapi import APIRouter, HTTPException, Query

from ml.predictor import TRADITIONAL_ONSET_DOY, predict_onset
from schemas import DriftDataPoint, DriftResponse, DriftStatistics

logger = logging.getLogger(__name__)
router = APIRouter()


def _linear_trend(values: list[float]) -> float:
    """Slope of OLS fit (units per step), scaled to per-decade."""
    n = len(values)
    if n < 2:
        return 0.0
    xs = list(range(n))
    mean_x = sum(xs) / n
    mean_y = sum(values) / n
    cov = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, values)) / n
    var_x = sum((x - mean_x) ** 2 for x in xs) / n
    return (cov / var_x) * 10 if var_x else 0.0


def _safe_avg(lst: list[float]) -> float:
    return round(sum(lst) / len(lst), 1) if lst else 0.0


@router.get("/drift", response_model=DriftResponse, tags=["Drift"])
def get_drift(
    region: str = Query("kebumen"),
    start_year: int = Query(1995, ge=1995, le=2025),
    end_year: int = Query(2025, ge=1995, le=2025),
):
    if region.lower() != "kebumen":
        raise HTTPException(status_code=400, detail="Region not supported")
    if start_year > end_year:
        raise HTTPException(status_code=400, detail="start_year must be ≤ end_year")

    trad_doy = TRADITIONAL_ONSET_DOY
    data: list[DriftDataPoint] = []

    for year in range(start_year, end_year + 1):
        pred = predict_onset(year, region)
        shift = pred["predicted_onset_doy"] - trad_doy
        data.append(DriftDataPoint(
            year=year,
            actual_onset_date=pred["predicted_onset_date"],
            actual_onset_doy=pred["predicted_onset_doy"],
            traditional_onset_doy=trad_doy,
            shift_days=shift,
            oni_value=pred["oni_value"],
            enso_phase=pred["enso_phase"],
        ))
        logger.debug("drift year=%d shift=%+d enso=%s", year, shift, pred["enso_phase"])

    shifts = [d.shift_days for d in data]
    el_nino_s = [d.shift_days for d in data if "el_nino" in d.enso_phase]
    la_nina_s = [d.shift_days for d in data if "la_nina" in d.enso_phase]
    neutral_s = [d.shift_days for d in data if d.enso_phase == "neutral"]

    max_dp = max(data, key=lambda d: d.shift_days)

    statistics = DriftStatistics(
        mean_shift_days=round(sum(shifts) / len(shifts), 1),
        max_shift_days=max(shifts),
        max_shift_year=max_dp.year,
        trend_days_per_decade=round(_linear_trend([float(s) for s in shifts]), 2),
        el_nino_avg_shift=_safe_avg(el_nino_s),
        la_nina_avg_shift=_safe_avg(la_nina_s),
        neutral_avg_shift=_safe_avg(neutral_s),
    )

    return DriftResponse(
        region=region,
        start_year=start_year,
        end_year=end_year,
        traditional_onset_doy=trad_doy,
        data=data,
        statistics=statistics,
    )
