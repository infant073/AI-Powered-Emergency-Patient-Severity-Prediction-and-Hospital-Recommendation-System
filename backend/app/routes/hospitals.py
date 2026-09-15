from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..database import get_db_connection

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_hospitals():
    """Returns all emergency care hospitals with live bed statuses and specialties."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM hospitals")
        rows = cursor.fetchall()
        conn.close()
        
        hospitals = []
        for r in rows:
            hospitals.append({
                "id": r["id"],
                "name": r["name"],
                "location": r["location"],
                "coordinates": {"lat": r["lat"], "lng": r["lng"]},
                "distance_km": r["distance_km"],
                "emergency_department": bool(r["emergency_department"]),
                "icu_beds_total": r["icu_beds_total"],
                "icu_beds_available": r["icu_beds_available"],
                "er_beds_total": r["er_beds_total"],
                "er_beds_available": r["er_beds_available"],
                "cardiology": bool(r["cardiology"]),
                "neurology": bool(r["neurology"]),
                "trauma_level_1": bool(r["trauma_level_1"]),
                "pediatric_er": bool(r["pediatric_er"]),
                "general_emergency": bool(r["general_emergency"]),
                "estimated_wait_min": r["estimated_wait_min"],
                "ambulance_bay_status": r["ambulance_bay_status"],
                "contact_phone": r["contact_phone"]
            })
        return hospitals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
