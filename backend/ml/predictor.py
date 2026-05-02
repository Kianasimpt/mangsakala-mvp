import csv
import logging
import pickle
from datetime import date, timedelta
from functools import lru_cache
from pathlib import Path

logger = logging.getLogger(__name__)

_ROOT = Path(__file__).parent.parent.parent
MODEL_PATH = _ROOT / "model" / "onset_predictor.pkl"
ONI_PATH = _ROOT / "data" / "raw" / "oni_monthly_raw.csv"
RAINFALL_PATH = _ROOT / "data" / "raw" / "kebumen_chirps_daily_1995_2025.csv"

MODEL_MAE_DAYS = 9.2
TRADITIONAL_ONSET_DOY = 295  # Oct 22

_model = None
_oni_data: dict = {}       # {year: {col: float}}
_rainfall_data: dict = {}  # {(year, month): float}
_is_loaded = False

ONI_COLS = ["DJF", "JFM", "FMA", "MAM", "AMJ", "MJJ", "JJA", "JAS", "ASO", "SON", "OND", "NDJ"]


def _load_all() -> None:
    global _model, _oni_data, _rainfall_data, _is_loaded

    logger.info("Loading model from %s", MODEL_PATH)
    with open(MODEL_PATH, "rb") as f:
        _model = pickle.load(f)
    logger.info("Model loaded: %s", type(_model).__name__)

    logger.info("Loading ONI data from %s", ONI_PATH)
    with open(ONI_PATH, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            year = int(row["Year"])
            _oni_data[year] = {}
            for col in ONI_COLS:
                raw = row.get(col, "").strip()
                try:
                    _oni_data[year][col] = float(raw)
                except (ValueError, TypeError):
                    _oni_data[year][col] = None
    logger.info("ONI data: %d years (%d–%d)", len(_oni_data),
                min(_oni_data), max(_oni_data))

    logger.info("Loading rainfall data from %s", RAINFALL_PATH)
    with open(RAINFALL_PATH, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            d = date.fromisoformat(row["date"])
            key = (d.year, d.month)
            try:
                mm = float(row["rainfall_mm"])
            except (ValueError, TypeError):
                mm = 0.0
            _rainfall_data[key] = _rainfall_data.get(key, 0.0) + mm
    logger.info("Rainfall data: %d month-buckets", len(_rainfall_data))

    _is_loaded = True
    logger.info("All resources loaded successfully")


def _ensure_loaded() -> None:
    if not _is_loaded:
        _load_all()


def is_loaded() -> bool:
    return _is_loaded


# ---------- feature helpers ----------

def _oni_val(year: int, col: str) -> float:
    return _oni_data.get(year, {}).get(col) or 0.0


def _oni_jjas_avg(year: int) -> float:
    """Average of JJA and JAS as proxy for Jun–Sep ENSO signal."""
    return (_oni_val(year, "JJA") + _oni_val(year, "JAS")) / 2.0


def _oni_lag3(year: int) -> float:
    """ONI 3 months before typical Oct onset → JAS window."""
    return _oni_val(year, "JAS")


def _pre_season_rain(year: int) -> float:
    """Total rainfall Jul–Sep (pre-season)."""
    return sum(_rainfall_data.get((year, m), 0.0) for m in (7, 8, 9))


def _doy_to_date(year: int, doy: int) -> date:
    try:
        return date(year, 1, 1) + timedelta(days=doy - 1)
    except (ValueError, OverflowError):
        return date(year, 10, 22)


# ---------- ENSO classification ----------

def get_enso_phase(oni: float) -> str:
    if oni >= 1.5:
        return "el_nino_strong"
    if oni >= 1.0:
        return "el_nino_moderate"
    if oni >= 0.5:
        return "el_nino_weak"
    if oni <= -1.5:
        return "la_nina_strong"
    if oni <= -1.0:
        return "la_nina_moderate"
    if oni <= -0.5:
        return "la_nina_weak"
    return "neutral"


# ---------- prediction ----------

@lru_cache(maxsize=256)
def predict_onset(year: int, region: str) -> dict:
    """
    Returns:
      predicted_onset_date, predicted_onset_doy,
      confidence_interval_days, model_mae_days,
      features, oni_value, enso_phase
    """
    _ensure_loaded()

    prev_doy = (
        predict_onset(year - 1, region)["predicted_onset_doy"]
        if year > 1995
        else TRADITIONAL_ONSET_DOY
    )

    oni_jjas = _oni_jjas_avg(year)
    oni_l3 = _oni_lag3(year)
    pre_rain = _pre_season_rain(year)

    features = {
        "oni_jjas_avg": round(oni_jjas, 3),
        "oni_lag_3": round(oni_l3, 3),
        "pre_season_rainfall": round(pre_rain, 2),
        "prev_year_onset_doy": prev_doy,
    }

    X = [[features["oni_jjas_avg"], features["oni_lag_3"],
          features["pre_season_rainfall"], features["prev_year_onset_doy"]]]

    predicted_doy = int(round(float(_model.predict(X)[0])))
    predicted_doy = max(260, min(340, predicted_doy))

    oni_repr = round(oni_l3, 2)
    onset_date = _doy_to_date(year, predicted_doy)

    logger.debug("predict_onset(%d, %s) → doy=%d date=%s features=%s",
                 year, region, predicted_doy, onset_date, features)

    return {
        "predicted_onset_date": onset_date,
        "predicted_onset_doy": predicted_doy,
        "confidence_interval_days": int(MODEL_MAE_DAYS),
        "model_mae_days": MODEL_MAE_DAYS,
        "features": features,
        "oni_value": oni_repr,
        "enso_phase": get_enso_phase(oni_repr),
    }
