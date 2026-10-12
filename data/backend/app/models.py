from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PatientInput(BaseModel):
    patient_id: str = Field(default="PT-DEMO", description="Unique patient identifier")
    age: int = Field(ge=1, le=120, description="Age of patient in years")
    gender: str = Field(pattern="^(Male|Female|Other)$", description="Gender of patient")
    
    # Vital signs
    heart_rate: int = Field(ge=20, le=260, description="Heart rate in BPM")
    systolic_bp: int = Field(ge=40, le=300, description="Systolic blood pressure in mmHg")
    diastolic_bp: int = Field(ge=20, le=200, description="Diastolic blood pressure in mmHg")
    spo2: float = Field(ge=50.0, le=100.0, description="Oxygen saturation percentage")
    temperature: float = Field(ge=30.0, le=45.0, description="Body temperature in Celsius")
    respiratory_rate: int = Field(ge=4, le=60, description="Breaths per minute")
    
    # Acute Symptoms
    chest_pain: bool = False
    breathing_difficulty: bool = False
    dizziness: bool = False
    loss_of_consciousness: bool = False
    severe_bleeding: bool = False
    confusion: bool = False
    
    # Medical History
    cardiac_history: bool = False
    diabetes: bool = False
    stroke_history: bool = False

class RiskFactor(BaseModel):
    factor: str
    severity: str # 'CRITICAL', 'HIGH', 'MODERATE', 'NORMAL'
    detail: str
    icon: Optional[str] = None

class HospitalRecommendation(BaseModel):
    hospital_id: str
    name: str
    location: str
    coordinates: Dict[str, float]
    distance_km: float
    suitability_score: int # 0-100%
    icu_beds_available: int
    icu_beds_total: int
    er_beds_available: int
    er_beds_total: int
    emergency_department: bool
    cardiology: bool
    neurology: bool
    trauma_level_1: bool
    estimated_wait_min: int
    ambulance_bay_status: str
    contact_phone: str
    match_reasons: List[str]
    alert_notes: Optional[str] = None

class PredictionResponse(BaseModel):
    patient_id: str
    severity_level: str # 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'
    risk_score: int # 0-100
    confidence: float # 0.0-1.0
    key_risk_factors: List[str]
    detailed_factors: List[RiskFactor]
    recommendation: str
    action_required: str
    color_code: str
    feature_contributions: Dict[str, float]
    recommended_hospitals: List[HospitalRecommendation]
    top_hospital: Optional[HospitalRecommendation] = None
    timestamp: str
    disclaimer: str

class PatientRecord(BaseModel):
    id: Optional[int] = None
    patient_id: str
    created_at: str
    age: int
    gender: str
    severity_level: str
    risk_score: int
    confidence: float
    heart_rate: int
    blood_pressure: str
    spo2: float
    temperature: float
    respiratory_rate: int
    symptoms_summary: str
    recommended_hospital: str
    status: str = "Evaluated"

class AnalyticsOverview(BaseModel):
    total_patients: int
    critical_cases: int
    high_risk_cases: int
    moderate_cases: int
    low_risk_cases: int
    avg_risk_score: float
    severity_distribution: List[Dict[str, Any]]
    recent_trend: List[Dict[str, Any]]
    hourly_distribution: List[Dict[str, Any]]
    hospital_capacity_summary: List[Dict[str, Any]]
