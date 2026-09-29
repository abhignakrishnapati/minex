import React, { useState } from 'react';
import {
  Users,
  Search,
  Heart,
  Thermometer,
  Battery,
  Radio,
  MapPin,
  Filter,
  Volume2
} from 'lucide-react';
import { Worker, SeverityLevel } from '../types';

interface WorkersLocationPanelProps {
  workers: Worker[];
  selectedWorkerId?: string | null;
  onSelectWorker?: (worker: Worker | null) => void;
  onPingWorker?: (workerId: string) => void;
}

export const WorkersLocationPanel: React.FC<WorkersLocationPanelProps> = ({
  workers,
  selectedWorkerId,
  onSelectWorker,
  onPingWorker,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.zoneName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || w.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roles = Array.from(new Set(workers.map((w) => w.role)));

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Underground Personnel Tracking & Biometric Telemetry
            </h2>
            <span className="text-xs sm:text-sm font-mono px-2.5 py-1 rounded-md bg-stone-800 text-stone-200 border border-stone-700">
              {workers.length} Miners Logged Below Ground
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Active RFID transponders & smart caplamp health stats across all 4 mine depth levels
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search miner or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-400 text-xs sm:text-sm w-44 sm:w-56"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400"
          >
            <option value="all">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredWorkers.map((worker) => {
          const isSelected = selectedWorkerId === worker.id;
          const isRed = worker.zoneSeverity === 'red';
          const isYellow = worker.zoneSeverity === 'yellow';

          return (
            <div
              key={worker.id}
              onClick={() => onSelectWorker?.(isSelected ? null : worker)}
              className={`rounded-xl p-4 border transition-all cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-amber-400 border-amber-400 bg-stone-850'
                  : isRed
                  ? 'border-rose-600/80 bg-rose-950/40 hover:bg-rose-950/60 shadow-md shadow-rose-950/40'
                  : isYellow
                  ? 'border-amber-600/70 bg-amber-950/30 hover:bg-amber-950/50'
                  : 'border-stone-800 bg-stone-950/70 hover:border-stone-700 hover:bg-stone-950/90'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      isRed ? 'bg-rose-500 animate-pulse' : isYellow ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base">{worker.name}</h3>
                    <p className="text-xs text-stone-400">{worker.role}</p>
                  </div>
                </div>

                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-stone-850 text-stone-300 border border-stone-700">
                  {worker.tagId}
                </span>
              </div>

              {/* Location & Sector */}
              <div className="text-xs sm:text-sm text-stone-300 mb-3 flex items-center gap-1.5 font-mono">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="truncate">{worker.zoneName}</span>
              </div>

              {/* Vital Biometrics with larger font */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-stone-900 border border-stone-800 text-xs sm:text-sm font-mono mb-3">
                <div className="text-center">
                  <span className="text-stone-400 block text-[11px]">Heart Rate</span>
                  <strong className="text-rose-400 flex items-center justify-center gap-1 mt-0.5">
                    <Heart className="w-3.5 h-3.5" />
                    {worker.heartRate}
                  </strong>
                </div>
                <div className="text-center border-x border-stone-800">
                  <span className="text-stone-400 block text-[11px]">Temp</span>
                  <strong className="text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                    <Thermometer className="w-3.5 h-3.5" />
                    {worker.bodyTemp}°C
                  </strong>
                </div>
                <div className="text-center">
                  <span className="text-stone-400 block text-[11px]">Caplamp</span>
                  <strong className="text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <Battery className="w-3.5 h-3.5" />
                    {worker.battery}%
                  </strong>
                </div>
              </div>

              {/* Ping Caplamp Button */}
              <div className="flex items-center justify-between pt-1 text-xs text-stone-400">
                <span>Last Ping: {worker.lastPing}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPingWorker?.(worker.id);
                  }}
                  className="px-2.5 py-1 text-xs font-mono font-semibold rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  Ping Caplamp
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
