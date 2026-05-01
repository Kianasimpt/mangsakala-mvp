from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime, date

class MangsaItem(BaseModel):
    number: int = Field(..., ge=1, le=12)
    name: str
    traditional_start: date
    traditional_end: date
    adaptive_start: date
    adaptive_end: date
    shift_days: int

class CurrentMangsa(MangsaItem):
    javanese_name: str
    natural_signs: str
    agricultural_activity: str

class PlantingWindow(BaseModel):
    start: date
    end: date
    confidence: Literal["low", "medium", "high"]
    rationale: str

class RecommendedPlanting(BaseModel):
    primary_window: PlantingWindow
    alternative_window: Optional[PlantingWindow] = None

class PredictedOnset(BaseModel):
    date: date
    day_of_year: int
    confidence_interval_days: int
    model_mae_days: float

class CalendarMetadata(BaseModel):
    model_version: str
    data_source: str
    last_updated: datetime

class CalendarResponse(BaseModel):
    year: int
    region: str
    current_mangsa: CurrentMangsa
    all_mangsa: List[MangsaItem]
    recommended_planting: RecommendedPlanting
    predicted_onset: PredictedOnset
    metadata: CalendarMetadata

EnsoPhase = Literal["neutral", "el_nino_weak", "el_nino_moderate", "el_nino_strong", "la_nina_weak", "la_nina_moderate", "la_nina_strong"]

class DriftDataPoint(BaseModel):
    year: int
    actual_onset_date: date
    actual_onset_doy: int
    traditional_onset_doy: int
    shift_days: int
    oni_value: float
    enso_phase: EnsoPhase

class DriftStatistics(BaseModel):
    mean_shift_days: float
    max_shift_days: int
    max_shift_year: int
    trend_days_per_decade: float
    el_nino_avg_shift: float
    la_nina_avg_shift: float
    neutral_avg_shift: float

class DriftResponse(BaseModel):
    region: str
    start_year: int
    end_year: int
    traditional_onset_doy: int
    data: List[DriftDataPoint]
    statistics: DriftStatistics

class EnsoContext(BaseModel):
    current_phase: EnsoPhase
    oni_value: float
    explanation: str

class AlertResponse(BaseModel):
    year: int
    region: str
    alert_active: bool
    severity: Literal["none", "low", "medium", "high"]
    shift_days: int
    threshold_days: int
    predicted_onset_date: date
    traditional_onset_date: date
    message: str
    recommendations: List[str]
    enso_context: EnsoContext

class ErrorResponse(BaseModel):
    error: bool = True
    code: str
    message: str
    details: Optional[dict] = None
    