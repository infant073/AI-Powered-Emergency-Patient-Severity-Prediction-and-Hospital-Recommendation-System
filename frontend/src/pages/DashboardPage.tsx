import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Bed, 
  TrendingUp, 
  Building2,
  RefreshCw,
  Clock
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { AnalyticsData } from '../types';
import { api } from '../services/api';

export const DashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading emergency intelligence analytics...</p>
      </div>
    );
  }

  const data = analytics || {
    total_patients: 10,
    critical_cases: 3,
    high_risk_cases: 3,
    moderate_cases: 2,
    low_risk_cases: 2,
    avg_risk_score: 65.4,
    severity_distribution: [
      { name: 'Critical', value: 3, color: '#EF4444' },
      { name: 'High Risk', value: 3, color: '#F97316' },
      { name: 'Moderate', value: 2, color: '#F59E0B' },
      { name: 'Low Risk', value: 2, color: '#10B981' },
    ],
    recent_trend: [],
    hospital_capacities: [],
    age_demographics: []
  };

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Clinical Operations</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Real-Time Triage Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-sky-400" />
            Emergency Operations & Triage Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated severity distributions, risk score trends, and regional hospital bed capacity monitoring.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Feed</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Assessed</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl font-black text-white mt-2 block font-mono">{data.total_patients}</span>
          <span className="text-[10px] text-slate-500 mt-1 block">Cumulative triage logs</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20">
          <div className="flex items-center justify-between text-rose-300 text-xs font-semibold">
            <span>Critical Cases</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-black text-rose-400 mt-2 block font-mono">{data.critical_cases}</span>
          <span className="text-[10px] text-rose-400/70 mt-1 block">Life-threatening priority</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-orange-500/30 bg-orange-950/20">
          <div className="flex items-center justify-between text-orange-300 text-xs font-semibold">
            <span>High-Risk Cases</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-2xl font-black text-orange-400 mt-2 block font-mono">{data.high_risk_cases}</span>
          <span className="text-[10px] text-orange-400/70 mt-1 block">Urgent care needed</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center justify-between text-amber-300 text-xs font-semibold">
            <span>Moderate Cases</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400 mt-2 block font-mono">{data.moderate_cases}</span>
          <span className="text-[10px] text-amber-400/70 mt-1 block">Standard acute triage</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold">
            <span>Low-Risk Cases</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400 mt-2 block font-mono">{data.low_risk_cases}</span>
          <span className="text-[10px] text-emerald-400/70 mt-1 block">Stable / non-urgent</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-sky-500/30 bg-sky-950/20">
          <div className="flex items-center justify-between text-sky-300 text-xs font-semibold">
            <span>Avg. Risk Score</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl font-black text-sky-300 mt-2 block font-mono">{data.avg_risk_score}</span>
          <span className="text-[10px] text-sky-400/70 mt-1 block">Out of 100 max</span>
        </div>

      </div>

      {/* Row 1 Charts: Severity Distribution (Pie) & Recent Trend (Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Severity Distribution Donut */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Patient Severity Breakdown</h3>
            <span className="text-[11px] text-slate-400">Class Distribution</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.severity_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.severity_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.severity_distribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}:</span>
                <span className="font-bold text-white ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Score Chronological Trend */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Risk Score Progression Trend</h3>
              <p className="text-xs text-slate-400">Recent sequential patient triage assessments</p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded bg-slate-900 text-sky-400 border border-slate-800">
              Score Timeline
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.recent_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="patient" stroke="#64748b" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
            <span>Y-Axis: Risk Score (0 - 100)</span>
            <span>X-Axis: Evaluated Patient Cases</span>
          </div>
        </div>

      </div>

      {/* Row 2: Hospital Bed Capacities (ICU & ER Occupancy) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              Regional Hospital Bed Capacity & Availability
            </h3>
            <p className="text-xs text-slate-400">Real-time ICU and Emergency Room bed availability across monitored trauma networks</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Available
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded bg-slate-700 inline-block"></span> Occupied
            </span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.hospital_capacities} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <XAxis dataKey="hospital" stroke="#94a3b8" fontSize={11} interval={0} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="icuAvailable" name="ICU Available" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="icuOccupied" name="ICU Occupied" fill="#475569" radius={[4, 4, 0, 0]} />
              <Bar dataKey="erAvailable" name="ER Beds Available" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="erOccupied" name="ER Occupied" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
