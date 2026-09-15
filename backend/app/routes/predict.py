from fastapi import APIRouter, HTTPException
from ..models import PatientInput, PredictionResponse
from ..ml_service import inference_service

router = APIRouter(tags=["AI Prediction"])

@router.post("/predict", response_model=PredictionResponse)
def predict_severity(patient: PatientInput):
    """
    Evaluates patient vitals, symptoms, and medical history using trained Machine Learning models.
    Returns:
    - Emergency Severity Level (LOW, MODERATE, HIGH, CRITICAL)
    - Risk Score (0-100)
    - AI Confidence
    - Explainable AI Key Risk Factors
    - Recommended action guidance
    - Ranked Hospital Recommendations with suitability scores
    """
    try:
        result = inference_service.predict(patient)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
