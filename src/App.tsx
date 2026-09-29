/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_SAFETY_LAYERS,
  INITIAL_GAS_READINGS,
  INITIAL_MINE_ZONES,
  INITIAL_WORKERS,
  INITIAL_SENSOR_NODES,
  INITIAL_COMM_NODES,
  INITIAL_ALERTS,
  INITIAL_ROOF_METRICS,
  INITIAL_SEISMIC_METRICS,
  INITIAL_VEHICLE_METRICS,
  INITIAL_MACHINE_METRICS,
  INITIAL_AI_ANOMALIES,
  INITIAL_AI_PREDICTIONS,
  INITIAL_AI_RISK_SCORE,
  INITIAL_RESCUE_MISSION,
  INITIAL_GEOLOGICAL_DIGITAL_TWIN,
} from './data/mineData';
import {
  SafetyLayerData,
  GasReading,
  MineZone,
  Worker,
  SensorNode,
  CommunicationNode,
  SystemAlert,
  SeverityLevel,
  SafetyLayerType,
  RoofStabilityMetric,
  SeismicActivityMetric,
  VehicleSafetyMetric,
  MachineHealthMetric,
  AIAnomalyDetection,
  AIHazardPrediction,
  AIRiskScoreClassification,
  EmergencyRescueMission,
  GeologicalDigitalTwinData,
  DrillingIntervalRecord,
} from './types';
import { Header } from './components/Header';
import { SeverityOverview } from './components/SeverityOverview';
import { MineMap } from './components/MineMap';
import { SafetyLayersPanel } from './components/SafetyLayersPanel';
import { GasMonitoringPanel } from './components/GasMonitoringPanel';
import { WorkersLocationPanel } from './components/WorkersLocationPanel';
import { CommunicationStatusPanel } from './components/CommunicationStatusPanel';
import { AutomaticAlertsBanner } from './components/AutomaticAlertsBanner';
import { EnvironmentalResearchCharts } from './components/EnvironmentalResearchCharts';
import { GroundEquipmentPanel } from './components/GroundEquipmentPanel';
import { HumanSafetyPanel } from './components/HumanSafetyPanel';
import { AIIntelligencePanel } from './components/AIIntelligencePanel';
import { EmergencyRescuePanel } from './components/EmergencyRescuePanel';
import { GeologicalDigitalTwinPanel } from './components/GeologicalDigitalTwinPanel';
import { EmergencyModal } from './components/EmergencyModal';
import { playAlertTone } from './utils/audioAlert';
import {
  ShieldCheck,
  Mountain,
  Users,
  BrainCircuit,
  LifeBuoy,
  Layers,
  Sparkles,
  Activity,
  AlertTriangle,
  Compass,
  Wind,
} from 'lucide-react';

export default function App() {
  // Layer 1: Environmental & Gas
  const [layers, setLayers] = useState<SafetyLayerData[]>(INITIAL_SAFETY_LAYERS);
  const [gasReadings, setGasReadings] = useState<GasReading[]>(INITIAL_GAS_READINGS);
  const [zones, setZones] = useState<MineZone[]>(INITIAL_MINE_ZONES);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [sensors, setSensors] = useState<SensorNode[]>(INITIAL_SENSOR_NODES);
  const [commNodes, setCommNodes] = useState<CommunicationNode[]>(INITIAL_COMM_NODES);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);

  // Layer 2: Ground & Equipment
  const [roofMetrics, setRoofMetrics] = useState<RoofStabilityMetric[]>(INITIAL_ROOF_METRICS);
  const [seismicMetrics, setSeismicMetrics] = useState<SeismicActivityMetric[]>(INITIAL_SEISMIC_METRICS);
  const [vehicleMetrics, setVehicleMetrics] = useState<VehicleSafetyMetric[]>(INITIAL_VEHICLE_METRICS);
  const [machineMetrics, setMachineMetrics] = useState<MachineHealthMetric[]>(INITIAL_MACHINE_METRICS);

  // Layer 4: Artificial Intelligence
  const [aiAnomalies, setAiAnomalies] = useState<AIAnomalyDetection[]>(INITIAL_AI_ANOMALIES);
  const [aiPredictions, setAiPredictions] = useState<AIHazardPrediction[]>(INITIAL_AI_PREDICTIONS);
  const [aiRiskScore, setAiRiskScore] = useState<AIRiskScoreClassification>(INITIAL_AI_RISK_SCORE);

  // Layer 5: Rescue & Emergency Response
  const [rescueMission, setRescueMission] = useState<EmergencyRescueMission>(INITIAL_RESCUE_MISSION);

  // Layer-Wise Geological Digital Twin, Drilling Telemetry & Borehole Ventilation
  const [geologicalData, setGeologicalData] = useState<GeologicalDigitalTwinData>(INITIAL_GEOLOGICAL_DIGITAL_TWIN);

  // Main Dashboard View Selector ('layers' | 'geological_twin' | 'alerts' | 'analytics' | 'rescue')
  // Layer 5 rescue kept at last
  const [activeMainTab, setActiveMainTab] = useState<'layers' | 'geological_twin' | 'alerts' | 'analytics' | 'rescue'>('layers');

  // Active Safety Layer Focus Tab (1 | 2 | 3 | 4 | 'all')
  const [activeLayerTab, setActiveLayerTab] = useState<1 | 2 | 3 | 4 | 'all'>(1);

  // Filter & Navigation states
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<SeverityLevel | 'all'>('all');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<SafetyLayerType | undefined>(undefined);

  // System states (Dark theme default)
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [simPreset, setSimPreset] = useState<'normal' | 'yellow_dust' | 'red_emergency'>('yellow_dust');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isEvacuating, setIsEvacuating] = useState<boolean>(false);

  // Count active alerts by severity
  const alertsCount = {
    red: alerts.filter((a) => !a.acknowledged && a.severity === 'red').length,
    yellow: alerts.filter((a) => !a.acknowledged && a.severity === 'yellow').length,
    green: alerts.filter((a) => a.severity === 'green').length,
  };

  // Switch simulation state when preset changes
  useEffect(() => {
    if (simPreset === 'normal') {
      setLayers(INITIAL_SAFETY_LAYERS.map((l) => ({ ...l, severity: 'green' })));
      setGasReadings(INITIAL_GAS_READINGS.map((g) => ({ ...g, severity: 'green' })));
      setZones(INITIAL_MINE_ZONES.map((z) => ({ ...z, severity: 'green', primaryHazard: undefined })));
      setWorkers((prev) => prev.map((w) => ({ ...w, zoneSeverity: 'green' })));
      setSensors((prev) => prev.map((s) => ({ ...s, severity: 'green' })));
      if (audioEnabled) playAlertTone('green');
    } else if (simPreset === 'yellow_dust') {
      setLayers((prev) =>
        prev.map((l) => {
          if (l.id === 'dust') {
            return {
              ...l,
              currentValue: 42.1,
              severity: 'yellow',
              changeRate: '+4.5 μg/hr',
            };
          }
          if (l.id === 'airflow') {
            return {
              ...l,
              currentValue: 1.4,
              severity: 'yellow',
              changeRate: '-0.3 m/s',
            };
          }
          return { ...l, severity: 'green' };
        })
      );
      setGasReadings(INITIAL_GAS_READINGS);
      setZones((prev) =>
        prev.map((z) => {
          if (z.id === 'zone-3') {
            return {
              ...z,
              severity: 'yellow',
              primaryHazard: 'Elevated BC880 dust & localized air friction',
            };
          }
          return { ...z, severity: 'green' };
        })
      );
      setWorkers((prev) =>
        prev.map((w) => ({
          ...w,
          zoneSeverity: w.zoneId === 'zone-3' ? 'yellow' : 'green',
        }))
      );
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          severity: s.zoneId === 'zone-3' ? 'yellow' : 'green',
        }))
      );
      if (audioEnabled) playAlertTone('yellow');
    } else if (simPreset === 'red_emergency') {
      setLayers((prev) =>
        prev.map((l) => {
          if (l.id === 'water') {
            return {
              ...l,
              currentValue: 74.5,
              severity: 'red',
              changeRate: '+12.4 cm/hr',
            };
          }
          if (l.id === 'temperature') {
            return {
              ...l,
              currentValue: 34.2,
              severity: 'red',
              changeRate: '+2.1°C/hr',
            };
          }
          if (l.id === 'smoke') {
            return {
              ...l,
              currentValue: 2.8,
              severity: 'red',
              changeRate: '+0.8 %/m',
            };
          }
          return l;
        })
      );
      setGasReadings((prev) =>
        prev.map((g) => {
          if (g.id === 'ch4') {
            return {
              ...g,
              currentValue: 1.35,
              severity: 'red',
              statusText: 'CRITICAL EXPLOSION THRESHOLD (>1.25% CUT-OFF)',
            };
          }
          if (g.id === 'co') {
            return {
              ...g,
              currentValue: 62.0,
              severity: 'red',
              statusText: 'TOXIC ACCUMULATION DETECTED',
            };
          }
          return g;
        })
      );
      setZones((prev) =>
        prev.map((z) => {
          if (z.id === 'zone-4') {
            return {
              ...z,
              severity: 'red',
              primaryHazard: 'Methane surge (1.35%) & Sump flooding (74.5 cm)',
            };
          }
          if (z.id === 'zone-3') {
            return {
              ...z,
              severity: 'yellow',
            };
          }
          return z;
        })
      );
      setWorkers((prev) =>
        prev.map((w) => ({
          ...w,
          zoneSeverity: w.zoneId === 'zone-4' ? 'red' : w.zoneId === 'zone-3' ? 'yellow' : 'green',
          heartRate: w.zoneId === 'zone-4' ? 112 : w.heartRate,
        }))
      );
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          severity: s.zoneId === 'zone-4' ? 'red' : s.zoneId === 'zone-3' ? 'yellow' : 'green',
        }))
      );
      setAlerts((prev) => {
        if (prev.some((a) => a.id === 'ALT-999')) return prev;
        return [
          {
            id: 'ALT-999',
            timestamp: 'NOW',
            severity: 'red',
            title: 'CRITICAL METHANE & WATER INUNDATION BREACH',
            location: 'Zone Delta (Level -500m Deep Sump)',
            sensorLayer: 'Gas & Water Sensors',
            value: 'CH₄ 1.35% | Sump 74.5cm',
            threshold: '> 1.25% LEL / > 60cm Danger',
            acknowledged: false,
            autoTriggerAction: 'Substation power isolated & primary dewatering pump 3 triggered',
          },
          ...prev,
        ];
      });
      if (audioEnabled) playAlertTone('red');
    }
  }, [simPreset, audioEnabled]);

  // Subtle telemetry jitter every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => {
          const deltaTemp = (Math.random() - 0.5) * 0.2;
          const deltaDust = (Math.random() - 0.5) * 0.4;
          return {
            ...s,
            temperature: +(s.temperature + deltaTemp).toFixed(1),
            dust: Math.max(0, +(s.dust + deltaDust).toFixed(1)),
          };
        })
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    if (audioEnabled) playAlertTone('green');
  };

  const handlePingWorker = (workerId: string) => {
    if (audioEnabled) playAlertTone('yellow');
  };

  // Layer 3 Handlers: SOS Distress & Fall Detection
  const handleTriggerSOS = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              sosActive: true,
              status: 'sos',
              zoneSeverity: 'red',
              motionlessDurationSec: 65,
              fallDetected: true,
            }
          : w
      )
    );
    const miner = workers.find((w) => w.id === workerId);
    setAlerts((prev) => [
      {
        id: `ALT-SOS-${Date.now().toString().slice(-4)}`,
        timestamp: 'JUST NOW',
        severity: 'red',
        title: `EMERGENCY SOS DISTRESS: MINER ${miner?.tagId || workerId} (${miner?.name})`,
        location: miner?.zoneName || 'Deep Mine Sump Gallery',
        sensorLayer: 'Layer 3: Human Safety Wearable',
        value: `HR: ${miner?.heartRate || 116} bpm | Fall Motionless 65s`,
        threshold: 'Immediate Underground Rescue Dispatch',
        acknowledged: false,
        autoTriggerAction: 'Incident location logged & UGV Sentinel-Alpha robot alerted',
      },
      ...prev,
    ]);
    if (audioEnabled) playAlertTone('red');
  };

  const handleResolveSOS = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              sosActive: false,
              status: 'active',
              motionlessDurationSec: 0,
              fallDetected: false,
            }
          : w
      )
    );
    if (audioEnabled) playAlertTone('green');
  };

  // Layer 5 Handlers: Emergency Mission, Robotics & Server Alerts
  const handleToggleEmergencyMode = () => {
    const nextState = !rescueMission.active;
    setRescueMission((prev) => ({
      ...prev,
      active: nextState,
      missionPhase: nextState ? 'INCIDENT_DETECTED' : 'STANDBY',
    }));
    if (nextState) {
      if (audioEnabled) playAlertTone('red');
      setIsEmergencyModalOpen(true);
    } else {
      if (audioEnabled) playAlertTone('green');
    }
  };

  const handleDeployRobot = () => {
    setRescueMission((prev) => ({
      ...prev,
      missionPhase: 'ROBOT_SCOUTING',
      rescueRobots: prev.rescueRobots.map((bot) => ({
        ...bot,
        status: 'autonomous_scouting',
        tunnelLocation: 'Level -500m Sump Incline Ch 540m (Scouting)',
      })),
      serverDispatchedAlerts: [
        `[${new Date().toLocaleTimeString()}] SERVER DIRECTIVE: UGV Sentinel-Alpha rerouted ahead of crew. Scanning with FLIR & sniffer.`,
        ...prev.serverDispatchedAlerts,
      ],
    }));
    if (audioEnabled) playAlertTone('yellow');
  };

  const handleDispatchServerAlert = (alertText: string) => {
    const entry = `[${new Date().toLocaleTimeString()}] SERVER BROADCAST: ${alertText}`;
    setRescueMission((prev) => ({
      ...prev,
      serverDispatchedAlerts: [entry, ...prev.serverDispatchedAlerts],
    }));
    setAlerts((prev) => [
      {
        id: `ALT-SRV-${Date.now().toString().slice(-4)}`,
        timestamp: 'JUST NOW',
        severity: 'yellow',
        title: 'CENTRAL SERVER EMERGENCY BROADCAST TO TEAMS',
        location: 'Surface Control Room SCADA Uplink',
        sensorLayer: 'Layer 5: Rescue Operations',
        value: alertText,
        threshold: 'Underground Transceiver Relay',
        acknowledged: false,
        autoTriggerAction: 'Transmitted via Leaky Feeder & LoRa underground mesh',
      },
      ...prev,
    ]);
  };

  const handleAdvanceMissionPhase = (phase: EmergencyRescueMission['missionPhase']) => {
    setRescueMission((prev) => ({
      ...prev,
      missionPhase: phase,
      serverDispatchedAlerts: [
        `[${new Date().toLocaleTimeString()}] MISSION STATUS ADVANCED: ${phase.replace(/_/g, ' ')}`,
        ...prev.serverDispatchedAlerts,
      ],
    }));
    if (phase === 'RESCUE_COMPLETED' && audioEnabled) {
      playAlertTone('green');
    }
  };

  const handleConfirmEvacuation = () => {
    setIsEvacuating(true);
    if (audioEnabled) playAlertTone('red');
    setTimeout(() => {
      setIsEvacuating(false);
      setIsEmergencyModalOpen(false);
      setAlerts((prev) => [
        {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          timestamp: 'JUST NOW',
          severity: 'red',
          title: 'MINE-WIDE EMERGENCY EVACUATION BROADCASTED',
          location: 'All Shafts & Underground Galleries',
          sensorLayer: 'Life Safety Protocol',
          value: 'Code Red',
          threshold: 'Immediate Muster',
          acknowledged: false,
          autoTriggerAction: 'Caplamp vibrators pulsed & man-riding cage summoned to -500m',
        },
        ...prev,
      ]);
    }, 1500);
  };

  // Geological Digital Twin & Drilling Handlers
  const handleToggleForcedPurge = () => {
    const nextPurge = !geologicalData.forcedGasPurgeActive;
    setGeologicalData((prev) => ({
      ...prev,
      forcedGasPurgeActive: nextPurge,
      exhaustOutlets: prev.exhaustOutlets.map((outlet) => ({
        ...outlet,
        exhaustRateM3Min: nextPurge ? +(outlet.exhaustRateM3Min * 1.6).toFixed(1) : +(outlet.exhaustRateM3Min / 1.6).toFixed(1),
        fanSpeedRpm: nextPurge ? Math.min(2200, outlet.fanSpeedRpm + 600) : Math.max(900, outlet.fanSpeedRpm - 600),
        plumeStatus: nextPurge ? 'evacuating_critical' : 'active_continuous',
      })),
      boreholes: prev.boreholes.map((bh) => ({
        ...bh,
        gasExtractionFlowM3Min: nextPurge ? +(bh.gasExtractionFlowM3Min * 1.45).toFixed(1) : +(bh.gasExtractionFlowM3Min / 1.45).toFixed(1),
        suctionPressureKpa: nextPurge ? +(bh.suctionPressureKpa * 1.3).toFixed(1) : +(bh.suctionPressureKpa / 1.3).toFixed(1),
      })),
    }));

    if (nextPurge) {
      if (audioEnabled) playAlertTone('red');
      setAlerts((prev) => [
        {
          id: `ALT-PURGE-${Date.now().toString().slice(-4)}`,
          timestamp: 'JUST NOW',
          severity: 'red',
          title: 'BOREHOLE FORCED GAS PURGE & SURFACE EVACUATION ENGAGED',
          location: 'Surface Outlets OUTLET-01 & OUTLET-02 / Boreholes BH-GAS-01 & 02',
          sensorLayer: 'Ventilation & Gas Evacuation',
          value: 'Emergency Flow Boost Active',
          threshold: 'Manual / Automatic Hazard Purge',
          acknowledged: false,
          autoTriggerAction: 'Surface flare and scrubber boosted; borehole isolation dampers driven to 100% open',
        },
        ...prev,
      ]);
    } else {
      if (audioEnabled) playAlertTone('green');
    }
  };

  const handleToggleDegasPump = () => {
    setGeologicalData((prev) => ({
      ...prev,
      degasificationPumpRunning: !prev.degasificationPumpRunning,
    }));
    if (audioEnabled) playAlertTone('yellow');
  };

  const handleAdjustBoreholeDamper = (boreholeId: string, damperPct: number) => {
    setGeologicalData((prev) => ({
      ...prev,
      boreholes: prev.boreholes.map((bh) => {
        if (bh.id !== boreholeId) return bh;
        const factor = Math.max(0.05, damperPct / 100);
        return {
          ...bh,
          damperPositionPct: damperPct,
          gasExtractionFlowM3Min: +(18.5 * factor).toFixed(1),
          suctionPressureKpa: -+(42 * factor).toFixed(1),
        };
      }),
    }));
  };

  const handleAddDrillingLog = (record: Omit<DrillingIntervalRecord, 'id' | 'timestamp'>) => {
    const newRecord: DrillingIntervalRecord = {
      ...record,
      id: `DIR-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setGeologicalData((prev) => {
      const matchedLayer = prev.strataLayers.find((l) => l.id === record.strataLayerId);
      const updatedRigs = prev.drillingRigs.map((rig) => {
        if (rig.rigId !== record.rigId) return rig;
        return {
          ...rig,
          currentDepthM: record.depthM,
          ropMetersPerHour: record.ropMetersPerHour,
          torqueKNm: record.torqueKNm,
          weightOnBitKN: record.weightOnBitKN,
          mudGasReturnCh4Pct: record.mudGasReturnCh4Pct,
          currentLayerId: record.strataLayerId,
          currentLayerName: matchedLayer?.name || rig.currentLayerName,
        };
      });

      return {
        ...prev,
        drillingLogs: [newRecord, ...prev.drillingLogs],
        drillingRigs: updatedRigs,
      };
    });

    const isAnomaly = record.strataAnomalyFlag !== 'nominal' || record.mudGasReturnCh4Pct > 2.0;
    if (isAnomaly) {
      if (audioEnabled) playAlertTone('red');
      setAlerts((prev) => [
        {
          id: `ALT-DRILL-${Date.now().toString().slice(-4)}`,
          timestamp: 'JUST NOW',
          severity: 'red',
          title: `DRILLING STRATA GAS ANOMALY: RIG ${record.rigId} AT -${record.depthM}m`,
          location: `${record.strataName} (-${record.depthM}m)`,
          sensorLayer: 'Layer-Wise Drilling Telemetry',
          value: `Mud CH₄: ${record.mudGasReturnCh4Pct}% | Anomaly: ${record.strataAnomalyFlag.replace(/_/g, ' ')}`,
          threshold: '> 2.0% CH₄ Gas Outburst Threshold',
          acknowledged: false,
          autoTriggerAction: 'Ventilation borehole dampers adjusted & surface oxidizer flare purged',
        },
        ...prev,
      ]);
    } else {
      if (audioEnabled) playAlertTone('green');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Industrial Dark Control Room Header */}
      <Header
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        simPreset={simPreset}
        setSimPreset={setSimPreset}
        onEmergencyEvacuate={() => setIsEmergencyModalOpen(true)}
        alertsCount={alertsCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* 1ST: Interactive Subsurface Mine Mapping & Real-Time Positioning */}
        <MineMap
          zones={zones}
          workers={workers}
          sensors={sensors}
          vehicles={vehicleMetrics}
          selectedZoneFilter={selectedZoneFilter}
          selectedWorkerId={selectedWorkerId}
          onSelectWorker={(w) => setSelectedWorkerId(w ? w.id : null)}
          appMode={rescueMission.active ? 'rescue' : 'normal'}
          rescueTeams={rescueMission.rescueTeams}
          rescueRobots={rescueMission.rescueRobots}
          safeRoute={rescueMission.recommendedSafeRoute}
          geologicalData={geologicalData}
          onTogglePurge={handleToggleForcedPurge}
        />

        {/* 2ND: CENTRAL OPERATIONS CONTROL NAVIGATION - BUTTON DRIVEN (Eliminates excessive scrolling & clutter) */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-3 sm:p-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Dashboard View Selector:
              </span>
              {rescueMission.active && (
                <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                  RESCUE MISSION ACTIVE
                </span>
              )}
            </div>

            {/* Quick Emergency / Standby Status Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleToggleEmergencyMode();
                  setActiveMainTab('rescue');
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border ${
                  rescueMission.active
                    ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 shadow-md animate-pulse'
                    : 'bg-stone-950 text-rose-300 border-rose-800 hover:bg-stone-850'
                }`}
              >
                {rescueMission.active ? '🚨 Active Evacuation Mode' : '🛡️ Trigger Rescue Standby'}
              </button>
            </div>
          </div>

          {/* Primary View Buttons (Layer 5 Kept at Last) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-stone-800 text-xs sm:text-sm">
            {/* Box 1: Safety Layers (1-4) */}
            <button
              type="button"
              onClick={() => setActiveMainTab('layers')}
              className={`p-3 rounded-xl border font-bold flex items-center gap-2.5 transition-all shadow-sm ${
                activeMainTab === 'layers'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 ring-2 ring-amber-400/40'
                  : 'bg-stone-950 text-amber-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              <Layers className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <div className="leading-tight">Safety Layers (1–4)</div>
                <div className="text-3xs font-normal opacity-80 mt-0.5">Gases, Strata & Wearables</div>
              </div>
            </button>

            {/* Box 2: Geological Twin & Drilling */}
            <button
              type="button"
              onClick={() => setActiveMainTab('geological_twin')}
              className={`p-3 rounded-xl border font-bold flex items-center gap-2.5 transition-all shadow-sm ${
                activeMainTab === 'geological_twin'
                  ? 'bg-teal-500 text-stone-950 border-teal-400 ring-2 ring-teal-400/40'
                  : 'bg-stone-950 text-teal-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              <Mountain className="w-5 h-5 text-teal-400 shrink-0" />
              <div className="text-left">
                <div className="leading-tight">Geological Twin & Drilling</div>
                <div className="text-3xs font-normal opacity-80 mt-0.5">Strata G1-G5, Boreholes & Outlets</div>
              </div>
            </button>

            {/* Box 3: Alerts & Zones */}
            <button
              type="button"
              onClick={() => setActiveMainTab('alerts')}
              className={`p-3 rounded-xl border font-bold flex items-center gap-2.5 transition-all shadow-sm ${
                activeMainTab === 'alerts'
                  ? 'bg-amber-600 text-white border-amber-500 ring-2 ring-amber-500/40'
                  : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <div className="leading-tight">Alerts & Zones ({alerts.filter((a) => !a.acknowledged).length})</div>
                <div className="text-3xs font-normal opacity-80 mt-0.5">Alarms & Zone Severity</div>
              </div>
            </button>

            {/* Box 4: Sensor Analytics */}
            <button
              type="button"
              onClick={() => setActiveMainTab('analytics')}
              className={`p-3 rounded-xl border font-bold flex items-center gap-2.5 transition-all shadow-sm ${
                activeMainTab === 'analytics'
                  ? 'bg-cyan-600 text-white border-cyan-500 ring-2 ring-cyan-500/40'
                  : 'bg-stone-950 text-cyan-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              <Activity className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="leading-tight">Sensor Analytics</div>
                <div className="text-3xs font-normal opacity-80 mt-0.5">Gas Trends & Mesh Comms</div>
              </div>
            </button>

            {/* Box 5 (LAST): Layer 5 Rescue & Robotics */}
            <button
              type="button"
              onClick={() => setActiveMainTab('rescue')}
              className={`p-3 rounded-xl border font-bold flex items-center gap-2.5 transition-all shadow-sm ${
                activeMainTab === 'rescue'
                  ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-500/40'
                  : 'bg-stone-950 text-rose-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              <LifeBuoy className="w-5 h-5 text-rose-300 shrink-0" />
              <div className="text-left">
                <div className="leading-tight">Layer 5: Rescue & Robotics</div>
                <div className="text-3xs font-normal opacity-80 mt-0.5">UGVs, Team & Safe Route</div>
              </div>
            </button>
          </div>

          {/* Sub-Selector when 'layers' is chosen */}
          {activeMainTab === 'layers' && (
            <div className="mt-3 pt-3 border-t border-stone-800 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-stone-400 font-bold mr-1">Select Layer:</span>
              <button
                type="button"
                onClick={() => setActiveLayerTab(1)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                  activeLayerTab === 1
                    ? 'bg-teal-500 text-stone-950 border-teal-400'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Layer 1: Environmental Gases
              </button>
              <button
                type="button"
                onClick={() => setActiveLayerTab(2)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                  activeLayerTab === 2
                    ? 'bg-amber-500 text-stone-950 border-amber-400'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:text-white'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                Layer 2: Ground Strata & Fleet
              </button>
              <button
                type="button"
                onClick={() => setActiveLayerTab(3)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                  activeLayerTab === 3
                    ? 'bg-rose-500 text-stone-950 border-rose-400'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Layer 3: Human Safety & Wearables
              </button>
              <button
                type="button"
                onClick={() => setActiveLayerTab(4)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                  activeLayerTab === 4
                    ? 'bg-cyan-500 text-stone-950 border-cyan-400'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:text-white'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                Layer 4: AI Hazard Detection
              </button>
              <button
                type="button"
                onClick={() => setActiveLayerTab('all')}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                  activeLayerTab === 'all'
                    ? 'bg-stone-700 text-white border-stone-600'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                All 4 Layers
              </button>
            </div>
          )}
        </div>

        {/* 1. SAFETY LAYERS TAB VIEW: FOCUSED LAYER BY LAYER */}
        {activeMainTab === 'layers' && (
          <div className="space-y-6">
            {/* LAYER 1: ENVIRONMENTAL SENSORS & GAS MONITORING */}
            {(activeLayerTab === 'all' || activeLayerTab === 1) && (
              <div className="space-y-6">
                <SafetyLayersPanel
                  layers={layers}
                  selectedLayerId={selectedLayerId}
                  onLayerSelect={setSelectedLayerId}
                />
                <GasMonitoringPanel gasReadings={gasReadings} />
              </div>
            )}

            {/* LAYER 2: GROUND AND EQUIPMENT */}
            {(activeLayerTab === 'all' || activeLayerTab === 2) && (
              <div className="space-y-6">
                <div className="bg-stone-900/80 rounded-xl p-4 border border-teal-500/30 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      <Mountain className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Layer-Wise Geological Digital Twin & Strata Abnormality Model</div>
                      <div className="text-xs text-stone-400">Deep stratigraphic layers G1–G5, drill rig telemetries, ventilation boreholes & gas evacuation outlets</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMainTab('geological_twin')}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-stone-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    Open Geological Twin & Drilling View →
                  </button>
                </div>
                <GroundEquipmentPanel
                  roofMetrics={roofMetrics}
                  seismicMetrics={seismicMetrics}
                  vehicleMetrics={vehicleMetrics}
                  machineMetrics={machineMetrics}
                />
              </div>
            )}

            {/* LAYER 3: HUMAN SAFETY */}
            {(activeLayerTab === 'all' || activeLayerTab === 3) && (
              <div className="space-y-6">
                <HumanSafetyPanel
                  workers={workers}
                  onTriggerSOS={handleTriggerSOS}
                  onResolveSOS={handleResolveSOS}
                  onSelectWorker={(w) => setSelectedWorkerId(w.id)}
                  selectedWorkerId={selectedWorkerId}
                />
                <WorkersLocationPanel
                  workers={workers}
                  selectedWorkerId={selectedWorkerId}
                  onSelectWorker={(w) => setSelectedWorkerId(w ? w.id : null)}
                  onPingWorker={handlePingWorker}
                />
              </div>
            )}

            {/* LAYER 4: INTELLIGENCE (AI BASED) */}
            {(activeLayerTab === 'all' || activeLayerTab === 4) && (
              <AIIntelligencePanel
                anomalies={aiAnomalies}
                predictions={aiPredictions}
                riskScore={aiRiskScore}
              />
            )}
          </div>
        )}

        {/* GEOLOGICAL DIGITAL TWIN, DRILLING TELEMETRY & BOREHOLE VENTILATION */}
        {activeMainTab === 'geological_twin' && (
          <div className="space-y-6">
            <GeologicalDigitalTwinPanel
              data={geologicalData}
              onToggleForcedPurge={handleToggleForcedPurge}
              onToggleDegasPump={handleToggleDegasPump}
              onAdjustBoreholeDamper={handleAdjustBoreholeDamper}
              onAddDrillingLog={handleAddDrillingLog}
            />
          </div>
        )}

        {/* 2. ALERTS TAB VIEW: AUTOMATIC ALERTS BANNER & SEVERITY OVERVIEW */}
        {activeMainTab === 'alerts' && (
          <div className="space-y-6">
            <AutomaticAlertsBanner
              alerts={alerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onTriggerEvacuate={() => setIsEmergencyModalOpen(true)}
              audioEnabled={audioEnabled}
            />

            <SeverityOverview
              zones={zones}
              workers={workers}
              selectedZoneFilter={selectedZoneFilter}
              onSelectZoneFilter={setSelectedZoneFilter}
            />
          </div>
        )}

        {/* 3. SENSOR ANALYTICS TAB VIEW: RECHARTS & COMMS MESH */}
        {activeMainTab === 'analytics' && (
          <div className="space-y-6">
            <EnvironmentalResearchCharts />
            <CommunicationStatusPanel commNodes={commNodes} />
          </div>
        )}

        {/* 4 (LAST). RESCUE TAB VIEW: LAYER 5 RESCUE & ROBOTICS */}
        {activeMainTab === 'rescue' && (
          <EmergencyRescuePanel
            mission={rescueMission}
            onToggleEmergencyMode={handleToggleEmergencyMode}
            onDeployRobot={handleDeployRobot}
            onDispatchServerAlert={handleDispatchServerAlert}
            onAdvanceMissionPhase={handleAdvanceMissionPhase}
          />
        )}

        {/* Footer with statutory compliance notice in dark theme */}
        <footer className="pt-6 pb-10 border-t border-stone-800 text-center text-xs sm:text-sm text-stone-400 font-mono space-y-1.5">
          <div className="font-semibold text-stone-300">
            MineGuard SIH26039 Underground Mine Safety, Monitoring & Rescue System
          </div>
          <div>
            Government of Jharkhand • Department of Mines & Geology • In Accordance with Coal Mines Regulations (CMR) 2017 & DGMS Safety Circulars
          </div>
        </footer>
      </main>

      {/* Emergency Evacuation Dialog */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        workers={workers}
        zones={zones}
        onConfirmEvacuation={handleConfirmEvacuation}
        isEvacuating={isEvacuating}
      />
    </div>
  );
}
