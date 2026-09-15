from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import init_db
from .routes import predict, hospitals, patients, analytics, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database on startup
    init_db()
    yield

app = FastAPI(
    title="AI-Powered Emergency Patient Severity & Hospital Recommendation API",
    description="Intelligent clinical decision-support REST API for emergency triage severity assessment and hospital suitability matching.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(predict.router)
app.include_router(hospitals.router)
app.include_router(patients.router)
app.include_router(analytics.router)
app.include_router(health.router)

@app.get("/")
def root():
    return {
        "message": "AI-Powered Emergency Patient Severity Prediction and Hospital Recommendation API is running.",
        "docs": "/docs",
        "endpoints": ["/predict", "/hospitals", "/patients", "/analytics", "/health", "/model-info"],
        "disclaimer": "Prototype for educational/research purposes only. Predictions are not medical diagnoses."
    }
