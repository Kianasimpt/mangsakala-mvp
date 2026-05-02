# Mangsakala MVP — Konteks untuk Claude Code

## Tentang Proyek
Mangsakala adalah web MVP kalender iklim adaptif untuk petani Jawa, menggabungkan **Pranata Mangsa** (kalender pertanian tradisional Jawa) dengan ML berbasis data CHIRPS + NOAA ONI. Dibuat untuk **IYREF 2026 SRE ITB** (kompetisi inovasi pertanian).

**Tim:**
- Satya — Frontend & Production Lead
- Reza Dwi Pranata — Backend & ML Lead (ini user-nya, kianasatyakaslana@gmail.com)
- Azzaenab — Data & Penelitian
- Nadya — Komunikasi & Validasi Lapangan

---

## Stack Teknis

### Backend
- **FastAPI** + **scikit-learn** Random Forest
- Python, venv di `backend/venv/`
- Model: `model/onset_predictor.pkl` — MAE 9.2 hari (baseline tradisional: 12 hari)
- Data: `data/raw/kebumen_chirps_daily_1995_2025.csv` + `data/raw/oni_monthly_raw.csv`
- Jalankan: `cd backend && uvicorn main:app --reload` → `http://localhost:8000`

### Frontend
- **Tidak ada build step, tidak ada npm** — murni HTML statis + React CDN + Babel standalone
- Buka langsung di browser sebagai file HTML, atau serve via Live Server
- `API_BASE` default ke `http://localhost:8000/api`, bisa di-override via `window.API_BASE`

### CORS
Backend hanya allow `http://localhost:5173` dan `http://localhost:3000` — kalau port berbeda, edit `backend/main.py`.

---

## Struktur File Penting

```
mangsakala-mvp/
├── backend/
│   ├── main.py              # FastAPI app, CORS, lifespan loader
│   ├── schemas.py           # Semua Pydantic models
│   ├── constants.py         # PRANATA_MANGSA data (12 mangsa, dates, durations)
│   ├── ml/
│   │   └── predictor.py     # Load model pkl, ONI data, rainfall data; predict_onset()
│   └── routers/
│       ├── calendar.py      # GET /api/calendar?year=&region=
│       ├── drift.py         # GET /api/drift?region=&start_year=&end_year=
│       ├── alert.py         # GET /api/alert?year=&region=&threshold_days=
│       └── health.py        # GET /api/health
├── frontend/
│   ├── Mangsakala.html      # Halaman Beranda (tab Ringkas)
│   ├── Mangsakala-Almanac.html  # Halaman Almanac (tab Mangsa)
│   ├── Mangsakala-Drift.html    # Halaman Iklim + chart drift (tab Iklim)
│   ├── Mangsakala-Alert.html    # Halaman Alert Center (tab Waspada)
│   ├── ios-frame.jsx        # Komponen IOSDevice frame (phone preview wrapper)
│   ├── mangsa-shared.jsx    # Shared: MANGSA_INFO, MANGSA_THEME, getStoredActiveMangsa, mangsaThemeStyle, MangsaOrnament, MangsaActiveStrip
│   ├── tweaks-panel.jsx     # Dev-only tweaks panel (TweaksPanel, useTweaks, TweakSlider, dll)
│   ├── styles.css           # Global styles (screen, header, body, grid, mangsa cards, dll)
│   ├── almanac.css          # Styles spesifik Almanac (TopBar, carousel, sparkline, sheets)
│   ├── drift.css            # Styles spesifik Drift (chart, ENSO, timeline)
│   └── alert.css            # Styles spesifik Alert (AlertBanner, EnsoContext, ActionTimeline)
├── model/
│   └── onset_predictor.pkl  # Trained Random Forest model
└── data/
    └── raw/
        ├── kebumen_chirps_daily_1995_2025.csv
        └── oni_monthly_raw.csv
```

---

## API Endpoints

### `GET /api/calendar?year=2026&region=kebumen`
Return: `CalendarResponse`
- `current_mangsa` — mangsa aktif hari ini (number, name, adaptive/traditional dates, shift_days, javanese_name, natural_signs, agricultural_activity)
- `all_mangsa` — array 12 MangsaItem
- `recommended_planting` — primary + alternative planting window
- `predicted_onset` — predicted onset date + confidence interval
- `metadata` — model version, data source

### `GET /api/drift?region=kebumen&start_year=1995&end_year=2025`
Return: `DriftResponse`
- `data` — array DriftDataPoint per tahun (year, shift_days, enso_phase, oni_value)
- `statistics` — mean_shift, max_shift, trend_days_per_decade, el_nino/la_nina avg

### `GET /api/alert?year=2026&region=kebumen&threshold_days=14`
Return: `AlertResponse`
- `severity` — "none" | "low" | "medium" | "high"
- `shift_days`, `predicted_onset_date`, `traditional_onset_date`
- `message`, `recommendations` (array 3 string)
- `enso_context` — current_phase, oni_value, explanation
- `region` — region string

### `GET /api/health`
Return: `{"status": "ok"}`

**Catatan:** Saat ini hanya `region=kebumen` yang didukung. Region lain return HTTP 400.

---

## Frontend — Pola Penting

### Struktur tiap halaman HTML
Setiap halaman punya pattern yang sama:
1. Load CSS (styles.css + page-specific)
2. Load React, ReactDOM, Babel dari CDN (unpkg, dengan integrity hash)
3. Load shared JSX: `ios-frame.jsx`, `tweaks-panel.jsx`, `mangsa-shared.jsx`
4. Inline script Babel dengan data hardcoded + React components + `App()` component
5. `ReactDOM.createRoot(document.getElementById("root")).render(<IOSDevice><App/></IOSDevice>)`

### Cara data flow
- Data mulanya hardcoded sebagai `let` di module level (fallback kalau API offline)
- `useEffect` di dalam `App()` fetch API → mutate module-level vars (`DRIFT.length = 0; DRIFT.push(...)`)
- Trigger re-render via `_setApiVer(v => v + 1)` atau React state setter lain

### ACTIVE_MANGSA
Semua 4 halaman punya `let ACTIVE_MANGSA = 5` (default) yang di-override dari `data.current_mangsa.number` saat API berhasil. Halaman Almanac juga pakai React state `activeMangsaUi`.

### Scrollbar hiding
Semua halaman pakai `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` di body dan container scroll internal (`.body`, `.almanac-scroll`, `ios-frame.jsx` inner div).

### IOSDevice wrapper
Semua halaman dibungkus `<IOSDevice width={402} height={874}>`. Frame menampilkan Dynamic Island dan home indicator. Inner scroll div pakai `scrollbarWidth: 'none'`.

---

## State Saat Ini (per 2026-05-03)

### Yang sudah dikerjakan di sesi ini:
1. **Scrollbar** — dihilangkan di semua 4 halaman (body browser + dalam device frame)
2. **Chart Drift (Y axis)** — diperbaiki: sekarang dinamis berdasarkan range data API, tidak lagi hardcoded `-10` s/d `30`
3. **Chart Drift (zone labels)** — dipindah ke atas `chart-data` layer dengan background pill supaya tidak tertimpa garis chart
4. **ACTIVE_MANGSA** — di-connect ke API `current_mangsa.number` di semua 4 halaman
5. **Alert hardcoded fields** — `location`, `updatedAgo`, `implRegion` sekarang dari API response + helper functions

### Yang masih hardcoded (belum diurus):
- `REGIONS` array (6 wilayah) di Mangsakala.html & Almanac — belum ada endpoint `/api/regions`
- `SPARKS` data sparkline di Almanac — pseudo-random, belum ada endpoint `/api/sparklines`
- `ActionTimeline` di Alert — teks 3 langkah hardcoded, tidak dinamis dari API

### Batasan yang diketahui:
- Hanya Kebumen yang punya data aktual; 5 wilayah lain tampil "Segera hadir"
- CORS hanya allow port 5173 dan 3000 — kalau pakai port lain (misal 8080 atau file://) perlu edit `backend/main.py`
- `TWEAK_DEFAULTS` di Almanac dan Alert adalah dev tweaks panel, bukan data produksi

---

## Konvensi Kode

- **Jangan tambah npm / build step** — frontend harus tetap pure HTML + CDN
- Komponen React inline di `<script type="text/babel">` bukan file terpisah (kecuali shared: ios-frame, mangsa-shared, tweaks-panel)
- CSS class naming: kebab-case (`hero-card`, `mc-active`, `chart-line-live`)
- Warna design tokens di `:root` dalam `styles.css`: `--terracotta`, `--olive`, `--cream`, `--ink`, `--paper`
- Module-level `let` untuk data yang di-override API, `const` untuk lookup tables statis
- Setiap halaman punya loading spinner + offline banner fallback

---

## Cara Jalankan

```bash
# Backend
cd backend
python -m venv venv          # kalau belum ada
venv\Scripts\activate        # Windows
pip install fastapi uvicorn scikit-learn pandas numpy
uvicorn main:app --reload

# Frontend
# Buka langsung di browser, atau:
cd frontend
python -m http.server 5173   # agar CORS pass
# Lalu buka http://localhost:5173/Mangsakala.html
```
