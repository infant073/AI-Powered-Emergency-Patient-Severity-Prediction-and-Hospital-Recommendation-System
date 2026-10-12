from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..database import get_db_connection
from ..models import PatientRecord

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("", response_model=List[PatientRecord])
def get_patient_history():
    """Retrieves chronological triage assessment logs."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM patients ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        
        records = []
        for r in rows:
            records.append(PatientRecord(
                id=r["id"],
                patient_id=r["patient_id"],
                created_at=r["created_at"],
                age=r["age"],
                gender=r["gender"],
                severity_level=r["severity_level"],
                risk_score=r["risk_score"],
                confidence=r["confidence"],
                heart_rate=r["heart_rate"],
                blood_pressure=r["blood_pressure"],
                spo2=r["spo2"],
                temperature=r["temperature"],
                respiratory_rate=r["respiratory_rate"],
                symptoms_summary=r["symptoms_summary"],
                recommended_hospital=r["recommended_hospital"],
                status=r["status"]
            ))
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("", response_model=Dict[str, Any])
def create_patient_record(record: PatientRecord):
    """Adds a new manual triage assessment record."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO patients (
            patient_id, created_at, age, gender, severity_level,
            risk_score, confidence, heart_rate, blood_pressure,
            spo2, temperature, respiratory_rate, symptoms_summary,
            recommended_hospital, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record.patient_id, record.created_at, record.age, record.gender,
            record.severity_level, record.risk_score, record.confidence,
            record.heart_rate, record.blood_pressure, record.spo2,
            record.temperature, record.respiratory_rate, record.symptoms_summary,
            record.recommended_hospital, record.status
        ))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return {"status": "success", "id": new_id, "message": "Record saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
