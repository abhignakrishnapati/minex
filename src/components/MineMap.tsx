import React, { useState } from 'react';
import {
  Layers,
  Users,
  Radio,
  Wind,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Heart,
  Battery,
  Thermometer,
  Shield,
  Bot,
  LifeBuoy,
  Truck,
  Gauge,
  Activity,
  Flame,
  Droplets,
  Compass,
  Zap,
  Sliders
} from 'lucide-react';
import {
  MineZone,
  Worker,
  SensorNode,
  SeverityLevel,
  RescueTeamMember,
  RescueRobotTelemetry,
  SafeRouteSegment,
  VehicleSafetyMetric,
  GeologicalDigitalTwinData,
  GeologicalStrataLayer,
  BoreholeVentilationNode,
  SurfaceGasExhaustOutlet,
  DrillingRigTelemetry
} from '../types';

interface MineMapProps {
  zones: MineZone[];
  workers: Worker[];
  sensors: SensorNode[];
  vehicles?: VehicleSafetyMetric[];
  selectedZoneFilter: SeverityLevel | 'all';
  onSelectWorker?: (worker: Worker | null) => void;
  selectedWorkerId?: string | null;
  appMode?: 'normal' | 'rescue';
  rescueTeams?: RescueTeamMember[];
  rescueRobots?: RescueRobotTelemetry[];
  safeRoute?: SafeRouteSegment[];
  geologicalData?: GeologicalDigitalTwinData;
  onToggleForcedPurge?: () => void;
}

export const MineMap: React.FC<MineMapProps> = ({
  zones,
  workers,
  sensors,
  vehicles = [],
  selectedZoneFilter,
  onSelectWorker,
  selectedWorkerId,
  appMode = 'normal',
  rescueTeams = [],
  rescueRobots = [],
  safeRoute = [],
  geologicalData,
  onToggleForcedPurge,
}) => {
  const [showWorkers, setShowWorkers] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showAirflow, setShowAirflow] = useState(true);
  const [showEscapeRoutes, setShowEscapeRoutes] = useState(appMode === 'rescue');
  const [showRescueUnits, setShowRescueUnits] = useState(true);
  const [showGeology, setShowGeology] = useState(true);
  const [showBoreholes, setShowBoreholes] = useState(true);
  const [showExhaust, setShowExhaust] = useState(true);
  const [showDrillRigs, setShowDrillRigs] = useState(true);

  const [hoveredWorker, setHoveredWorker] = useState<Worker | null>(null);
  const [hoveredSensor, setHoveredSensor] = useState<SensorNode | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(null);
  const [selectedRobot, setSelectedRobot] = useState<RescueRobotTelemetry | null>(null);
  const [selectedRescueTeam, setSelectedRescueTeam] = useState<RescueTeamMember | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSafetyMetric | null>(null);
  const [selectedStrata, setSelectedStrata] = useState<GeologicalStrataLayer | null>(null);
  const [selectedBorehole, setSelectedBorehole] = useState<BoreholeVentilationNode | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<SurfaceGasExhaustOutlet | null>(null);
  const [selectedRig, setSelectedRig] = useState<DrillingRigTelemetry | null>(null);

  const [zoomLevel, setZoomLevel] = useState(1);

  const activeWorker = workers.find((w) => w.id === selectedWorkerId) || hoveredWorker;

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 shadow-xl overflow-hidden flex flex-col">
      {/* Map Header and Control Toolbar */}
      <div className="p-4 sm:p-5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 bg-stone-950/60">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-lg bg-stone-800 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Subsurface Mine Mapping & Real-Time Positioning
            </h2>
            <span className="text-xs sm:text-sm font-mono px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
              4 Depth Levels (Surface to -500m)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Active cross-sectional view showing Green, Yellow, and Red zones, worker transponders, sensor nodes, and airflow vectors
          </p>
        </div>

        {/* Layer Visibility Toggles with larger font */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setShowWorkers(!showWorkers)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showWorkers
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Miners ({workers.length})
          </button>
          <button
            type="button"
            onClick={() => setShowSensors(!showSensors)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showSensors
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            Sensors ({sensors.length})
          </button>
          <button
            type="button"
            onClick={() => setShowVehicles(!showVehicles)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showVehicles
                ? 'bg-sky-500 text-stone-950 border-sky-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            Vehicles ({vehicles.length})
          </button>
          <button
            type="button"
            onClick={() => setShowRescueUnits(!showRescueUnits)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showRescueUnits
                ? 'bg-cyan-500 text-stone-950 border-cyan-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            Rescue Units ({rescueTeams.length + rescueRobots.length})
          </button>
          <button
            type="button"
            onClick={() => setShowAirflow(!showAirflow)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showAirflow
                ? 'bg-teal-500 text-stone-950 border-teal-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
          >
            <Wind className="w-4 h-4" />
            Air Flow
          </button>
          <button
            type="button"
            onClick={() => setShowEscapeRoutes(!showEscapeRoutes)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showEscapeRoutes
                ? 'bg-emerald-500 text-stone-950 border-emerald-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
          >
            <Navigation className="w-4 h-4" />
            Escape Routes
          </button>

          {/* Geological & Degasification Infrastructure Toggles */}
          <button
            type="button"
            onClick={() => setShowGeology(!showGeology)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showGeology
                ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
            title="Toggle Stratigraphic Geology Layers (G1-G5)"
          >
            <Layers className="w-4 h-4" />
            Strata G1-G5
          </button>

          <button
            type="button"
            onClick={() => setShowBoreholes(!showBoreholes)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showBoreholes
                ? 'bg-teal-600 text-white border-teal-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
            title="Toggle Ventilation & Degasification Boreholes"
          >
            <Wind className="w-4 h-4" />
            Boreholes
          </button>

          <button
            type="button"
            onClick={() => setShowExhaust(!showExhaust)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showExhaust
                ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
            title="Toggle Surface Gas Evacuation Outlets (Flare & Scrubber)"
          >
            <Flame className="w-4 h-4" />
            Gas Outlets
          </button>

          <button
            type="button"
            onClick={() => setShowDrillRigs(!showDrillRigs)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showDrillRigs
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
            }`}
            title="Toggle Surface Drilling Rigs & Active Bit Depth"
          >
            <Compass className="w-4 h-4" />
            Drill Rigs
          </button>

          {/* Forced Borehole Purge Action Button */}
          {onToggleForcedPurge && (
            <button
              type="button"
              onClick={onToggleForcedPurge}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md border ${
                geologicalData?.forcedGasPurgeActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-amber-600/50'
              }`}
              title="Engage / Disengage high-rate borehole degasification purge"
            >
              <Zap className="w-3.5 h-3.5" />
              {geologicalData?.forcedGasPurgeActive ? 'Purge Active' : 'Borehole Purge'}
            </button>
          )}

          {/* Zoom controls */}
          <div className="flex items-center ml-1 border border-stone-700 rounded-lg overflow-hidden bg-stone-950">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
              className="p-2 hover:bg-stone-800 text-stone-300 border-r border-stone-800"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-2 hover:bg-stone-800 text-stone-300 border-r border-stone-800"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-2 hover:bg-stone-800 text-stone-300"
              title="Reset Zoom"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TACTICAL RESCUE & UNIT SELECTOR BUTTONS */}
      <div className="bg-stone-900/90 border-b border-stone-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-stone-400 font-bold uppercase tracking-wider text-2xs flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            Quick Inspect:
          </span>

          {/* Robot Button */}
          {rescueRobots.map((bot) => (
            <button
              key={bot.robotId}
              type="button"
              onClick={() => {
                setSelectedRobot(selectedRobot?.robotId === bot.robotId ? null : bot);
                setSelectedRescueTeam(null);
                if (onSelectWorker) onSelectWorker(null);
              }}
              className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                selectedRobot?.robotId === bot.robotId
                  ? 'bg-cyan-500 text-stone-950 border-cyan-400 ring-2 ring-cyan-400/50'
                  : 'bg-stone-950 text-cyan-300 border-cyan-700/60 hover:bg-stone-850'
              }`}
            >
              <span>🤖</span>
              <span>{bot.robotId} ({bot.robotId.includes('Beta') ? 'West' : 'East'})</span>
              <span className="text-3xs px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-200 border border-cyan-700">
                {bot.batteryPct}% BAT
              </span>
            </button>
          ))}

          {/* Rescue Team Members Buttons */}
          {rescueTeams.map((team) => {
            const isSelected = selectedRescueTeam?.id === team.id;
            const isMedic = team.role.toLowerCase().includes('paramedic');
            return (
              <button
                key={team.id}
                type="button"
                onClick={() => {
                  setSelectedRescueTeam(isSelected ? null : team);
                  setSelectedRobot(null);
                  if (onSelectWorker) onSelectWorker(null);
                }}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  isSelected
                    ? isMedic
                      ? 'bg-emerald-400 text-stone-950 border-emerald-300 ring-2 ring-emerald-400/50'
                      : 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-400/50'
                    : isMedic
                    ? 'bg-stone-950 text-emerald-300 border-emerald-700/60 hover:bg-stone-850'
                    : 'bg-stone-950 text-amber-300 border-amber-700/60 hover:bg-stone-850'
                }`}
              >
                <span>{isMedic ? '🚑' : '🛡️'}</span>
                <span>{team.id} ➔ {team.targetMiner?.tagId || 'Miner'} ({team.targetMiner?.minerName.split(' ')[0]})</span>
                <span className="text-3xs px-1.5 py-0.5 rounded bg-stone-900 text-amber-300 border border-stone-700 font-mono">
                  {team.targetMiner?.distanceMeters}m
                </span>
                <span className="text-3xs px-1.5 py-0.5 rounded bg-stone-900 text-stone-300 border border-stone-700 font-mono">
                  {team.scbaOxygenRemainingPct}% O₂
                </span>
              </button>
            );
          })}

          {/* Trapped Miners M003 & M007 Quick Buttons */}
          {workers.filter((w) => w.tagId === 'M003' || w.tagId === 'M007').map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                if (onSelectWorker) {
                  onSelectWorker(selectedWorkerId === m.id ? null : m);
                }
                setSelectedRobot(null);
                setSelectedRescueTeam(null);
              }}
              className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                selectedWorkerId === m.id
                  ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/50'
                  : 'bg-stone-950 text-rose-300 border-rose-700/60 hover:bg-stone-850'
              }`}
            >
              <span>🚨</span>
              <span>Miner {m.tagId} ({m.name.split(' ')[0]})</span>
              <span className="text-3xs px-1.5 py-0.2 rounded bg-rose-950 text-rose-200 border border-rose-700 uppercase">
                SOS
              </span>
            </button>
          ))}
        </div>

        {(selectedRobot || selectedRescueTeam || selectedWorkerId) && (
          <button
            type="button"
            onClick={() => {
              setSelectedRobot(null);
              setSelectedRescueTeam(null);
              if (onSelectWorker) onSelectWorker(null);
            }}
            className="text-stone-400 hover:text-white px-2 py-1 rounded bg-stone-800 text-2xs hover:bg-stone-700 transition-colors"
          >
            Clear Selection ✕
          </button>
        )}
      </div>

      {/* Main Interactive Map Container */}
      <div className="relative bg-stone-950 w-full overflow-auto min-h-[500px] max-h-[640px] p-5 flex items-center justify-center select-none">
        
        {/* Subtle coordinate grid & depth scale on the left with larger font */}
        <div className="absolute left-3 top-5 bottom-5 w-24 pointer-events-none flex flex-col justify-between text-xs font-mono text-stone-400 z-10">
          <div className="border-b border-stone-800 pb-1 font-semibold text-stone-300">Surface (0m)</div>
          <div className="border-b border-stone-800 pb-1 font-semibold text-stone-300">-120m Portal</div>
          <div className="border-b border-stone-800 pb-1 font-semibold text-stone-300">-240m Haulage</div>
          <div className="border-b border-stone-800 pb-1 font-semibold text-stone-300">-380m Face 4</div>
          <div className="border-b border-stone-800 pb-1 font-semibold text-stone-300">-500m Sump</div>
        </div>

        {/* Scalable SVG Schematic Container */}
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 w-full max-w-[920px] h-[520px] relative"
        >
          <svg
            viewBox="0 0 920 520"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Pattern for Green Zone accessibility hatching */}
              <pattern id="greenHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="12" stroke="#10b981" strokeWidth="2" strokeOpacity="0.25" />
              </pattern>
              {/* Pattern for Yellow Zone accessibility hatching */}
              <pattern id="yellowHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#f59e0b" strokeWidth="2.5" strokeOpacity="0.35" />
              </pattern>
              {/* Pattern for Red Zone accessibility hatching */}
              <pattern id="redHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#f43f5e" strokeWidth="3" strokeOpacity="0.45" />
              </pattern>
              
              {/* Markers for Airflow and Escape arrows */}
              <marker id="arrowAir" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
              <marker id="arrowEscape" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
              </marker>
              <marker id="arrowGasUp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 10 L 5 0 L 10 10 z" fill="#f43f5e" />
              </marker>
              <marker id="arrowAirDown" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 0 L 5 10 z" fill="#06b6d4" />
              </marker>
              <marker id="arrowRescueAmber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
              </marker>
              <marker id="arrowRescueEmerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
              </marker>
            </defs>

            {/* ============================================================ */}
            {/* GEOLOGICAL STRATA DIGITAL TWIN BACKGROUND BANDS (G1 - G5) */}
            {/* ============================================================ */}
            {showGeology && geologicalData?.strataLayers && (
              <g id="geological-strata-layers" opacity="0.95">
                {/* Stratigraphic Band Definitions: Depth mapped to SVG Y coords */}
                {[
                  { layer: geologicalData.strataLayers[0], y: 40, height: 65, labelY: 55 },
                  { layer: geologicalData.strataLayers[1], y: 105, height: 95, labelY: 120 },
                  { layer: geologicalData.strataLayers[2], y: 200, height: 95, labelY: 215 },
                  { layer: geologicalData.strataLayers[3], y: 295, height: 100, labelY: 310 },
                  { layer: geologicalData.strataLayers[4], y: 395, height: 115, labelY: 410 },
                ].map(({ layer, y, height, labelY }) => {
                  if (!layer) return null;
                  const isSelected = selectedStrata?.id === layer.id;
                  const riskBadgeColor =
                    layer.digitalTwinPrediction.riskSeverity === 'red'
                      ? '#f43f5e'
                      : layer.digitalTwinPrediction.riskSeverity === 'yellow'
                      ? '#f59e0b'
                      : '#10b981';

                  return (
                    <g
                      key={layer.id}
                      className="cursor-pointer transition-opacity"
                      onClick={() => setSelectedStrata(isSelected ? null : layer)}
                    >
                      {/* Layer Backdrop Rectangle */}
                      <rect
                        x="70"
                        y={y}
                        width="800"
                        height={height}
                        fill={layer.colorHex}
                        fillOpacity={isSelected ? 0.35 : 0.14}
                        stroke={isSelected ? '#fbbf24' : layer.colorHex}
                        strokeWidth={isSelected ? 2.5 : 1}
                        strokeDasharray={isSelected ? undefined : '4 4'}
                      />

                      {/* Geological Layer Metadata Tag on Right Border */}
                      <rect
                        x="730"
                        y={labelY - 10}
                        width="135"
                        height="20"
                        rx="4"
                        fill="#1c1917"
                        fillOpacity="0.92"
                        stroke={riskBadgeColor}
                        strokeWidth="1.2"
                      />
                      <circle cx="740" cy={labelY} r="3.5" fill={riskBadgeColor} />
                      <text
                        x="748"
                        y={labelY + 3.5}
                        fill="#f3f4f6"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {layer.code}: {layer.digitalTwinPrediction.abnormalityRisk.slice(0, 16)}
                      </text>

                      {/* Geological Layer Lithology & Depth Tag on Left */}
                      <text
                        x="85"
                        y={labelY + 2}
                        fill="#a8a29e"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        opacity="0.85"
                      >
                        {layer.code} • {layer.name.toUpperCase()} ({layer.depthRangeM[0]}m to -{layer.depthRangeM[1]}m) | RQD: {layer.rqdPct}% | CH₄: {layer.gasContentM3PerTon} m³/t
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* ============================================================ */}
            {/* SURFACE DRILLING RIG (DR-01) & PENETRATING DRILL STRING */}
            {/* ============================================================ */}
            {showDrillRigs && geologicalData?.drillingRigs && (
              <g id="surface-drilling-rigs">
                {geologicalData.drillingRigs.map((rig) => {
                  const collarX = 480;
                  const targetBitY = 430; // depth -418.5m in Layer G5
                  const isSelected = selectedRig?.rigId === rig.rigId;

                  return (
                    <g
                      key={rig.rigId}
                      className="cursor-pointer"
                      onClick={() => setSelectedRig(isSelected ? null : rig)}
                    >
                      {/* Drill String (Continuous Rotating Steel Casing from Surface to Bit) */}
                      <line
                        x1={collarX}
                        y1="40"
                        x2={collarX}
                        y2={targetBitY}
                        stroke="#06b6d4"
                        strokeWidth="3.5"
                        strokeDasharray="6 3"
                      />

                      {/* Rotating Diamond Drill Bit with spark particle glow at tip */}
                      <circle
                        cx={collarX}
                        cy={targetBitY}
                        r="6"
                        fill="#0891b2"
                        stroke="#22d3ee"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                      <polygon
                        points={`${collarX - 4},${targetBitY} ${collarX + 4},${targetBitY} ${collarX},${targetBitY + 6}`}
                        fill="#fbbf24"
                      />

                      {/* Derrick Lattice Mast Tower on Surface */}
                      <polygon
                        points={`${collarX - 16},40 ${collarX + 16},40 ${collarX},10`}
                        fill="#164e63"
                        fillOpacity="0.8"
                        stroke="#22d3ee"
                        strokeWidth="2"
                      />
                      {/* Crown Block & Rotary Table */}
                      <circle cx={collarX} cy="10" r="4" fill="#fbbf24" />
                      <rect x={collarX - 6} y="36" width="12" height="6" fill="#f59e0b" />

                      {/* Rig Telemetry Callout Box */}
                      <rect
                        x={collarX - 95}
                        y="14"
                        width="88"
                        height="22"
                        rx="4"
                        fill="#082f49"
                        fillOpacity="0.9"
                        stroke="#06b6d4"
                        strokeWidth="1.2"
                      />
                      <text
                        x={collarX - 51}
                        y="24"
                        fill="#e0f2fe"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {rig.name} (-{rig.currentDepthM.toFixed(0)}m)
                      </text>
                      <text
                        x={collarX - 51}
                        y="32"
                        fill="#38bdf8"
                        fontSize="7.5"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        ROP: {rig.ropMetersPerHour} m/h • CH₄: {rig.mudGasReturnCh4Pct}%
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* ============================================================ */}
            {/* VENTILATION & DEGASIFICATION BOREHOLES */}
            {/* ============================================================ */}
            {showBoreholes && geologicalData?.boreholes && (
              <g id="ventilation-boreholes">
                {/* Borehole 1: Fresh Air Intake BH-VENT-01 at X=320 down to -240m (Y=220) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedBorehole(geologicalData.boreholes[0])}
                >
                  <line
                    x1="320"
                    y1="40"
                    x2="320"
                    y2="220"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                    strokeDasharray="5 3"
                    markerEnd="url(#arrowAirDown)"
                  />
                  {/* Borehole Collar Tag */}
                  <rect
                    x="275"
                    y="18"
                    width="85"
                    height="18"
                    rx="3"
                    fill="#164e63"
                    fillOpacity="0.9"
                    stroke="#06b6d4"
                    strokeWidth="1"
                  />
                  <text
                    x="317"
                    y="30"
                    fill="#cffafe"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    BH-VENT-01 (Intake)
                  </text>
                </g>

                {/* Borehole 2: In-Seam Pre-Drainage BH-GAS-01 at X=570 down to -380m (Y=340) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedBorehole(geologicalData.boreholes[1])}
                >
                  <line
                    x1="570"
                    y1="40"
                    x2="570"
                    y2="340"
                    stroke="#a855f7"
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                  />
                  {/* Upward Gas Suction Arrow on line */}
                  <line
                    x1="570"
                    y1="180"
                    x2="570"
                    y2="140"
                    stroke="#c084fc"
                    strokeWidth="4"
                    markerEnd="url(#arrowGasUp)"
                  />
                  <rect
                    x="525"
                    y="18"
                    width="90"
                    height="18"
                    rx="3"
                    fill="#3b0764"
                    fillOpacity="0.9"
                    stroke="#c084fc"
                    strokeWidth="1"
                  />
                  <text
                    x="570"
                    y="30"
                    fill="#fae8ff"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    BH-GAS-01 (Pre-Drain)
                  </text>
                </g>

                {/* Borehole 3: Deep Degasification Sump Line BH-GAS-02 at X=725 down to -500m Sump (Y=450) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedBorehole(geologicalData.boreholes[2])}
                >
                  <line
                    x1="725"
                    y1="40"
                    x2="725"
                    y2="450"
                    stroke="#f43f5e"
                    strokeWidth="4"
                    strokeDasharray="7 3"
                    className={geologicalData.forcedGasPurgeActive ? 'animate-pulse' : ''}
                  />
                  {/* Upward Gas Suction Chevrons */}
                  <line
                    x1="725"
                    y1="360"
                    x2="725"
                    y2="300"
                    stroke="#fda4af"
                    strokeWidth="4.5"
                    markerEnd="url(#arrowGasUp)"
                  />
                  <rect
                    x="675"
                    y="18"
                    width="100"
                    height="18"
                    rx="3"
                    fill="#881337"
                    fillOpacity="0.9"
                    stroke="#f43f5e"
                    strokeWidth="1"
                  />
                  <text
                    x="725"
                    y="30"
                    fill="#ffe4e6"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    BH-GAS-02 (Sump Purge)
                  </text>
                </g>
              </g>
            )}

            {/* ============================================================ */}
            {/* SURFACE GAS EVACUATION OUTLETS (FLARE & SCRUBBER) */}
            {/* ============================================================ */}
            {showExhaust && geologicalData?.exhaustOutlets && (
              <g id="surface-gas-exhaust-outlets">
                {/* Outlet 1: Methane Thermal Oxidizer / Flare at surface X=570 */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedOutlet(geologicalData.exhaustOutlets[0])}
                >
                  {/* Flare Stack Pipe */}
                  <rect x="566" y="2" width="8" height="24" fill="#44403c" stroke="#78716c" strokeWidth="1" />
                  {/* Animated Flame Core */}
                  <circle cx="570" cy="2" r="5" fill="#f59e0b" className="animate-ping" />
                  <polygon
                    points="566,2 574,2 570,-7"
                    fill="#ef4444"
                  />
                  <polygon
                    points="567,2 573,2 570,-4"
                    fill="#fbbf24"
                  />
                  <text
                    x="570"
                    y="-10"
                    fill="#fbbf24"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    🔥 FLARE OUTLET (680 m³/m)
                  </text>
                </g>

                {/* Outlet 2: Main Upcast Scrubber Fan Station at surface X=725 */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedOutlet(geologicalData.exhaustOutlets[1])}
                >
                  {/* Scrubber Chimney */}
                  <rect x="721" y="2" width="8" height="24" fill="#334155" stroke="#64748b" strokeWidth="1" />
                  {/* Rotating Fan Icon / Vapor Puff */}
                  <circle cx="725" cy="0" r="5" fill="#38bdf8" fillOpacity="0.8" className="animate-pulse" />
                  <path
                    d="M 720,-3 Q 725,-9 730,-3 Q 725,2 720,-3"
                    fill="none"
                    stroke="#bae6fd"
                    strokeWidth="1.5"
                  />
                  <text
                    x="725"
                    y="-10"
                    fill="#7dd3fc"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    💨 SCRUBBER OUTLET (1,850 m³/m)
                  </text>
                </g>
              </g>
            )}

            {/* Surface Line & Headframe structure */}
            <line x1="50" y1="40" x2="880" y2="40" stroke="#57534e" strokeWidth="3" strokeDasharray="5 5" />
            <text x="85" y="30" fill="#d6d3d1" fontSize="13" fontWeight="bold" fontFamily="monospace">
              SURFACE TOPOGRAPHY & MINE CONTROL PORTAL
            </text>
            
            {/* Surface headframe tower */}
            <path d="M 240 40 L 255 10 L 270 40 Z" fill="none" stroke="#a8a29e" strokeWidth="2.5" />
            <rect x="251" y="6" width="8" height="8" fill="#f59e0b" />
            
            {/* Ventilation exhaust fan tower */}
            <path d="M 680 40 L 695 12 L 710 40 Z" fill="none" stroke="#a8a29e" strokeWidth="2.5" />
            <circle cx="695" cy="20" r="5" fill="#38bdf8" />

            {/* Downcast Fresh Air Shaft (Vertical) */}
            <rect x="245" y="40" width="22" height="440" fill="#1c1917" stroke="#57534e" strokeWidth="2.5" />
            {/* Upcast Return Air Shaft (Vertical) */}
            <rect x="685" y="40" width="22" height="440" fill="#1c1917" stroke="#57534e" strokeWidth="2.5" />

            {/* ============================================================ */}
            {/* ZONE ALPHA: Surface to -120m Incline (LEVEL 1) */}
            {/* ============================================================ */}
            <g opacity={selectedZoneFilter === 'all' || selectedZoneFilter === 'green' ? 1 : 0.25}>
              <rect
                x="80"
                y="85"
                width="760"
                height="56"
                rx="8"
                fill="#064e3b"
                fillOpacity="0.35"
                stroke="#10b981"
                strokeWidth="2"
              />
              <rect x="80" y="85" width="760" height="56" rx="8" fill="url(#greenHatch)" />
              <line x1="90" y1="113" x2="830" y2="113" stroke="#78716c" strokeWidth="2.5" strokeDasharray="6 4" />
              <text x="95" y="104" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="monospace">
                ZONE ALPHA (SAFE RANGE) • LEVEL -120m MAIN INCLINE
              </text>
            </g>

            {/* ============================================================ */}
            {/* ZONE BRAVO: Level -240m Haulage & Substation (LEVEL 2) */}
            {/* ============================================================ */}
            <g opacity={selectedZoneFilter === 'all' || selectedZoneFilter === 'green' ? 1 : 0.25}>
              <rect
                x="120"
                y="190"
                width="700"
                height="60"
                rx="8"
                fill="#064e3b"
                fillOpacity="0.35"
                stroke="#10b981"
                strokeWidth="2"
              />
              <rect x="120" y="190" width="700" height="60" rx="8" fill="url(#greenHatch)" />
              <line x1="130" y1="220" x2="810" y2="220" stroke="#78716c" strokeWidth="2.5" strokeDasharray="6 4" />
              <text x="135" y="210" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="monospace">
                ZONE BRAVO (SAFE RANGE) • LEVEL -240m HAULAGEWAY & SUBSTATION
              </text>
            </g>

            {/* ============================================================ */}
            {/* ZONE CHARLIE: Level -380m Active Extraction Face 4 (LEVEL 3) */}
            {/* ============================================================ */}
            {(() => {
              const zoneCharlie = zones.find((z) => z.id === 'zone-3');
              const isRed = zoneCharlie?.severity === 'red';
              const isYellow = zoneCharlie?.severity === 'yellow';
              const fill = isRed ? '#881337' : isYellow ? '#78350f' : '#064e3b';
              const stroke = isRed ? '#f43f5e' : isYellow ? '#f59e0b' : '#10b981';
              const hatch = isRed ? 'url(#redHatch)' : isYellow ? 'url(#yellowHatch)' : 'url(#greenHatch)';
              const textColor = isRed ? '#fb7185' : isYellow ? '#fbbf24' : '#34d399';

              return (
                <g opacity={selectedZoneFilter === 'all' || selectedZoneFilter === zoneCharlie?.severity ? 1 : 0.25}>
                  <rect
                    x="160"
                    y="300"
                    width="640"
                    height="62"
                    rx="8"
                    fill={fill}
                    fillOpacity={isRed ? 0.55 : 0.4}
                    stroke={stroke}
                    strokeWidth={isRed ? 3 : 2}
                    className={isRed ? 'animate-pulse' : ''}
                  />
                  <rect x="160" y="300" width="640" height="62" rx="8" fill={hatch} />
                  <line x1="170" y1="331" x2="790" y2="331" stroke="#78716c" strokeWidth="2.5" strokeDasharray="6 4" />
                  <text x="175" y="320" fill={textColor} fontSize="12" fontWeight="bold" fontFamily="monospace">
                    ZONE CHARLIE ({zoneCharlie?.severity.toUpperCase()} RANGE) • LEVEL -380m LONGWALL FACE 4
                  </text>
                  {zoneCharlie?.primaryHazard && (
                    <text x="175" y="348" fill={textColor} fontSize="11" fontWeight="bold" fontFamily="monospace">
                      Hazard: {zoneCharlie.primaryHazard}
                    </text>
                  )}
                </g>
              );
            })()}

            {/* ============================================================ */}
            {/* ZONE DELTA: Level -500m Deep Drainage Sump (LEVEL 4) */}
            {/* ============================================================ */}
            {(() => {
              const zoneDelta = zones.find((z) => z.id === 'zone-4');
              const isRed = zoneDelta?.severity === 'red';
              const isYellow = zoneDelta?.severity === 'yellow';
              const fill = isRed ? '#881337' : isYellow ? '#78350f' : '#064e3b';
              const stroke = isRed ? '#f43f5e' : isYellow ? '#f59e0b' : '#10b981';
              const hatch = isRed ? 'url(#redHatch)' : isYellow ? 'url(#yellowHatch)' : 'url(#greenHatch)';
              const textColor = isRed ? '#fb7185' : isYellow ? '#fbbf24' : '#34d399';

              return (
                <g opacity={selectedZoneFilter === 'all' || selectedZoneFilter === zoneDelta?.severity ? 1 : 0.25}>
                  <rect
                    x="220"
                    y="410"
                    width="530"
                    height="60"
                    rx="8"
                    fill={fill}
                    fillOpacity={isRed ? 0.55 : 0.4}
                    stroke={stroke}
                    strokeWidth={isRed ? 3 : 2}
                    className={isRed ? 'animate-pulse' : ''}
                  />
                  <rect x="220" y="410" width="530" height="60" rx="8" fill={hatch} />
                  {/* Sump water basin */}
                  <rect x="420" y="436" width="120" height="26" rx="4" fill="#0284c7" fillOpacity="0.6" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="435" y="453" fill="#bae6fd" fontSize="11" fontWeight="bold" fontFamily="monospace">SUMP PIT</text>
                  <text x="235" y="428" fill={textColor} fontSize="12" fontWeight="bold" fontFamily="monospace">
                    ZONE DELTA ({zoneDelta?.severity.toUpperCase()} RANGE) • LEVEL -500m SUMP & WATER DRAINAGE
                  </text>
                </g>
              );
            })()}

            {/* Connecting Cross-Cuts and Hoist Lines */}
            <line x1="245" y1="113" x2="245" y2="440" stroke="#78716c" strokeWidth="2.5" strokeDasharray="4 4" />
            <line x1="695" y1="113" x2="695" y2="440" stroke="#78716c" strokeWidth="2.5" strokeDasharray="4 4" />
            <line x1="770" y1="220" x2="770" y2="331" stroke="#57534e" strokeWidth="3.5" />
            <line x1="245" y1="331" x2="245" y2="435" stroke="#57534e" strokeWidth="3.5" />

            {/* AIR FLOW DIRECTION VECTORS */}
            {showAirflow && (
              <g className="transition-opacity duration-300">
                <line x1="256" y1="50" x2="256" y2="105" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrowAir)" />
                <line x1="256" y1="118" x2="256" y2="210" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrowAir)" />
                <line x1="256" y1="225" x2="256" y2="320" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrowAir)" />
                <line x1="256" y1="335" x2="256" y2="425" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrowAir)" />
                
                <line x1="268" y1="113" x2="675" y2="113" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#arrowAir)" />
                <line x1="268" y1="220" x2="675" y2="220" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#arrowAir)" />
                <line x1="268" y1="331" x2="675" y2="331" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#arrowAir)" />

                <line x1="696" y1="415" x2="696" y2="50" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="5 3" markerEnd="url(#arrowAir)" />
                <text x="708" y="70" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">UPCAST EXHAUST</text>
                <text x="155" y="70" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">DOWNCAST INTAKE</text>
              </g>
            )}

            {/* EMERGENCY ESCAPE ROUTES */}
            {showEscapeRoutes && (
              <g className="transition-opacity duration-300">
                <line x1="320" y1="435" x2="256" y2="435" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowEscape)" />
                <line x1="256" y1="430" x2="256" y2="60" stroke="#10b981" strokeWidth="3.5" strokeDasharray="7 4" markerEnd="url(#arrowEscape)" />
                <line x1="500" y1="331" x2="265" y2="331" stroke="#10b981" strokeWidth="3" strokeDasharray="5 3" markerEnd="url(#arrowEscape)" />
                <text x="272" y="270" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  PRIMARY HOIST ESCAPEWAY
                </text>
              </g>
            )}

            {/* SENSOR NODES OVERLAYS with larger icon bounds */}
            {showSensors &&
              sensors.map((s) => {
                const cx = (s.x / 100) * 820 + 50;
                const cy = (s.y / 100) * 450 + 30;
                const isSelected = selectedSensor?.id === s.id;
                const strokeColor =
                  s.severity === 'red' ? '#f43f5e' : s.severity === 'yellow' ? '#f59e0b' : '#10b981';

                return (
                  <g
                    key={s.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onMouseEnter={() => setHoveredSensor(s)}
                    onMouseLeave={() => setHoveredSensor(null)}
                    onClick={() => setSelectedSensor(isSelected ? null : s)}
                  >
                    <rect
                      x={cx - 12}
                      y={cy - 12}
                      width="24"
                      height="24"
                      rx="5"
                      fill="#1c1917"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                    />
                    <circle cx={cx} cy={cy} r="4" fill={strokeColor} />
                    <text
                      x={cx}
                      y={cy + 22}
                      fill="#f5f5f4"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {s.id}
                    </text>
                  </g>
                );
              })}

            {/* RECOMMENDED SAFE ESCAPE / RESCUE ROUTE (Green low-hazard corridor) */}
            {(showEscapeRoutes || appMode === 'rescue') && (
              <g className="transition-opacity duration-300">
                {/* Surface to Level -120m */}
                <path
                  d="M 100 70 L 160 120 L 290 125"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="8,6"
                  className="animate-pulse opacity-90"
                />
                {/* Level -120m to Level -240m Haulage (Safe draft) */}
                <path
                  d="M 290 125 L 340 180 L 410 230 L 460 230"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="8,6"
                  className="animate-pulse opacity-90"
                />
                {/* Level -240m to Level -380m via North bypass avoiding active face */}
                <path
                  d="M 460 230 L 510 280 L 480 340 L 420 340"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="8,6"
                  className="animate-pulse opacity-90"
                />
                {/* Lower descent towards muster station */}
                <path
                  d="M 420 340 L 380 400 L 440 435"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="6,4"
                  className="animate-pulse opacity-80"
                />
                <text
                  x="200"
                  y="105"
                  fill="#34d399"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  🟢 RECOMMENDED LOW-AFFECTED SAFE ROUTE
                </text>
              </g>
            )}

            {/* RESCUE MISSION TARGET TRAJECTORY VECTORS - AT WHICH MINER RESCUE TEAMS ARE GOING */}
            {showRescueUnits &&
              rescueTeams.map((rt) => {
                if (!rt.targetMiner) return null;
                const rCx = (rt.x / 100) * 820 + 50;
                const rCy = (rt.y / 100) * 450 + 30;
                const targetWorker = workers.find(
                  (w) => w.id === rt.targetMiner.minerId || w.tagId === rt.targetMiner.tagId
                );
                if (!targetWorker) return null;
                const tCx = (targetWorker.x / 100) * 820 + 50;
                const tCy = (targetWorker.y / 100) * 450 + 30;
                const midX = (rCx + tCx) / 2;
                const midY = (rCy + tCy) / 2 - 16;
                const isSelected = selectedRescueTeam?.id === rt.id || selectedWorkerId === targetWorker.id;
                const strokeColor = rt.id === 'R01' ? '#f59e0b' : '#10b981';
                const markerId = rt.id === 'R01' ? 'url(#arrowRescueAmber)' : 'url(#arrowRescueEmerald)';

                return (
                  <g
                    key={`rescue-vector-${rt.id}`}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedRescueTeam(isSelected ? null : rt)}
                  >
                    {/* Glowing highlight path */}
                    <line
                      x1={rCx}
                      y1={rCy}
                      x2={tCx}
                      y2={tCy}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 4 : 2.5}
                      strokeDasharray="6 4"
                      strokeOpacity={isSelected ? 0.95 : 0.75}
                      markerEnd={markerId}
                      className="animate-pulse"
                    />

                    {/* Concentric rings around target miner highlighting rescue destination */}
                    <circle
                      cx={tCx}
                      cy={tCy}
                      r="22"
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      strokeOpacity="0.85"
                      className="animate-pulse"
                    />

                    {/* Callout badge along trajectory vector: R01 ➔ M007 */}
                    <rect
                      x={midX - 78}
                      y={midY - 10}
                      width="156"
                      height="20"
                      rx="5"
                      fill="#0c0a09"
                      fillOpacity="0.95"
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      fill={strokeColor}
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {rt.id} ➔ {rt.targetMiner.tagId} ({rt.targetMiner.minerName.split(' ')[0]}) • {rt.targetMiner.distanceMeters}m | ~{rt.targetMiner.etaMinutes}m
                    </text>
                  </g>
                );
              })}

            {/* RESCUE TEAMS LOCATION TRACKING (R01, R02) */}
            {showRescueUnits &&
              rescueTeams.map((rt) => {
                const cx = (rt.x / 100) * 820 + 50;
                const cy = (rt.y / 100) * 450 + 30;
                const isSelected = selectedRescueTeam?.id === rt.id;

                return (
                  <g
                    key={rt.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedRescueTeam(isSelected ? null : rt)}
                  >
                    {/* Outer radar pulse */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill="#ffffff"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                    {/* White transponder disk with bold dark border */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="8"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      className="drop-shadow-lg"
                    />
                    {/* Rescue Callout Label */}
                    <rect
                      x={cx - 44}
                      y={cy - 28}
                      width="88"
                      height="17"
                      rx="4"
                      fill="#0f172a"
                      stroke={isSelected ? '#38bdf8' : '#64748b'}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    <text
                      x={cx}
                      y={cy - 16}
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      🛡️ {rt.id} ({rt.name.includes('West') ? 'WEST' : 'EAST'})
                    </text>
                  </g>
                );
              })}

            {/* RESCUE ROBOT SCOUT (ROBOT-Alpha UGV with LiDAR & Thermal FLIR) */}
            {showRescueUnits &&
              rescueRobots.map((bot) => {
                const cx = (bot.x / 100) * 820 + 50;
                const cy = (bot.y / 100) * 450 + 30;
                const isSelected = selectedRobot?.robotId === bot.robotId;

                return (
                  <g
                    key={bot.robotId}
                    className="cursor-pointer"
                    onClick={() => setSelectedRobot(isSelected ? null : bot)}
                  >
                    {/* 360° LiDAR scanning field */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="30"
                      fill="#06b6d4"
                      fillOpacity="0.1"
                      stroke="#06b6d4"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                    {/* Robot core icon */}
                    <rect
                      x={cx - 10}
                      y={cy - 10}
                      width="20"
                      height="20"
                      rx="5"
                      fill="#0891b2"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle cx={cx} cy={cy} r="3" fill="#22d3ee" className="animate-pulse" />
                    {/* Robot Badge */}
                    <rect
                      x={cx - 45}
                      y={cy + 14}
                      width="90"
                      height="16"
                      rx="4"
                      fill="#083344"
                      stroke="#06b6d4"
                      strokeWidth="1"
                    />
                    <text
                      x={cx}
                      y={cy + 25}
                      fill="#22d3ee"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      🤖 {bot.robotId}
                    </text>
                  </g>
                );
              })}

            {/* UNDERGROUND VEHICLES ON MAP */}
            {showVehicles &&
              vehicles.map((veh) => {
                const cx = (veh.x / 100) * 820 + 50;
                const cy = (veh.y / 100) * 450 + 30;
                const isSelected = selectedVehicle?.vehicleId === veh.vehicleId;
                const isWarning = veh.antiCollisionRadarStatus === 'warning';

                return (
                  <g
                    key={veh.vehicleId}
                    className="cursor-pointer"
                    onClick={() => setSelectedVehicle(isSelected ? null : veh)}
                  >
                    {/* Anti-collision radar radius field */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isWarning ? 22 : 16}
                      fill={isWarning ? '#f59e0b' : '#38bdf8'}
                      fillOpacity={isWarning ? 0.25 : 0.15}
                      stroke={isWarning ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="1.5"
                      strokeDasharray={isWarning ? '3,3' : undefined}
                      className={isWarning ? 'animate-pulse' : ''}
                    />
                    {/* Vehicle body capsule */}
                    <rect
                      x={cx - 11}
                      y={cy - 9}
                      width="22"
                      height="18"
                      rx="4"
                      fill="#0284c7"
                      stroke={isSelected ? '#ffffff' : '#38bdf8'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      className="drop-shadow-md"
                    />
                    {/* Wheels */}
                    <rect x={cx - 9} y={cy - 11} width="5" height="3" rx="1" fill="#0f172a" />
                    <rect x={cx + 4} y={cy - 11} width="5" height="3" rx="1" fill="#0f172a" />
                    <rect x={cx - 9} y={cy + 8} width="5" height="3" rx="1" fill="#0f172a" />
                    <rect x={cx + 4} y={cy + 8} width="5" height="3" rx="1" fill="#0f172a" />
                    {/* Cab window */}
                    <rect x={cx - 7} y={cy - 6} width="14" height="6" rx="2" fill="#e0f2fe" fillOpacity="0.8" />
                    {/* Vehicle ID & Speed badge */}
                    <rect
                      x={cx - 36}
                      y={cy + 13}
                      width="72"
                      height="15"
                      rx="3"
                      fill="#082f49"
                      stroke="#38bdf8"
                      strokeWidth="1"
                    />
                    <text
                      x={cx}
                      y={cy + 24}
                      fill="#e0f2fe"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      🚜 {veh.vehicleId} • {veh.speedKmh}k
                    </text>
                  </g>
                );
              })}

            {/* WORKERS LOCATION MARKERS with larger pins and tags */}
            {showWorkers &&
              workers.map((w) => {
                const cx = (w.x / 100) * 820 + 50;
                const cy = (w.y / 100) * 450 + 30;
                const isHovered = hoveredWorker?.id === w.id;
                const isSelected = selectedWorkerId === w.id;
                const color =
                  w.zoneSeverity === 'red'
                    ? '#f43f5e'
                    : w.zoneSeverity === 'yellow'
                    ? '#f59e0b'
                    : '#10b981';

                return (
                  <g
                    key={w.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredWorker(w)}
                    onMouseLeave={() => setHoveredWorker(null)}
                    onClick={() => onSelectWorker?.(isSelected ? null : w)}
                  >
                    {/* Worker pulse halo */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered || isSelected || w.sosActive ? 18 : 10}
                      fill={color}
                      fillOpacity={isHovered || isSelected ? 0.5 : 0.3}
                      className={w.zoneSeverity === 'red' || w.sosActive ? 'animate-ping' : ''}
                    />
                    {/* Worker solid pin */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="6.5"
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* Worker Callsign tag (M001, M002, M003 SOS) */}
                    <rect
                      x={cx - 24}
                      y={cy - 24}
                      width="48"
                      height="16"
                      rx="3"
                      fill={w.sosActive ? '#991b1b' : '#1c1917'}
                      stroke={w.sosActive ? '#f87171' : '#78716c'}
                      strokeWidth="1"
                    />
                    <text
                      x={cx}
                      y={cy - 12}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {w.sosActive ? `🚨 ${w.tagId}` : w.tagId}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>
      </div>

      {/* DEDICATED SEVERITY & ENTITY LEGEND (MOVED OFF CANVAS - UNOBSTRUCTED) */}
      <div className="px-4 py-3 bg-stone-950 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <span className="font-bold text-white uppercase tracking-wider text-xs">
            Zone Severity:
          </span>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 border border-emerald-400"></span>
            <span className="text-emerald-300">Green (Safe Range)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs bg-amber-500 border border-amber-400"></span>
            <span className="text-amber-300">Yellow (Caution / Elevated Gas)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs bg-rose-500 border border-rose-400"></span>
            <span className="text-rose-300">Red (Severe Hazard / Evacuate)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-stone-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
            Miners (M001-M008)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400"></span>
            Sensors
          </span>
          <span className="flex items-center gap-1.5 text-sky-300 font-bold">
            <span>🚜</span>
            Vehicles ({vehicles.length})
          </span>
          <span className="flex items-center gap-1.5 text-white font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-900"></span>
            Rescue Teams ({rescueTeams.length} Rescuers)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <span>🤖</span>
            Rescue Robots ({rescueRobots.length} UGVs)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-3 h-0.5 bg-emerald-400 border-t border-dashed"></span>
            Safe Route
          </span>
          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Layers className="w-3 h-3 text-amber-400" />
            Strata G1-G5
          </span>
          <span className="flex items-center gap-1.5 text-teal-300 font-bold">
            <Wind className="w-3 h-3 text-teal-400" />
            Boreholes
          </span>
          <span className="flex items-center gap-1.5 text-rose-300 font-bold">
            <Flame className="w-3 h-3 text-rose-400" />
            Gas Outlets (Flare/Scrubber)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Compass className="w-3 h-3 text-cyan-400" />
            Drill Rigs
          </span>
        </div>
      </div>

      {/* Selected / Hovered Worker Details Bar in Dark Theme */}
      {activeWorker && (
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-col gap-2.5 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  activeWorker.zoneSeverity === 'red'
                    ? 'bg-rose-500 animate-pulse'
                    : activeWorker.zoneSeverity === 'yellow'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-white text-base">{activeWorker.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono text-xs border border-stone-700">
                    {activeWorker.tagId}
                  </span>
                  <span className="text-stone-400 font-medium">({activeWorker.role})</span>
                </div>
                <div className="text-stone-400 text-xs sm:text-sm flex items-center gap-2 mt-0.5">
                  <span>Location: <strong className="text-stone-200">{activeWorker.zoneName}</strong></span>
                  <span>•</span>
                  <span>Last Ping: {activeWorker.lastPing}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-1.5 text-rose-300 bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-800/60">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{activeWorker.heartRate} bpm</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800/60">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span>{activeWorker.bodyTemp}°C</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/60">
                <Battery className="w-4 h-4 text-emerald-400" />
                <span>{activeWorker.battery}%</span>
              </div>
              <div className="text-stone-300 px-2.5 py-1 rounded-md bg-stone-850 border border-stone-700">
                Zone: <strong className="uppercase">{activeWorker.zoneSeverity}</strong>
              </div>
            </div>
          </div>

          {/* If an inbound rescue team is dispatched to this miner */}
          {activeWorker.assignedRescueTeam && (
            <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-stone-900/60 p-2.5 rounded-lg border border-amber-500/30">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-bold text-2xs animate-pulse">
                  🚑 INBOUND RESCUE TEAM
                </span>
                <span className="text-amber-300">
                  Unit: <strong className="text-white">{activeWorker.assignedRescueTeam.teamName}</strong> ({activeWorker.assignedRescueTeam.rescuerLead})
                </span>
              </div>
              <div className="flex items-center gap-3 text-stone-300 flex-wrap">
                <span>Distance: <strong className="text-amber-400">{activeWorker.assignedRescueTeam.distanceMeters}m</strong></span>
                <span>ETA: <strong className="text-emerald-400">~{activeWorker.assignedRescueTeam.etaMinutes} min</strong></span>
                <span className="text-stone-400 hidden md:inline">Status: {activeWorker.assignedRescueTeam.status}</span>
                {rescueTeams.find((rt) => rt.id === activeWorker.assignedRescueTeam?.teamId) && (
                  <button
                    type="button"
                    onClick={() => {
                      const matchedTeam = rescueTeams.find((rt) => rt.id === activeWorker.assignedRescueTeam?.teamId);
                      if (matchedTeam) setSelectedRescueTeam(matchedTeam);
                    }}
                    className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-sky-300 border border-sky-600 transition-colors ml-auto text-2xs font-bold"
                  >
                    🛡️ Track Inbound Team ({activeWorker.assignedRescueTeam.teamId})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Rescue Team Member Full Detail View */}
      {selectedRescueTeam && (
        <div className="p-4 bg-stone-950 border-t-2 border-sky-500 flex flex-col gap-3 text-sm animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-base">{selectedRescueTeam.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 font-mono text-xs border border-sky-700">
                    {selectedRescueTeam.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-mono text-xs border border-emerald-800 uppercase font-bold">
                    {selectedRescueTeam.status}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  Role: <strong className="text-white">{selectedRescueTeam.role}</strong> • Depth: <span className="text-stone-300">{selectedRescueTeam.depthM}m</span>
                </p>
                <p className="text-xs text-sky-300 mt-0.5 flex items-center gap-1 font-mono">
                  <span>📍 Tactical Position:</span>
                  <strong>{selectedRescueTeam.location}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm">
              {/* SCBA Oxygen Level */}
              <div className="bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 flex items-center gap-2">
                <span className="text-stone-400 text-xs">SCBA O₂:</span>
                <span className={`font-bold ${selectedRescueTeam.scbaOxygenRemainingPct > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedRescueTeam.scbaOxygenRemainingPct}%
                </span>
                <div className="w-16 h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${selectedRescueTeam.scbaOxygenRemainingPct}%` }}
                  />
                </div>
              </div>

              {/* Heart Rate */}
              <div className="bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 flex items-center gap-1.5 text-rose-300">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{selectedRescueTeam.heartRate} bpm</span>
              </div>

              {/* Ambient Rescuer Gas Envelope */}
              <div className="bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-300 flex items-center gap-2 text-xs">
                <span>Rescuer Env:</span>
                <span className="text-emerald-400">CH₄ {selectedRescueTeam.ambientGas.ch4Pct}%</span>
                <span>•</span>
                <span className="text-amber-400">CO {selectedRescueTeam.ambientGas.coPpm}ppm</span>
                <span>•</span>
                <span className="text-sky-400">O₂ {selectedRescueTeam.ambientGas.o2Pct}%</span>
              </div>

              {/* Comm Status */}
              <div className="bg-emerald-950/60 px-2.5 py-1.5 rounded-xl border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-1 font-bold">
                <Radio className="w-3.5 h-3.5" />
                <span>COMMS OPTIMAL</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRescueTeam(null)}
                className="text-stone-400 hover:text-white px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors ml-1"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* DEDICATED ASSIGNED TARGET MINER NAVIGATION VECTOR */}
          {selectedRescueTeam.targetMiner && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-2xs">
                  🎯 AT WHICH MINER TEAM IS GOING
                </span>
                <span className="text-stone-200">
                  Heading to: <strong className="text-amber-300 text-sm">{selectedRescueTeam.targetMiner.minerName} ({selectedRescueTeam.targetMiner.tagId} - {selectedRescueTeam.targetMiner.role})</strong>
                </span>
                <span className="text-stone-400">
                  📍 {selectedRescueTeam.targetMiner.currentLocation}
                </span>
              </div>

              <div className="flex items-center gap-3 text-stone-300 flex-wrap">
                <span>Distance: <strong className="text-amber-400 text-sm">{selectedRescueTeam.targetMiner.distanceMeters}m</strong></span>
                <span>ETA: <strong className="text-emerald-400 text-sm">~{selectedRescueTeam.targetMiner.etaMinutes} min</strong></span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-2xs font-bold animate-pulse">
                  {selectedRescueTeam.targetMiner.minerStatus.toUpperCase()} DISTRESS
                </span>
                {workers.find((w) => w.id === selectedRescueTeam.targetMiner.minerId || w.tagId === selectedRescueTeam.targetMiner.tagId) && (
                  <button
                    type="button"
                    onClick={() => {
                      const tw = workers.find((w) => w.id === selectedRescueTeam.targetMiner.minerId || w.tagId === selectedRescueTeam.targetMiner.tagId);
                      if (tw && onSelectWorker) onSelectWorker(tw);
                    }}
                    className="px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors ml-auto shadow-sm"
                  >
                    🎯 Focus Target Miner ({selectedRescueTeam.targetMiner.tagId})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Rescue Robot Full Detail View */}
      {selectedRobot && (
        <div className="p-4 bg-stone-950 border-t-2 border-cyan-500 flex flex-col gap-3 text-sm animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-base">{selectedRobot.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-700">
                    {selectedRobot.robotId}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-900/60 text-cyan-200 font-mono text-xs border border-cyan-700 uppercase font-bold">
                    {selectedRobot.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-cyan-300 mt-1 font-mono">
                  📍 Location: <strong className="text-white">{selectedRobot.tunnelLocation}</strong> • Depth: {selectedRobot.depthM}m
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs sm:text-sm">
              <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
                FLIR Temp: <strong className="text-amber-400">{selectedRobot.flirThermalTempC}°C</strong>
              </span>
              <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
                LiDAR Clearance: <strong className="text-emerald-400">{selectedRobot.lidarObstacleClearanceM}m</strong>
              </span>
              <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
                Battery: <strong className="text-cyan-400">{selectedRobot.batteryPct}%</strong>
              </span>
              <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
                Sniffer: <strong className="text-rose-400">CH₄ {selectedRobot.gasSniffer.ch4Pct}%</strong> | <strong className="text-amber-400">CO {selectedRobot.gasSniffer.coPpm}ppm</strong> | <strong className="text-sky-400">NO₂ {selectedRobot.gasSniffer.no2Ppm}</strong> | <strong className="text-teal-400">SO₂ {selectedRobot.gasSniffer.so2Ppm}</strong>
              </span>
              <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-cyan-300 font-bold">
                Video: 1080p IR {selectedRobot.videoStreamStatus.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => setSelectedRobot(null)}
                className="text-stone-400 hover:text-white px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors ml-1"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Robot Scouting Ahead for Target Miner */}
          {selectedRobot.scoutingForMiner && (
            <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-400 text-stone-950 font-bold text-2xs">
                  🤖 SCOUTING LEAD
                </span>
                <span className="text-stone-200">
                  Scouting for: <strong className="text-cyan-300">{selectedRobot.scoutingForMiner.minerName} ({selectedRobot.scoutingForMiner.tagId})</strong>
                </span>
                <span className="text-stone-400">
                  📍 {selectedRobot.scoutingForMiner.currentLocation}
                </span>
              </div>
              <div className="flex items-center gap-3 text-stone-300">
                <span>Distance: <strong className="text-cyan-400">{selectedRobot.scoutingForMiner.distanceMeters}m</strong></span>
                <span>ETA: <strong className="text-emerald-400">~{selectedRobot.scoutingForMiner.etaMinutes} min</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Underground Vehicle Full Detail View */}
      {selectedVehicle && (
        <div className="p-4 bg-stone-950 border-t-2 border-sky-500 flex flex-wrap items-center justify-between gap-4 text-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-base">{selectedVehicle.type}</span>
                <span className="px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 font-mono text-xs border border-sky-700">
                  {selectedVehicle.vehicleId}
                </span>
                <span className={`px-2 py-0.5 rounded-md font-mono text-xs uppercase font-bold ${
                  selectedVehicle.status === 'yellow' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  Status: {selectedVehicle.status}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                Operator: <strong className="text-white">{selectedVehicle.operator}</strong> • Level: <span className="text-stone-200">{selectedVehicle.level}</span>
              </p>
              <p className="text-xs text-sky-300 mt-0.5 font-mono">
                📍 Location: <strong>{selectedVehicle.location}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs sm:text-sm">
            <span className="bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-200 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-sky-400" />
              Speed: <strong className="text-sky-300 text-sm">{selectedVehicle.speedKmh} km/h</strong>
            </span>
            <span className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
              selectedVehicle.antiCollisionRadarStatus === 'warning'
                ? 'bg-amber-950/60 border-amber-700 text-amber-300 animate-pulse'
                : 'bg-stone-900 border-stone-800 text-emerald-400'
            }`}>
              <Activity className="w-4 h-4" />
              Radar: <strong>{selectedVehicle.antiCollisionRadarStatus.toUpperCase()}</strong>
            </span>
            <span className="bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-300">
              Proximity Alerts: <strong className={selectedVehicle.proximityAlerts > 0 ? 'text-amber-400' : 'text-emerald-400'}>{selectedVehicle.proximityAlerts}</strong>
            </span>
            <span className="bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-300">
              Brakes: <strong className="text-emerald-400">{selectedVehicle.brakeStatus.toUpperCase()}</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedVehicle(null)}
              className="text-stone-400 hover:text-white px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors ml-1"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Selected Geological Strata Detail Panel */}
      {selectedStrata && (
        <div className="p-4 bg-stone-950 border-t-2 border-amber-500 flex flex-wrap items-center justify-between gap-4 text-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-xl text-white font-bold text-xs border flex items-center justify-center min-w-[38px]"
              style={{ backgroundColor: selectedStrata.colorHex, borderColor: '#fbbf24' }}
            >
              {selectedStrata.code}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-base">{selectedStrata.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono text-xs border border-stone-700">
                  {selectedStrata.depthRangeM[0]}m to -{selectedStrata.depthRangeM[1]}m
                </span>
                <span className={`px-2 py-0.5 rounded-md font-mono text-xs uppercase font-bold ${
                  selectedStrata.digitalTwinPrediction.riskSeverity === 'red'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : selectedStrata.digitalTwinPrediction.riskSeverity === 'yellow'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  Predicted Anomaly: {selectedStrata.digitalTwinPrediction.abnormalityRisk}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                Lithology: <strong className="text-white">{selectedStrata.lithologyType}</strong> • Lead Time: <strong className="text-amber-300">{selectedStrata.digitalTwinPrediction.earlyWarningLeadTimeHrs}h</strong> • Failure Prob: <strong className="text-rose-400">{selectedStrata.digitalTwinPrediction.failureProbabilityPct}%</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs sm:text-sm">
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              RQD: <strong className="text-amber-300">{selectedStrata.rqdPct}%</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              UCS: <strong className="text-stone-100">{selectedStrata.ucsMpa} MPa</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              CH₄ Content: <strong className={selectedStrata.gasContentM3PerTon > 8 ? 'text-rose-400' : 'text-stone-300'}>{selectedStrata.gasContentM3PerTon} m³/t</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              Creep: <strong className="text-amber-300">{selectedStrata.strataCreepVelocityMmDay} mm/d</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedStrata(null)}
              className="text-stone-400 hover:text-white px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors ml-1"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Selected Borehole Detail Panel */}
      {selectedBorehole && (
        <div className="p-4 bg-stone-950 border-t-2 border-teal-500 flex flex-wrap items-center justify-between gap-4 text-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-base">{selectedBorehole.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 font-mono text-xs border border-teal-700">
                  {selectedBorehole.id}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono text-xs border border-stone-700 uppercase font-bold">
                  {selectedBorehole.type.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                Connected Level: <strong className="text-white">{selectedBorehole.connectedLevelName}</strong> • Depth: -{selectedBorehole.targetDepthM}m (Ø{selectedBorehole.diameterMm}mm)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs sm:text-sm">
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              Flow Rate: <strong className="text-cyan-300">{selectedBorehole.gasExtractionFlowM3Min} m³/min</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              Suction: <strong className="text-emerald-300">{selectedBorehole.suctionPressureKpa} kPa</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              CH₄ Purity: <strong className="text-rose-400">{selectedBorehole.methanePurityPct}%</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              Damper: <strong className="text-amber-300">{selectedBorehole.damperPositionPct}%</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedBorehole(null)}
              className="text-stone-400 hover:text-white px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors ml-1"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Selected Surface Gas Evacuation Outlet Detail Panel */}
      {selectedOutlet && (
        <div className="p-4 bg-stone-950 border-t-2 border-rose-500 flex flex-wrap items-center justify-between gap-4 text-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-base">{selectedOutlet.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 font-mono text-xs border border-rose-700">
                  {selectedOutlet.id}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono text-xs border border-stone-700">
                  {selectedOutlet.type}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                Collar Location: <strong className="text-white">{selectedOutlet.location}</strong> • Plume Status: <strong className="text-emerald-400 uppercase">{selectedOutlet.plumeStatus.replace(/_/g, ' ')}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs sm:text-sm">
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              Exhaust Rate: <strong className="text-cyan-300">{selectedOutlet.exhaustRateM3Min} m³/min</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              CH₄ Concentration: <strong className="text-rose-400">{selectedOutlet.ch4EvacuatedPct}%</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              Fan: <strong className="text-stone-300">{selectedOutlet.fanSpeedRpm} RPM</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedOutlet(null)}
              className="text-stone-400 hover:text-white px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors ml-1"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Selected Drilling Rig Detail Panel */}
      {selectedRig && (
        <div className="p-4 bg-stone-950 border-t-2 border-cyan-500 flex flex-wrap items-center justify-between gap-4 text-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-base">{selectedRig.name} ({selectedRig.model})</span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-700">
                  {selectedRig.rigId}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-800 text-amber-300 font-mono text-xs border border-stone-700">
                  Bit at -{selectedRig.currentDepthM.toFixed(1)}m
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                Intercepted Strata: <strong className="text-cyan-300">{selectedRig.currentLayerName}</strong> • Target Depth: -{selectedRig.targetDepthM}m
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs sm:text-sm">
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              ROP: <strong className="text-cyan-300">{selectedRig.ropMetersPerHour} m/hr</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              Torque: <strong className="text-amber-400">{selectedRig.torqueKNm} kNm</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              WOB: <strong className="text-stone-300">{selectedRig.weightOnBitKN} kN</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-200">
              Mud CH₄: <strong className="text-rose-400">{selectedRig.mudGasReturnCh4Pct}%</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedRig(null)}
              className="text-stone-400 hover:text-white px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors ml-1"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Selected Sensor Node Detail View in Dark Theme */}
      {selectedSensor && (
        <div className="p-4 bg-stone-950 border-t border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-bold text-white text-base">{selectedSensor.name} ({selectedSensor.id})</span>
              <p className="text-xs text-stone-400">{selectedSensor.level} • Battery {selectedSensor.battery}%</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm">
            <span className="bg-stone-900 px-2.5 py-1 rounded-md border border-stone-800 text-stone-200">
              Temp: <strong className="text-amber-400">{selectedSensor.temperature}°C</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-md border border-stone-800 text-stone-200">
              RH: <strong className="text-sky-400">{selectedSensor.humidity}%</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-md border border-stone-800 text-stone-200">
              BC Dust: <strong className="text-amber-300">{selectedSensor.dust} μg/m³</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-md border border-stone-800 text-stone-200">
              Air Flow: <strong className="text-teal-400">{selectedSensor.airflow} m/s</strong>
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-md border border-stone-800 text-stone-200">
              Water: <strong className="text-blue-400">{selectedSensor.water} cm</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedSensor(null)}
              className="text-stone-400 hover:text-white px-2 py-1 ml-2"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
