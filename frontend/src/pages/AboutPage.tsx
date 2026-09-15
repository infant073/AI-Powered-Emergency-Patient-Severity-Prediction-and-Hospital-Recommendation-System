import React from 'react';
import { 
  Info, 
  Wifi, 
  Activity, 
  Navigation2, 
  Radio, 
  Lock, 
  Mic, 
  Cpu, 
  ShieldAlert,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const futureEnhancements = [
    {
      icon: Wifi,
      title: "Real-Time Ambulance IoT Sensor Streaming",
      desc: "Direct Bluetooth Low Energy (BLE) & MQTT integration with wearable multi-parameter patient monitors (automatic continuous SpO2, NIBP, 12-lead ECG, EtCO2).",
      status: "Hardware Integration Phase"
    },
    {
      icon: Activity,
      title: "Deep Learning ECG Waveform Analysis",
      desc: "1D-CNN and Transformer models for instant automated ST-elevation myocardial infarction (STEMI) and lethal arrhythmia detection on live telemetry feeds.",
      status: "AI Research Phase"
    },
    {
      icon: Navigation2,
      title: "Traffic-Aware Emergency Routing",
      desc: "Dynamic live GPS traffic telemetry integration (OSRM / OpenStreetMap / Mapbox) with emergency siren green-wave traffic signal prioritization.",
      status: "Logistics Optimization"
    },
    {
      icon: Radio,
      title: "Real-Time Hospital EHR & Bed APIs",
      desc: "HL7 FHIR & OpenEMR interoperability protocol to directly reserve ICU beds, pre-notify surgical teams, and sync triage notes before ambulance arrival.",
      status: "EHR Standards"
    },
    {
      icon: Lock,
      title: "Federated Learning & Edge AI",
      desc: "On-device edge inference inside ambulance tablets without sending raw patient biometric data to the cloud, enabling strict local privacy preservation.",
      status: "Privacy Engineering"
    },
    {
      icon: Mic,
      title: "Multilingual Voice Emergency Assistant",
      desc: "Hands-free speech-to-text voice recognition for paramedics to dictate patient vitals, medications administered, and Glasgow Coma Scale during active transit.",
      status: "Voice UX"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Project Architecture & Future Roadmap</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400">Emergency Care Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
          <Info className="w-6 h-6 text-sky-400" />
          About AegisEmergency AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          A software-only data science and machine learning decision-support prototype engineered to optimize emergency pre-hospital triage and hospital dispatch.
        </p>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">The Emergency Triage Challenge</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            In pre-hospital emergency situations, paramedics and triage nurses face extreme cognitive loads while interpreting volatile multi-vital streams under stringent time constraints. Routing a critical cardiac patient to a facility with zero open cath-lab beds or full ICU wards can cause catastrophic treatment delays ("door-to-needle" time).
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">The AI Decision-Support Solution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AegisEmergency AI acts as an intelligent co-pilot: it accepts clinical parameters, executes low-latency Random Forest inference, calculates transparent Explainable AI risk factors, and applies a multi-criteria suitability algorithm to recommend the highest-capacity, specialty-matched regional hospital.
          </p>
        </div>

      </div>

      {/* Future Roadmap & IoT Hardware Integration */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Beyond The Prototype</span>
          <h2 className="text-xl font-bold text-white mt-1">Future System Roadmap & IoT Integration</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Architectural blueprint for transitioning from manual intake to continuous telemetry-driven ambulance networks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {futureEnhancements.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regulatory & Medical Disclaimer Note */}
      <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-800/50 text-amber-200 space-y-3">
        <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          Prototype Research Statement & Academic Disclaimer
        </h4>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          This system is a software-only artificial intelligence and data science prototype developed for hackathons, technological exploration, and algorithmic benchmarking. <strong>It is NOT certified as a Class II or Class III medical device under FDA (21 CFR Part 820) or EU MDR (2017/745) regulations.</strong> All recommendations and risk scores are assistive calculations and must never supersede certified healthcare professional judgment.
        </p>
      </div>

    </div>
  );
};
