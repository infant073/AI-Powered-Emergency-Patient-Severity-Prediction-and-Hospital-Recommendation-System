import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Navigation, 
  Bed, 
  Clock, 
  Heart, 
  Brain, 
  ShieldAlert, 
  CheckCircle2,
  Layers,
  Phone,
  Radio
} from 'lucide-react';
import { Hospital } from '../types';
import { api } from '../services/api';

interface HospitalMapPageProps {
  selectedHospital?: Hospital | null;
  onSelectHospital?: (hospital: Hospital) => void;
}

export const HospitalMapPage: React.FC<HospitalMapPageProps> = ({
  selectedHospital: initialSelectedHospital,
}) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [activeHospital, setActiveHospital] = useState<Hospital | null>(initialSelectedHospital || null);
  const [loading, setLoading] = useState(true);

  // Center patient location coordinates
  const patientLocation = { lat: 37.7700, lng: -122.4250, label: "Current Patient Incident Location" };

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await api.getHospitals();
        setHospitals(data);
        if (!activeHospital && data.length > 0) {
          setActiveHospital(data[0]);
        }
      } catch (err) {
        console.error('Failed to load hospitals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (initialSelectedHospital) {
      setActiveHospital(initialSelectedHospital);
    }
  }, [initialSelectedHospital]);

  // Coordinate projection helper to fit SVG 600x450 canvas
  // Bounds around SF coordinates: lat (37.745 to 37.800), lng (-122.460 to -122.380)
  const mapWidth = 700;
  const mapHeight = 500;
  
  const minLat = 37.745;
  const maxLat = 37.800;
  const minLng = -122.460;
  const maxLng = -122.380;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 80) + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (mapHeight - 80) + 40;
    return { x, y };
  };

  const patientPos = projectCoords(patientLocation.lat, patientLocation.lng);

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Geospatial Intelligence</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Emergency Dispatch & Bed Availability</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Radio className="w-6 h-6 text-sky-400" />
            Interactive Hospital Emergency Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time geospatial layout of emergency facilities, distance radiuses, ICU bed occupancy, and active transit paths.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            {hospitals.length} Monitored Facilities
          </span>
        </div>
      </div>

      {/* Main Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Center Map Visualizer (8 Cols) */}
        <div className="lg:col-span-8 glass-panel p-4 rounded-2xl border border-slate-800 relative flex flex-col items-center justify-center overflow-hidden min-h-[520px]">
          
          {/* Map Controls Header */}
          <div className="w-full flex items-center justify-between mb-3 px-2 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-200">Live Field Map Projection</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> Patient
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span> Hospital
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span> Recommended
              </span>
            </div>
          </div>

          {/* Interactive Tactical SVG Map */}
          <div className="w-full h-full relative flex items-center justify-center bg-slate-950/90 rounded-xl border border-slate-900 overflow-hidden shadow-inner">
            
            {/* Grid & Radar Lines Background */}
            <svg className="w-full h-[460px]" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Distance Radius Rings from Patient */}
              <circle cx={patientPos.x} cy={patientPos.y} r="80" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={patientPos.x + 85} y={patientPos.y + 4} fill="#64748b" fontSize="10" fontFamily="monospace">2 km</text>

              <circle cx={patientPos.x} cy={patientPos.y} r="160" fill="none" stroke="rgba(56, 189, 248, 0.10)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={patientPos.x + 165} y={patientPos.y + 4} fill="#64748b" fontSize="10" fontFamily="monospace">4 km</text>

              <circle cx={patientPos.x} cy={patientPos.y} r="240" fill="none" stroke="rgba(56, 189, 248, 0.06)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={patientPos.x + 245} y={patientPos.y + 4} fill="#64748b" fontSize="10" fontFamily="monospace">6 km</text>

              {/* Route line to active hospital */}
              {activeHospital && (
                (() => {
                  const targetPos = projectCoords(
                    activeHospital.coordinates?.lat || 37.7749,
                    activeHospital.coordinates?.lng || -122.4194
                  );
                  return (
                    <g>
                      <line
                        x1={patientPos.x}
                        y1={patientPos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke="url(#routeGradient)"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                      />
                      <circle cx={targetPos.x} cy={targetPos.y} r="22" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping-slow" />
                    </g>
                  );
                })()
              )}

              {/* Hospital Markers */}
              {hospitals.map((hosp) => {
                const pos = projectCoords(hosp.coordinates.lat, hosp.coordinates.lng);
                const isSelected = activeHospital?.id === hosp.id || activeHospital?.hospital_id === hosp.id;
                const isTop = (hosp.suitability_score || 0) > 85;

                return (
                  <g 
                    key={hosp.id || hosp.name} 
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => setActiveHospital(hosp)}
                  >
                    {/* Pulsing ring for selected */}
                    {isSelected && (
                      <circle cx={pos.x} cy={pos.y} r="18" fill="rgba(14, 165, 233, 0.25)" stroke="#38bdf8" strokeWidth="1.5" />
                    )}

                    {/* Marker Body */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? "11" : "9"}
                      fill={isSelected ? "#0284c7" : isTop ? "#059669" : "#1e293b"}
                      stroke={isSelected ? "#bae6fd" : isTop ? "#34d399" : "#475569"}
                      strokeWidth="2"
                    />

                    {/* Hospital Cross Icon */}
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      +
                    </text>

                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + 20}
                      textAnchor="middle"
                      fill={isSelected ? "#38bdf8" : "#94a3b8"}
                      fontSize="10"
                      fontWeight={isSelected ? "bold" : "normal"}
                    >
                      {hosp.name.split(' ')[0]} ({hosp.distance_km}km)
                    </text>
                  </g>
                );
              })}

              {/* Patient Incident Point */}
              <g className="cursor-pointer">
                <circle cx={patientPos.x} cy={patientPos.y} r="16" fill="rgba(239, 68, 68, 0.2)" className="animate-ping" />
                <circle cx={patientPos.x} cy={patientPos.y} r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <text x={patientPos.x} y={patientPos.y - 14} textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">
                  PATIENT LOC
                </text>
              </g>
            </svg>

            {/* Bottom floating legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300">
              <span className="font-semibold text-white block">Incident Coordinates:</span>
              <span className="font-mono text-slate-400">37.7700° N, 122.4250° W</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Hospital Details & List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Selected Hospital Card */}
          {activeHospital ? (
            <div className="glass-panel p-5 rounded-2xl border border-sky-500/40 bg-slate-900/90 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                  Target Destination
                </span>
                <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                  {activeHospital.suitability_score ? `Suitability: ${activeHospital.suitability_score}%` : 'Active Route'}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{activeHospital.name}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{activeHospital.location}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-medium">Distance</span>
                  <span className="text-sm font-bold text-sky-400 mt-0.5 block">{activeHospital.distance_km} km</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-medium">ICU Beds Available</span>
                  <span className={`text-sm font-bold mt-0.5 block ${activeHospital.icu_beds_available > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeHospital.icu_beds_available} / {activeHospital.icu_beds_total}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-medium">Est. Wait Time</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">~{activeHospital.estimated_wait_min} min</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 block font-medium">Ambulance Bay</span>
                  <span className="text-xs font-bold text-emerald-400 mt-1 block uppercase">{activeHospital.ambulance_bay_status}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Capabilities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeHospital.cardiology && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px]">
                      Cardiology
                    </span>
                  )}
                  {activeHospital.neurology && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px]">
                      Neurology
                    </span>
                  )}
                  {activeHospital.trauma_level_1 && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                      Trauma L1
                    </span>
                  )}
                  {activeHospital.emergency_department && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                      24/7 ER
                    </span>
                  )}
                </div>
              </div>

              {/* Phone call CTA */}
              <div className="pt-2">
                <a
                  href={`tel:${activeHospital.contact_phone}`}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Emergency Desk ({activeHospital.contact_phone})</span>
                </a>
              </div>
            </div>
          ) : null}

          {/* Quick List of All Hospitals */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              All Monitored Regional Facilities
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {hospitals.map((h) => {
                const isSelected = activeHospital?.id === h.id || activeHospital?.hospital_id === h.id;
                return (
                  <button
                    key={h.id || h.name}
                    onClick={() => setActiveHospital(h)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-500/60 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="font-semibold truncate">{h.name}</div>
                      <div className="text-[10px] text-slate-400">{h.distance_km} km • {h.icu_beds_available} ICU beds</div>
                    </div>
                    <Navigation className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
