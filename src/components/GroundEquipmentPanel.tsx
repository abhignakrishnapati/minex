import React, { useState } from 'react';
import {
  Mountain,
  Activity,
  Truck,
  Cog,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Gauge,
  Zap,
  HardHat,
  ArrowUpRight
} from 'lucide-react';
import {
  RoofStabilityMetric,
  SeismicActivityMetric,
  VehicleSafetyMetric,
  MachineHealthMetric
} from '../types';

interface GroundEquipmentPanelProps {
  roofMetrics: RoofStabilityMetric[];
  seismicMetrics: SeismicActivityMetric[];
  vehicleMetrics: VehicleSafetyMetric[];
  machineMetrics: MachineHealthMetric[];
}

export const GroundEquipmentPanel: React.FC<GroundEquipmentPanelProps> = ({
  roofMetrics,
  seismicMetrics,
  vehicleMetrics,
  machineMetrics,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'roof' | 'seismic' | 'equipment'>('all');

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Mountain className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Layer 2: Ground & Equipment Safety Management
            </h2>
            <span className="text-xs sm:text-sm px-2.5 py-1 rounded-md font-mono bg-stone-800 text-stone-200 border border-stone-700">
              Strata • Seismic • Vehicles & Heavy Machinery
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Integrated geotechnical convergence, micro-seismic arrays, and combined fleet vehicle speed tracking & machinery diagnostics
          </p>
        </div>

        {/* Subtab Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSubTab === 'all'
                ? 'bg-stone-800 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            All Subsystems
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('roof')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'roof'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            Roof Stability
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('seismic')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'seismic'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Seismic Activity
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('equipment')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'equipment'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Vehicles & Machine Health
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. ROOF STABILITY SECTION */}
        {(activeSubTab === 'all' || activeSubTab === 'roof') && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                  Roof Stability & Strata Extensometers
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-400">
                {roofMetrics.length} Stationed Boreholes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {roofMetrics.map((roof) => {
                const isRed = roof.status === 'red';
                const isYellow = roof.status === 'yellow';

                return (
                  <div
                    key={roof.sensorId}
                    className={`rounded-xl p-4 border transition-all ${
                      isRed
                        ? 'border-rose-600 bg-rose-950/40 shadow-lg shadow-rose-950/30'
                        : isYellow
                        ? 'border-amber-600/70 bg-amber-950/20'
                        : 'border-stone-800 bg-stone-950/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-sm text-stone-200">
                        {roof.sensorId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                          isRed
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isYellow
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {roof.delaminationRisk} Risk
                      </span>
                    </div>

                    <p className="text-xs text-stone-400 mb-3 line-clamp-1">{roof.location}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2.5 border-t border-stone-800">
                      <div className="bg-stone-900/80 p-2 rounded-lg">
                        <span className="text-stone-400 block">Convergence:</span>
                        <span className="text-base font-bold text-white">
                          {roof.convergenceRateMmPerDay} <span className="text-xs text-stone-400">mm/day</span>
                        </span>
                      </div>
                      <div className="bg-stone-900/80 p-2 rounded-lg">
                        <span className="text-stone-400 block">Bolt Tension:</span>
                        <span className="text-base font-bold text-white">
                          {roof.rockBoltTensionKn} <span className="text-xs text-stone-400">kN</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs font-mono text-stone-400 bg-stone-900/40 px-2.5 py-1.5 rounded-md">
                      <span>Borehole Displacement:</span>
                      <span className="text-stone-200 font-bold">{roof.boreholeExtensometerMm} mm</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. SEISMIC ACTIVITY SECTION */}
        {(activeSubTab === 'all' || activeSubTab === 'seismic') && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                  Seismic Activity & Micro-Acoustic Monitoring
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-400">
                Continuous Sub-surface Array
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {seismicMetrics.map((seis) => {
                const isYellow = seis.status === 'yellow';

                return (
                  <div
                    key={seis.stationId}
                    className={`rounded-xl p-4 border transition-all ${
                      isYellow
                        ? 'border-amber-600/70 bg-amber-950/20'
                        : 'border-stone-800 bg-stone-950/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono font-bold text-sm text-white">
                          {seis.stationId}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                          isYellow ? 'bg-amber-400 text-stone-950' : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {isYellow ? 'Elevated Microseisms' : 'Nominal Strata'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mb-3">{seis.location}</p>

                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      <div className="bg-stone-900/80 p-2.5 rounded-lg">
                        <span className="text-stone-400 block">Events/Hr:</span>
                        <span className="text-lg font-bold text-white">{seis.eventsLastHour}</span>
                      </div>
                      <div className="bg-stone-900/80 p-2.5 rounded-lg">
                        <span className="text-stone-400 block">Max Richter:</span>
                        <span className="text-lg font-bold text-amber-400">
                          {seis.maxMagnitudeRichter} M
                        </span>
                      </div>
                      <div className="bg-stone-900/80 p-2.5 rounded-lg">
                        <span className="text-stone-400 block">PPV Velocity:</span>
                        <span className="text-lg font-bold text-white">
                          {seis.peakParticleVelocityMmS} <span className="text-xs">mm/s</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 text-xs text-stone-400 font-mono flex justify-between bg-stone-900/40 px-2.5 py-1.5 rounded-md">
                      <span>Cumulative Seismic Energy:</span>
                      <span className="text-stone-200 font-semibold">{seis.energyJoules.toLocaleString()} Joules</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. COMBINED VEHICLES & MACHINERY HEALTH SECTION */}
        {(activeSubTab === 'all' || activeSubTab === 'equipment') && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-400" />
                  Vehicles & Machine Health (Speed, Collision Radar & Diagnostics)
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-300">
                {vehicleMetrics.length} Vehicles Online • {machineMetrics.length} Heavy Plants Monitored
              </span>
            </div>

            {/* Mobile Vehicles Subsection */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold font-mono uppercase text-stone-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-400" />
                  Fleet Telemetry & Speed Tracking
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Radar Range: 100m Anti-Pinch Shield
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {vehicleMetrics.map((veh) => {
                  const isWarning = veh.antiCollisionRadarStatus === 'warning';

                  return (
                    <div
                      key={veh.vehicleId}
                      className={`rounded-xl p-4 border transition-all ${
                        isWarning
                          ? 'border-amber-500 bg-amber-950/20'
                          : 'border-stone-800 bg-stone-950/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-sky-400" />
                          <span className="font-mono font-bold text-sm text-white">
                            {veh.vehicleId}
                          </span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-medium">
                          {veh.type}
                        </span>
                      </div>

                      <div className="text-xs text-stone-400 mb-2">
                        <div>Operator: <span className="text-stone-200 font-medium">{veh.operator}</span></div>
                        <div className="line-clamp-1">Sector: <span className="text-stone-300 font-mono">{veh.location}</span></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-stone-800">
                        <div className="bg-stone-900/80 p-2 rounded-lg">
                          <span className="text-stone-400 block">Speed:</span>
                          <span className="text-base font-bold text-white">{veh.speedKmh} km/h</span>
                        </div>
                        <div className="bg-stone-900/80 p-2 rounded-lg">
                          <span className="text-stone-400 block">Proximity Alerts:</span>
                          <span className={`text-base font-bold ${veh.proximityAlerts > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {veh.proximityAlerts}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs font-mono flex items-center justify-between bg-stone-900/40 px-2 py-1 rounded">
                        <span className="text-stone-400">Anti-Collision Radar:</span>
                        <span className={`font-bold uppercase ${isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {veh.antiCollisionRadarStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heavy Machinery Diagnostics Subsection */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold font-mono uppercase text-stone-300 flex items-center gap-1.5">
                  <Cog className="w-3.5 h-3.5 text-purple-400" />
                  Heavy Plant SCADA Condition & Vibration Diagnostics
                </span>
                <span className="text-xs font-mono text-stone-400">
                  ISO 10816 Vibration Standard
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {machineMetrics.map((mac) => {
                  const isRed = mac.status === 'red';
                  const isYellow = mac.status === 'yellow';

                  return (
                    <div
                      key={mac.machineId}
                      className={`rounded-xl p-4 border transition-all ${
                        isRed
                          ? 'border-rose-600 bg-rose-950/40'
                          : isYellow
                          ? 'border-amber-600/70 bg-amber-950/20'
                          : 'border-stone-800 bg-stone-950/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-xs text-stone-300">
                          {mac.machineId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                            isRed
                              ? 'bg-rose-600 text-white animate-pulse'
                              : isYellow
                              ? 'bg-amber-400 text-stone-950'
                              : 'bg-emerald-950 text-emerald-300'
                          }`}
                        >
                          {isRed ? 'Critical Overheat' : isYellow ? 'High Vibration' : 'Optimal'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">{mac.name}</h4>
                      <p className="text-xs text-stone-400 mb-3">{mac.location}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-stone-800">
                        <div className="bg-stone-900/80 p-2 rounded-lg">
                          <span className="text-stone-400 block">Motor Temp:</span>
                          <span className={`text-base font-bold ${mac.cutterMotorTempC > 85 ? 'text-rose-400' : 'text-white'}`}>
                            {mac.cutterMotorTempC}°C
                          </span>
                        </div>
                        <div className="bg-stone-900/80 p-2 rounded-lg">
                          <span className="text-stone-400 block">Vibration RMS:</span>
                          <span className={`text-base font-bold ${mac.vibrationRmsMmS > 5 ? 'text-rose-400' : 'text-white'}`}>
                            {mac.vibrationRmsMmS} mm/s
                          </span>
                        </div>
                        <div className="bg-stone-900/80 p-2 rounded-lg">
                          <span className="text-stone-400 block">Hydraulic Press:</span>
                          <span className="text-sm font-bold text-stone-200">{mac.hydraulicOilPressureBar} bar</span>
                        </div>
                        <div className="bg-stone-900/80 p-2 rounded-lg">
                          <span className="text-stone-400 block">Operating Hours:</span>
                          <span className="text-sm font-bold text-stone-200">{mac.operatingHours} h</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
