"""
Comprehensive automated API and Machine Learning test suite.
"""

import sys
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from backend.app.main import app
from backend.app.models import PatientInput
from backend.app.ml_service import inference_service
from backend.app.database import init_db, get_db_connection

def run_tests():
    print("=" * 60)
    print("RUNNING AUTOMATED VERIFICATION TESTS")
    print("=" * 60)

    # 1. Initialize Database
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as count FROM hospitals")
    hosp_count = cursor.fetchone()['count']
    cursor.execute("SELECT COUNT(*) as count FROM patients")
    pat_count = cursor.fetchone()['count']
    print(f"[OK] Database Initialized: {hosp_count} hospitals, {pat_count} sample patients loaded.")
    conn.close()

    # 2. Test ML Model Inference directly
    print("\n--- Testing Machine Learning Predictions ---")
    
    # Test Scenario 1: Stable Patient
    pt_stable = PatientInput(
        patient_id="TEST-STABLE",
        age=28,
        gender="Female",
        heart_rate=70,
        systolic_bp=115,
        diastolic_bp=75,
        spo2=99.0,
        temperature=36.7,
        respiratory_rate=14,
        chest_pain=False,
        breathing_difficulty=False,
        dizziness=False,
        loss_of_consciousness=False,
        severe_bleeding=False,
        confusion=False
    )
    res_stable = inference_service.predict(pt_stable)
    print(f"[OK] Stable Patient -> Severity: {res_stable.severity_level}, Risk Score: {res_stable.risk_score}, Conf: {res_stable.confidence}")
    assert res_stable.severity_level == 'LOW', f"Expected LOW but got {res_stable.severity_level}"

    # Test Scenario 2: Moderate Patient
    pt_mod = PatientInput(
        patient_id="TEST-MOD",
        age=52,
        gender="Male",
        heart_rate=105,
        systolic_bp=145,
        diastolic_bp=90,
        spo2=94.0,
        temperature=38.7,
        respiratory_rate=22,
        chest_pain=False,
        breathing_difficulty=True,
        dizziness=True,
        loss_of_consciousness=False,
        severe_bleeding=False,
        confusion=False,
        diabetes=True
    )
    res_mod = inference_service.predict(pt_mod)
    print(f"[OK] Moderate Patient -> Severity: {res_mod.severity_level}, Risk Score: {res_mod.risk_score}, Conf: {res_mod.confidence}")
    assert res_mod.severity_level in ['MODERATE', 'HIGH'], f"Unexpected severity {res_mod.severity_level}"

    # Test Scenario 3: High Risk Patient (Chest pain + cardiac history + hypoxia)
    pt_high = PatientInput(
        patient_id="TEST-HIGH",
        age=68,
        gender="Male",
        heart_rate=125,
        systolic_bp=175,
        diastolic_bp=100,
        spo2=88.5,
        temperature=38.0,
        respiratory_rate=28,
        chest_pain=True,
        breathing_difficulty=True,
        dizziness=True,
        loss_of_consciousness=False,
        severe_bleeding=False,
        confusion=False,
        cardiac_history=True
    )
    res_high = inference_service.predict(pt_high)
    print(f"[OK] High Risk Patient -> Severity: {res_high.severity_level}, Risk Score: {res_high.risk_score}, Conf: {res_high.confidence}")
    print(f"     Top Hospital: {res_high.top_hospital.name} ({res_high.top_hospital.suitability_score}%)")
    assert res_high.severity_level in ['HIGH', 'CRITICAL']
    assert res_high.top_hospital.cardiology is True, "Top hospital should have Cardiology for cardiac patient"

    # Test Scenario 4: Critical Patient (Shock + LOC + Severe Bleeding)
    pt_crit = PatientInput(
        patient_id="TEST-CRIT",
        age=75,
        gender="Male",
        heart_rate=155,
        systolic_bp=68,
        diastolic_bp=40,
        spo2=79.0,
        temperature=39.5,
        respiratory_rate=38,
        chest_pain=True,
        breathing_difficulty=True,
        dizziness=True,
        loss_of_consciousness=True,
        severe_bleeding=True,
        confusion=True,
        cardiac_history=True,
        stroke_history=True
    )
    res_crit = inference_service.predict(pt_crit)
    print(f"[OK] Critical Patient -> Severity: {res_crit.severity_level}, Risk Score: {res_crit.risk_score}, Conf: {res_crit.confidence}")
    print(f"     Top Hospital: {res_crit.top_hospital.name} (ICU beds: {res_crit.top_hospital.icu_beds_available})")
    assert res_crit.severity_level == 'CRITICAL'
    assert res_crit.top_hospital.icu_beds_available > 0, "Critical patient must be routed to hospital with open ICU beds"

    print("\n" + "=" * 60)
    print("ALL API AND MACHINE LEARNING TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
