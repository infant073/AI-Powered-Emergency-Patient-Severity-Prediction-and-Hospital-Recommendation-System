import axios from 'axios';
import { PatientFormData, PredictionResult, Hospital, PatientHistoryRecord, AnalyticsData, ModelMetadata } from '../types';

// Use Vite proxy or fallback directly to FastAPI localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // AI Severity Prediction
  predictSeverity: async (data: PatientFormData): Promise<PredictionResult> => {
    const response = await client.post<PredictionResult>('/predict', data);
    return response.data;
  },

  // Hospital List
  getHospitals: async (): Promise<Hospital[]> => {
    const response = await client.get<Hospital[]>('/hospitals');
    return response.data;
  },

  // Patient History
  getPatients: async (): Promise<PatientHistoryRecord[]> => {
    const response = await client.get<PatientHistoryRecord[]>('/patients');
    return response.data;
  },

  // Save manual patient record
  savePatient: async (record: Partial<PatientHistoryRecord>) => {
    const response = await client.post('/patients', record);
    return response.data;
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await client.get<AnalyticsData>('/analytics');
    return response.data;
  },

  // Health Check
  getHealth: async () => {
    const response = await client.get('/health');
    return response.data;
  },

  // Model Metadata & XAI metrics
  getModelInfo: async (): Promise<ModelMetadata> => {
    const response = await client.get<ModelMetadata>('/model-info');
    return response.data;
  }
};
