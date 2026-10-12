from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ..database import get_db_connection
from ..models import AnalyticsOverview

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("", response_model=Dict[str, Any])
def get_analytics_overview():
    """Returns aggregated emergency triage analytics, charts data, and hospital capacity."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Total & Severity breakdown
        cursor.execute("""
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN severity_level = 'CRITICAL' THEN 1 ELSE 0 END) as critical_cnt,
            SUM(CASE WHEN severity_level = 'HIGH' THEN 1 ELSE 0 END) as high_cnt,
            SUM(CASE WHEN severity_level = 'MODERATE' THEN 1 ELSE 0 END) as moderate_cnt,
            SUM(CASE WHEN severity_level = 'LOW' THEN 1 ELSE 0 END) as low_cnt,
            AVG(risk_score) as avg_risk
        FROM patients
        """)
        stats = cursor.fetchone()
        
        total = stats['total'] or 0
        critical_cnt = stats['critical_cnt'] or 0
        high_cnt = stats['high_cnt'] or 0
        moderate_cnt = stats['moderate_cnt'] or 0
        low_cnt = stats['low_cnt'] or 0
        avg_risk = round(stats['avg_risk'] or 0.0, 1)

        severity_distribution = [
            {"name": "Critical", "value": critical_cnt, "color": "#EF4444"},
            {"name": "High Risk", "value": high_cnt, "color": "#F97316"},
            {"name": "Moderate", "value": moderate_cnt, "color": "#F59E0B"},
            {"name": "Low Risk", "value": low_cnt, "color": "#10B981"}
        ]

        # 2. Recent Risk Score Trend
        cursor.execute("""
        SELECT patient_id, created_at, risk_score, severity_level 
        FROM patients 
        ORDER BY id DESC LIMIT 15
        """)
        recent_rows = cursor.fetchall()
        recent_trend = []
        for r in reversed(recent_rows):
            recent_trend.append({
                "patient": r["patient_id"],
                "score": r["risk_score"],
                "severity": r["severity_level"],
                "time": r["created_at"].split(" ")[-1] if " " in r["created_at"] else r["created_at"]
            })

        # 3. Hospital Capacities
        cursor.execute("""
        SELECT name, icu_beds_total, icu_beds_available, er_beds_total, er_beds_available, estimated_wait_min
        FROM hospitals
        """)
        hosp_rows = cursor.fetchall()
        hosp_capacities = []
        for h in hosp_rows:
            hosp_capacities.append({
                "hospital": h["name"].split(" ")[0] + " " + h["name"].split(" ")[1],
                "fullName": h["name"],
                "icuAvailable": h["icu_beds_available"],
                "icuOccupied": h["icu_beds_total"] - h["icu_beds_available"],
                "erAvailable": h["er_beds_available"],
                "erOccupied": h["er_beds_total"] - h["er_beds_available"],
                "waitMin": h["estimated_wait_min"]
            })

        # 4. Hourly / Age Distribution
        cursor.execute("""
        SELECT 
            CASE 
                WHEN age < 30 THEN '18-29'
                WHEN age < 50 THEN '30-49'
                WHEN age < 70 THEN '50-69'
                ELSE '70+'
            END as age_bracket,
            COUNT(*) as count,
            AVG(risk_score) as avg_score
        FROM patients
        GROUP BY age_bracket
        """)
        age_dist = [{"group": r["age_bracket"], "count": r["count"], "avgRisk": round(r["avg_score"], 1)} for r in cursor.fetchall()]

        conn.close()

        return {
            "total_patients": total,
            "critical_cases": critical_cnt,
            "high_risk_cases": high_cnt,
            "moderate_cases": moderate_cnt,
            "low_risk_cases": low_cnt,
            "avg_risk_score": avg_risk,
            "severity_distribution": severity_distribution,
            "recent_trend": recent_trend,
            "hospital_capacities": hosp_capacities,
            "age_demographics": age_dist
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
