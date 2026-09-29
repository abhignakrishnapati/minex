import React, { useState } from 'react';
import {
  LifeBuoy,
  AlertOctagon,
  Bot,
  Shield,
  Navigation,
  Radio,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  Droplets,
  Heart,
  Battery,
  Wind,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import {
  EmergencyRescueMission,
  RescueTeamMember,
  RescueRobotTelemetry,
  SafeRouteSegment
} from '../types';

interface EmergencyRescuePanelProps {
  mission: EmergencyRescueMission;
  onToggleEmergencyMode: () => void;
  onDeployRobot: () => void;
  onDispatchServerAlert: (alertText: string) => void;
  onAdvanceMissionPhase?: (phase: EmergencyRescueMission['missionPhase']) => void;
}

export const EmergencyRescuePanel: React.FC<EmergencyRescuePanelProps> = ({
  mission,
  onToggleEmergencyMode,
  onDeployRobot,
  onDispatchServerAlert,
  onAdvanceMissionPhase,
}) => {
  const [serverAlertInput, setServerAlertInput] = useState('');
  const [previewStandby, setPreviewStandby] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'route' | 'robot' | 'team' | 'alerts'>('robot');
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string>('R01');
  const [selectedRobotId, setSelectedRobotId] = useState<string>('ROBOT-Alpha');

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverAlertInput.trim()) return;
    onDispatchServerAlert(serverAlertInput.trim());
    setServerAlertInput('');
  };

  const getPhaseBadge = (phase: EmergencyRescueMission['missionPhase']) => {
    switch (phase) {
      case 'STANDBY':
        return { label: 'Standby Monitoring', color: 'bg-stone-800 text-stone-300' };
      case 'INCIDENT_DETECTED':
        return { label: 'Incident Triaged', color: 'bg-rose-950 text-rose-300 border border-rose-500' };
      case 'ROBOT_SCOUTING':
        return { label: 'Robot Scouting Active', color: 'bg-cyan-950 text-cyan-300 border border-cyan-500 animate-pulse' };
      case 'RESCUE_TEAM_ADVANCING':
        return { label: 'Rescue Teams Ingress', color: 'bg-amber-950 text-amber-300 border border-amber-500' };
      case 'EXTRACTION_IN_PROGRESS':
        return { label: 'Miners Secured', color: 'bg-purple-950 text-purple-300 border border-purple-500' };
      case 'RESCUE_COMPLETED':
        return { label: 'Mission Completed Successfully', color: 'bg-emerald-900 text-emerald-200 border border-emerald-400' };
      default:
        return { label: phase, color: 'bg-stone-800 text-white' };
    }
  };

  const currentPhase = getPhaseBadge(mission.missionPhase);

  // When evacuation has NOT occurred yet and not in standby preview mode
  if (!mission.active && !previewStandby) {
    return (
      <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <LifeBuoy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 border border-stone-700 uppercase font-bold">
              Layer 5 • Pre-Incident Standby Protocol
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Rescue Operations & Robotics Staging
            </h2>
            <p className="text-stone-400 text-sm mt-2 leading-relaxed">
              Rescue team location tracking (R01/R02), frontline robotic scouts (Sentinel-Alpha), low-hazard evacuation route calculation, and emergency telemetry will <strong>display immediately once an evacuation is triggered</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-left font-mono text-xs text-stone-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Emergency Staging Status:</span>
              <span className="text-emerald-400 font-bold">ARMED & MONITORING</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Rescue Teams Ready:</span>
              <span className="text-white">R01 (Team Alpha Leader), R02 (Paramedic)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Autonomous Rescue Scout:</span>
              <span className="text-cyan-400">UGV Sentinel-Alpha (Armed with FLIR & LiDAR)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onToggleEmergencyMode}
              className="px-5 py-3 rounded-xl font-mono text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 flex items-center gap-2 transition-all"
            >
              <AlertOctagon className="w-5 h-5" />
              🚨 TRIGGER MINE-WIDE EVACUATION & DEPLOY RESCUE
            </button>
            <button
              type="button"
              onClick={() => setPreviewStandby(true)}
              className="px-4 py-3 rounded-xl font-mono text-sm font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
            >
              👁️ Preview Rescue Operations Console
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-4 sm:p-6 shadow-2xl transition-all ${
      mission.active
        ? 'bg-stone-900 border-rose-600 ring-2 ring-rose-600/30'
        : 'bg-stone-900 border-stone-800'
    }`}>
      {/* Header: Emergency Alarm & Evacuation Command */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className={`p-2 rounded-lg ${mission.active ? 'bg-rose-600 text-white animate-bounce' : 'bg-stone-800 text-rose-400'}`}>
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Layer 5: Emergency Response, Evacuation & Rescue Robotics
            </h2>
            <span className={`text-xs sm:text-sm px-2.5 py-1 rounded-md font-mono font-bold ${currentPhase.color}`}>
              {currentPhase.label}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Incident isolation, affected zone diagnostics, rescue team tracking, robotic scouting, and real-time safe route navigation
          </p>
        </div>

        {/* Master Emergency Alarm Trigger */}
        <div className="flex items-center gap-3">
          {previewStandby && !mission.active && (
            <button
              type="button"
              onClick={() => setPreviewStandby(false)}
              className="px-3 py-2 rounded-xl font-mono text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
            >
              ↩ Return to Standby
            </button>
          )}
          <button
            type="button"
            onClick={onToggleEmergencyMode}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
              mission.active
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 animate-pulse'
                : 'bg-stone-800 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-600/50'
            }`}
          >
            <AlertOctagon className="w-5 h-5" />
            {mission.active ? '🚨 EVACUATION ALARM ACTIVE (DEACTIVATE)' : '🚨 TRIGGER MINE-WIDE EVACUATION ALARM'}
          </button>
        </div>
      </div>

      {/* Navigation Subtabs for Layer 5 Checklist */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 mb-5 overflow-x-auto text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setSelectedTab('overview')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedTab === 'overview' ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-400 hover:text-white'
          }`}
        >
          Incident Identification & Vitals
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('route')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedTab === 'route' ? 'bg-emerald-600 text-white font-semibold' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Recommended Safe Route
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('robot')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedTab === 'robot' ? 'bg-cyan-600 text-white font-semibold' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          Rescue Robots ({mission.rescueRobots.length} UGVs)
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('team')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedTab === 'team' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Rescue Teams ({mission.rescueTeams.length} Rescuers)
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('alerts')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedTab === 'alerts' ? 'bg-purple-600 text-white font-semibold' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          Server Alerts & Comms
        </button>
      </div>

      {/* 1. OVERVIEW: INCIDENT LOCATION & AFFECTED ZONE IDENTIFICATION */}
      {selectedTab === 'overview' && (
        <div className="space-y-5">
          {/* Incident Triage Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-stone-950 border border-stone-800 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                1. Incident Location & Affected Zone Identified
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {mission.incidentLocation}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mb-3">
                Nature of Incident: <span className="text-amber-300 font-medium">{mission.incidentType}</span>
              </p>

              {/* Environmental sensors information at site */}
              <div className="text-xs font-mono text-stone-400 mb-1.5 font-bold uppercase">
                Environmental Sensors Information at Affected Site:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                <div className="bg-stone-900 p-2 rounded-lg border border-rose-600/40">
                  <span className="text-stone-400 block text-2xs">CH₄ Methane:</span>
                  <span className="text-base font-bold text-rose-400">{mission.criticalReadingsAtSite.ch4}%</span>
                </div>
                <div className="bg-stone-900 p-2 rounded-lg border border-rose-600/40">
                  <span className="text-stone-400 block text-2xs">CO Carbon:</span>
                  <span className="text-base font-bold text-rose-400">{mission.criticalReadingsAtSite.co} ppm</span>
                </div>
                <div className="bg-stone-900 p-2 rounded-lg border border-amber-600/40">
                  <span className="text-stone-400 block text-2xs">Temperature:</span>
                  <span className="text-base font-bold text-amber-400">{mission.criticalReadingsAtSite.temperature}°C</span>
                </div>
                <div className="bg-stone-900 p-2 rounded-lg border border-stone-700">
                  <span className="text-stone-400 block text-2xs">Smoke Optic:</span>
                  <span className="text-base font-bold text-stone-200">{mission.criticalReadingsAtSite.smoke} OD/m</span>
                </div>
                <div className="bg-stone-900 p-2 rounded-lg border border-stone-700">
                  <span className="text-stone-400 block text-2xs">Water Depth:</span>
                  <span className="text-base font-bold text-blue-400">{mission.criticalReadingsAtSite.water} cm</span>
                </div>
              </div>
            </div>

            {/* Trapped Miners Summary */}
            <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-stone-400 uppercase tracking-wider font-bold mb-1">
                  Last Recorded Miners Location
                </div>
                <div className="text-2xl font-mono font-bold text-white mb-1 flex items-center gap-2">
                  <span className="text-rose-400">{mission.trappedMinersCount} Trapped</span>
                  <span className="text-xs font-mono text-stone-400">({mission.sosAlertsCount} SOS Active)</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono text-stone-300 mt-2">
                  <div className="p-2 bg-stone-950 rounded-lg border border-stone-800">
                    <span className="text-rose-400 font-bold block">M003: Amitabh Kumar</span>
                    <span className="text-2xs text-stone-400">📍 Cross-cut 5 Sump Chamber (-500m)</span>
                  </div>
                  <div className="p-2 bg-stone-950 rounded-lg border border-stone-800">
                    <span className="text-amber-400 font-bold block">M007: Manoj Tirkey</span>
                    <span className="text-2xs text-stone-400">📍 Pump Station 4 Bumper (-500m)</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-mono text-stone-400">
                <span>Mission Elapsed:</span>
                <span className="text-white font-bold">{mission.timeElapsed}</span>
              </div>
            </div>
          </div>

          {/* DEDICATED MATRIX: WHICH RESCUE TEAM IS GOING TO WHICH MINER */}
          <div className="p-4 sm:p-5 rounded-xl bg-stone-950 border-2 border-amber-500/40 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs">
                  🎯 DISPATCH MATRIX
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Target Miner Rescue Assignments — At Which Miner Rescue Teams Are Going
                  </h3>
                  <p className="text-2xs sm:text-xs text-stone-400">
                    Live subsurface navigation vectors, individual miner assignments, distances, and estimated time of arrival (ETA)
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono text-xs font-bold animate-pulse">
                2 ACTIVE EXTRACTION VECTORS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {mission.rescueTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 rounded-xl bg-stone-900 border border-amber-500/30 space-y-2.5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-mono text-xs font-bold">
                          {team.id}
                        </span>
                        <span className="font-bold text-white text-sm">{team.name.split('(')[0]}</span>
                      </div>
                      <span className="text-2xs text-stone-400 font-mono">Rescuer Role: {team.role}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-2xs font-mono font-bold bg-stone-950 text-emerald-400 border border-emerald-800">
                      O₂ {team.scbaOxygenRemainingPct}%
                    </span>
                  </div>

                  {/* Target Miner Box */}
                  <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs font-mono space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-2xs uppercase">Heading to Rescue Miner:</span>
                      <span className="text-rose-400 font-bold text-2xs animate-pulse">
                        {team.targetMiner.minerStatus.toUpperCase()} DISTRESS
                      </span>
                    </div>
                    <div className="text-sm font-bold text-amber-300 flex items-center justify-between">
                      <span>👤 {team.targetMiner.minerName} ({team.targetMiner.tagId})</span>
                      <span className="text-stone-400 font-normal text-xs">{team.targetMiner.role}</span>
                    </div>
                    <div className="text-2xs text-stone-300">
                      📍 Target Location: <strong className="text-white">{team.targetMiner.currentLocation}</strong>
                    </div>

                    <div className="pt-2 mt-1 border-t border-stone-800/80 grid grid-cols-2 gap-2 text-stone-300">
                      <div>
                        <span className="text-stone-500 text-3xs uppercase block">Distance Remaining:</span>
                        <strong className="text-amber-400 text-sm">{team.targetMiner.distanceMeters} meters</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 text-3xs uppercase block">Estimated Arrival:</span>
                        <strong className="text-emerald-400 text-sm">~{team.targetMiner.etaMinutes} mins</strong>
                      </div>
                    </div>

                    <div className="text-3xs text-stone-400 pt-1">
                      Vector: <span className="text-stone-300">{team.targetMiner.ingressVectorDescription}</span>
                    </div>

                    {team.targetMiner.assignedRobotSupport && (
                      <div className="text-3xs text-cyan-400 pt-0.5 flex items-center gap-1">
                        <Bot className="w-3 h-3 text-cyan-400" />
                        <span>Preceded by scout: {team.targetMiner.assignedRobotSupport}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Progression: Monitor until rescue completed successfully */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider font-bold mb-3 flex items-center justify-between">
              <span>Mission Phase Progression (Monitor Until Completion)</span>
              <span className="text-emerald-400">Live Mission Checklist</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
              {[
                { phase: 'STANDBY', label: '1. Standby' },
                { phase: 'INCIDENT_DETECTED', label: '2. Triaged' },
                { phase: 'ROBOT_SCOUTING', label: '3. Robot Scout' },
                { phase: 'RESCUE_TEAM_ADVANCING', label: '4. Rescue Ingress' },
                { phase: 'EXTRACTION_IN_PROGRESS', label: '5. Secured' },
                { phase: 'RESCUE_COMPLETED', label: '6. Success' },
              ].map((step, idx) => {
                const isActive = mission.missionPhase === step.phase;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onAdvanceMissionPhase?.(step.phase as any)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-md'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. RECOMMENDED LOW-AFFECTED SAFE ESCAPE / RESCUE ROUTE */}
      {selectedTab === 'route' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Recommended Low-Affected Safe Route & Evacuation Corridor
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/30">
              Low Toxicity & Fire Bypass Active
            </span>
          </div>

          <div className="space-y-3">
            {mission.recommendedSafeRoute.map((segment) => {
              const isDanger = segment.hazardLevel === 'danger';
              const isCaution = segment.hazardLevel === 'caution';

              return (
                <div
                  key={segment.step}
                  className={`rounded-xl p-4 border transition-all ${
                    isDanger
                      ? 'border-rose-600 bg-rose-950/30'
                      : isCaution
                      ? 'border-amber-600/70 bg-amber-950/20'
                      : 'border-emerald-600/50 bg-emerald-950/20'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-mono font-bold flex items-center justify-center border border-stone-700">
                        {segment.step}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {segment.from} <span className="text-stone-500">→</span> {segment.to}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-stone-300">{segment.distanceMeters} meters</span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase text-xs ${
                          isDanger
                            ? 'bg-rose-600 text-white'
                            : isCaution
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {segment.hazardLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200 font-medium mb-2.5">
                    🧭 <span className="text-stone-400">Navigation:</span> {segment.navInstructions}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-stone-400 pt-2 border-t border-stone-800/80">
                    <div>
                      O₂ Oxygen: <span className="text-white font-bold">{segment.oxygenLevel}%</span>
                    </div>
                    <div>
                      Visibility: <span className="text-white font-bold">{segment.visibilityMeters} meters</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RESCUE ROBOT SCOUTING */}
      {selectedTab === 'robot' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                "Instead Send Rescue Robot" — Unmanned Ground Scout (UGV)
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Dispatched ahead of human rescue teams into zero-visibility & explosive atmospheres
              </p>
            </div>

            <button
              type="button"
              onClick={onDeployRobot}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
            >
              <Play className="w-3.5 h-3.5" />
              Dispatch / Reroute UGV Sentinel-Alpha
            </button>
          </div>

          {/* Robot Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-950 rounded-xl border border-stone-800">
            {mission.rescueRobots.map((bot) => {
              const isSelected = selectedRobotId === bot.robotId;
              return (
                <button
                  key={bot.robotId}
                  type="button"
                  onClick={() => setSelectedRobotId(bot.robotId)}
                  className={`px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-stone-950 shadow-md ring-2 ring-cyan-400/40'
                      : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>🤖</span>
                  <span>{bot.name}</span>
                  <span className="text-3xs px-2 py-0.5 rounded bg-stone-950 text-cyan-300 border border-cyan-800">
                    {bot.batteryPct}% BAT
                  </span>
                </button>
              );
            })}
          </div>

          {mission.rescueRobots
            .filter((bot) => bot.robotId === selectedRobotId)
            .map((bot) => (
            <div key={bot.robotId} className="p-5 rounded-xl bg-stone-950 border border-cyan-500/40">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-white">{bot.name}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      {bot.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 font-mono mt-1">
                    Tunnel Location: <span className="text-stone-200">{bot.tunnelLocation}</span> (Depth: -{bot.depthM}m)
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
                    <span className="text-stone-400">Battery: </span>
                    <span className="text-emerald-400 font-bold">{bot.batteryPct}%</span>
                  </div>
                  <div className="bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
                    <span className="text-stone-400">Video Stream: </span>
                    <span className="text-cyan-400 font-bold uppercase">{bot.videoStreamStatus}</span>
                  </div>
                </div>
              </div>

              {/* Real-time Robotic Sensors: Thermal FLIR, LiDAR, Gas Sniffer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Thermal FLIR */}
                <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800">
                  <div className="text-xs font-mono text-amber-400 font-bold mb-1">
                    FLIR Thermal Imager
                  </div>
                  <div className="text-2xl font-mono font-bold text-white mb-1">
                    {bot.flirThermalTempC}°C
                  </div>
                  <p className="text-2xs text-stone-400">
                    Thermal hot-spot detection calibrated for body heat signatures & smoldering coal
                  </p>
                </div>

                {/* LiDAR Obstacle Clearance */}
                <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800">
                  <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                    360° 3D LiDAR Scanner
                  </div>
                  <div className="text-2xl font-mono font-bold text-white mb-1">
                    {bot.lidarObstacleClearanceM} m
                  </div>
                  <p className="text-2xs text-stone-400">
                    Clearance ahead: Passage navigable for tracked crawler through roof debris
                  </p>
                </div>

                {/* Robotic Gas Sniffer Array */}
                <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800">
                  <div className="text-xs font-mono text-rose-400 font-bold mb-1">
                    Robot Environmental Gas Sniffer
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-mono text-stone-200">
                    <div>CH₄: <span className="font-bold text-rose-400">{bot.gasSniffer.ch4Pct}%</span></div>
                    <div>CO: <span className="font-bold text-rose-400">{bot.gasSniffer.coPpm}</span></div>
                    <div>O₂: <span className="font-bold text-white">{bot.gasSniffer.o2Pct}%</span></div>
                    <div>NO₂: <span className="font-bold text-amber-400">{bot.gasSniffer.no2Ppm}</span></div>
                    <div>SO₂: <span className="font-bold text-amber-400">{bot.gasSniffer.so2Ppm}</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs font-mono text-stone-400 flex items-center justify-between bg-stone-900/50 px-3 py-1.5 rounded-md">
                <span>Intercom: 2-Way Audio Channel Active</span>
                <span>Traction Torque: {bot.tractionMotorTorqueNm} Nm (Crawler Track Engaged)</span>
              </div>

              {/* Scouting Target Miner Notification */}
              {bot.scoutingForMiner && (
                <div className="mt-3.5 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/50 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-400 text-stone-950 font-mono text-xs font-bold">
                        🎯 LEAD SCOUT FOR MINER
                      </span>
                      <span className="font-bold text-white text-sm">
                        {bot.scoutingForMiner.minerName} ({bot.scoutingForMiner.tagId} - {bot.scoutingForMiner.role})
                      </span>
                    </div>
                    <span className="text-2xs font-mono text-cyan-300 font-bold bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-700">
                      DISTANCE: {bot.scoutingForMiner.distanceMeters}m | ETA: ~{bot.scoutingForMiner.etaMinutes}m
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-stone-300">
                    <div>
                      📍 Location: <strong className="text-white">{bot.scoutingForMiner.currentLocation}</strong>
                    </div>
                    <div>
                      ⚠️ Site Hazard: <strong className="text-amber-300">{bot.scoutingForMiner.hazardAtSite}</strong>
                    </div>
                  </div>
                  <div className="text-2xs text-stone-400 font-mono">
                    Mission Vector: <span className="text-cyan-200">{bot.scoutingForMiner.ingressVectorDescription}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. RESCUE TEAMS LOCATION TRACKING & RESCUE TEAM ZONE MONITORING */}
      {selectedTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                Rescue Team Location Tracking & Rescuer Zone Monitoring
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Real-time positioning, SCBA oxygen supply, vitals, and atmospheric envelope around rescue teams
              </p>
            </div>
          </div>

          {/* Member Switcher Buttons to avoid side-by-side clumsiness */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-950 rounded-xl border border-stone-800">
            {mission.rescueTeams.map((t) => {
              const isSelected = selectedTeamMemberId === t.id;
              const isMedic = t.role.toLowerCase().includes('paramedic');
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTeamMemberId(t.id)}
                  className={`px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                    isSelected
                      ? isMedic
                        ? 'bg-emerald-400 text-stone-950 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-stone-900 text-stone-300 hover:text-white border border-stone-800'
                  }`}
                >
                  <span>{isMedic ? '🚑' : '🛡️'}</span>
                  <span>{t.name}</span>
                  <span className="text-3xs px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800">
                    {t.scbaOxygenRemainingPct}% O₂
                  </span>
                </button>
              );
            })}
          </div>

          {/* Focused Single Rescuer Card */}
          {mission.rescueTeams
            .filter((team) => team.id === selectedTeamMemberId)
            .map((team) => (
              <div key={team.id} className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                      {team.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base sm:text-lg">{team.name}</h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Role: <strong className="text-stone-200">{team.role}</strong> • Base: <span className="text-stone-300 font-mono">{team.location}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-400 text-stone-950 uppercase">
                    {team.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-stone-400">SCBA Oxygen Supply:</span>
                      <span className="text-lg font-bold text-emerald-400">{team.scbaOxygenRemainingPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all"
                        style={{ width: `${team.scbaOxygenRemainingPct}%` }}
                      />
                    </div>
                    <span className="text-3xs text-stone-400 mt-1 block">Est. 48 minutes breathing duration remaining</span>
                  </div>

                  <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-stone-400 block mb-1">Rescuer Heart Rate:</span>
                      <span className="text-2xl font-bold text-white flex items-center gap-1.5">
                        <Heart className="w-5 h-5 text-rose-400" />
                        {team.heartRate} <span className="text-xs font-normal text-stone-400">bpm</span>
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-2xs font-bold">
                      NORMAL VITALS
                    </span>
                  </div>
                </div>

                {/* Rescuer Zone Ambient Gas Envelope */}
                <div className="p-3.5 rounded-lg bg-stone-900 border border-stone-800 text-xs font-mono">
                  <span className="text-stone-400 block text-2xs uppercase mb-2 font-bold">
                    Rescuer Immediate Ambient Gas Envelope:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-stone-200">
                    <div className="bg-stone-950 p-2 rounded border border-stone-800">
                      <span className="text-stone-400 text-2xs block">CH₄ Methane:</span>
                      <span className="text-emerald-400 font-bold">{team.ambientGas.ch4Pct}%</span>
                    </div>
                    <div className="bg-stone-950 p-2 rounded border border-stone-800">
                      <span className="text-stone-400 text-2xs block">CO Carbon:</span>
                      <span className="text-stone-200 font-bold">{team.ambientGas.coPpm} ppm</span>
                    </div>
                    <div className="bg-stone-950 p-2 rounded border border-stone-800">
                      <span className="text-stone-400 text-2xs block">O₂ Oxygen:</span>
                      <span className="text-white font-bold">{team.ambientGas.o2Pct}%</span>
                    </div>
                    <div className="bg-stone-950 p-2 rounded border border-stone-800 flex flex-col justify-between">
                      <span className="text-stone-400 text-2xs block">Radio Comms:</span>
                      <span className="text-emerald-400 font-bold uppercase">{team.commStatus}</span>
                    </div>
                  </div>
                </div>

                {/* TARGET MINER NAVIGATION VECTOR - WHICH MINER THIS RESCUE TEAM IS GOING TO */}
                <div className="p-4 rounded-xl bg-amber-950/30 border-2 border-amber-500/60 shadow-lg space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-500/30">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs">
                        🎯 TARGET MINER
                      </span>
                      <div>
                        <span className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider block">
                          Assigned Target Miner Navigation Vector
                        </span>
                        <h4 className="text-base font-bold text-white">
                          Heading to Rescue: <span className="text-amber-400 font-mono">{team.targetMiner.minerName} ({team.targetMiner.tagId} - {team.targetMiner.role})</span>
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-mono text-xs font-bold animate-pulse">
                        {team.targetMiner.minerStatus.toUpperCase()} DISTRESS
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                        PRIORITY: {team.targetMiner.priorityLevel}
                      </span>
                    </div>
                  </div>

                  {/* Target Miner Location & ETA Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                    <div className="bg-stone-900/90 p-3 rounded-lg border border-stone-800">
                      <span className="text-stone-400 block text-2xs uppercase">Target Miner Location:</span>
                      <strong className="text-white text-sm block mt-0.5">{team.targetMiner.currentLocation}</strong>
                      <span className="text-stone-400 text-2xs">Subsurface Depth: -{team.targetMiner.depthM}m</span>
                    </div>

                    <div className="bg-stone-900/90 p-3 rounded-lg border border-stone-800">
                      <div className="flex items-center justify-between text-2xs text-stone-400 uppercase">
                        <span>Distance to Miner:</span>
                        <span className="text-amber-400 font-bold">{team.targetMiner.distanceMeters} meters</span>
                      </div>
                      <div className="text-base font-bold text-white mt-0.5">
                        ETA: <span className="text-emerald-400">~{team.targetMiner.etaMinutes} mins</span>
                      </div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(15, 100 - (team.targetMiner.distanceMeters / 60) * 100)}%` }}
                        />
                      </div>
                      <span className="text-3xs text-stone-400 block mt-1">Ingress advancing under positive ventilation</span>
                    </div>

                    <div className="bg-stone-900/90 p-3 rounded-lg border border-stone-800">
                      <span className="text-stone-400 block text-2xs uppercase">Target Miner Vitals at Site:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" /> {team.targetMiner.minerVitals.heartRate} bpm
                        </span>
                        <span className="text-amber-300 font-bold">
                          {team.targetMiner.minerVitals.bodyTemp}°C
                        </span>
                      </div>
                      <span className="text-3xs text-rose-300 block mt-1">
                        {team.targetMiner.minerVitals.fallDetected ? '⚠️ FALL CONFIRMED • ' : ''}
                        Motionless: {team.targetMiner.minerVitals.motionlessSec}s
                      </span>
                    </div>
                  </div>

                  {/* Ingress Vector & Support Robot */}
                  <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs font-mono space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="text-stone-300">
                        <span className="text-amber-400 font-bold">Tactical Ingress Vector: </span>
                        <span>{team.targetMiner.ingressVectorDescription}</span>
                      </div>
                      {team.targetMiner.assignedRobotSupport && (
                        <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-2xs font-bold whitespace-nowrap self-start sm:self-auto">
                          🤖 Preceded by: {team.targetMiner.assignedRobotSupport}
                        </span>
                      )}
                    </div>
                    <div className="text-2xs text-stone-400 pt-1 border-t border-stone-800">
                      Hazard Reported at Miner Site: <strong className="text-rose-300">{team.targetMiner.hazardAtSite}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 5. ALERTS FROM RESCUE TEAM & SEND INFORMATION FROM SERVER */}
      {selectedTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-400" />
                Alerts from Rescue Team & Server Bi-Directional Information Dispatch
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Central command server dispatch log and telemetry broadcast to underground teams
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider font-bold">
              Dispatched Server Communications & Alerts History:
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {mission.serverDispatchedAlerts.map((msg, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80 text-xs font-mono text-stone-200 flex items-start gap-2"
                >
                  <CheckCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{msg}</span>
                </div>
              ))}
            </div>

            {/* Input to send information from server */}
            <form onSubmit={handleSendAlert} className="pt-2 border-t border-stone-800 flex items-center gap-2">
              <input
                type="text"
                value={serverAlertInput}
                onChange={(e) => setServerAlertInput(e.target.value)}
                placeholder="Broadcast emergency directive from server to rescue units..."
                className="flex-1 px-3.5 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Send from Server
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
