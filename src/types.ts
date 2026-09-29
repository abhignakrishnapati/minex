export type SeverityLevel = 'green' | 'yellow' | 'red';
export type AppMode = 'normal' | 'rescue';

export interface Worker {
  id: string;
  name: string;
  tagId: string;
  role: 'Driller' | 'Ventilation Tech' | 'Blaster' | 'Geologist' | 'Electrical Eng' | 'Shift Supervisor';
  zoneId: string;
  zoneName: string;
  level: string; // e.g., 'Level -240m'
  x: number; // Map percentage 0-100
  y: number; // Map percentage 0-100
  status: 'active' | 'still' | 'alert' | 'sos';
  heartRate: number; // bpm
  bodyTemp: number; // °C
  battery: number; // %
  lastPing: string;
  zoneSeverity: SeverityLevel;
  fallDetected?: boolean;
  sosActive?: boolean;
  motionlessDurationSec?: number;
  lastKnownPosition?: string;
  assignedRescueTeam?: {
    teamId: string;
    teamName: string;
    rescuerLead: string;
    etaMinutes: number;
    distanceMeters: number;
    status: string;
  };
}

export type SafetyLayerType = 'temperature' | 'humidity' | 'dust' | 'airflow' | 'water' | 'smoke';

export interface SafetyLayerData {
  id: SafetyLayerType;
  layerNumber: number;
  name: string;
  unit: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  safeRange: [number, number];
  cautionRange: [number, number];
  dangerRange: [number, number];
  severity: SeverityLevel;
  changeRate: string; // e.g., "+0.4/hr"
  sensorCount: number;
  activeSensors: number;
  description: string;
  regulationStandard: string; // e.g., "DGMS / NIOSH Safe Limit"
}

// 8 Atmospheric Gases (including CH4, CO, O2, CO2, H2S, NO, NO2, SO2)
export interface GasReading {
  id: string;
  formula: string;
  name: string;
  currentValue: number;
  unit: string;
  safeThreshold: number;
  warningThreshold: number;
  dangerThreshold: number;
  severity: SeverityLevel;
  statusText: string;
}

// Layer 2: Ground & Equipment Safety
export interface RoofStabilityMetric {
  sensorId: string;
  location: string;
  convergenceRateMmPerDay: number; // mm/day
  rockBoltTensionKn: number; // kN
  delaminationRisk: 'low' | 'moderate' | 'high' | 'critical';
  boreholeExtensometerMm: number; // mm displacement
  status: SeverityLevel;
}

export interface SeismicActivityMetric {
  stationId: string;
  location: string;
  eventsLastHour: number;
  energyJoules: number;
  maxMagnitudeRichter: number;
  peakParticleVelocityMmS: number; // PPV mm/s
  status: SeverityLevel;
}

export interface VehicleSafetyMetric {
  vehicleId: string;
  type: 'LHD Loader' | 'Dump Truck' | 'Continuous Miner' | 'Man Transporter';
  operator: string;
  location: string;
  speedKmh: number;
  proximityAlerts: number; // anti-pinch / personnel near-miss
  antiCollisionRadarStatus: 'active' | 'warning' | 'degraded';
  brakeStatus: 'optimal' | 'service_due';
  status: SeverityLevel;
  x?: number; // Map position 0-100
  y?: number; // Map position 0-100
  level?: string;
}

export interface MachineHealthMetric {
  machineId: string;
  name: string;
  location: string;
  cutterMotorTempC: number;
  conveyorTensionKpa: number;
  vibrationRmsMmS: number;
  hydraulicOilPressureBar: number;
  operatingHours: number;
  status: SeverityLevel;
}

// Layer 4: Intelligence (AI / ML)
export interface AIAnomalyDetection {
  id: string;
  timestamp: string;
  sensorLayer: string;
  detectedPattern: string;
  confidenceScore: number; // 0-100%
  severity: SeverityLevel;
  rootCauseAnalysis: string;
}

export interface AIHazardPrediction {
  hazardType: string;
  zone: string;
  probabilityPct: number;
  forecastHorizon: string; // e.g. "Next 30 mins"
  triggerFactors: string[];
  recommendedMitigation: string;
  severity: SeverityLevel;
}

export interface AIRiskScoreClassification {
  overallMineRiskScore: number; // 0 - 100
  classification: 'Low Normal' | 'Guarded Caution' | 'Elevated Threat' | 'Severe Emergency';
  autonomousActionsTaken: string[];
  neuralModelVersion: string;
}

// Layer 5: Rescue Operation & Emergency Response
export interface TargetMinerAssignment {
  minerId: string;
  minerName: string;
  tagId: string;
  role: string;
  currentLocation: string;
  depthM: number;
  distanceMeters: number;
  etaMinutes: number;
  minerStatus: 'sos' | 'trapped' | 'critical' | 'stable';
  hazardAtSite: string;
  minerVitals: {
    heartRate: number;
    motionlessSec: number;
    fallDetected: boolean;
    bodyTemp: number;
  };
  ingressVectorDescription: string;
  priorityLevel: 'CRITICAL_ALPHA' | 'CRITICAL_BRAVO' | 'STANDARD';
  assignedRobotSupport?: string;
}

export interface RescueTeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  depthM: number;
  x: number;
  y: number;
  scbaOxygenRemainingPct: number; // Self-Contained Breathing Apparatus %
  heartRate: number;
  ambientGas: {
    ch4Pct: number;
    coPpm: number;
    o2Pct: number;
  };
  commStatus: 'optimal' | 'mesh_relay' | 'weak';
  status: 'advancing' | 'on_site' | 'extracting' | 'standby';
  targetMiner: TargetMinerAssignment;
}

export interface RescueRobotTelemetry {
  robotId: string;
  name: string;
  status: 'deploying' | 'autonomous_scouting' | 'live_inspection' | 'survivor_located' | 'standby';
  batteryPct: number;
  tunnelLocation: string;
  depthM: number;
  x: number;
  y: number;
  flirThermalTempC: number;
  lidarObstacleClearanceM: number;
  gasSniffer: {
    ch4Pct: number;
    coPpm: number;
    o2Pct: number;
    no2Ppm: number;
    so2Ppm: number;
  };
  twoWayAudioActive: boolean;
  videoStreamStatus: 'online' | 'high_latency' | 'offline';
  cameraAngleDeg: number;
  tractionMotorTorqueNm: number;
  scoutingForMiner?: TargetMinerAssignment;
}

export interface SafeRouteSegment {
  step: number;
  from: string;
  to: string;
  distanceMeters: number;
  hazardLevel: 'safe' | 'caution' | 'danger';
  oxygenLevel: number;
  visibilityMeters: number;
  navInstructions: string;
}

export interface EmergencyRescueMission {
  missionId: string;
  active: boolean;
  incidentLocation: string;
  affectedZoneId: string;
  affectedZoneName: string;
  incidentType: string;
  timeElapsed: string;
  criticalReadingsAtSite: {
    ch4: number;
    co: number;
    temperature: number;
    smoke: number;
    water: number;
  };
  trappedMinersCount: number;
  sosAlertsCount: number;
  recommendedSafeRoute: SafeRouteSegment[];
  rescueRobots: RescueRobotTelemetry[];
  rescueTeams: RescueTeamMember[];
  serverDispatchedAlerts: string[];
  missionPhase: 'STANDBY' | 'INCIDENT_DETECTED' | 'ROBOT_SCOUTING' | 'RESCUE_TEAM_ADVANCING' | 'EXTRACTION_IN_PROGRESS' | 'RESCUE_COMPLETED';
}

export interface MineZone {
  id: string;
  name: string;
  level: string; // e.g., '-120m Incline', '-240m Haulage'
  depth: number; // meters underground
  severity: SeverityLevel;
  workersInside: number;
  primaryHazard?: string;
  sensorsOnline: number;
  totalSensors: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface SensorNode {
  id: string;
  name: string;
  zoneId: string;
  level: string;
  x: number;
  y: number;
  temperature: number; // °C
  humidity: number; // %
  dust: number; // μg/m³
  airflow: number; // m/s
  water: number; // cm
  smoke: number; // %
  methane: number; // % LEL
  status: 'online' | 'degraded' | 'offline';
  battery: number;
  severity: SeverityLevel;
}

export interface CommunicationNode {
  id: string;
  name: string;
  type: 'Gateway' | 'Mesh Repeater' | 'Fiber Switch' | 'VLF Backup';
  location: string;
  status: 'online' | 'degraded' | 'offline';
  rssi: number; // -dBm (e.g. -68 dBm)
  latencyMs: number;
  packetLoss: number; // %
  battery: number; // %
  connectedDevices: number;
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  severity: SeverityLevel;
  title: string;
  location: string;
  sensorLayer: string;
  value: string;
  threshold: string;
  acknowledged: boolean;
  autoTriggerAction: string;
  minerInfo?: {
    name: string;
    tagId: string;
    role: string;
    vitals?: string;
  };
  gasesAndEnv?: {
    ch4?: string;
    co?: string;
    o2?: string;
    temp?: string;
    dust?: string;
    water?: string;
    smoke?: string;
  };
}

export interface ResearchDataPoint {
  date: string;
  visibility: number; // meters
  bcConcentration: number; // μg/m³ (Black carbon / coal dust)
  relativeHumidity: number; // %
  temperature: number; // °C
  condition: 'Fog' | 'Haze' | 'Mist' | 'Clear' | 'Normal';
  severity: SeverityLevel;
}

// ==========================================================
// GEOLOGICAL NATURE DIGITAL TWIN & STRATA TYPES
// ==========================================================
export type LithologyClass =
  | 'Alluvium & Weathered Zone'
  | 'Massive Quartzitic Sandstone'
  | 'Carbonaceous Shale & Coal Seam A'
  | 'Fractured Sandy Siltstone Aquitard'
  | 'Gas-Bearing Deep Coal Seam B';

export interface GeologicalStrataLayer {
  id: string; // 'G1', 'G2', 'G3', 'G4', 'G5'
  name: string;
  code: string;
  lithologyType: LithologyClass;
  depthRangeM: [number, number]; // [topDepth, bottomDepth]
  thicknessM: number;
  colorHex: string;
  bgRgba: string;
  rqdPct: number; // Rock Quality Designation %
  ucsMpa: number; // Uniaxial Compressive Strength in MPa
  porePressureMpa: number; // In-situ Pore Pressure
  permeabilityMilliDarcy: number;
  gasContentM3PerTon: number; // In-situ gas content (m3/t)
  horizontalStressRatio: number; // K-ratio (sigma_H / sigma_v)
  strataCreepVelocityMmDay: number; // Roof/strata convergence rate
  waterIngressLpm: number;
  microseismicEventsLast24h: number;
  // Digital Twin Predictive Engine
  digitalTwinPrediction: {
    abnormalityRisk: 'Normal' | 'Elevated Creep' | 'Gas Outburst Threat' | 'Water Inrush Risk' | 'Roof Shear Risk';
    riskSeverity: SeverityLevel;
    failureProbabilityPct: number;
    earlyWarningLeadTimeHrs: number; // Lead time before major abnormality occurs
    predictedAnomalyLocation: string;
    detectedPrecursors: string[];
    mitigationAction: string;
  };
}

// ==========================================================
// DRILLING TELEMETRY & STRATA LAYER-LEVEL LOGGING TYPES
// ==========================================================
export interface DrillingIntervalRecord {
  id: string;
  timestamp: string;
  rigId: string;
  depthM: number;
  strataLayerId: string;
  strataName: string;
  lithology: string;
  ropMetersPerHour: number; // Rate of Penetration
  torqueKNm: number;
  weightOnBitKN: number; // WOB
  rpm: number;
  mudGasReturnCh4Pct: number;
  mudGasReturnCoPpm: number;
  fluidLossLpm: number;
  fractureFrequencyPerM: number;
  coreRecoveryPct: number;
  strataAnomalyFlag: 'nominal' | 'gas_pocket_intercepted' | 'void_detected' | 'hard_inclusion' | 'water_zone';
  notes: string;
}

export interface DrillingRigTelemetry {
  rigId: string;
  name: string;
  model: string;
  currentDepthM: number;
  targetDepthM: number;
  currentLayerId: string;
  currentLayerName: string;
  status: 'active_drilling' | 'casing_installation' | 'coring_sample' | 'standby';
  ropMetersPerHour: number;
  torqueKNm: number;
  weightOnBitKN: number;
  rpm: number;
  penetrationResistanceMpa: number;
  mudGasReturnCh4Pct: number;
  mudGasReturnCoPpm: number;
  vibrationG: number;
  fluidLossLpm: number;
  activeAnomalyWarning?: string;
  surfaceX: number; // Map position 0-100%
  drillStringEndX: number;
  drillStringEndY: number;
}

// ==========================================================
// BOREHOLE VENTILATION & GAS EVACUATION TYPES
// ==========================================================
export interface BoreholeVentilationNode {
  id: string; // 'BH-VENT-01', 'BH-GAS-01', 'BH-GAS-02'
  name: string;
  type: 'intake_fresh_air' | 'degasification_suction' | 'emergency_purge_exhaust';
  diameterMm: number; // e.g. 450mm
  surfaceX: number; // 0-100%
  targetDepthM: number;
  bottomX: number; // Map %
  bottomY: number; // Map %
  connectedLevelName: string;
  interceptedLayers: string[];
  suctionPressureKpa: number;
  gasExtractionFlowM3Min: number;
  methanePurityPct: number; // Methane purity at borehole head
  status: 'active_extracting' | 'forced_purge' | 'passive_vent' | 'standby';
  damperPositionPct: number; // 0-100% open
}

export interface SurfaceGasExhaustOutlet {
  id: string; // 'OUTLET-01', 'OUTLET-02'
  name: string;
  location: string;
  type: 'Methane Thermal Oxidizer / Flare' | 'Main Upcast Scrubber Fan Station';
  exhaustRateM3Min: number;
  ch4EvacuatedPct: number;
  coEvacuatedPpm: number;
  fanSpeedRpm: number;
  plumeStatus: 'nominal_exhaust' | 'high_rate_evacuation' | 'purge_active';
  surfaceX: number; // Map %
  surfaceY: number; // Map %
}

export interface GeologicalDigitalTwinData {
  strataLayers: GeologicalStrataLayer[];
  drillingRigs: DrillingRigTelemetry[];
  drillingLogs: DrillingIntervalRecord[];
  boreholes: BoreholeVentilationNode[];
  exhaustOutlets: SurfaceGasExhaustOutlet[];
  degasificationPumpActive: boolean;
  forcedGasPurgeActive: boolean;
  totalMethaneEvacuatedM3: number;
}

