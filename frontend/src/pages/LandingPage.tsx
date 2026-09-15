import React from 'react';
import { 
  Activity, 
  ArrowRight, 
  BrainCircuit, 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  Zap, 
  Clock, 
  BarChart3, 
  HeartPulse,
  Navigation,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface LandingPageProps {
  onStartAssessment: () => void;
  onViewDashboard: () => void;
  onViewInsights: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onViewDashboard,
  onViewInsights,
}) => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold backdrop-blur-sm shadow-inner shadow-sky-500/10">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Next-Generation Healthcare Decision-Support AI Prototype</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            AI-Powered Emergency <br />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              Care Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Predict patient severity and support faster emergency-care decisions using AI and clinical data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartAssessment}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 transform hover:-translate-y-0.5 transition-all"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewDashboard}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2.5 hover:border-slate-600 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <span>View Dashboard</span>
            </button>
          </div>

          {/* Quick Metrics ribbon */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="glass-panel p-3.5 rounded-xl text-center border border-slate-800">
              <span className="text-xl font-bold text-sky-400 font-mono">98.8%</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Model Triage Accuracy</p>
            </div>
            <div className="glass-panel p-3.5 rounded-xl text-center border border-slate-800">
              <span className="text-xl font-bold text-emerald-400 font-mono">&lt; 150ms</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-Time Inference</p>
            </div>
            <div className="glass-panel p-3.5 rounded-xl text-center border border-slate-800">
              <span className="text-xl font-bold text-amber-400 font-mono">6 Factors</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Hospital Match Engine</p>
            </div>
            <div className="glass-panel p-3.5 rounded-xl text-center border border-slate-800">
              <span className="text-xl font-bold text-rose-400 font-mono">100%</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Explainable AI (XAI)</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-sky-400 font-semibold">Workflow Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How The Intelligent System Works</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            From field vitals entry to explainable severity triage and optimal emergency hospital matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-black text-lg">
              01
            </div>
            <h3 className="text-base font-bold text-white">Clinical Vitals & Symptoms Input</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Healthcare providers enter patient physiological parameters (SpO2, Blood Pressure, Heart Rate, Respiratory Rate, Temp) and acute red-flag symptoms.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              ✓ Ready for future ambulance IoT sensor streaming
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-lg">
              02
            </div>
            <h3 className="text-base font-bold text-white">Machine Learning Severity Triage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trained Random Forest classifier evaluates patient risk score (0-100) and stratifies severity into LOW, MODERATE, HIGH, or CRITICAL tiers with confidence metrics.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              ✓ Transparent Explainable AI factor breakdown
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-black text-lg">
              03
            </div>
            <h3 className="text-base font-bold text-white">Multi-Factor Hospital Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent recommendation engine ranks nearby hospitals using distance, required medical specialty (Cardiology, Stroke, Trauma), ICU bed availability, and wait times.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              ✓ Suitability scoring with interactive map routing
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-sky-400 font-semibold">Engineering Stack</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Built with Modern Data Science & Web Tech</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
            <div className="text-sky-400 font-bold text-sm">React + Vite</div>
            <p className="text-[11px] text-slate-400">TypeScript Frontend</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
            <div className="text-emerald-400 font-bold text-sm">Python FastAPI</div>
            <p className="text-[11px] text-slate-400">High-Speed REST API</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
            <div className="text-cyan-400 font-bold text-sm">scikit-learn</div>
            <p className="text-[11px] text-slate-400">Random Forest Classifier</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
            <div className="text-amber-400 font-bold text-sm">Recharts</div>
            <p className="text-[11px] text-slate-400">Live Hospital Analytics</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
            <div className="text-purple-400 font-bold text-sm">Leaflet Maps</div>
            <p className="text-[11px] text-slate-400">Open-Source Geospatial</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
            <div className="text-rose-400 font-bold text-sm">SQLite Engine</div>
            <p className="text-[11px] text-slate-400">Triage Persistence</p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onViewInsights}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1.5 underline underline-offset-4"
          >
            <span>View Detailed AI Model Insights, Confusion Matrix & Metrics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Prominent Medical Disclaimer Banner */}
      <section className="p-6 rounded-2xl bg-amber-950/30 border border-amber-800/50 text-amber-200 space-y-3">
        <div className="flex items-center gap-2.5 font-bold text-sm text-amber-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span>IMPORTANT MEDICAL DISCLAIMER</span>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          &ldquo;Prototype for educational/research purposes only. Predictions are not medical diagnoses. Always consult qualified healthcare professionals.&rdquo;
        </p>
        <p className="text-[11px] text-amber-300/70">
          This system is an exploratory decision-support aid. It does not replace medical personnel, diagnostic imaging, laboratory tests, or physician clinical oversight.
        </p>
      </section>
    </div>
  );
};
