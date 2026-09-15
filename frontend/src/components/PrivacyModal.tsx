import React from 'react';
import { X, ShieldCheck, Lock, Database, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Security & Privacy Architecture</h3>
            <p className="text-xs text-slate-400">Healthcare AI Research & Data Protection Protocol</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Lock className="w-4 h-4 text-sky-400" />
              <span>De-Identified & Pseudonymized Inputs (Zero Real PHI)</span>
            </div>
            <p className="text-slate-400">
              In accordance with health privacy best practices (HIPAA Safe Harbor / GDPR Article 9), this prototype does not collect, transmit, or store identifiable personal information such as full names, social security numbers, dates of birth, or home street addresses. All triage evaluations use anonymized random alphanumeric identifiers (e.g. <code>PT-1082</code>).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Synthetic Training Dataset Transparency</span>
            </div>
            <p className="text-slate-400">
              The underlying machine learning model is trained on a synthetic clinical decision dataset generated from published Emergency Severity Index (ESI) and Modified Early Warning Score (MEWS) physiological distributions. <strong>No real-world patient records were extracted or utilized for training.</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Prototype Scope & Research Boundary</span>
            </div>
            <p className="text-slate-400">
              This system is strictly an academic decision-support prototype designed for hackathons, engineering evaluation, and algorithmic validation. Outputs are deterministic assistive predictions and must never override the clinical assessment of a qualified paramedic or physician.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-sky-600/20"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
