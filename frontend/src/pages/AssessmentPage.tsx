import React, { useState } from 'react';
import { 
  HeartPulse, 
  Activity, 
  Thermometer, 
  Wind, 
  AlertCircle, 
  Sparkles, 
  Check, 
  RefreshCw, 
  User, 
  FileCheck,
  Stethoscope
} from 'lucide-react';
import { PatientFormData, PredictionResult } from '../types';
import { api } from '../services/api';

interface AssessmentPageProps {
  onAssessmentComplete: (result: PredictionResult) => void;
}

const DEMO_PRESETS: Record<string, { label: string; desc: string; color: string; data: PatientFormData }> = {
  stable: {
    label: 'Demo 1: Stable Patient',
    desc: 'Normal vitals, isolated mild lightheadedness, low risk.',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20',
    data: {
      patient_id: 'PT-DEMO-101',
      age: 32,
      gender: 'Female',
      heart_rate: 72,
      systolic_bp: 118,
      diastolic_bp: 76,
      spo2: 99.0,
      temperature: 36.8,
      respiratory_rate: 14,
      chest_pain: false,
      breathing_difficulty: false,
      dizziness: true,
      loss_of_consciousness: false,
      severe_bleeding: false,
      confusion: false,
      cardiac_history: false,
      diabetes: false,
      stroke_history: false,
    },
  },
  moderate: {
    label: 'Demo 2: Moderate-Risk Patient',
    desc: 'Moderate fever, mild tachycardia, tachypnea, diabetes.',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20',
    data: {
      patient_id: 'PT-DEMO-202',
      age: 58,
      gender: 'Male',
      heart_rate: 104,
      systolic_bp: 142,
      diastolic_bp: 88,
      spo2: 94.5,
      temperature: 38.6,
      respiratory_rate: 22,
      chest_pain: false,
      breathing_difficulty: true,
      dizziness: true,
      loss_of_consciousness: false,
      severe_bleeding: false,
      confusion: false,
      cardiac_history: false,
      diabetes: true,
      stroke_history: false,
    },
  },
  high: {
    label: 'Demo 3: High-Risk Patient',
    desc: 'Acute chest pain, cardiac history, hypoxia, hypertension.',
    color: 'border-orange-500/40 text-orange-400 bg-orange-500/10 hover:bg-orange-500/20',
    data: {
      patient_id: 'PT-DEMO-303',
      age: 67,
      gender: 'Male',
      heart_rate: 124,
      systolic_bp: 178,
      diastolic_bp: 102,
      spo2: 89.0,
      temperature: 38.1,
      respiratory_rate: 28,
      chest_pain: true,
      breathing_difficulty: true,
      dizziness: true,
      loss_of_consciousness: false,
      severe_bleeding: false,
      confusion: false,
      cardiac_history: true,
      diabetes: true,
      stroke_history: false,
    },
  },
  critical: {
    label: 'Demo 4: Critical-Risk Patient',
    desc: 'Severe shock, unresponsiveness (LOC), severe hypoxia & bleeding.',
    color: 'border-rose-500/40 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20',
    data: {
      patient_id: 'PT-DEMO-404',
      age: 74,
      gender: 'Male',
      heart_rate: 152,
      systolic_bp: 72,
      diastolic_bp: 44,
      spo2: 81.0,
      temperature: 39.4,
      respiratory_rate: 36,
      chest_pain: true,
      breathing_difficulty: true,
      dizziness: true,
      loss_of_consciousness: true,
      severe_bleeding: true,
      confusion: true,
      cardiac_history: true,
      diabetes: true,
      stroke_history: true,
    },
  },
};

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ onAssessmentComplete }) => {
  const [formData, setFormData] = useState<PatientFormData>({
    patient_id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
    age: 45,
    gender: 'Male',
    heart_rate: 80,
    systolic_bp: 120,
    diastolic_bp: 80,
    spo2: 98.0,
    temperature: 37.0,
    respiratory_rate: 16,
    chest_pain: false,
    breathing_difficulty: false,
    dizziness: false,
    loss_of_consciousness: false,
    severe_bleeding: false,
    confusion: false,
    cardiac_history: false,
    diabetes: false,
    stroke_history: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadPreset = (key: string) => {
    const preset = DEMO_PRESETS[key];
    if (preset) {
      setFormData({ ...preset.data, patient_id: `PT-${Math.floor(1000 + Math.random() * 9000)}` });
      setErrors({});
      setApiError(null);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patient_id.trim()) {
      newErrors.patient_id = 'Patient ID is required';
    }

    if (formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Age must be between 1 and 120 years';
    }

    if (formData.heart_rate < 25 || formData.heart_rate > 240) {
      newErrors.heart_rate = 'Heart rate must be between 25 and 240 BPM';
    }

    if (formData.systolic_bp < 50 || formData.systolic_bp > 260) {
      newErrors.systolic_bp = 'Systolic BP must be between 50 and 260 mmHg';
    }

    if (formData.diastolic_bp < 30 || formData.diastolic_bp > 160) {
      newErrors.diastolic_bp = 'Diastolic BP must be between 30 and 160 mmHg';
    }

    if (formData.systolic_bp <= formData.diastolic_bp) {
      newErrors.systolic_bp = 'Systolic BP should be greater than Diastolic BP';
    }

    if (formData.spo2 < 50.0 || formData.spo2 > 100.0) {
      newErrors.spo2 = 'SpO2 must be between 50.0% and 100.0%';
    }

    if (formData.temperature < 30.0 || formData.temperature > 44.0) {
      newErrors.temperature = 'Body temperature must be between 30.0°C and 44.0°C';
    }

    if (formData.respiratory_rate < 6 || formData.respiratory_rate > 55) {
      newErrors.respiratory_rate = 'Respiratory rate must be between 6 and 55 breaths/min';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const result = await api.predictSeverity(formData);
      onAssessmentComplete(result);
    } catch (err: any) {
      console.error('Prediction API Error:', err);
      setApiError(
        err?.response?.data?.detail ||
          'Failed to connect to AI Inference API. Please ensure the Python FastAPI backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Clinical Intake</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Manual Entry Form</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-sky-400" />
            Patient Clinical Triage Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter patient vital signs and acute symptoms for real-time Machine Learning severity stratification.
          </p>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={() => loadPreset('stable')}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Normal Baseline</span>
        </button>
      </div>

      {/* Demo Mode Selector Presets */}
      <div className="glass-panel p-5 rounded-2xl border border-sky-500/20 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Demo Evaluation Presets (Quick-Fill Test Scenarios)</span>
        </div>
        <p className="text-xs text-slate-400">
          Select a pre-configured clinical profile to instantly demonstrate AI risk scoring and hospital routing:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {Object.entries(DEMO_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => loadPreset(key)}
              className={`p-3 rounded-xl border text-left transition-all ${preset.color}`}
            >
              <div className="font-bold text-xs">{preset.label}</div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-tight">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Error alert if API fails */}
      {apiError && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-600/60 text-rose-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
          <div>
            <span className="font-bold block">Inference Error</span>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Main Assessment Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Patient Information */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-sky-400">
            <User className="w-4 h-4" />
            1. Patient Demographics (Pseudonymized)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Patient Identifier (ID) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g. PT-1048"
              />
              {errors.patient_id && <p className="text-[11px] text-rose-400 mt-1">{errors.patient_id}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Age (Years) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                min="1"
                max="120"
              />
              {errors.age && <p className="text-[11px] text-rose-400 mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gender <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Vital Signs */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-sky-400">
              <Activity className="w-4 h-4" />
              2. Physiological Vital Signs
            </h2>
            <span className="text-[11px] text-slate-400">Standard clinical parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Heart Rate */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Heart Rate
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Normal: 60-100</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.heart_rate}
                  onChange={(e) => setFormData({ ...formData, heart_rate: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400">BPM</span>
              </div>
              {errors.heart_rate && <p className="text-[10px] text-rose-400">{errors.heart_rate}</p>}
            </div>

            {/* Systolic BP */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Systolic Blood Pressure</span>
                <span className="text-[10px] text-slate-400 font-normal">Normal: 90-120</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.systolic_bp}
                  onChange={(e) => setFormData({ ...formData, systolic_bp: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400">mmHg</span>
              </div>
              {errors.systolic_bp && <p className="text-[10px] text-rose-400">{errors.systolic_bp}</p>}
            </div>

            {/* Diastolic BP */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Diastolic Blood Pressure</span>
                <span className="text-[10px] text-slate-400 font-normal">Normal: 60-80</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.diastolic_bp}
                  onChange={(e) => setFormData({ ...formData, diastolic_bp: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400">mmHg</span>
              </div>
              {errors.diastolic_bp && <p className="text-[10px] text-rose-400">{errors.diastolic_bp}</p>}
            </div>

            {/* SpO2 */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" /> SpO2 Saturation
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Normal: 95-100%</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.spo2}
                  onChange={(e) => setFormData({ ...formData, spo2: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400">%</span>
              </div>
              {errors.spo2 && <p className="text-[10px] text-rose-400">{errors.spo2}</p>}
            </div>

            {/* Body Temperature */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Body Temperature
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Normal: 36.5-37.5</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400">°C</span>
              </div>
              {errors.temperature && <p className="text-[10px] text-rose-400">{errors.temperature}</p>}
            </div>

            {/* Respiratory Rate */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Respiratory Rate</span>
                <span className="text-[10px] text-slate-400 font-normal">Normal: 12-20</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.respiratory_rate}
                  onChange={(e) => setFormData({ ...formData, respiratory_rate: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400">breaths/min</span>
              </div>
              {errors.respiratory_rate && <p className="text-[10px] text-rose-400">{errors.respiratory_rate}</p>}
            </div>

          </div>
        </div>

        {/* Section 3: Acute Symptoms & Red Flags */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-sky-400">
              <AlertCircle className="w-4 h-4" />
              3. Acute Symptoms & Red Flags
            </h2>
            <span className="text-[11px] text-slate-400">Check all that apply</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'chest_pain', label: 'Chest Pain (Angina / Tightness)', desc: 'Precordial pressure or radiation' },
              { id: 'breathing_difficulty', label: 'Breathing Difficulty (Dyspnea)', desc: 'Labored respiration or stridor' },
              { id: 'dizziness', label: 'Dizziness / Syncope Sensation', desc: 'Postural instability or vertigo' },
              { id: 'loss_of_consciousness', label: 'Loss of Consciousness (LOC)', desc: 'Unresponsive or syncope episode' },
              { id: 'severe_bleeding', label: 'Severe / Uncontrolled Bleeding', desc: 'Major vascular or trauma hemorrhage' },
              { id: 'confusion', label: 'Acute Confusion / Delirium', desc: 'Disorientation or altered mental status' },
            ].map((sym) => {
              const isChecked = (formData as any)[sym.id];
              return (
                <label
                  key={sym.id}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-sky-950/40 border-sky-500/60 text-white shadow-sm shadow-sky-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setFormData({ ...formData, [sym.id]: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-950 border-slate-700"
                  />
                  <div>
                    <span className="text-xs font-semibold block">{sym.label}</span>
                    <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">{sym.desc}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 4: Medical History & Comorbidities */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-sky-400">
            <FileCheck className="w-4 h-4" />
            4. Relevant Medical History & Comorbidities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'cardiac_history', label: 'Known Cardiac Condition', desc: 'Prior MI, CAD, stent, or heart failure' },
              { id: 'diabetes', label: 'Diabetes Mellitus', desc: 'Type 1 or Type 2 on glycemic medication' },
              { id: 'stroke_history', label: 'Previous Stroke / TIA', desc: 'Cerebrovascular history' },
            ].map((med) => {
              const isChecked = (formData as any)[med.id];
              return (
                <label
                  key={med.id}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-teal-950/40 border-teal-500/60 text-white shadow-sm shadow-teal-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setFormData({ ...formData, [med.id]: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-teal-500 focus:ring-teal-500 bg-slate-950 border-slate-700"
                  />
                  <div>
                    <span className="text-xs font-semibold block">{med.label}</span>
                    <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">{med.desc}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <p className="text-[11px] text-slate-400 max-w-md">
            All parameters will be processed through the trained Random Forest classifier and ranked against sample hospital capacity in real time.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-sky-500/25 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Machine Learning Inference...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Patient</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
