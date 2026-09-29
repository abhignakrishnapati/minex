import React from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Bell,
  Volume2,
  ShieldAlert,
  Radio,
  Check,
  Zap
} from 'lucide-react';
import { SystemAlert, SeverityLevel } from '../types';

interface AutomaticAlertsBannerProps {
  alerts: SystemAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onTriggerEvacuate: () => void;
  audioEnabled: boolean;
}

export const AutomaticAlertsBanner: React.FC<AutomaticAlertsBannerProps> = ({
  alerts,
  onAcknowledgeAlert,
  onTriggerEvacuate,
  audioEnabled,
}) => {
  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const criticalRedAlerts = activeAlerts.filter((a) => a.severity === 'red');

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-stone-800 text-rose-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Automatic Alert & Emergency Response Engine
              </h2>
              {criticalRedAlerts.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-rose-600 text-white animate-pulse shadow-rose-950/50 shadow-md">
                  CRITICAL BREACH DETECTED
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              Autonomous threshold evaluation with fail-safe actuation & life-safety evacuation triggers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onTriggerEvacuate}
            className="px-4 py-2 text-xs sm:text-sm font-mono font-bold uppercase rounded-xl bg-rose-600 text-white hover:bg-rose-500 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-rose-950/60"
          >
            <ShieldAlert className="w-4 h-4" />
            Trigger Mine Evacuation
          </button>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const isRed = alert.severity === 'red';
          const isYellow = alert.severity === 'yellow';

          return (
            <div
              key={alert.id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 ${
                alert.acknowledged
                  ? 'bg-stone-950/60 border-stone-800/80 opacity-75'
                  : isRed
                  ? 'bg-rose-950/50 border-rose-600/70 ring-1 ring-rose-500/50 shadow-lg shadow-rose-950/40'
                  : isYellow
                  ? 'bg-amber-950/40 border-amber-600/60 ring-1 ring-amber-500/30'
                  : 'bg-emerald-950/30 border-emerald-600/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-1">
                  {isRed ? (
                    <AlertOctagon className="w-6 h-6 text-rose-500 animate-bounce" />
                  ) : isYellow ? (
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md uppercase ${
                        isRed
                          ? 'bg-rose-600 text-white'
                          : isYellow
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-emerald-500 text-stone-950'
                      }`}
                    >
                      {alert.severity} ALERT
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-stone-400 font-medium">
                      {alert.timestamp}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white">
                      {alert.title}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-stone-300 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      Location: <strong className="text-white">{alert.location}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Layer: <strong className="text-stone-200">{alert.sensorLayer}</strong>
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                      Observed: <strong className="text-amber-300">{alert.value}</strong> (Limit: {alert.threshold})
                    </span>
                  </div>

                  {/* Miner Information if affected */}
                  {alert.minerInfo && (
                    <div className="mt-2.5 p-2 rounded-lg bg-stone-950/80 border border-stone-800 text-xs sm:text-sm">
                      <div className="text-2xs font-mono uppercase text-stone-400 font-bold mb-1 flex items-center justify-between">
                        <span>👷 Subsurface Miner On-Site:</span>
                        <span className="text-amber-400 font-bold">{alert.minerInfo.status}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
                        <span className="text-white font-bold">{alert.minerInfo.name} ({alert.minerInfo.id})</span>
                        <span className="text-stone-400">Role: <strong className="text-stone-200">{alert.minerInfo.role}</strong></span>
                        {alert.minerInfo.heartRate && (
                          <span className="text-rose-400 font-bold">♥ {alert.minerInfo.heartRate} bpm</span>
                        )}
                        <span className="text-stone-400">Sector: <strong className="text-stone-200">{alert.location}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Gas and Environmental Snapshot */}
                  {alert.gasesAndEnv && (
                    <div className="mt-2 p-2 rounded-lg bg-stone-900/90 border border-stone-800 text-xs font-mono">
                      <div className="text-2xs uppercase text-stone-400 font-bold mb-1">
                        🧪 Atmospheric & Gas Envelope at Incident Site:
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-stone-200">
                        {alert.gasesAndEnv.ch4 && (
                          <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                            CH₄: <strong className="text-rose-400">{alert.gasesAndEnv.ch4}</strong>
                          </span>
                        )}
                        {alert.gasesAndEnv.co && (
                          <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                            CO: <strong className="text-amber-400">{alert.gasesAndEnv.co}</strong>
                          </span>
                        )}
                        {alert.gasesAndEnv.o2 && (
                          <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                            O₂: <strong className="text-white">{alert.gasesAndEnv.o2}</strong>
                          </span>
                        )}
                        {alert.gasesAndEnv.no2 && (
                          <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                            NO₂: <strong className="text-amber-300">{alert.gasesAndEnv.no2}</strong>
                          </span>
                        )}
                        {alert.gasesAndEnv.so2 && (
                          <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                            SO₂: <strong className="text-amber-300">{alert.gasesAndEnv.so2}</strong>
                          </span>
                        )}
                        {alert.gasesAndEnv.temp && (
                          <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                            Temp: <strong className="text-white">{alert.gasesAndEnv.temp}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Autonomous system trigger notice */}
                  <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm font-mono text-stone-200 bg-stone-950/80 px-2.5 py-1 rounded-md border border-stone-800 w-fit">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto-Action: <strong className="text-amber-300">{alert.autoTriggerAction}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 flex items-center gap-2">
                {!alert.acknowledged ? (
                  <button
                    type="button"
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-3.5 py-1.5 text-xs sm:text-sm font-mono font-semibold rounded-lg bg-stone-800 text-stone-100 hover:bg-stone-700 hover:text-white border border-stone-700 transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-xs sm:text-sm font-mono text-stone-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Acknowledged
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
