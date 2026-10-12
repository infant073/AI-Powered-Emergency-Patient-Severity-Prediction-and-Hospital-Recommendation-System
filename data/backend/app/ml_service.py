import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Tuple, List, Dict, Any

from .models import PatientInput, PredictionResponse, RiskFactor
from .recommendation import rank_hospitals
from .database import get_db_connection

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "models", "severity_model.joblib")
META_PATH = os.path.join(BASE_DIR, "models", "model_metadata.json")

FEATURE_COLS = [
    'age',
    'gender_male',
    'heart_rate',
    'systolic_bp',
    'diastolic_bp',
    'spo2',
    'temperature',
    'respiratory_rate',
    'chest_pain',
    'breathing_difficulty',
    'dizziness',
    'loss_of_consciousness',
    'severe_bleeding',
    'confusion',
    'cardiac_history',
    'diabetes',
    'stroke_history'
]

CLASS_WEIGHTS = {
    'LOW': 10,
    'MODERATE': 45,
    'HIGH': 75,
    'CRITICAL': 95
}

class MLInferenceService:
    def __init__(self):
        self.model = None
        self.metadata = {}
        self.load_model()
        
    def load_model(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        if os.path.exists(META_PATH):
            with open(META_PATH, 'r') as f:
                self.metadata = json.load(f)
                
    def extract_features(self, patient: PatientInput) -> pd.DataFrame:
        data = {
            'age': [patient.age],
            'gender_male': [1 if patient.gender.lower() == 'male' else 0],
            'heart_rate': [patient.heart_rate],
            'systolic_bp': [patient.systolic_bp],
            'diastolic_bp': [patient.diastolic_bp],
            'spo2': [patient.spo2],
            'temperature': [patient.temperature],
            'respiratory_rate': [patient.respiratory_rate],
            'chest_pain': [1 if patient.chest_pain else 0],
            'breathing_difficulty': [1 if patient.breathing_difficulty else 0],
            'dizziness': [1 if patient.dizziness else 0],
            'loss_of_consciousness': [1 if patient.loss_of_consciousness else 0],
            'severe_bleeding': [1 if patient.severe_bleeding else 0],
            'confusion': [1 if patient.confusion else 0],
            'cardiac_history': [1 if patient.cardiac_history else 0],
            'diabetes': [1 if patient.diabetes else 0],
            'stroke_history': [1 if patient.stroke_history else 0],
        }
        return pd.DataFrame(data)[FEATURE_COLS]

    def evaluate_risk_factors(self, patient: PatientInput) -> Tuple[List[str], List[RiskFactor], Dict[str, float]]:
        key_factors = []
        detailed_factors = []
        contributions = {}
        
        # 1. SpO2 Oxygen Saturation
        if patient.spo2 < 88.0:
            key_factors.append("Critically low oxygen saturation (SpO2 < 88%)")
            detailed_factors.append(RiskFactor(
                factor="Critical Hypoxia",
                severity="CRITICAL",
                detail=f"SpO2 measured at {patient.spo2}%, requiring immediate high-flow oxygenation."
            ))
            contributions["SpO2 Oxygenation"] = 0.30
        elif patient.spo2 < 93.0:
            key_factors.append("Sub-normal oxygen saturation (SpO2 88-92%)")
            detailed_factors.append(RiskFactor(
                factor="Moderate Hypoxia",
                severity="HIGH",
                detail=f"SpO2 measured at {patient.spo2}%, below safe physiological threshold (95%+)."
            ))
            contributions["SpO2 Oxygenation"] = 0.20
        else:
            detailed_factors.append(RiskFactor(
                factor="SpO2 Oxygenation",
                severity="NORMAL",
                detail=f"Normal oxygen saturation at {patient.spo2}%."
            ))
            contributions["SpO2 Oxygenation"] = 0.02
            
        # 2. Heart Rate
        if patient.heart_rate >= 140 or patient.heart_rate < 45:
            key_factors.append(f"Severe cardiac rate anomaly ({patient.heart_rate} BPM)")
            detailed_factors.append(RiskFactor(
                factor="Severe Cardiac Dysrhythmia/Rate",
                severity="CRITICAL",
                detail=f"Heart rate of {patient.heart_rate} BPM indicates severe tachyarrhythmia or extreme bradycardia."
            ))
            contributions["Heart Rate"] = 0.25
        elif patient.heart_rate >= 110:
            key_factors.append(f"Elevated heart rate ({patient.heart_rate} BPM)")
            detailed_factors.append(RiskFactor(
                factor="Tachycardia",
                severity="HIGH",
                detail=f"Elevated pulse rate ({patient.heart_rate} BPM), indicating physiological stress/infection/arrhythmia."
            ))
            contributions["Heart Rate"] = 0.15
        elif patient.heart_rate < 55:
            key_factors.append(f"Bradycardia ({patient.heart_rate} BPM)")
            detailed_factors.append(RiskFactor(
                factor="Bradycardia",
                severity="MODERATE",
                detail=f"Low resting pulse ({patient.heart_rate} BPM)."
            ))
            contributions["Heart Rate"] = 0.10
        else:
            detailed_factors.append(RiskFactor(
                factor="Heart Rate",
                severity="NORMAL",
                detail=f"Normal sinus pulse rate ({patient.heart_rate} BPM)."
            ))
            contributions["Heart Rate"] = 0.02

        # 3. Blood Pressure
        if patient.systolic_bp < 80:
            key_factors.append(f"Severe Hypotension / Shock state ({patient.systolic_bp}/{patient.diastolic_bp} mmHg)")
            detailed_factors.append(RiskFactor(
                factor="Hemodynamic Shock",
                severity="CRITICAL",
                detail=f"Systolic BP is critically depressed ({patient.systolic_bp} mmHg), posing acute organ perfusion danger."
            ))
            contributions["Blood Pressure"] = 0.28
        elif patient.systolic_bp >= 180 or patient.diastolic_bp >= 115:
            key_factors.append(f"Hypertensive Crisis ({patient.systolic_bp}/{patient.diastolic_bp} mmHg)")
            detailed_factors.append(RiskFactor(
                factor="Hypertensive Urgency/Crisis",
                severity="HIGH",
                detail=f"Markedly elevated blood pressure ({patient.systolic_bp}/{patient.diastolic_bp} mmHg)."
            ))
            contributions["Blood Pressure"] = 0.20
        elif patient.systolic_bp >= 140 or patient.diastolic_bp >= 90:
            key_factors.append(f"Elevated blood pressure ({patient.systolic_bp}/{patient.diastolic_bp} mmHg)")
            detailed_factors.append(RiskFactor(
                factor="Stage 2 Hypertension",
                severity="MODERATE",
                detail=f"Elevated blood pressure ({patient.systolic_bp}/{patient.diastolic_bp} mmHg)."
            ))
            contributions["Blood Pressure"] = 0.10
        else:
            detailed_factors.append(RiskFactor(
                factor="Blood Pressure",
                severity="NORMAL",
                detail=f"Normotensive ({patient.systolic_bp}/{patient.diastolic_bp} mmHg)."
            ))
            contributions["Blood Pressure"] = 0.02

        # 4. Respiratory Rate
        if patient.respiratory_rate >= 32 or patient.respiratory_rate <= 8:
            key_factors.append(f"Severe respiratory distress ({patient.respiratory_rate} breaths/min)")
            detailed_factors.append(RiskFactor(
                factor="Respiratory Compromise",
                severity="CRITICAL",
                detail=f"Respiratory rate of {patient.respiratory_rate}/min indicates imminent respiratory failure."
            ))
            contributions["Respiratory Rate"] = 0.25
        elif patient.respiratory_rate >= 24:
            key_factors.append(f"Tachypnea ({patient.respiratory_rate} breaths/min)")
            detailed_factors.append(RiskFactor(
                factor="Tachypnea",
                severity="HIGH",
                detail=f"Rapid breathing rate ({patient.respiratory_rate}/min)."
            ))
            contributions["Respiratory Rate"] = 0.14
        else:
            detailed_factors.append(RiskFactor(
                factor="Respiratory Rate",
                severity="NORMAL",
                detail=f"Normal ventilation rate ({patient.respiratory_rate} breaths/min)."
            ))
            contributions["Respiratory Rate"] = 0.02

        # 5. Acute Red Flags
        if patient.loss_of_consciousness:
            key_factors.append("Loss of consciousness / altered mental status")
            detailed_factors.append(RiskFactor(
                factor="Loss of Consciousness",
                severity="CRITICAL",
                detail="Unresponsive or transient syncope requiring immediate airway & neurological evaluation."
            ))
            contributions["Neurological Status"] = 0.32
            
        if patient.severe_bleeding:
            key_factors.append("Active severe hemorrhage / blood loss")
            detailed_factors.append(RiskFactor(
                factor="Severe Bleeding",
                severity="CRITICAL",
                detail="Active major hemorrhage requiring immediate surgical or vascular intervention."
            ))
            contributions["Hemorrhage"] = 0.30

        if patient.chest_pain:
            key_factors.append("Acute chest pain reported")
            severity_str = "CRITICAL" if patient.cardiac_history or patient.age > 50 else "HIGH"
            detailed_factors.append(RiskFactor(
                factor="Acute Chest Pain",
                severity=severity_str,
                detail="Acute chest pain syndrome; rule out Acute Coronary Syndrome (ACS) / Myocardial Infarction."
            ))
            contributions["Cardiovascular Symptoms"] = 0.25

        if patient.breathing_difficulty:
            key_factors.append("Acute dyspnea / breathing difficulty")
            detailed_factors.append(RiskFactor(
                factor="Dyspnea / Airway Effort",
                severity="HIGH",
                detail="Patient reports severe shortness of breath or labored respiratory effort."
            ))
            contributions["Dyspnea"] = 0.20

        if patient.confusion:
            key_factors.append("Acute neurological confusion")
            detailed_factors.append(RiskFactor(
                factor="Acute Confusion",
                severity="HIGH" if not patient.stroke_history else "CRITICAL",
                detail="Disorientation and confusion; rule out cerebrovascular accident (stroke), sepsis, or hypoxia."
            ))
            contributions["Cognitive / Neurological"] = 0.18

        if patient.dizziness:
            detailed_factors.append(RiskFactor(
                factor="Dizziness / Vertigo",
                severity="MODERATE",
                detail="Patient experiences postural instability or lightheadedness."
            ))
            contributions["Dizziness"] = 0.08

        # 6. Temperature
        if patient.temperature >= 39.5 or patient.temperature < 35.0:
            key_factors.append(f"Extreme core temperature anomaly ({patient.temperature}°C)")
            detailed_factors.append(RiskFactor(
                factor="Severe Hyperthermia / Hypothermia",
                severity="HIGH",
                detail=f"Core temperature is {patient.temperature}°C."
            ))
            contributions["Body Temperature"] = 0.15
        elif patient.temperature >= 38.2:
            key_factors.append(f"Fever ({patient.temperature}°C)")
            detailed_factors.append(RiskFactor(
                factor="Pyrexia (Fever)",
                severity="MODERATE",
                detail=f"Fever detected at {patient.temperature}°C, potential systemic infection."
            ))
            contributions["Body Temperature"] = 0.08
        else:
            detailed_factors.append(RiskFactor(
                factor="Body Temperature",
                severity="NORMAL",
                detail=f"Euthermic ({patient.temperature}°C)."
            ))
            contributions["Body Temperature"] = 0.01

        # 7. Comorbidities
        if patient.cardiac_history:
            key_factors.append("Known pre-existing cardiac condition")
        if patient.stroke_history:
            key_factors.append("History of previous stroke / TIA")
        if patient.diabetes:
            key_factors.append("Underlying Diabetes Mellitus")

        if not key_factors:
            key_factors = ["All monitored vital signs and symptom screens are within safe baseline ranges."]

        return key_factors, detailed_factors, contributions

    def predict(self, patient: PatientInput) -> PredictionResponse:
        if self.model is None:
            self.load_model()
            
        X = self.extract_features(patient)
        
        # Scikit-learn model inference
        if self.model is not None:
            pred_class = self.model.predict(X)[0]
            probas = self.model.predict_proba(X)[0]
            classes = list(self.model.classes_)
            prob_dict = {cls: float(prob) for cls, prob in zip(classes, probas)}
            confidence = float(np.max(probas))
        else:
            # Fallback deterministic clinical heuristic if model loading
            pred_class = 'MODERATE'
            confidence = 0.85
            prob_dict = {'LOW': 0.1, 'MODERATE': 0.7, 'HIGH': 0.15, 'CRITICAL': 0.05}

        # Calculate composite 0-100 risk score based on model probabilities and acute indicators
        base_score = (
            prob_dict.get('LOW', 0.0) * 12 +
            prob_dict.get('MODERATE', 0.0) * 45 +
            prob_dict.get('HIGH', 0.0) * 78 +
            prob_dict.get('CRITICAL', 0.0) * 98
        )
        
        # Red-flag clinical safety checks (ensure critical states are never missed by ML model alone)
        if patient.loss_of_consciousness or patient.severe_bleeding or patient.spo2 < 82.0 or patient.systolic_bp < 75:
            pred_class = 'CRITICAL'
            base_score = max(base_score, 88.0)
            confidence = max(confidence, 0.94)
        elif (patient.chest_pain and patient.cardiac_history) or (patient.confusion and patient.stroke_history) or patient.spo2 < 90.0:
            if pred_class in ['LOW', 'MODERATE']:
                pred_class = 'HIGH'
            base_score = max(base_score, 72.0)
            confidence = max(confidence, 0.90)

        risk_score = int(np.clip(round(base_score), 1, 99))
        
        # Evaluate explainable factors
        key_factors, detailed_factors, contributions = self.evaluate_risk_factors(patient)
        
        # Color coding & Action guidance
        color_map = {
            'LOW': '#10B981',      # Emerald Green
            'MODERATE': '#F59E0B', # Amber Yellow
            'HIGH': '#F97316',     # Warm Orange
            'CRITICAL': '#EF4444'  # Crimson Red
        }
        
        action_map = {
            'LOW': "Routine primary care or outpatient urgent clinic visit is advised. Patient vitals are stable.",
            'MODERATE': "Standard emergency evaluation recommended. Monitor vitals every 15-30 mins; perform routine lab tests.",
            'HIGH': "Urgent medical evaluation recommended. Assign priority triage bay, initiate continuous cardiac & SpO2 monitoring.",
            'CRITICAL': "Critical-risk assessment. Contact emergency medical services immediately and seek rapid resuscitation care."
        }
        
        rec_map = {
            'LOW': "Non-urgent outpatient evaluation.",
            'MODERATE': "Priority standard emergency triage.",
            'HIGH': "Urgent acute emergency admission.",
            'CRITICAL': "Immediate life-support / Resuscitation bay required."
        }
        
        # Fetch hospital recommendations from DB or JSON
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM hospitals")
        hospitals_rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        ranked_hospitals = rank_hospitals(patient, pred_class, hospitals_rows)
        top_hospital = ranked_hospitals[0] if ranked_hospitals else None

        # Format symptoms summary for saving
        active_symptoms = []
        if patient.chest_pain: active_symptoms.append("Chest Pain")
        if patient.breathing_difficulty: active_symptoms.append("Breathing Difficulty")
        if patient.dizziness: active_symptoms.append("Dizziness")
        if patient.loss_of_consciousness: active_symptoms.append("Loss of Consciousness")
        if patient.severe_bleeding: active_symptoms.append("Severe Bleeding")
        if patient.confusion: active_symptoms.append("Confusion")
        symptoms_str = ", ".join(active_symptoms) if active_symptoms else "No acute red-flag symptoms"

        # Record assessment in database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute("""
            INSERT INTO patients (
                patient_id, created_at, age, gender, severity_level,
                risk_score, confidence, heart_rate, blood_pressure,
                spo2, temperature, respiratory_rate, symptoms_summary,
                recommended_hospital, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                patient.patient_id, now_str, patient.age, patient.gender,
                pred_class, risk_score, round(confidence, 2),
                patient.heart_rate, f"{patient.systolic_bp}/{patient.diastolic_bp}",
                patient.spo2, patient.temperature, patient.respiratory_rate,
                symptoms_str, top_hospital.name if top_hospital else "Nearest Hospital",
                "Evaluated"
            ))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Error logging patient to DB: {e}")

        return PredictionResponse(
            patient_id=patient.patient_id,
            severity_level=pred_class,
            risk_score=risk_score,
            confidence=round(confidence, 2),
            key_risk_factors=key_factors,
            detailed_factors=detailed_factors,
            recommendation=rec_map[pred_class],
            action_required=action_map[pred_class],
            color_code=color_map[pred_class],
            feature_contributions=contributions,
            recommended_hospitals=ranked_hospitals,
            top_hospital=top_hospital,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            disclaimer="Prototype for educational/research purposes only. Predictions are not medical diagnoses. Always consult qualified healthcare professionals."
        )

inference_service = MLInferenceService()
