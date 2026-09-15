import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ChevronRight, 
  Eye, 
  X, 
  HeartPulse, 
  Activity, 
  Thermometer, 
  Wind, 
  Building2,
  RefreshCw,
  Clock
} from 'lucide-react';
import { PatientHistoryRecord, SeverityLevel } from '../types';
import { api } from '../services/api';

export const HistoryPage: React.FC = () => {
  const [records, setRecords] = useState<PatientHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<PatientHistoryRecord | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getPatients();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'MODERATE':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'LOW':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.recommended_hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.symptoms_summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === 'ALL' || r.severity_level === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Audit & History</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Chronological Triage Database</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <History className="w-6 h-6 text-sky-400" />
            Patient Assessment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete electronic triage log of all evaluated cases, vital signs snapshots, and hospital dispatch records.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient ID, Hospital, or Symptoms..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-400 flex-shrink-0">Filter Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedSeverity === sev
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Patient ID</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Age / Gender</th>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Risk Score</th>
                <th className="px-5 py-3.5">Recommended Hospital</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    No matching triage assessment records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id || record.patient_id}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-sky-400">
                      {record.patient_id}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                      {record.created_at}
                    </td>
                    <td className="px-5 py-3.5 text-slate-200 font-medium">
                      {record.age} y/o • {record.gender}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getSeverityBadge(record.severity_level)}`}>
                        {record.severity_level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {record.risk_score} / 100
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-medium max-w-xs truncate">
                      {record.recommended_hospital}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {record.status || 'Evaluated'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(record);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white transition-colors"
                        title="View Full Record"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspector Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <History className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white font-mono">{selectedRecord.patient_id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(selectedRecord.severity_level)}`}>
                    {selectedRecord.severity_level}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Timestamp: {selectedRecord.created_at}</p>
              </div>
            </div>

            {/* Vitals Summary Grid */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                  Clinical Vitals Recorded At Triage
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">{selectedRecord.heart_rate} BPM</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">{selectedRecord.blood_pressure} mmHg</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">SpO2 Saturation</span>
                    <span className="text-sm font-bold text-cyan-400 mt-0.5 block">{selectedRecord.spo2}%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Body Temp</span>
                    <span className="text-sm font-bold text-amber-400 mt-0.5 block">{selectedRecord.temperature}°C</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Respiratory Rate</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">{selectedRecord.respiratory_rate}/min</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">AI Risk Score</span>
                    <span className="text-sm font-bold text-sky-400 mt-0.5 block">{selectedRecord.risk_score} / 100</span>
                  </div>
                </div>
              </div>

              {/* Reported Symptoms */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] block">
                  Reported Symptoms & Comorbidities:
                </span>
                <p className="text-xs text-white">{selectedRecord.symptoms_summary}</p>
              </div>

              {/* Recommended Hospital */}
              <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/40 text-sky-200 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-sky-300">
                  <Building2 className="w-4 h-4" />
                  <span>Assigned Hospital Facility Dispatch</span>
                </div>
                <p className="text-sm font-bold text-white">{selectedRecord.recommended_hospital}</p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
