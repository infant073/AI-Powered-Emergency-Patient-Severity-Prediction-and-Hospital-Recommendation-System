import React from 'react';
import { AlertOctagon, AlertTriangle, PhoneCall, ShieldAlert, Sparkles } from 'lucide-react';
import { SeverityLevel } from '../types';

interface EmergencyAlertProps {
  severity: SeverityLevel;
  riskScore: number;
  topHospitalName?: string;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ severity, riskScore, topHospitalName }) => {
  if (severity === 'LOW' || severity === 'MODERATE') {
    return null;
  }

  const isCritical = severity === 'CRITICAL';

  return (
    <div
      role="alert"
      className={`relative overflow-hidden rounded-2xl p-5 mb-6 border transition-all ${
        isCritical
          ? 'bg-rose-950/40 border-rose-600/80 shadow-2xl shadow-rose-900/40 animate-pulse-subtle glow-critical'
          : 'bg-orange-950/40 border-orange-500/80 shadow-xl shadow-orange-950/40 glow-high'
      }`}
    >
      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-3 rounded-xl flex-shrink-0 ${
              isCritical
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-bounce'
                : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
            }`}
          >
            {isCritical ? (
              <AlertOctagon className="w-7 h-7" />
            ) : (
              <AlertTriangle className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase ${
                  isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                }`}
              >
                {isCritical ? 'CRITICAL EMERGENCY ALERT' : 'HIGH-SEVERITY CLINICAL ALERT'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Risk Score: {riskScore}/100</span>
            </div>

            <h3 className="text-lg font-bold text-white mt-1">
              {isCritical
                ? 'Critical-risk assessment. Contact emergency medical services and seek immediate professional care.'
                : 'High-risk patient detected. Immediate professional medical evaluation is recommended.'}
            </h3>

            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isCritical
                ? 'Patient exhibits severe hemodynamic or respiratory compromise. Immediate resuscitation facilities and Level-1 Trauma/ICU notification advised.'
                : 'Significant abnormal physiological indicators detected. Assign priority emergency triage bay without delay.'}
            </p>
          </div>
        </div>

        {/* Action button badge */}
        <div className="flex sm:flex-col items-end gap-2 flex-shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Recommended Dispatch</span>
            <span className="text-xs font-bold text-sky-400 truncate max-w-[200px] block">
              {topHospitalName || 'Regional Trauma Center'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
