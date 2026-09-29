import React from 'react';
import { Radio, Wifi, WifiOff, Activity, ShieldCheck, Battery, Zap } from 'lucide-react';
import { CommunicationNode } from '../types';

interface CommunicationStatusPanelProps {
  commNodes: CommunicationNode[];
}

export const CommunicationStatusPanel: React.FC<CommunicationStatusPanelProps> = ({ commNodes }) => {
  const onlineCount = commNodes.filter((c) => c.status === 'online').length;
  const degradedCount = commNodes.filter((c) => c.status === 'degraded').length;
  const offlineCount = commNodes.filter((c) => c.status === 'offline').length;

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400" />
              Underground Wireless Mesh & Communication Status
            </h2>
            <span className="text-xs sm:text-sm font-mono px-2.5 py-1 rounded-md bg-stone-800 text-stone-200 border border-stone-700">
              DGMS Compliant Intrinsically Safe (IS)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Through-the-Earth (VLF), Fiber-Optic Gigabit Backhaul, and LoRaWAN underground transceivers
          </p>
        </div>

        {/* Status Count Pills */}
        <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
          <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-semibold">
            {onlineCount} Online
          </span>
          {degradedCount > 0 && (
            <span className="px-2.5 py-1 rounded-md bg-amber-950 text-amber-300 border border-amber-700/60 font-semibold">
              {degradedCount} Degraded
            </span>
          )}
          {offlineCount > 0 && (
            <span className="px-2.5 py-1 rounded-md bg-rose-950 text-rose-300 border border-rose-700/60 font-semibold">
              {offlineCount} Offline
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {commNodes.map((node) => {
          const isOnline = node.status === 'online';
          const isDegraded = node.status === 'degraded';
          const isOffline = node.status === 'offline';

          return (
            <div
              key={node.id}
              className={`rounded-xl p-4 border transition-all ${
                isOffline
                  ? 'border-rose-600 bg-rose-950/40'
                  : isDegraded
                  ? 'border-amber-600/70 bg-amber-950/30'
                  : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-md ${
                      isOffline ? 'bg-rose-900 text-rose-300' : 'bg-stone-800 text-amber-400'
                    }`}
                  >
                    {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                  </div>
                  <span className="font-bold text-white text-sm sm:text-base">{node.name}</span>
                </div>
                <span
                  className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                    isOffline
                      ? 'bg-rose-600 text-white'
                      : isDegraded
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                  }`}
                >
                  {node.status}
                </span>
              </div>

              <div className="text-xs text-stone-400 mb-3 font-mono">
                <span>{node.type}</span> • <span>{node.level}</span>
              </div>

              {/* Stats with larger fonts */}
              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-2.5 border-t border-stone-800">
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-400">Signal RSSI:</span>
                  <strong className={node.signalStrength > -75 ? 'text-emerald-400' : 'text-amber-400'}>
                    {node.signalStrength} dBm
                  </strong>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-400">Latency:</span>
                  <strong className="text-stone-200">{node.latencyMs} ms</strong>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-400">Packet Loss:</span>
                  <strong className={node.packetLossPct > 2 ? 'text-amber-400' : 'text-emerald-400'}>
                    {node.packetLossPct}%
                  </strong>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-400">Battery Backup:</span>
                  <strong className="text-stone-200">{node.batteryPct}%</strong>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>Node ID: {node.id}</span>
                <span className="text-emerald-400 font-medium">{node.connectedClients} Clients Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
