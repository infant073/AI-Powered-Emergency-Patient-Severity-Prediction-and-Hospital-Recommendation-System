import React from 'react';
import { Activity, ShieldAlert, Cpu, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-100 text-sm">AegisEmergency AI</span>
              <span className="text-[10px] bg-slate-800 text-sky-400 px-2 py-0.5 rounded">Decision Support Prototype</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              An intelligent clinical decision-support software prototype leveraging Machine Learning (Random Forest Triage Classifier) and multi-factor hospital suitability algorithms to assist emergency teams in rapid patient risk stratification and optimal transport routing.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              Core Technologies
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li>• FastAPI & Python 3.13</li>
              <li>• Scikit-Learn (Random Forest)</li>
              <li>• React 18 & TypeScript & Vite</li>
              <li>• Leaflet & OpenStreetMap Engine</li>
              <li>• SQLite Embedded Database</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Research & Compliance
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Zero real Protected Health Information (PHI) is ingested. All models are trained on guideline-modeled synthetic triage records for demonstration.
            </p>
          </div>
        </div>

        {/* Disclaimer Banner Box */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-300/90 flex items-start gap-3 mb-6">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-xs text-amber-300">CRITICAL MEDICAL & LEGAL DISCLAIMER:</p>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              This application is a software-only technology prototype developed exclusively for educational, research, and hackathon demonstration purposes. <strong>It does NOT formulate medical diagnoses, provide clinical prescriptions, or replace certified clinical judgment.</strong> Always consult licensed healthcare personnel and certified Emergency Medical Services in real emergency situations.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-900 text-slate-500 text-[11px] gap-4">
          <p>© {new Date().getFullYear()} AegisEmergency AI Systems. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Software-Only AI + Data Science Prototype</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3 h-3 text-rose-400" /> Engineered for Emergency Response
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
