import React from 'react';
import {
  Thermometer,
  Droplets,
  CloudFog,
  Wind,
  Waves,
  Flame,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { SafetyLayerData, SafetyLayerType } from '../types';

interface SafetyLayersPanelProps {
  layers: SafetyLayerData[];
  onLayerSelect?: (layerId: SafetyLayerType) => void;
  selectedLayerId?: SafetyLayerType;
}

export const SafetyLayersPanel: React.FC<SafetyLayersPanelProps> = ({
  layers,
  onLayerSelect,
  selectedLayerId,
}) => {
  const getLayerIcon = (id: SafetyLayerType) => {
    switch (id) {
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-amber-400" />;
      case 'humidity':
        return <Droplets className="w-5 h-5 text-sky-400" />;
      case 'dust':
        return <CloudFog className="w-5 h-5 text-stone-300" />;
      case 'airflow':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'water':
        return <Waves className="w-5 h-5 text-blue-400" />;
      case 'smoke':
        return <Flame className="w-5 h-5 text-rose-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-stone-300" />;
    }
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              LAYER 1 OF 5
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Layer 1: Environmental Safety & Atmospheric Telemetry
            </h2>
            <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-md font-mono bg-stone-800 text-stone-200 border border-stone-700">
              6 Physical Sensors • 8 Gas Detectors
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real-time subsurface monitoring across Temperature, Humidity, Airborne Dust, Air Flow, Water Ingress, and Smoke, categorized into Green (Safe), Yellow (Caution), and Red (Danger) limits
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm font-mono">
          <span className="flex items-center gap-1.5 text-stone-300">
            <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
            Safe Range
          </span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <span className="w-3 h-3 rounded-xs bg-amber-400"></span>
            Caution
          </span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <span className="w-3 h-3 rounded-xs bg-rose-500"></span>
            Critical Danger
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layers.map((layer) => {
          const isSelected = selectedLayerId === layer.id;
          
          // Calculate percentage position for range bar
          const totalSpan = layer.maxValue - layer.minValue;
          const currentPct = Math.max(
            0,
            Math.min(100, ((layer.currentValue - layer.minValue) / totalSpan) * 100)
          );

          // Safe, caution, danger spans
          const safeStartPct = Math.max(0, ((layer.safeRange[0] - layer.minValue) / totalSpan) * 100);
          const safeEndPct = Math.min(100, ((layer.safeRange[1] - layer.minValue) / totalSpan) * 100);
          const safeWidth = Math.max(0, safeEndPct - safeStartPct);

          const isRed = layer.severity === 'red';
          const isYellow = layer.severity === 'yellow';

          return (
            <div
              key={layer.id}
              onClick={() => onLayerSelect?.(layer.id)}
              className={`rounded-xl p-4 border transition-all cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-amber-400 border-amber-400 bg-stone-850'
                  : isRed
                  ? 'border-rose-600/80 bg-rose-950/40 hover:bg-rose-950/60 shadow-lg shadow-rose-950/40'
                  : isYellow
                  ? 'border-amber-600/70 bg-amber-950/30 hover:bg-amber-950/50'
                  : 'border-stone-800 bg-stone-950/70 hover:border-stone-700 hover:bg-stone-950/90'
              }`}
            >
              {/* Top layer header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-stone-850 border border-stone-800">
                    {getLayerIcon(layer.id)}
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400/90 block font-semibold">
                      LAYER {layer.layerNumber} OF 5
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">{layer.name}</h3>
                  </div>
                </div>

                {/* Severity status pill with larger text */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs sm:text-sm font-mono font-bold ${
                    isRed
                      ? 'bg-rose-600 text-white animate-pulse'
                      : isYellow
                      ? 'bg-amber-400 text-stone-950 font-extrabold'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isRed ? (
                    <AlertOctagon className="w-3.5 h-3.5" />
                  ) : isYellow ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span className="uppercase">{layer.severity}</span>
                </div>
              </div>

              {/* Current Value Display with increased font */}
              <div className="flex items-baseline justify-between mt-3 mb-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white">
                    {layer.currentValue}
                  </span>
                  <span className="text-sm sm:text-base font-mono font-semibold text-stone-400">
                    {layer.unit}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-mono text-stone-400 flex items-center gap-1">
                  <span>Trend:</span>
                  <strong className="text-stone-200">{layer.changeRate}</strong>
                </div>
              </div>

              {/* Continuous Safe Range Visualization Bar */}
              <div className="my-3">
                <div className="flex justify-between text-xs font-mono text-stone-400 mb-1.5">
                  <span>{layer.minValue}{layer.unit}</span>
                  <span className="text-emerald-400 font-semibold">
                    Safe: {layer.safeRange[0]}-{layer.safeRange[1]} {layer.unit}
                  </span>
                  <span>{layer.maxValue}{layer.unit}</span>
                </div>

                {/* Triple-Zone Linear Bar */}
                <div className="relative w-full h-3.5 rounded-full bg-stone-800 overflow-hidden flex border border-stone-700">
                  <div
                    style={{ left: `${safeStartPct}%`, width: `${safeWidth}%` }}
                    className="absolute top-0 bottom-0 bg-emerald-500/90"
                    title={`Safe Zone: ${layer.safeRange[0]} to ${layer.safeRange[1]} ${layer.unit}`}
                  />
                  <div
                    style={{ left: `${safeEndPct}%`, width: `${100 - safeEndPct}%` }}
                    className="absolute top-0 bottom-0 bg-amber-400/90"
                    title="Caution Zone"
                  />
                  {/* Indicator needle */}
                  <div
                    style={{ left: `${currentPct}%` }}
                    className="absolute top-[-2px] bottom-[-2px] w-2 bg-white rounded-xs shadow-lg shadow-white/50 transform -translate-x-1/2 z-10"
                    title={`Current: ${layer.currentValue} ${layer.unit}`}
                  />
                </div>
              </div>

              {/* Sensory Health & Regulation Standard */}
              <div className="pt-2.5 mt-2.5 border-t border-stone-800 flex items-center justify-between text-xs sm:text-sm text-stone-400">
                <span className="truncate pr-2 font-medium text-stone-300" title={layer.regulationStandard}>
                  {layer.regulationStandard}
                </span>
                <span className="font-mono text-stone-400 shrink-0 font-semibold">
                  {layer.activeSensors}/{layer.sensorCount} Online
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
