import React from 'react';
import { SeverityLevel } from '../types';
import { ShieldCheck, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

interface SeverityGaugeProps {
  severity: SeverityLevel;
  riskScore: number;
  confidence: number;
}

export const SeverityGauge: React.FC<SeverityGaugeProps> = ({ severity, riskScore, confidence }) => {
  const getSeverityConfig = (level: SeverityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          label: 'CRITICAL',
          subLabel: 'Immediate Life-Threatening Priority',
          color: '#EF4444',
          bgClass: 'bg-rose-500/10 border-rose-500/40 text-rose-400',
          glowClass: 'glow-critical',
          barColor: 'bg-rose-500',
          icon: AlertOctagon,
          textColor: 'text-rose-500',
        };
      case 'HIGH':
        return {
          label: 'HIGH',
          subLabel: 'Urgent Emergency Admission',
          color: '#F97316',
          bgClass: 'bg-orange-500/10 border-orange-500/40 text-orange-400',
          glowClass: 'glow-high',
          barColor: 'bg-orange-500',
          icon: AlertCircle,
          textColor: 'text-orange-500',
        };
      case 'MODERATE':
        return {
          label: 'MODERATE',
          subLabel: 'Standard Acute Emergency Care',
          color: '#F59E0B',
          bgClass: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
          glowClass: 'glow-moderate',
          barColor: 'bg-amber-500',
          icon: AlertTriangle,
          textColor: 'text-amber-500',
        };
      case 'LOW':
      default:
        return {
          label: 'LOW',
          subLabel: 'Non-Urgent / Outpatient Care',
          color: '#10B981',
          bgClass: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
          glowClass: 'glow-low',
          barColor: 'bg-emerald-500',
          icon: ShieldCheck,
          textColor: 'text-emerald-500',
        };
    }
  };

  const config = getSeverityConfig(severity);
  const Icon = config.icon;

  // Compute stroke for circular SVG gauge
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className={`glass-panel p-6 rounded-2xl border ${config.glowClass} relative overflow-hidden`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Severity Badge & Title */}
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-2xl border ${config.bgClass} flex items-center justify-center`}>
            <Icon className="w-10 h-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Triage Stratification</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.bgClass}`}>
                {config.label}
              </span>
            </div>
            <h2 className={`text-3xl font-black tracking-tight mt-1 ${config.textColor}`}>
              {severity} SEVERITY
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-medium">{config.subLabel}</p>
            
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
              <span>AI Model Confidence:</span>
              <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Circular Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
              {/* Background Track */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#1e293b"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Track */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={config.color}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white">{riskScore}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Risk / 100</span>
            </div>
          </div>

          <div className="hidden sm:block space-y-2 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">0-34:</span>
              <span className="font-semibold text-emerald-400">LOW</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">35-64:</span>
              <span className="font-semibold text-amber-400">MODERATE</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">65-84:</span>
              <span className="font-semibold text-orange-400">HIGH</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">85-100:</span>
              <span className="font-semibold text-rose-400">CRITICAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linear Severity Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Overall Clinical Risk Severity Spectrum</span>
          <span className="font-bold text-white">{riskScore} / 100</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
          <div className="w-[35%] h-full bg-emerald-500/30 border-r border-slate-900" title="Low 0-35" />
          <div className="w-[30%] h-full bg-amber-500/30 border-r border-slate-900" title="Moderate 35-65" />
          <div className="w-[20%] h-full bg-orange-500/30 border-r border-slate-900" title="High 65-85" />
          <div className="w-[15%] h-full bg-rose-500/30" title="Critical 85-100" />
        </div>
      </div>
    </div>
  );
};
