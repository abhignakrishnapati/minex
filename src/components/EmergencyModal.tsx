import React from 'react';
import { AlertOctagon, Users, Radio, X, BellRing, PhoneCall } from 'lucide-react';
import { Worker, MineZone } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  workers: Worker[];
  zones: MineZone[];
  onConfirmEvacuation: () => void;
  isEvacuating: boolean;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  workers,
  zones,
  onConfirmEvacuation,
  isEvacuating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-stone-900 rounded-2xl border border-rose-600/70 shadow-2xl max-w-lg w-full overflow-hidden text-stone-100">
        {/* Modal Header */}
        <div className="bg-rose-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black/20 rounded-xl">
              <AlertOctagon className="w-7 h-7 animate-pulse text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">
                EMERGENCY MINE EVACUATION PROTOCOL
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 font-mono">
                DGMS Regulation 124(A) • Central Mine Safety Command
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-rose-950/60 border border-rose-600/60 rounded-xl p-3.5 text-xs sm:text-sm text-rose-200 leading-relaxed font-medium">
            This action will immediately activate all underground audio-visual sirens, pulse all miner caplamp transponders, isolate non-essential high-voltage electrical circuits, and summon the man-riding hoist cage to lowest muster depths.
          </div>

          {/* Muster count summary with larger text */}
          <div className="grid grid-cols-3 gap-2.5 text-xs sm:text-sm font-mono text-center">
            <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl">
              <span className="text-stone-400 block text-xs">Total Underground</span>
              <strong className="text-base sm:text-lg text-white font-bold">{workers.length} Miners</strong>
            </div>
            <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl">
              <span className="text-amber-400 block text-xs">Caution Zone</span>
              <strong className="text-base sm:text-lg text-amber-300 font-bold">
                {workers.filter((w) => w.zoneSeverity === 'yellow').length}
              </strong>
            </div>
            <div className="bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl">
              <span className="text-rose-400 block text-xs">Danger Zone</span>
              <strong className="text-base sm:text-lg text-rose-300 font-bold">
                {workers.filter((w) => w.zoneSeverity === 'red').length}
              </strong>
            </div>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-stone-300">
            <div className="flex items-center gap-2.5 font-mono">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>VLF & Mesh Transceiver Broadcast: <strong className="text-emerald-400">ARMED & READY</strong></span>
            </div>
            <div className="flex items-center gap-2.5 font-mono">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Mines Rescue Station (Dhanbad): <strong className="text-emerald-400">DIRECT HOTLINE READY</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-300 hover:text-white bg-stone-800 border border-stone-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmEvacuation}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-950/80 flex items-center gap-2 transition-all active:scale-95"
          >
            <BellRing className="w-4 h-4" />
            {isEvacuating ? 'EVACUATION BROADCASTING...' : 'CONFIRM & BROADCAST EVACUATION'}
          </button>
        </div>
      </div>
    </div>
  );
};
