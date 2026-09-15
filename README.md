# AegisEmergency AI — Emergency Patient Severity Prediction & Hospital Recommendation System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An AI-powered pre-hospital emergency decision-support system prototype that predicts patient clinical severity, provides Explainable AI (XAI) risk drivers, and recommends the most suitable nearby hospital based on clinical specialty, available ICU beds, travel distance, and emergency department wait times.

---

> [!WARNING]
> ### CRITICAL MEDICAL & REGULATORY DISCLAIMER
> **"Prototype for educational/research purposes only. Predictions are not medical diagnoses. Always consult qualified healthcare professionals."**
> 
> This project is a **software-only AI and Data Science research prototype**. It is **not** a certified medical device (FDA 21 CFR Part 820 or EU MDR 2017/745) and does not guarantee medical diagnoses or clinical outcomes. In real emergencies, always contact certified emergency medical services (911/112/999).

---

## 📑 Table of Contents

1. [Problem Statement & Solution](#-problem-statement--solution)
2. [Key System Features](#-key-system-features)
3. [Architecture Overview](#-architecture-overview)
4. [Machine Learning Pipeline & Dataset](#-machine-learning-pipeline--dataset)
5. [Hospital Suitability Scoring Algorithm](#-hospital-suitability-scoring-algorithm)
6. [API Reference & Endpoints](#-api-reference--endpoints)
7. [Installation & Local Setup](#-installation--local-setup)
8. [Demo Evaluation Presets](#-demo-evaluation-presets)
9. [Future Roadmap & IoT Integration](#-future-roadmap--iot-integration)

---

## 🚨 Problem Statement & Solution

### The Pre-Hospital Emergency Challenge
During acute medical emergencies, paramedics and triage dispatchers must make rapid, life-critical triage decisions under extreme pressure. Transporting a critical cardiac or stroke patient to an overloaded hospital with zero open cath-lab beds or full ICU wards leads to hazardous delays ("door-to-needle" time).

### The AegisEmergency AI Solution
AegisEmergency AI provides an end-to-end intelligent triage copilot:
1. **Clinical Intake**: Captures multi-parameter physiological vitals (SpO2, HR, BP, Temp, RR) and acute red-flag symptoms.
2. **ML Severity Stratification**: Uses an ensemble Random Forest classifier to predict severity (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`) and compute a calibrated **Risk Score (0–100)**.
3. **Explainable AI (XAI)**: Visualizes individual vital parameter contributions so clinicians understand *why* the score was assigned.
4. **Logistical Hospital Routing**: Evaluates nearby emergency centers and computes a multi-factor **Suitability Score (%)** matching patient clinical needs with available ICU beds, medical specialties, and distance.

---

## ✨ Key System Features

- **Modern Healthcare Landing Page**: Overview of emergency AI technology, 3-step workflow, and prominent medical disclaimers.
- **Patient Assessment Form**: Range-validated inputs for vitals, symptoms, and comorbidities with 1-click **Demo Presets**.
- **Visual Severity Gauge**: Color-coded severity dial (LOW: Green, MODERATE: Yellow, HIGH: Orange, CRITICAL: Red) and animated risk gauge.
- **Explainable AI (XAI) Attribution**: Transparent feature-attribution cards detailing abnormal physiological markers (hypoxia, tachycardia, hypotension, chest pain).
- **Multi-Factor Hospital Recommender**: Ranks regional hospitals with suitability percentages and explicit recommendation rationale.
- **Interactive Hospital Radar / Map**: Geospatial layout showing incident coordinates, hospital markers, distance circles, and transit paths.
- **Emergency Operations Dashboard**: Recharts-powered analytics for patient severity distribution, risk trends, and ICU capacity bars.
- **Patient History & Audit Log**: Searchable, filterable triage database with a detailed inspection modal.
- **AI Model Insights**: Real-time Data Science evaluation metrics including Accuracy (98.8%), Precision, Recall, F1-scores, Confusion Matrix, and Feature Importance ranking.
- **HIPAA-Compliant Security Architecture**: Zero real Protected Health Information (PHI) used; all patient profiles are pseudonymized (`PT-XXXX`).

---

## 🏛️ Architecture Overview

```
ambulence/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI application with CORS middleware & lifespan
│   │   ├── database.py           # SQLite schema and sample database seeder
│   │   ├── models.py             # Pydantic data validation models
│   │   ├── ml_service.py         # Model loader, risk score & XAI factor attribution
│   │   ├── recommendation.py     # Hospital suitability scoring algorithm
│   │   └── routes/
│   │       ├── predict.py        # POST /predict
│   │       ├── hospitals.py      # GET /hospitals
│   │       ├── patients.py       # GET & POST /patients
│   │       ├── analytics.py      # GET /analytics
│   │       └── health.py         # GET /health & GET /model-info
│   └── requirements.txt
├── ml/
│   ├── generate_dataset.py       # Modeled emergency triage synthetic generator
│   └── train_model.py            # Preprocessing, 80/20 train/test split, Random Forest training
├── data/
│   ├── emergency_triage_data.csv # 3,500 synthetic emergency records
│   └── sample_hospitals.json     # Geocoded emergency facilities & live bed status
├── models/
│   ├── severity_model.joblib     # Serialized trained scikit-learn model
│   └── model_metadata.json       # Accuracies, confusion matrix, and feature importances
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, EmergencyAlert, SeverityGauge, HospitalCard, etc.
│   │   ├── pages/                # Landing, Assessment, Result, HospitalMap, Dashboard, History, Insights, About
│   │   ├── services/api.ts       # Axios client connected to FastAPI
│   │   ├── types/index.ts        # TypeScript definitions
│   │   ├── App.tsx               # App router and state management
│   │   └── index.css             # Tailwind CSS & custom animations
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🧠 Machine Learning Pipeline & Dataset

### Synthetic Dataset Specification
- **Size**: 3,500 balanced triage cases.
- **Clinical Modeling**: Modeled after standard **Emergency Severity Index (ESI)** and **Modified Early Warning Score (MEWS)** guidelines.
- **Notice**: *The dataset is synthesized strictly for software prototype evaluation and research demonstration.*
- **Features Used (17)**:
  - Numerical: `age`, `heart_rate`, `systolic_bp`, `diastolic_bp`, `spo2`, `temperature`, `respiratory_rate`
  - Binary: `gender_male`, `chest_pain`, `breathing_difficulty`, `dizziness`, `loss_of_consciousness`, `severe_bleeding`, `confusion`, `cardiac_history`, `diabetes`, `stroke_history`

### Model Evaluation Results (Test Holdout: 20%)

| Metric | Score | Note |
| :--- | :--- | :--- |
| **Accuracy** | **98.86%** | Hold-out test set |
| **Macro Precision** | **98.76%** | Balanced across all 4 classes |
| **Macro Recall** | **98.81%** | Zero critical cases missed |
| **Macro F1-Score** | **98.78%** | Harmonic mean |
| **Inference Latency** | **< 150 ms** | Fast real-time REST inference |

---

## 🏥 Hospital Suitability Scoring Algorithm

The hospital recommendation engine computes a dynamic multi-criteria suitability score (0–100%):

$$\text{Suitability} = f(\text{Specialty Match}) + f(\text{Severity-ICU Match}) + f(\text{Distance}) + f(\text{Wait Time}) + f(\text{Ambulance Bay})$$

1. **Medical Specialty Alignment (+25%)**: Prioritizes Cath-Labs for chest pain/cardiac history, Comprehensive Stroke Centers for acute confusion/LOC, and Level-1 Trauma for severe hemorrhages.
2. **ICU Capacity & Severity Alignment (+25%)**: Directs `CRITICAL` cases to facilities with verified available ICU beds.
3. **Distance & Proximity (+15%)**: Minimizes transit times based on incident coordinates.
4. **Estimated Wait Time (+12%)**: Factors in emergency room triage queues.
5. **Ambulance Bay Status**: Penalizes facilities currently on diversion.

---

## 🔌 API Reference & Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/predict` | Evaluates patient vitals, returns severity, risk score (0-100), XAI factors, and ranked hospitals |
| `GET` | `/hospitals` | Returns all regional emergency care facilities with live bed occupancy |
| `GET` | `/patients` | Chronological log of past patient triage assessments |
| `POST` | `/patients` | Saves a new manual triage assessment record |
| `GET` | `/analytics` | Aggregated severity distributions, risk trends, and hospital bed stats |
| `GET` | `/health` | Health status and ML model loaded check |
| `GET` | `/model-info` | Returns trained model metadata, confusion matrix, and feature importances |

---

## 🚀 Installation & Local Setup

### Prerequisites
- **Python 3.10+** (Python 3.13 tested)
- **Node.js 18+** & **npm**

### Step 1: Clone and Train ML Model
```bash
# Navigate to project directory
cd ambulence

# Install backend dependencies
python -m pip install -r backend/requirements.txt

# Train the ML model and generate metadata
python ml/train_model.py
```

### Step 2: Start the FastAPI Backend
```bash
# Run FastAPI server on port 8000
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The API interactive documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).*

### Step 3: Start the React Frontend
In a second terminal:
```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 🧪 Demo Evaluation Presets

To easily test the prototype during demonstrations or hackathon judging, click the **Demo Evaluation Presets** on the Patient Assessment page:

1. **Demo 1 (Stable Patient)**: 32 y/o Female, normal vitals, mild dizziness $\rightarrow$ **LOW Severity (Risk: ~12/100)**.
2. **Demo 2 (Moderate-Risk Patient)**: 58 y/o Male, fever 38.6°C, tachycardia 104 BPM, dyspnea $\rightarrow$ **MODERATE Severity (Risk: ~52/100)**.
3. **Demo 3 (High-Risk Patient)**: 67 y/o Male, acute chest pain, cardiac history, SpO2 89%, BP 178/102 $\rightarrow$ **HIGH Severity (Risk: ~78/100)** $\rightarrow$ Recommends Heart & Vascular Institute.
4. **Demo 4 (Critical-Risk Patient)**: 74 y/o Male, shock (BP 72/44), loss of consciousness, severe bleeding, SpO2 81% $\rightarrow$ **CRITICAL Alert (Risk: ~98/100)** $\rightarrow$ Routes to Level-1 Trauma Center with open ICU beds.

---

## 🔮 Future Roadmap & IoT Integration

- [ ] **Wearable Ambulance IoT Telemetry**: Stream real-time SpO2, NIBP, and EtCO2 via Bluetooth Low Energy (BLE) / MQTT.
- [ ] **Deep Learning 12-Lead ECG Analysis**: Automatic STEMI and arrhythmia classification on live streams.
- [ ] **Live GPS Traffic Routing**: Dynamic ambulance green-wave traffic signal prioritization.
- [ ] **Hospital EHR Interoperability**: Direct HL7 FHIR pre-arrival notifications and ICU bed reservations.
- [ ] **On-Device Edge AI**: Ambulance tablet inference ensuring offline operation and patient privacy.
- [ ] **Multilingual Voice Assistant**: Hands-free paramedic voice dictation for Glasgow Coma Scale and medication administration.

---

## 📄 License & Compliance

Developed as a prototype for educational and research evaluation. Zero real Protected Health Information (PHI) is ingested or retained.
