import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Building2, 
  BrainCircuit, 
  Info, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPrivacy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenPrivacy }) => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.getHealth();
        setBackendOnline(res?.status === 'healthy');
      } catch (err) {
        setBackendOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Activity },
    { id: 'assessment', label: 'New Assessment', icon: PlusCircle, highlight: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Hospitals & Map', icon: Building2 },
    { id: 'history', label: 'Patient History', icon: History },
    { id: 'insights', label: 'AI Model Insights', icon: BrainCircuit },
    { id: 'about', label: 'About & Roadmap', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Top micro banner for prototype disclaimer */}
      <div className="bg-amber-950/60 border-b border-amber-800/30 px-4 py-1 text-center text-xs text-amber-300/90 flex items-center justify-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
        <span><strong>Prototype For Research/Educational Evaluation Only:</strong> Not a certified diagnostic device. Always consult licensed medical providers.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button 
            onClick={() => setActiveTab('landing')} 
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                  AegisEmergency AI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                  Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Triage Severity & Hospital Recommender</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm shadow-sky-500/10'
                      : item.highlight
                      ? 'text-sky-300 hover:bg-sky-500/10 hover:text-white border border-sky-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right utility buttons: API health & Privacy */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className="text-slate-400">
                {backendOnline === null ? 'Connecting...' : backendOnline ? 'AI Model Online' : 'AI Service Offline'}
              </span>
            </div>

            <button
              onClick={onOpenPrivacy}
              title="Privacy & Data Safety Notice"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Privacy Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/60 bg-slate-950 px-2 py-2 overflow-x-auto gap-1 text-[11px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-1.5 rounded-lg flex-shrink-0 ${
                isActive ? 'text-sky-400 bg-sky-950/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
