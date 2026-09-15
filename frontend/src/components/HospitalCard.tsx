import React from 'react';
import { Hospital } from '../types';
import { 
  Building2, 
  MapPin, 
  Navigation, 
  Bed, 
  Clock, 
  Heart, 
  Brain, 
  ShieldAlert, 
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  isTopRecommendation?: boolean;
  onSelectOnMap?: (hospital: Hospital) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ 
  hospital, 
  isTopRecommendation = false,
  onSelectOnMap 
}) => {
  const suitability = hospital.suitability_score || 75;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 70) return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div 
      className={`glass-panel p-5 rounded-2xl border transition-all duration-200 ${
        isTopRecommendation 
          ? 'border-sky-500/60 bg-slate-900/90 shadow-xl shadow-sky-500/10 ring-1 ring-sky-500/40' 
          : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {isTopRecommendation ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/30">
            ★ Top AI Recommendation
          </span>
        ) : (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" /> Emergency Facility
          </span>
        )}

        <div className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${getScoreColor(suitability)}`}>
          <span>Suitability:</span>
          <span className="text-sm font-black">{suitability}%</span>
        </div>
      </div>

      {/* Hospital Name & Address */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-white leading-snug">{hospital.name}</h3>
        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="truncate">{hospital.location}</span>
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 mb-3 text-center">
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-semibold">
            <Navigation className="w-3 h-3 text-sky-400" /> Dist
          </div>
          <span className="text-sm font-bold text-white mt-0.5 block">{hospital.distance_km} km</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-semibold">
            <Bed className="w-3 h-3 text-emerald-400" /> ICU Beds
          </div>
          <span className={`text-sm font-bold mt-0.5 block ${hospital.icu_beds_available > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {hospital.icu_beds_available} / {hospital.icu_beds_total}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-semibold">
            <Clock className="w-3 h-3 text-amber-400" /> Est. Wait
          </div>
          <span className="text-sm font-bold text-white mt-0.5 block">~{hospital.estimated_wait_min} min</span>
        </div>
      </div>

      {/* Specialties Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {hospital.cardiology && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1">
            <Heart className="w-3 h-3" /> Cardiology Center
          </span>
        )}
        {hospital.neurology && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
            <Brain className="w-3 h-3" /> Stroke & Neuro
          </span>
        )}
        {hospital.trauma_level_1 && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Level-1 Trauma
          </span>
        )}
        {hospital.emergency_department ? (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            24/7 Full ER
          </span>
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
            Urgent Triage Only
          </span>
        )}
      </div>

      {/* Match Reasons */}
      {hospital.match_reasons && hospital.match_reasons.length > 0 && (
        <div className="mb-4 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Recommendation Rationale:
          </span>
          <ul className="space-y-1">
            {hospital.match_reasons.map((reason, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-tight">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alert notes if any */}
      {hospital.alert_notes && (
        <div className="mb-3 p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
          <span>{hospital.alert_notes}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-400 gap-2">
        <a 
          href={`tel:${hospital.contact_phone}`} 
          className="flex items-center gap-1 hover:text-sky-400 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-slate-500" />
          <span>{hospital.contact_phone}</span>
        </a>

        {onSelectOnMap && (
          <button
            onClick={() => onSelectOnMap(hospital)}
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Navigation className="w-3 h-3" />
            <span>View Route</span>
          </button>
        )}
      </div>
    </div>
  );
};
