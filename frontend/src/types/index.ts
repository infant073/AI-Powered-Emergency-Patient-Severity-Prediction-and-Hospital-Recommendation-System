export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface PatientFormData {
  patient_id: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  
  // Vitals
  heart_rate: number;
  systolic_bp: number;
  diastolic_bp: number;
  spo2: number;
  temperature: number;
  respiratory_rate: number;
  
  // Acute Symptoms
  chest_pain: boolean;
  breathing_difficulty: boolean;
  dizziness: boolean;
  loss_of_consciousness: boolean;
  severe_bleeding: boolean;
  confusion: boolean;
  
  // Medical History
  cardiac_history: boolean;
  diabetes: boolean;
  stroke_history: boolean;
}

export interface RiskFactor {
  factor: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NORMAL';
  detail: string;
  icon?: string;
}

export interface Hospital {
  id?: string;
  hospital_id?: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  distance_km: number;
  suitability_score?: number;
  icu_beds_total: number;
  icu_beds_available: number;
  er_beds_total: number;
  er_beds_available: number;
  emergency_department: boolean;
  cardiology: boolean;
  neurology: boolean;
  trauma_level_1: boolean;
  pediatric_er: boolean;
  general_emergency: boolean;
  estimated_wait_min: number;
  ambulance_bay_status: string;
  contact_phone: string;
  match_reasons?: string[];
  alert_notes?: string | null;
}

export interface PredictionResult {
  patient_id: string;
  severity_level: SeverityLevel;
  risk_score: number;
  confidence: number;
  key_risk_factors: string[];
  detailed_factors: RiskFactor[];
  recommendation: string;
  action_required: string;
  color_code: string;
  feature_contributions: Record<string, number>;
  recommended_hospitals: Hospital[];
  top_hospital?: Hospital;
  timestamp: string;
  disclaimer: string;
}

export interface PatientHistoryRecord {
  id: number;
  patient_id: string;
  created_at: string;
  age: number;
  gender: string;
  severity_level: SeverityLevel;
  risk_score: number;
  confidence: number;
  heart_rate: number;
  blood_pressure: string;
  spo2: number;
  temperature: number;
  respiratory_rate: number;
  symptoms_summary: string;
  recommended_hospital: string;
  status: string;
}

export interface AnalyticsData {
  total_patients: number;
  critical_cases: number;
  high_risk_cases: number;
  moderate_cases: number;
  low_risk_cases: number;
  avg_risk_score: number;
  severity_distribution: Array<{ name: string; value: number; color: string }>;
  recent_trend: Array<{ patient: string; score: number; severity: SeverityLevel; time: string }>;
  hospital_capacities: Array<{
    hospital: string;
    fullName: string;
    icuAvailable: number;
    icuOccupied: number;
    erAvailable: number;
    erOccupied: number;
    waitMin: number;
  }>;
  age_demographics: Array<{ group: string; count: number; avgRisk: number }>;
}

export interface ModelMetadata {
  model_name: string;
  framework: string;
  n_estimators: number;
  dataset_type: string;
  dataset_notice: string;
  total_samples: number;
  train_samples: number;
  test_samples: number;
  classes: string[];
  features: string[];
  accuracy: number;
  precision_macro: number;
  recall_macro: number;
  f1_macro: number;
  precision_weighted: number;
  recall_weighted: number;
  f1_weighted: number;
  confusion_matrix: number[][];
  classification_report: Record<string, any>;
  feature_importances: Array<{
    feature: string;
    name: string;
    importance: number;
    importance_pct: number;
  }>;
}
