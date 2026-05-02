# Mangsakala 🌾
> Adaptive Indigenous Climate Calendar for Climate-Smart Agriculture

[![Status](https://img.shields.io/badge/status-MVP-orange)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## 📖 About
Mangsakala adalah aplikasi web yang merekalibrasi kalender Pranata Mangsa 
Jawa terhadap anomali iklim modern, menggunakan machine learning untuk 
membantu petani tradisional beradaptasi dengan dampak perubahan iklim.

[Insert hero screenshot]

## 🎯 Problem
- 97% petani tradisional Kebumen kesulitan prediksi musim tanam
- Akurasi Pranata Mangsa anjlok ke 66.7% (data 2023)
- Penundaan tanam 30 hari → kerugian produksi padi 6.5-11% nasional

## 💡 Solution: Two-Eyed Seeing
Mengawinkan sains iklim modern dengan kearifan lokal:
- 👁️ Modern: CHIRPS rainfall + NOAA ONI + Random Forest ML
- 👁️ Indigenous: Pranata Mangsa 12 mangsa cycle

## 🏗️ Architecture
[Mermaid diagram: Data → Processing → Output]

## 🚀 Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind, Recharts |
| Backend | FastAPI, Pydantic, Uvicorn |
| ML | scikit-learn, pandas, numpy |
| Data | CHIRPS, NOAA ONI |

## 📦 Installation
[Step-by-step install guide for backend + frontend]

## 🧪 Methodology
- Onset detection: Liebmann-Marengo simplified
- Features: ONI lag-3, ONI JJAS avg, pre-season rainfall, prev onset DOY
- Model: Random Forest Regressor (100 estimators, max_depth=5)
- Validation: Leave-One-Out CV on n=30 onset events 1995-2025

## 📊 Results
- MAE: [X] days (vs Pranata Mangsa traditional MAE 12 days)
- Best performance: Neutral ENSO years
- Limitation: Higher error on extreme El Niño (n=4 in training)

## ⚠️ Limitations & Honest Disclosure
- Training data terbatas (n=30 onset events)
- Single region validation (Kebumen only)
- CHIRPS data resolution: 5.5km grid, may miss micro-climate
- Model belum incorporate IOD (Indian Ocean Dipole)
- Onset detection rule simplified vs full Liebmann-Marengo paper

## 🗺️ Roadmap
- Phase 1 (0-12 mo): Multi-region validation Java
- Phase 2 (1-3 yr): Integration with Dinas Pertanian Jateng
- Phase 3 (3+ yr): Pan-Asia indigenous calendar platform 
  (Subak Bali, Bugis, Sasi Maluku)

## 👥 Team
- **Satya** — Frontend & Production Lead
- **Reza Dwi Pranata** — Backend & ML Lead
- **Azzaenab** — [Role]
- **Nadya** — [Role]

## 📜 License
MIT

## 🙏 Acknowledgments
- IYREF 2026 SRE ITB
- CHIRPS / UCSB Climate Hazards Center
- NOAA Climate Prediction Center
