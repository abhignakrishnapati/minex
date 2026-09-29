import React, { useState } from 'react';
import {
  Layers,
  Activity,
  AlertTriangle,
  Flame,
  Wind,
  Droplets,
  Gauge,
  Compass,
  CheckCircle,
  Clock,
  Shield,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
} from 'lucide-react';
import {
  GeologicalDigitalTwinData,
  GeologicalStrataLayer,
  DrillingRigTelemetry,
  DrillingIntervalRecord,
  BoreholeVentilationNode,
  SurfaceGasExhaustOutlet,
  SeverityLevel,
} from '../types';

interface GeologicalDigitalTwinPanelProps {
  data: GeologicalDigitalTwinData;
  onToggleForcedPurge: () => void;
  onToggleDegasPump: () => void;
  onAdjustBoreholeDamper: (boreholeId: string, damperPct: number) => void;
  onAddDrillingLog: (record: Omit<DrillingIntervalRecord, 'id' | 'timestamp'>) => void;
}

export const GeologicalDigitalTwinPanel: React.FC<GeologicalDigitalTwinPanelProps> = ({
  data,
  onToggleForcedPurge,
  onToggleDegasPump,
  onAdjustBoreholeDamper,
  onAddDrillingLog,
}) => {
  const [activeTab, setActiveTab] = useState<'twin' | 'drilling' | 'ventilation'>('twin');
  const [selectedLayerId, setSelectedLayerId] = useState<string>('G5'); // default to deep gassy seam
  const [layerFilter, setLayerFilter] = useState<string>('all');
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [isSimulatingTwin, setIsSimulatingTwin] = useState<boolean>(false);
  const [simMessage, setSimMessage] = useState<string | null>(null);

  // Form state for logging new drilling record at layer level
  const [newLogDepth, setNewLogDepth] = useState<number>(422.0);
  const [newLogLayerId, setNewLogLayerId] = useState<string>('G5');
  const [newLogLithology, setNewLogLithology] = useState<string>('Friable fractured vitrain coal with gas desorbing');
  const [newLogRop, setNewLogRop] = useState<number>(7.2);
  const [newLogTorque, setNewLogTorque] = useState<number>(19.5);
  const [newLogWob, setNewLogWob] = useState<number>(86.0);
  const [newLogCh4, setNewLogCh4] = useState<number>(2.95);
  const [newLogCo, setNewLogCo] = useState<number>(45.0);
  const [newLogRecovery, setNewLogRecovery] = useState<number>(82);
  const [newLogAnomaly, setNewLogAnomaly] = useState<DrillingIntervalRecord['strataAnomalyFlag']>('gas_pocket_intercepted');
  const [newLogNotes, setNewLogNotes] = useState<string>('Torque peak detected upon breaching bedding plane. Gas sniffer recorded immediate methane return.');

  const handleSimulateTwin = () => {
    setIsSimulatingTwin(true);
    setSimMessage('Recalibrating 3D Finite-Element Strata Stress Mesh & In-Situ Gas Desorption Matrix...');
    setTimeout(() => {
      setIsSimulatingTwin(false);
      setSimMessage('Digital Twin calibrated: Early warning horizon verified. Outburst risk localized to Level -500m Seam B.');
      setTimeout(() => setSimMessage(null), 5000);
    }, 1800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLayer = data.strataLayers.find((l) => l.id === newLogLayerId);
    onAddDrillingLog({
      rigId: 'DR-01',
      depthM: Number(newLogDepth),
      strataLayerId: newLogLayerId,
      strataName: selectedLayer ? selectedLayer.name : `Layer ${newLogLayerId}`,
      lithology: newLogLithology,
      ropMetersPerHour: Number(newLogRop),
      torqueKNm: Number(newLogTorque),
      weightOnBitKN: Number(newLogWob),
      rpm: 480,
      mudGasReturnCh4Pct: Number(newLogCh4),
      mudGasReturnCoPpm: Number(newLogCo),
      fluidLossLpm: 16.0,
      fractureFrequencyPerM: 15.2,
      coreRecoveryPct: Number(newLogRecovery),
      strataAnomalyFlag: newLogAnomaly,
      notes: newLogNotes,
    });
    setShowLogModal(false);
  };

  const activeLayer = data.strataLayers.find((l) => l.id === selectedLayerId) || data.strataLayers[4];
  const primaryRig = data.drillingRigs[0];

  const filteredLogs = layerFilter === 'all'
    ? data.drillingLogs
    : data.drillingLogs.filter((log) => log.strataLayerId === layerFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner / System Telemetry Summary */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Geological Nature Digital Twin & Subsurface Engine
              </h2>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                AI PREDICTIVE TWIN ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-3xl">
              Real-time strata lithology digital twin forecasting roof shear, gas outburst, and water inrush prior to failure.
              Captures drilling telemetry at layer level and orchestrates surface gas evacuation via borehole ventilation.
            </p>
          </div>

          {/* Quick Purge / Degas Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onToggleDegasPump}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all border ${
                data.degasificationPumpActive
                  ? 'bg-cyan-950/80 text-cyan-200 border-cyan-500/40 hover:bg-cyan-900'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${data.degasificationPumpActive ? 'text-cyan-400 animate-pulse' : 'text-stone-400'}`} />
              Degas Vacuum: {data.degasificationPumpActive ? 'ENGAGED (-48 kPa)' : 'OFFLINE'}
            </button>

            <button
              type="button"
              onClick={onToggleForcedPurge}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md border ${
                data.forcedGasPurgeActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" />
              {data.forcedGasPurgeActive ? 'Forced Borehole Purge Active' : 'Engage Forced Borehole Purge'}
            </button>
          </div>
        </div>

        {/* Real-time Subsurface KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-stone-800/80">
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-3xs text-stone-400 uppercase font-mono tracking-wider">Monitored Strata Layers</div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">5 Lithologic Units</div>
            <div className="text-2xs text-stone-400">0m Surface to -520m Basal</div>
          </div>
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-3xs text-stone-400 uppercase font-mono tracking-wider">Active Drilling Rig (DR-01)</div>
            <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
              {primaryRig.currentDepthM.toFixed(1)}m <span className="text-xs text-stone-400 font-normal">/ {primaryRig.targetDepthM}m</span>
            </div>
            <div className="text-2xs text-cyan-400 truncate">{primaryRig.currentLayerName.split(':')[0]}</div>
          </div>
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-3xs text-stone-400 uppercase font-mono tracking-wider">Borehole Suction Network</div>
            <div className="text-lg font-bold text-emerald-300 font-mono mt-0.5">3 Boreholes Active</div>
            <div className="text-2xs text-stone-400">BH-VENT-01, GAS-01 & GAS-02</div>
          </div>
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-3xs text-stone-400 uppercase font-mono tracking-wider">Total Gas Evacuated</div>
            <div className="text-lg font-bold text-rose-300 font-mono mt-0.5">
              {data.totalMethaneEvacuatedM3.toLocaleString()} m³
            </div>
            <div className="text-2xs text-emerald-400">Outlets 01 & 02 Operating</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('twin')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'twin'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Geological Strata Digital Twin & Abnormality Predictor
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drilling')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'drilling'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          Layer-Level Drilling Telemetry & Strata Log
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ventilation')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'ventilation'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Wind className="w-4 h-4" />
          Borehole Ventilation & Gas Evacuation Outlets
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GEOLOGICAL STRATA DIGITAL TWIN & ABNORMALITY PREDICTOR */}
      {/* ========================================================================= */}
      {activeTab === 'twin' && (
        <div className="space-y-6">
          {/* Action & Simulation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/80 p-3.5 rounded-xl border border-stone-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-300">
                Select a geological layer to inspect lithological properties, stress tensor, and early warning horizon:
              </span>
            </div>
            <button
              type="button"
              onClick={handleSimulateTwin}
              disabled={isSimulatingTwin}
              className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-amber-300 border border-stone-700 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTwin ? 'animate-spin text-amber-400' : ''}`} />
              {isSimulatingTwin ? 'Simulating 3D Strata Stress...' : 'Recalibrate Twin Predictive Mesh'}
            </button>
          </div>

          {simMessage && (
            <div className="bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 animate-fadeIn">
              <Activity className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{simMessage}</span>
            </div>
          )}

          {/* Stratigraphic Column Selector & Layer Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive 5-Layer Stratigraphic Column (4 cols) */}
            <div className="lg:col-span-4 bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Subsurface Stratigraphic Column
                  </h3>
                  <span className="text-3xs font-mono text-stone-400">0m to -520m</span>
                </div>

                <div className="space-y-2">
                  {data.strataLayers.map((layer) => {
                    const isSelected = layer.id === selectedLayerId;
                    const riskColor =
                      layer.digitalTwinPrediction.riskSeverity === 'red'
                        ? 'border-rose-500 bg-rose-950/30'
                        : layer.digitalTwinPrediction.riskSeverity === 'yellow'
                        ? 'border-amber-500 bg-amber-950/20'
                        : 'border-emerald-500/40 bg-emerald-950/10';

                    return (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all relative overflow-hidden ${
                          isSelected
                            ? 'ring-2 ring-amber-400 bg-stone-800 shadow-md'
                            : 'bg-stone-950/60 border-stone-800 hover:bg-stone-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-sm shrink-0"
                              style={{ backgroundColor: layer.colorHex }}
                            />
                            <span className="text-xs font-bold text-white">{layer.code}</span>
                            <span className="text-2xs text-stone-400 font-mono">
                              ({layer.depthRangeM[0]}m to -{layer.depthRangeM[1]}m)
                            </span>
                          </div>
                          <span
                            className={`text-3xs font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                              layer.digitalTwinPrediction.riskSeverity === 'red'
                                ? 'bg-rose-900 text-rose-200'
                                : layer.digitalTwinPrediction.riskSeverity === 'yellow'
                                ? 'bg-amber-900 text-amber-200'
                                : 'bg-emerald-900 text-emerald-200'
                            }`}
                          >
                            {layer.digitalTwinPrediction.abnormalityRisk}
                          </span>
                        </div>

                        <div className="text-xs text-stone-300 font-medium mt-1 truncate">
                          {layer.name}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-800/60 text-3xs text-stone-400 font-mono">
                          <span>RQD: {layer.rqdPct}%</span>
                          <span>UCS: {layer.ucsMpa} MPa</span>
                          <span className={layer.gasContentM3PerTon > 10 ? 'text-rose-400 font-bold' : ''}>
                            CH₄: {layer.gasContentM3PerTon} m³/t
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-stone-950 border border-stone-800 text-3xs text-stone-400 space-y-1">
                <div className="font-semibold text-stone-300">Geological Physics Reference:</div>
                <div>• DGMS Statutory Gas Limits: 10.0 m³/ton threshold for outburst classification.</div>
                <div>• Fracture Criterion: Coulomb-Navier shear slip active in Layer G4 & G5.</div>
              </div>
            </div>

            {/* Right: Detailed Layer Properties & Digital Twin Abnormality Predictor (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Selected Layer Overview Card */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded"
                        style={{ backgroundColor: activeLayer.colorHex }}
                      />
                      <h3 className="text-base font-bold text-white">
                        {activeLayer.code}: {activeLayer.name}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Lithology: <span className="text-stone-200 font-medium">{activeLayer.lithologyType}</span> • Depth Interval: -{activeLayer.depthRangeM[0]}m to -{activeLayer.depthRangeM[1]}m ({activeLayer.thicknessM}m thickness)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 font-mono">Early Warning Lead Time:</span>
                    <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700 font-mono font-bold text-amber-300 text-xs">
                      {activeLayer.digitalTwinPrediction.earlyWarningLeadTimeHrs} Hours
                    </span>
                  </div>
                </div>

                {/* Quantitative Rock Mechanical & In-situ State Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                    <div className="text-3xs text-stone-400 uppercase font-mono">Rock Quality (RQD)</div>
                    <div className="text-base font-bold text-stone-100 font-mono mt-0.5">
                      {activeLayer.rqdPct}%
                    </div>
                    <div className="text-3xs text-stone-400">{activeLayer.rqdPct > 70 ? 'Competent Strata' : 'Fractured / Jointed'}</div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                    <div className="text-3xs text-stone-400 uppercase font-mono">Compressive Strength</div>
                    <div className="text-base font-bold text-stone-100 font-mono mt-0.5">
                      {activeLayer.ucsMpa} MPa
                    </div>
                    <div className="text-3xs text-stone-400">UCS Lab Calibrated</div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                    <div className="text-3xs text-stone-400 uppercase font-mono">Pore Fluid Pressure</div>
                    <div className={`text-base font-bold font-mono mt-0.5 ${activeLayer.porePressureMpa > 2.5 ? 'text-rose-400' : 'text-stone-100'}`}>
                      {activeLayer.porePressureMpa} MPa
                    </div>
                    <div className="text-3xs text-stone-400">Fiber Piezometers</div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                    <div className="text-3xs text-stone-400 uppercase font-mono">Gas Sorption Content</div>
                    <div className={`text-base font-bold font-mono mt-0.5 ${activeLayer.gasContentM3PerTon > 8 ? 'text-rose-400' : 'text-stone-100'}`}>
                      {activeLayer.gasContentM3PerTon} m³/t
                    </div>
                    <div className="text-3xs text-stone-400">Langmuir Desorption</div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                    <div className="text-3xs text-stone-400 uppercase font-mono">Horizontal Stress (K)</div>
                    <div className="text-base font-bold text-stone-100 font-mono mt-0.5">
                      {activeLayer.horizontalStressRatio} σH/σv
                    </div>
                    <div className="text-3xs text-stone-400">{activeLayer.horizontalStressRatio > 1.5 ? 'High Tectonic Thrust' : 'Hydrostatic State'}</div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                    <div className="text-3xs text-stone-400 uppercase font-mono">Strata Creep Velocity</div>
                    <div className={`text-base font-bold font-mono mt-0.5 ${activeLayer.strataCreepVelocityMmDay > 2.0 ? 'text-amber-400' : 'text-stone-100'}`}>
                      {activeLayer.strataCreepVelocityMmDay} mm/day
                    </div>
                    <div className="text-3xs text-stone-400">Laser Extensometers</div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                    <div className="text-3xs text-stone-400 uppercase font-mono">Groundwater Influx</div>
                    <div className={`text-base font-bold font-mono mt-0.5 ${activeLayer.waterIngressLpm > 150 ? 'text-cyan-400' : 'text-stone-100'}`}>
                      {activeLayer.waterIngressLpm} L/min
                    </div>
                    <div className="text-3xs text-stone-400">Sump Catchment Rate</div>
                  </div>

                  <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                    <div className="text-3xs text-stone-400 uppercase font-mono">Microseismics (24h)</div>
                    <div className={`text-base font-bold font-mono mt-0.5 ${activeLayer.microseismicEventsLast24h > 20 ? 'text-rose-400' : 'text-stone-100'}`}>
                      {activeLayer.microseismicEventsLast24h} Events
                    </div>
                    <div className="text-3xs text-stone-400">Geophone Array</div>
                  </div>
                </div>

                {/* DIGITAL TWIN EARLY ABNORMALITY PREDICTION PANEL */}
                <div className={`mt-5 p-4 rounded-xl border ${
                  activeLayer.digitalTwinPrediction.riskSeverity === 'red'
                    ? 'bg-rose-950/40 border-rose-600/60'
                    : activeLayer.digitalTwinPrediction.riskSeverity === 'yellow'
                    ? 'bg-amber-950/30 border-amber-600/50'
                    : 'bg-emerald-950/20 border-emerald-600/40'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        activeLayer.digitalTwinPrediction.riskSeverity === 'red'
                          ? 'text-rose-400 animate-bounce'
                          : activeLayer.digitalTwinPrediction.riskSeverity === 'yellow'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`} />
                      <div>
                        <span className="text-2xs font-mono uppercase tracking-wider text-stone-400">
                          Digital Twin Predictive Assessment
                        </span>
                        <div className="text-base font-bold text-white">
                          Forecasted Anomaly: {activeLayer.digitalTwinPrediction.abnormalityRisk}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xs text-stone-400 font-mono">Failure Probability</div>
                      <div className="text-lg font-bold font-mono text-white">
                        {activeLayer.digitalTwinPrediction.failureProbabilityPct}%
                      </div>
                    </div>
                  </div>

                  {/* Probability Bar */}
                  <div className="w-full bg-stone-900 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        activeLayer.digitalTwinPrediction.failureProbabilityPct > 70
                          ? 'bg-rose-500'
                          : activeLayer.digitalTwinPrediction.failureProbabilityPct > 35
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${activeLayer.digitalTwinPrediction.failureProbabilityPct}%` }}
                    />
                  </div>

                  {/* Precursors Detected by AI Twin */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="text-xs font-semibold text-stone-200">Precursor Signals Identified:</div>
                    {activeLayer.digitalTwinPrediction.detectedPrecursors.map((prec, i) => (
                      <div key={i} className="text-2xs text-stone-300 flex items-start gap-2 bg-stone-900/60 px-2.5 py-1.5 rounded border border-stone-800">
                        <span className="text-amber-400 font-mono">•</span>
                        <span>{prec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mitigation Action */}
                  <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-start gap-2 text-xs">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-emerald-300">Prescribed Engineering Mitigation: </span>
                      <span className="text-stone-300">{activeLayer.digitalTwinPrediction.mitigationAction}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LAYER-LEVEL DRILLING TELEMETRY & STRATA LOGGING */}
      {/* ========================================================================= */}
      {activeTab === 'drilling' && (
        <div className="space-y-6">
          {/* Active Drilling Rig Live Telemetry Dashboard */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">
                    {primaryRig.name}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-semibold">
                    {primaryRig.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Model: {primaryRig.model} • Surface Collar: Position X: {primaryRig.surfaceX}%
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow"
                >
                  <Plus className="w-4 h-4" />
                  Record New Strata Interval Log
                </button>
              </div>
            </div>

            {/* Depth & Penetration Progress */}
            <div className="mt-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-stone-300 font-medium">
                  Current Bit Depth: <strong className="text-cyan-300 font-mono text-sm">-{primaryRig.currentDepthM.toFixed(1)}m</strong>
                </span>
                <span className="text-stone-400 font-mono">Target: -{primaryRig.targetDepthM}m</span>
              </div>
              <div className="w-full bg-stone-900 rounded-full h-3 overflow-hidden p-0.5 border border-stone-800">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(primaryRig.currentDepthM / primaryRig.targetDepthM) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-3xs font-mono text-stone-400 mt-1.5">
                <span>Intercepting: <strong className="text-amber-300">{primaryRig.currentLayerName}</strong></span>
                <span>{((primaryRig.currentDepthM / primaryRig.targetDepthM) * 100).toFixed(1)}% Completed</span>
              </div>
            </div>

            {/* Live Rig Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <div className="text-3xs text-stone-400 uppercase font-mono">ROP (Rate of Penetration)</div>
                <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                  {primaryRig.ropMetersPerHour} m/hr
                </div>
                <div className="text-3xs text-stone-400">Diamond Coring Bit</div>
              </div>

              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <div className="text-3xs text-stone-400 uppercase font-mono">Rotary Torque</div>
                <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                  {primaryRig.torqueKNm} kNm
                </div>
                <div className="text-3xs text-stone-400">Head Motor Drive</div>
              </div>

              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <div className="text-3xs text-stone-400 uppercase font-mono">Weight on Bit (WOB)</div>
                <div className="text-base font-bold text-stone-200 font-mono mt-0.5">
                  {primaryRig.weightOnBitKN} kN
                </div>
                <div className="text-3xs text-stone-400">Hydraulic Thrust</div>
              </div>

              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <div className="text-3xs text-stone-400 uppercase font-mono">Mud Return CH₄ Gas</div>
                <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
                  {primaryRig.mudGasReturnCh4Pct}%
                </div>
                <div className="text-3xs text-rose-400 font-semibold">Gas Pocket Peak</div>
              </div>

              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <div className="text-3xs text-stone-400 uppercase font-mono">Mud Return CO</div>
                <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                  {primaryRig.mudGasReturnCoPpm} ppm
                </div>
                <div className="text-3xs text-stone-400">Electrochemical Sniffer</div>
              </div>

              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <div className="text-3xs text-stone-400 uppercase font-mono">Fluid Loss</div>
                <div className="text-base font-bold text-stone-200 font-mono mt-0.5">
                  {primaryRig.fluidLossLpm} L/min
                </div>
                <div className="text-3xs text-stone-400">Fracture Permeation</div>
              </div>
            </div>

            {/* Active Anomaly Warning Banner on Rig */}
            {primaryRig.activeAnomalyWarning && (
              <div className="mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-500/50 flex items-start gap-2.5 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300">LAYER-LEVEL ANOMALY DETECTED DURING DRILLING: </span>
                  <span>{primaryRig.activeAnomalyWarning}</span>
                </div>
              </div>
            )}
          </div>

          {/* Historical Layer-Wise Drilling Log Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  Stratigraphic Drilling Interval Records
                </h3>
                <p className="text-xs text-stone-400">
                  Continuous logging of rate of penetration, gas returns, and rock quality per geological layer
                </p>
              </div>

              {/* Filter by Geological Layer */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Filter Strata:</span>
                <select
                  value={layerFilter}
                  onChange={(e) => setLayerFilter(e.target.value)}
                  className="bg-stone-800 text-stone-200 text-xs rounded-lg px-2.5 py-1.5 border border-stone-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="all">All Geological Layers (G1 - G5)</option>
                  <option value="G1">G1: Overburden & Alluvium</option>
                  <option value="G2">G2: Quartzitic Sandstone</option>
                  <option value="G3">G3: Upper Coal Seam A</option>
                  <option value="G4">G4: Siltstone Aquitard</option>
                  <option value="G5">G5: Deep Coal Seam B</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto border border-stone-800 rounded-lg">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-stone-950 text-stone-400 font-mono text-3xs uppercase tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-2.5 px-3">Depth (m)</th>
                    <th className="py-2.5 px-3">Geological Layer</th>
                    <th className="py-2.5 px-3">Lithology Sample</th>
                    <th className="py-2.5 px-3">ROP (m/h)</th>
                    <th className="py-2.5 px-3">Torque (kNm)</th>
                    <th className="py-2.5 px-3">Return CH₄</th>
                    <th className="py-2.5 px-3">Core Recovery</th>
                    <th className="py-2.5 px-3">Layer Anomaly Flag</th>
                    <th className="py-2.5 px-3">Geologist Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 bg-stone-900/60 text-stone-300">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">-{log.depthM.toFixed(1)}m</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded font-mono text-2xs font-semibold bg-stone-800 text-amber-300 border border-stone-700">
                          {log.strataLayerId}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-[180px] truncate text-stone-200" title={log.lithology}>
                        {log.lithology}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-cyan-300">{log.ropMetersPerHour}</td>
                      <td className="py-2.5 px-3 font-mono">{log.torqueKNm}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className={log.mudGasReturnCh4Pct > 1.5 ? 'text-rose-400 font-bold' : 'text-stone-300'}>
                          {log.mudGasReturnCh4Pct}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{log.coreRecoveryPct}%</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-3xs font-mono font-bold uppercase ${
                          log.strataAnomalyFlag === 'gas_pocket_intercepted'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : log.strataAnomalyFlag === 'void_detected' || log.strataAnomalyFlag === 'water_zone'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {log.strataAnomalyFlag.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-[240px] truncate text-stone-400" title={log.notes}>
                        {log.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BOREHOLE VENTILATION & GAS EVACUATION SYSTEM */}
      {/* ========================================================================= */}
      {activeTab === 'ventilation' && (
        <div className="space-y-6">
          {/* Surface Gas Evacuation Outlets Section */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Surface Gas Evacuation Outlets & Scrubber Stations
                  </h3>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Safely flares drained explosive methane and scrubbers return air to exhaust hazardous gases from the deep levels
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-700">
                  Total CH₄ Evacuated: {data.totalMethaneEvacuatedM3.toLocaleString()} m³
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.exhaustOutlets.map((outlet) => (
                <div
                  key={outlet.id}
                  className="bg-stone-950 p-4 rounded-xl border border-stone-800 hover:border-stone-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {outlet.type.includes('Flare') ? <Flame className="w-4 h-4" /> : <Wind className="w-4 h-4" />}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{outlet.name}</h4>
                        <div className="text-3xs text-stone-400">{outlet.location}</div>
                      </div>
                    </div>

                    <span className={`text-3xs font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      outlet.plumeStatus === 'high_rate_evacuation' || outlet.plumeStatus === 'purge_active'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {outlet.plumeStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-850 text-xs">
                    <div>
                      <div className="text-3xs text-stone-400 uppercase font-mono">Exhaust Rate</div>
                      <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">
                        {outlet.exhaustRateM3Min} m³/min
                      </div>
                    </div>
                    <div>
                      <div className="text-3xs text-stone-400 uppercase font-mono">CH₄ In Flue</div>
                      <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                        {outlet.ch4EvacuatedPct}%
                      </div>
                    </div>
                    <div>
                      <div className="text-3xs text-stone-400 uppercase font-mono">Fan RPM</div>
                      <div className="text-sm font-bold text-stone-200 font-mono mt-0.5">
                        {outlet.fanSpeedRpm} RPM
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subsurface Boreholes Ventilation Network */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    Subsurface Boreholes Ventilation & Degasification Lines
                  </h3>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Surface-to-deep drilled boreholes providing forced intake fresh air and pre-drainage vacuum suction to trapped miner chambers
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {data.boreholes.map((bh) => (
                <div
                  key={bh.id}
                  className="bg-stone-950 p-4 rounded-xl border border-stone-800 hover:border-stone-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg border ${
                        bh.type === 'intake_fresh_air'
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}>
                        <Wind className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{bh.name}</h4>
                          <span className={`text-3xs font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            bh.status === 'forced_purge'
                              ? 'bg-rose-900 text-white animate-pulse'
                              : 'bg-stone-800 text-stone-300'
                          }`}>
                            {bh.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Connected Level: <strong className="text-stone-200">{bh.connectedLevelName}</strong> (Target Depth: -{bh.targetDepthM}m • Ø{bh.diameterMm}mm)
                        </p>
                      </div>
                    </div>

                    {/* Damper Slider Control */}
                    <div className="flex items-center gap-3 bg-stone-900 px-3 py-2 rounded-lg border border-stone-800">
                      <div className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        Damper:
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={bh.damperPositionPct}
                        onChange={(e) => onAdjustBoreholeDamper(bh.id, Number(e.target.value))}
                        className="w-24 accent-amber-500 cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-amber-300 w-10 text-right">
                        {bh.damperPositionPct}%
                      </span>
                    </div>
                  </div>

                  {/* Flow & Pressure Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-stone-850 text-xs">
                    <div>
                      <div className="text-3xs text-stone-400 uppercase font-mono">Borehole Pressure</div>
                      <div className={`text-sm font-bold font-mono mt-0.5 ${bh.suctionPressureKpa < 0 ? 'text-cyan-300' : 'text-emerald-300'}`}>
                        {bh.suctionPressureKpa > 0 ? `+${bh.suctionPressureKpa}` : bh.suctionPressureKpa} kPa
                      </div>
                      <div className="text-3xs text-stone-400">{bh.suctionPressureKpa < 0 ? 'Negative Vacuum Suction' : 'Positive Fresh Draft'}</div>
                    </div>

                    <div>
                      <div className="text-3xs text-stone-400 uppercase font-mono">Flow Rate</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">
                        {bh.gasExtractionFlowM3Min} m³/min
                      </div>
                      <div className="text-3xs text-stone-400">Volumetric Discharge</div>
                    </div>

                    <div>
                      <div className="text-3xs text-stone-400 uppercase font-mono">CH₄ Purity at Collar</div>
                      <div className={`text-sm font-bold font-mono mt-0.5 ${bh.methanePurityPct > 50 ? 'text-rose-400' : 'text-stone-300'}`}>
                        {bh.methanePurityPct}%
                      </div>
                      <div className="text-3xs text-stone-400">{bh.methanePurityPct > 80 ? 'Pre-Drainage Quality' : 'Diluted Air'}</div>
                    </div>

                    <div>
                      <div className="text-3xs text-stone-400 uppercase font-mono">Intercepted Strata</div>
                      <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">
                        {bh.interceptedLayers.join(' → ')}
                      </div>
                      <div className="text-3xs text-stone-400">Cased Through Impervious Bed</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECORD NEW LAYER-LEVEL DRILLING INTERVAL */}
      {/* ========================================================================= */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Record Layer-Level Drilling Log</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-stone-400 hover:text-white text-sm px-2 py-1 rounded bg-stone-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Depth (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newLogDepth}
                    onChange={(e) => setNewLogDepth(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Geological Strata Layer</label>
                  <select
                    value={newLogLayerId}
                    onChange={(e) => setNewLogLayerId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white font-mono"
                  >
                    <option value="G1">Layer G1: Overburden & Alluvium (0-65m)</option>
                    <option value="G2">Layer G2: Quartzitic Sandstone (65-180m)</option>
                    <option value="G3">Layer G3: Upper Coal Seam A (180-285m)</option>
                    <option value="G4">Layer G4: Siltstone Aquitard (285-390m)</option>
                    <option value="G5">Layer G5: Deep Coal Seam B (390-520m)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Lithology Sample Observed</label>
                <input
                  type="text"
                  value={newLogLithology}
                  onChange={(e) => setNewLogLithology(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">ROP (m/hr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLogRop}
                    onChange={(e) => setNewLogRop(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Torque (kNm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLogTorque}
                    onChange={(e) => setNewLogTorque(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Weight on Bit (kN)</label>
                  <input
                    type="number"
                    step="1"
                    value={newLogWob}
                    onChange={(e) => setNewLogWob(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Mud Gas CH₄ (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newLogCh4}
                    onChange={(e) => setNewLogCh4(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Mud Gas CO (ppm)</label>
                  <input
                    type="number"
                    step="1"
                    value={newLogCo}
                    onChange={(e) => setNewLogCo(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Core Recovery (%)</label>
                  <input
                    type="number"
                    step="1"
                    value={newLogRecovery}
                    onChange={(e) => setNewLogRecovery(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Strata Anomaly Classification</label>
                <select
                  value={newLogAnomaly}
                  onChange={(e) => setNewLogAnomaly(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white font-mono"
                >
                  <option value="nominal">Nominal Strata Penetration</option>
                  <option value="gas_pocket_intercepted">Gas Pocket Intercepted (CH4 / CO surge)</option>
                  <option value="void_detected">Void / Lost Circulation Cavity Detected</option>
                  <option value="water_zone">Water Bearing Aquitard Influx</option>
                  <option value="hard_inclusion">Hard Chert Inclusion (Torque Spike)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Geologist Observation Notes</label>
                <textarea
                  rows={2}
                  value={newLogNotes}
                  onChange={(e) => setNewLogNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow"
                >
                  Commit Strata Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
