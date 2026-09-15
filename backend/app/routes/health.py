from fastapi import APIRouter
from typing import Dict, Any
import os
import json

router = APIRouter(tags=["Health & Model Info"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
META_PATH = os.path.join(BASE_DIR, "models", "model_metadata.json")

@router.get("/health")
def health_check():
    """Health check endpoint for the backend services."""
    model_loaded = os.path.exists(os.path.join(BASE_DIR, "models", "severity_model.joblib"))
    return {
        "status": "healthy",
        "service": "AI Emergency Severity & Hospital Recommendation System API",
        "model_loaded": model_loaded,
        "database": "SQLite (initialized)"
    }

@router.get("/model-info")
def get_model_information() -> Dict[str, Any]:
    """Returns trained machine learning model metrics, confusion matrix, and feature importances."""
    if os.path.exists(META_PATH):
        with open(META_PATH, 'r') as f:
            return json.load(f)
    return {
        "error": "Model metadata not found. Train model via ml/train_model.py"
    }
