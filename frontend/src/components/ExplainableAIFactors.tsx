import React from 'react';
import { HelpCircle, AlertCircle, CheckCircle2, TrendingUp, Cpu } from 'lucide-react';
import { RiskFactor } from '../types';

interface ExplainableAIFactorsProps {
  keyRiskFactors: string[];
  detailedFactors: RiskFactor[];
  featureContributions: Record<string, number>;
  actionRequired: string;
}

export const ExplainableAIFactors: React.FC<ExplainableAIFactorsProps> = ({
  keyRiskFactors,
  detailedFactors,
  featureContributions,
  actionRequired
}) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          icon: '🔴',
          label: 'Critical Factor',
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        };
      case 'HIGH':
        return {
          icon: '🟠',
          label: 'High Risk',
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
        };
      case 'MODERATE':
        return {
          icon: '🟡',
          label: 'Moderate Impact',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        };
      case 'NORMAL':
      default:
        return {
          icon: '🟢',
          label: 'Within Baseline',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        };
    }
  };

  // Convert featureContributions to sorted array
  const contributionsList = Object.entries(featureContributions || {}).map(([key, val]) => ({
    name: key,
    weight: Math.round(val * 100)
  })).sort((a, b) => b.weight - a.weight);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Explainable AI (XAI) Attribution</h3>
            <p className="text-xs text-slate-400">Why was this clinical severity level assigned?</p>
          </div>
        </div>

        <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Transparent AI Triage
        </span>
      </div>

      {/* Suggested Action Box */}
      <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 text-sky-200">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-sky-300 uppercase tracking-wide">Immediate Recommended Action</span>
            <p className="text-xs text-white font-medium mt-0.5">{actionRequired}</p>
          </div>
        </div>
      </div>

      {/* Primary Key Risk Factors List */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>Clinical Risk Factors Breakdown</span>
          <span className="text-slate-500 font-normal">({detailedFactors.length} vital & symptom checks)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {detailedFactors.map((item, idx) => {
            const badge = getSeverityBadge(item.severity);
            return (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex items-start gap-3"
              >
                <span className="text-base mt-0.5">{badge.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200 truncate">{item.factor}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Importance Contribution Bars */}
      {contributionsList.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <span>Patient-Specific AI Feature Importance Contribution</span>
          </h4>

          <div className="space-y-2.5">
            {contributionsList.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-slate-400 font-mono font-medium">{item.weight}% weight</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, Math.min(100, item.weight))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
