import React from 'react';
import { ShieldCheck, AlertCircle, AlertOctagon, Users, MapPin, Activity } from 'lucide-react';
import { MineZone, Worker, SeverityLevel } from '../types';

interface SeverityOverviewProps {
  zones: MineZone[];
  workers: Worker[];
  selectedZoneFilter: SeverityLevel | 'all';
  onSelectZoneFilter: (filter: SeverityLevel | 'all') => void;
}

export const SeverityOverview: React.FC<SeverityOverviewProps> = ({
  zones,
  workers,
  selectedZoneFilter,
  onSelectZoneFilter,
}) => {
  const greenZones = zones.filter((z) => z.severity === 'green');
  const yellowZones = zones.filter((z) => z.severity === 'yellow');
  const redZones = zones.filter((z) => z.severity === 'red');

  const greenWorkers = workers.filter((w) => w.zoneSeverity === 'green').length;
  const yellowWorkers = workers.filter((w) => w.zoneSeverity === 'yellow').length;
  const redWorkers = workers.filter((w) => w.zoneSeverity === 'red').length;

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Safety Severity Classification & Safe Range Areas
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
            Real-time multi-tier zoning categorized according to environmental severity threshold criteria
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
          <span className="text-stone-400 font-medium mr-1">Filter Map:</span>
          <button
            type="button"
            onClick={() => onSelectZoneFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedZoneFilter === 'all'
                ? 'bg-stone-700 text-white shadow-xs font-semibold'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            All ({zones.length})
          </button>
          <button
            type="button"
            onClick={() => onSelectZoneFilter('green')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedZoneFilter === 'green'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-emerald-950/50 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/50'
            }`}
          >
            Green ({greenZones.length})
          </button>
          <button
            type="button"
            onClick={() => onSelectZoneFilter('yellow')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedZoneFilter === 'yellow'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-amber-950/50 text-amber-300 border border-amber-700/50 hover:bg-amber-900/50'
            }`}
          >
            Yellow ({yellowZones.length})
          </button>
          <button
            type="button"
            onClick={() => onSelectZoneFilter('red')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedZoneFilter === 'red'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-rose-950/50 text-rose-300 border border-rose-700/50 hover:bg-rose-900/50'
            }`}
          >
            Red ({redZones.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* GREEN ZONE: SAFE RANGE */}
        <div
          onClick={() => onSelectZoneFilter(selectedZoneFilter === 'green' ? 'all' : 'green')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            selectedZoneFilter === 'green'
              ? 'ring-2 ring-emerald-400 bg-emerald-950/80 border-emerald-500'
              : 'border-emerald-800/60 bg-emerald-950/40 hover:bg-emerald-950/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-emerald-200">GREEN ZONE</span>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/40">
              SAFE RANGE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 mb-3.5 leading-relaxed">
            All 5 sensor layers strictly within statutory safe operating envelopes. Full shift authorization.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm pt-2.5 border-t border-emerald-800/60 font-mono">
            <div>
              <span className="text-stone-400 block text-xs">Active Sectors</span>
              <span className="font-bold text-white text-sm sm:text-base">
                {greenZones.length} / {zones.length}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-xs">Workers Present</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm sm:text-base">
                <Users className="w-4 h-4" />
                {greenWorkers} Personnel
              </span>
            </div>
          </div>
        </div>

        {/* YELLOW ZONE: CAUTION RANGE */}
        <div
          onClick={() => onSelectZoneFilter(selectedZoneFilter === 'yellow' ? 'all' : 'yellow')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            selectedZoneFilter === 'yellow'
              ? 'ring-2 ring-amber-400 bg-amber-950/80 border-amber-500'
              : 'border-amber-800/60 bg-amber-950/40 hover:bg-amber-950/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-amber-200">YELLOW ZONE</span>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/40">
              CAUTION RANGE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 mb-3.5 leading-relaxed">
            Approaching elevated limit (e.g. BC880 dust accumulation, lower airflow). Auto-mist active.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm pt-2.5 border-t border-amber-800/60 font-mono">
            <div>
              <span className="text-stone-400 block text-xs">Active Sectors</span>
              <span className="font-bold text-white text-sm sm:text-base">
                {yellowZones.length} / {zones.length}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-xs">Workers Present</span>
              <span className="font-bold text-amber-300 flex items-center gap-1.5 text-sm sm:text-base">
                <Users className="w-4 h-4" />
                {yellowWorkers} Personnel
              </span>
            </div>
          </div>
        </div>

        {/* RED ZONE: SEVERE / DANGER RANGE */}
        <div
          onClick={() => onSelectZoneFilter(selectedZoneFilter === 'red' ? 'all' : 'red')}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            selectedZoneFilter === 'red'
              ? 'ring-2 ring-rose-400 bg-rose-950/80 border-rose-500 shadow-rose-950/60 shadow-lg'
              : redZones.length > 0
              ? 'border-rose-600 bg-rose-950/50 animate-pulse'
              : 'border-rose-900/60 bg-rose-950/30 hover:bg-rose-950/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-rose-200">RED ZONE</span>
            </div>
            <span className="text-xs font-mono font-bold bg-rose-600/30 text-rose-300 px-2.5 py-1 rounded-md border border-rose-500/40">
              CRITICAL DANGER
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 mb-3.5 leading-relaxed">
            Severe breach: Methane &gt;1.0%, Water flooding &gt;60cm, or smoke. Instant evacuation triggered.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm pt-2.5 border-t border-rose-800/60 font-mono">
            <div>
              <span className="text-stone-400 block text-xs">Breached Sectors</span>
              <span className="font-bold text-rose-400 text-sm sm:text-base">
                {redZones.length} / {zones.length}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-xs">Personnel in Danger</span>
              <span className="font-bold text-rose-400 flex items-center gap-1.5 text-sm sm:text-base">
                <Users className="w-4 h-4" />
                {redWorkers} Workers
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
