import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Radio,
  Heart,
  Battery,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  BellRing
} from 'lucide-react';
import { Worker } from '../types';

interface HumanSafetyPanelProps {
  workers: Worker[];
  onTriggerSOS?: (workerId: string) => void;
  onResolveSOS?: (workerId: string) => void;
  onSelectWorker?: (worker: Worker) => void;
  selectedWorkerId?: string | null;
}

export const HumanSafetyPanel: React.FC<HumanSafetyPanelProps> = ({
  workers,
  onTriggerSOS,
  onResolveSOS,
  onSelectWorker,
  selectedWorkerId,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'sos' | 'falls' | 'deep'>('all');

  const sosCount = workers.filter((w) => w.sosActive).length;
  const fallCount = workers.filter((w) => w.fallDetected).length;

  const filteredWorkers = workers.filter((w) => {
    if (filterMode === 'sos') return w.sosActive;
    if (filterMode === 'falls') return w.fallDetected;
    if (filterMode === 'deep') return w.level.includes('-500m');
    return true;
  });

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Layer 3: Human Safety Management
            </h2>
            <span className="text-xs sm:text-sm px-2.5 py-1 rounded-md font-mono bg-stone-800 text-stone-200 border border-stone-700">
              Personal Wearable Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real-time subsurface worker tracking, IMU fall detection, emergency SOS distress engine, and continuous biometric monitoring
          </p>
        </div>

        {/* Quick Stats & Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {sosCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-950 border border-rose-600 text-rose-300 text-xs sm:text-sm font-mono font-bold flex items-center gap-2 animate-pulse shadow-md shadow-rose-950/50">
              <BellRing className="w-4 h-4 text-rose-400" />
              <span>{sosCount} ACTIVE SOS DISTRESS</span>
            </div>
          )}
          {fallCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-500 text-amber-300 text-xs sm:text-sm font-mono font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{fallCount} FALL DETECTED</span>
            </div>
          )}

          <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-stone-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              All Miners ({workers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('sos')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterMode === 'sos'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-rose-400 hover:text-white'
              }`}
            >
              SOS Only ({sosCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('falls')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterMode === 'falls'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-amber-400 hover:text-white'
              }`}
            >
              Fall Events ({fallCount})
            </button>
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {filteredWorkers.map((w) => {
          const isSelected = selectedWorkerId === w.id;
          const isSOS = w.sosActive;
          const isFall = w.fallDetected;

          return (
            <div
              key={w.id}
              onClick={() => onSelectWorker?.(w)}
              className={`rounded-xl p-4 border transition-all cursor-pointer ${
                isSOS
                  ? 'border-rose-600 bg-rose-950/40 shadow-xl shadow-rose-950/50 ring-2 ring-rose-500/40'
                  : isFall
                  ? 'border-amber-500 bg-amber-950/20 shadow-md'
                  : isSelected
                  ? 'border-cyan-500 bg-stone-950/90 ring-1 ring-cyan-500'
                  : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
              }`}
            >
              {/* Header: Callsign & Status */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-sm px-2 py-0.5 rounded font-bold ${
                      isSOS
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-stone-800 text-stone-200 border border-stone-700'
                    }`}
                  >
                    {w.tagId}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      w.zoneSeverity === 'red'
                        ? 'bg-rose-500 animate-ping'
                        : w.zoneSeverity === 'yellow'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  {isSOS && (
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-xs font-bold animate-bounce">
                      SOS ACTIVE
                    </span>
                  )}
                  {isFall && !isSOS && (
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-mono text-xs font-bold">
                      FALL ALERT
                    </span>
                  )}
                  {!isSOS && !isFall && (
                    <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-500" />
                      {w.lastPing}
                    </span>
                  )}
                </div>
              </div>

              {/* Worker Name & Role */}
              <div className="mb-2.5">
                <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {w.name}
                </h4>
                <p className="text-xs text-stone-400 font-medium">{w.role}</p>
              </div>

              {/* Location telemetry */}
              <div className="p-2 bg-stone-900/80 rounded-lg text-xs font-mono text-stone-300 mb-3 space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-stone-500" />
                    Level:
                  </span>
                  <span className="text-stone-200 font-bold">{w.level}</span>
                </div>
                <div className="text-xs text-stone-400 line-clamp-1">
                  Zone: <span className="text-stone-200">{w.zoneName}</span>
                </div>
                {w.lastKnownPosition && (
                  <div className="text-xs text-amber-300 line-clamp-1">
                    📍 {w.lastKnownPosition}
                  </div>
                )}
              </div>

              {/* Optional Monitoring: Biometrics & Fall status */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                <div className="bg-stone-900/60 p-2 rounded-lg flex items-center justify-between">
                  <span className="text-stone-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> HR:
                  </span>
                  <span className={`font-bold ${w.heartRate > 105 ? 'text-rose-400 font-mono' : 'text-white'}`}>
                    {w.heartRate} <span className="text-2xs text-stone-400">bpm</span>
                  </span>
                </div>
                <div className="bg-stone-900/60 p-2 rounded-lg flex items-center justify-between">
                  <span className="text-stone-400 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temp:
                  </span>
                  <span className={`font-bold ${w.bodyTemp > 37.5 ? 'text-rose-400' : 'text-white'}`}>
                    {w.bodyTemp}°C
                  </span>
                </div>
                <div className="bg-stone-900/60 p-2 rounded-lg flex items-center justify-between">
                  <span className="text-stone-400 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" /> Bat:
                  </span>
                  <span className="font-bold text-white">{w.battery}%</span>
                </div>
                <div className="bg-stone-900/60 p-2 rounded-lg flex items-center justify-between">
                  <span className="text-stone-400">Motion:</span>
                  <span className={`font-bold ${w.motionlessDurationSec && w.motionlessDurationSec > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {w.motionlessDurationSec && w.motionlessDurationSec > 0 ? `${w.motionlessDurationSec}s stop` : 'Active'}
                  </span>
                </div>
              </div>

              {/* SOS Distress Button Actions */}
              <div className="pt-2 border-t border-stone-800 flex items-center gap-2">
                {isSOS ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolveSOS?.(w.id);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Clear SOS & Stand Down
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerSOS?.(w.id);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-rose-900 text-stone-300 hover:text-white border border-stone-700 hover:border-rose-600 font-mono text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Simulate / Trigger SOS
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
