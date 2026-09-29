import React from 'react';
import {
  Shield,
  Volume2,
  VolumeX,
  AlertTriangle,
  Radio,
  Clock,
  Flame,
  Droplets,
  Wind
} from 'lucide-react';
import { SeverityLevel } from '../types';

interface HeaderProps {
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  simPreset: 'normal' | 'yellow_dust' | 'red_emergency';
  setSimPreset: (preset: 'normal' | 'yellow_dust' | 'red_emergency') => void;
  onEmergencyEvacuate: () => void;
  alertsCount: { red: number; yellow: number; green: number };
}

export const Header: React.FC<HeaderProps> = ({
  audioEnabled,
  setAudioEnabled,
  simPreset,
  setSimPreset,
  onEmergencyEvacuate,
  alertsCount,
}) => {
  return (
    <header className="bg-stone-900/95 backdrop-blur-md border-b border-stone-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-3.5 gap-y-3">
          
          {/* Brand & Project Metadata */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-stone-950 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold shadow-inner">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  MineGuard
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  SIH26039
                </span>
                <span className="inline-flex items-center text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                  Telemetry Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 font-medium mt-0.5">
                Underground Mine Safety, Monitoring & Rescue • Govt. of Jharkhand
              </p>
            </div>
          </div>

          {/* Center Severity Indicators & Shift Stats */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
              <Clock className="w-4 h-4 text-stone-400" />
              <span className="text-stone-200 font-semibold">Shift A</span>
              <span className="text-stone-600">|</span>
              <span className="text-stone-400">Depth -500m</span>
            </div>

            {/* Severity Pill Counts */}
            <div className="flex items-center gap-1.5 bg-stone-950 p-1.5 rounded-lg border border-stone-800">
              <div
                title="Red Zone Alerts (Critical Danger)"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs sm:text-sm font-mono font-bold transition-all ${
                  alertsCount.red > 0
                    ? 'bg-rose-600 text-white animate-pulse shadow-rose-900/50 shadow-md'
                    : 'bg-stone-850 text-stone-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-300"></span>
                <span>{alertsCount.red} RED</span>
              </div>
              <div
                title="Yellow Zone Alerts (Caution/Elevated)"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs sm:text-sm font-mono font-bold transition-all ${
                  alertsCount.yellow > 0
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-amber-900/40 shadow-md'
                    : 'bg-stone-850 text-stone-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-stone-950"></span>
                <span>{alertsCount.yellow} YEL</span>
              </div>
              <div
                title="Green Zone (Normal / Safe Envelopes)"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs sm:text-sm font-mono font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>SAFE</span>
              </div>
            </div>
          </div>

          {/* Right Controls: Sim preset & Emergency Evacuation */}
          <div className="flex items-center gap-2.5">
            {/* Live Scenario Selector for SIH Demonstration */}
            <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setSimPreset('normal')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  simPreset === 'normal'
                    ? 'bg-stone-800 text-white shadow-xs font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Simulate normal safe mine operations"
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setSimPreset('yellow_dust')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  simPreset === 'yellow_dust'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Simulate dust surge & ventilation drop in Face 4"
              >
                Dust Surge
              </button>
              <button
                type="button"
                onClick={() => setSimPreset('red_emergency')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  simPreset === 'red_emergency'
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Simulate methane ingress & flooding breach"
              >
                Emergency
              </button>
            </div>

            {/* Sound Mute Toggle */}
            <button
              type="button"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2.5 rounded-lg border transition-colors ${
                audioEnabled
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title={audioEnabled ? 'Auditory Siren Enabled' : 'Auditory Siren Muted'}
              aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Emergency Evacuation Button */}
            <button
              type="button"
              onClick={onEmergencyEvacuate}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-500 active:scale-95 shadow-md shadow-rose-950/50 transition-all flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Evacuate</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
