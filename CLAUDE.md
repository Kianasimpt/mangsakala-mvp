# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

**Cara tercepat** — dari root project:
```powershell
.\start.ps1
```
Script ini start backend di port 8000 dan buka frontend langsung di browser.

**Manual** (jika perlu debug terpisah):
```powershell
# Backend — dari backend/
.\venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend — buka file langsung di browser, atau serve via:
cd frontend; python -m http.server 3000
```

The backend URL is hardcoded as `http://localhost:8000/api` in each HTML file via `window.API_BASE`.

## Architecture

### Backend

All four endpoints ultimately call one function: `predict_onset(year, region)` in `backend/ml/predictor.py`. It is `@lru_cache`'d and **recursive** — predicting year N calls year N-1 for `prev_year_onset_doy`, bottoming out at 1995. Invalidating the cache (e.g. after reloading data) requires `predict_onset.cache_clear()`.

On startup (`main.py` lifespan), `_load_all()` reads:
- `model/onset_predictor.pkl` — trained Random Forest
- `data/raw/oni_monthly_raw.csv` — NOAA ONI (columns: `Year`, `DJF`…`NDJ`)
- `data/raw/kebumen_chirps_daily_1995_2025.csv` — CHIRPS rainfall (columns: `date`, `rainfall_mm`)

These files are **not tracked in git** (`data/raw/` and `model/` only have `.gitkeep`). The model and data must exist locally for the backend to start.

Router responsibilities:
- `routers/calendar.py` — builds all 12 adaptive mangsa from shift_days, finds current mangsa, derives planting windows from predicted onset date
- `routers/drift.py` — calls `predict_onset` for every year in range, computes statistics and trend
- `routers/alert.py` — single year, computes shift vs traditional, ENSO explanation, recommendations
- `routers/health.py` — returns model load status
- `schemas.py` — all Pydantic response models
- `constants.py` — `PRANATA_MANGSA` list (12 mangsa with start date + duration)

Only `region="kebumen"` is supported. All other regions return HTTP 400.

### Frontend

No build step. Each page is a self-contained HTML file that loads React 18 + Babel Standalone from CDN (unpkg.com) and transpiles JSX in-browser at runtime:

| File | Page |
|---|---|
| `Mangsakala-Almanac.html` | Main calendar: mangsa wheel, carousel, notifications |
| `Mangsakala-Drift.html` | Historical onset drift chart 1995–2025 |
| `Mangsakala-Alert.html` | ENSO alert + planting recommendations |
| `Mangsakala.html` | Entry / landing page |

Shared `.jsx` files (`ios-frame.jsx`, `mangsa-shared.jsx`, `tweaks-panel.jsx`) are loaded via `<script type="text/babel" src="...">` tags inside each HTML file.

**JSX-in-HTML constraint:** Because JSX is parsed inside HTML `<script>` tags, bare `>` and `<` characters in JSX text content cause syntax errors. Use `→`, `←` (unicode), `&gt;`, `&lt;`, or `{'>'}` / `{'<'}` instead.

The MANGSA data (names, dates, shifts) is **duplicated** — defined in both `constants.py` (backend) and hardcoded in `Mangsakala-Almanac.html` (frontend). The frontend displays live API data when the backend is reachable; it falls back to the hardcoded values with an offline banner when the backend is not available.

### Data & model

ML features fed to the Random Forest:
- `oni_jjas_avg` — average of JJA + JAS ONI values
- `oni_lag_3` — JAS ONI (3-month lag before Oct onset)
- `pre_season_rainfall` — total CHIRPS rainfall Jul–Sep
- `prev_year_onset_doy` — recursive: previous year's predicted onset

Predicted DOY is clamped to `[260, 340]`. Model MAE = 9.2 days vs traditional baseline of 12 days.
