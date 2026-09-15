import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Building2, 
  RotateCcw, 
  FileText, 
  Share2, 
  Download,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { PredictionResult, Hospital } from '../types';
import { SeverityGauge } from '../components/SeverityGauge';
import { ExplainableAIFactors } from '../components/ExplainableAIFactors';
import { EmergencyAlert } from '../components/EmergencyAlert';
import { HospitalCard } from '../components/HospitalCard';

interface ResultPageProps {
  result: PredictionResult;
  onNewAssessment: () => void;
  onOpenMap: (hospital?: Hospital) => void;
  onViewHistory: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  onNewAssessment,
  onOpenMap,
  onViewHistory,
}) => {
  const topHosp = result.top_hospital || result.recommended_hospitals[0];
  const otherHospitals = result.recommended_hospitals.slice(1);

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewAssessment}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            title="Back to Form"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-400 font-mono">{result.patient_id}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Triage Timestamp: {result.timestamp}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Emergency Severity & Recommendation Report
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewAssessment}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Patient Assessment</span>
          </button>
          <button
            onClick={onViewHistory}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Triage Log</span>
          </button>
        </div>
      </div>

      {/* Prominent Emergency Alert (if HIGH or CRITICAL) */}
      <EmergencyAlert
        severity={result.severity_level}
        riskScore={result.risk_score}
        topHospitalName={topHosp?.name}
      />

      {/* Section 1: Large Visual Severity Indicator & Risk Score */}
      <SeverityGauge
        severity={result.severity_level}
        riskScore={result.risk_score}
        confidence={result.confidence}
      />

      {/* Section 2: Explainable AI Risk Factors & Transparent Attribution */}
      <ExplainableAIFactors
        keyRiskFactors={result.key_risk_factors}
        detailedFactors={result.detailed_factors}
        featureContributions={result.feature_contributions}
        actionRequired={result.action_required}
      />

      {/* Section 3: Hospital Recommendations */}
      <div className="space-y-6 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-semibold">Logistical Routing</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Multi-Factor Suitability Algorithm
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Recommended Emergency Facilities</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked dynamically by specialty readiness, patient severity, ICU capacity, distance, and current wait time.
            </p>
          </div>

          <button
            onClick={() => onOpenMap(topHosp)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-500/40 text-sky-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Navigation className="w-4 h-4 text-sky-400" />
            <span>Open Interactive Map</span>
          </button>
        </div>

        {/* Top Recommended Hospital */}
        {topHosp && (
          <div>
            <HospitalCard
              hospital={topHosp}
              isTopRecommendation={true}
              onSelectOnMap={onOpenMap}
            />
          </div>
        )}

        {/* Other Nearby Hospitals */}
        {otherHospitals.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Alternative Facilities in Vicinity ({otherHospitals.length} options)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherHospitals.map((hosp, idx) => (
                <HospitalCard
                  key={hosp.hospital_id || hosp.id || idx}
                  hospital={hosp}
                  isTopRecommendation={false}
                  onSelectOnMap={onOpenMap}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Legal & Clinical Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
        <p>{result.disclaimer}</p>
      </div>
    </div>
  );
};
