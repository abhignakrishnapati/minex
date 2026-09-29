import React from 'react';
import { Flame, AlertTriangle, ShieldCheck, AlertOctagon, Zap, Info } from 'lucide-react';
import { GasReading } from '../types';

interface GasMonitoringPanelProps {
  gasReadings: GasReading[];
}

export const GasMonitoringPanel: React.FC<GasMonitoringPanelProps> = ({ gasReadings }) => {
  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Continuous Atmospheric Gas Telemetry
            </h2>
            <span className="text-xs sm:text-sm font-mono px-2.5 py-1 rounded-md bg-stone-800 text-stone-200 border border-stone-700">
              DGMS Statutory Standards
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real-time gas concentration monitoring with automated electrical cut-offs & explosion prevention
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {gasReadings.map((gas) => {
          const isRed = gas.severity === 'red';
          const isYellow = gas.severity === 'yellow';

          return (
            <div
              key={gas.id}
              className={`rounded-xl p-4 border transition-all ${
                isRed
                  ? 'border-rose-600 bg-rose-950/50 shadow-lg shadow-rose-950/40'
                  : isYellow
                  ? 'border-amber-600/70 bg-amber-950/30'
                  : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
              }`}
            >
              {/* Header Formula & Name */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                    {gas.formula}
                  </span>
                  <p className="text-xs sm:text-sm text-stone-400 font-medium">{gas.name}</p>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold uppercase ${
                    isRed
                      ? 'bg-rose-600 text-white animate-pulse'
                      : isYellow
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {gas.severity}
                </div>
              </div>

              {/* Numerical Value with increased font */}
              <div className="my-3">
                <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white">
                  {gas.currentValue}
                </span>
                <span className="text-sm font-mono text-stone-400 ml-1.5 font-semibold">
                  {gas.unit}
                </span>
              </div>

              {/* Threshold & Cutoff info */}
              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-2.5 border-t border-stone-800">
                <div className="flex justify-between text-stone-400">
                  <span>Warning:</span>
                  <span className="text-amber-400 font-semibold">{gas.warningThreshold} {gas.unit}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Cut-off:</span>
                  <span className="text-rose-400 font-semibold">{gas.dangerThreshold} {gas.unit}</span>
                </div>
              </div>

              {/* Status Note */}
              <div className="mt-3 pt-2 border-t border-stone-800/80 text-xs text-stone-300 line-clamp-2 leading-relaxed">
                {gas.statusText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
