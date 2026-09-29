import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Target,
  CheckCircle2,
  Layers,
  ArrowRight,
  Lightbulb,
  Workflow
} from 'lucide-react';
import {
  AIAnomalyDetection,
  AIHazardPrediction,
  AIRiskScoreClassification
} from '../types';

interface AIIntelligencePanelProps {
  anomalies: AIAnomalyDetection[];
  predictions: AIHazardPrediction[];
  riskScore: AIRiskScoreClassification;
}

export const AIIntelligencePanel: React.FC<AIIntelligencePanelProps> = ({
  anomalies,
  predictions,
  riskScore,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'anomalies' | 'predictions' | 'actions'>('all');

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-6 shadow-xl">
      {/* Header with AI Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Layer 4: Artificial Intelligence & Predictive Threat Engine
            </h2>
            <span className="text-xs sm:text-sm px-2.5 py-1 rounded-md font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Fully Artificial Intelligence Based
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Deep neural multi-sensor correlation, self-learning anomaly detection, probabilistic hazard forecasting, and automated risk classification
          </p>
        </div>

        {/* Model telemetry chip */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-300 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>{riskScore.neuralModelVersion}</span>
        </div>
      </div>

      {/* Top Banner: AI Risk Score Classification & Autonomous Control Bar */}
      <div className="mb-6 p-4 sm:p-5 rounded-xl bg-linear-to-r from-stone-950 via-stone-900 to-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-stone-900 border-4 border-amber-500 flex flex-col items-center justify-center text-center shadow-lg shadow-amber-500/20">
              <span className="text-xl font-mono font-bold text-white leading-none">
                {riskScore.overallMineRiskScore}
              </span>
              <span className="text-3xs font-mono text-stone-400 uppercase">/ 100</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider">
              Composite Mine Risk Classification
            </div>
            <div className="text-lg sm:text-xl font-bold text-amber-400 flex items-center gap-2">
              <span>{riskScore.classification}</span>
              <span className="px-2 py-0.5 rounded text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40">
                High Watch
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Evaluated across 28 environmental nodes, 4 depth levels, and seismic micro-stress sensors
            </p>
          </div>
        </div>

        {/* Autonomous Mitigation Executed */}
        <div className="bg-stone-900/90 p-3 rounded-lg border border-stone-800 max-w-md w-full text-xs font-mono">
          <div className="text-stone-400 font-bold mb-1.5 flex items-center gap-1.5 text-xs text-cyan-400">
            <Workflow className="w-3.5 h-3.5" />
            Autonomous Actions Executed by AI:
          </div>
          <ul className="space-y-1 text-stone-300 text-xs">
            {riskScore.autonomousActionsTaken.map((act, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="line-clamp-1">{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grid: Autonomous Detection & Hazard Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. AUTONOMOUS ANOMALY DETECTION */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                Autonomous Pattern & Anomaly Detection
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {anomalies.length} Active Correlations
            </span>
          </div>

          <div className="space-y-3">
            {anomalies.map((anm) => {
              const isRed = anm.severity === 'red';

              return (
                <div
                  key={anm.id}
                  className={`rounded-xl p-4 border transition-all ${
                    isRed
                      ? 'border-rose-600 bg-rose-950/30'
                      : 'border-amber-600/60 bg-amber-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-300">
                        {anm.id}
                      </span>
                      <span className="text-xs text-stone-400">({anm.timestamp})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-stone-400">Confidence:</span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        {anm.confidenceScore}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                    Layer: {anm.sensorLayer}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200 font-medium mb-2 leading-relaxed">
                    {anm.detectedPattern}
                  </p>

                  <div className="p-2.5 bg-stone-950/70 rounded-lg border border-stone-800/80 text-xs text-stone-300 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-200">Root Cause Diagnostics: </span>
                      {anm.rootCauseAnalysis}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. HAZARD PREDICTION & RISK FORECASTING */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                Probabilistic Hazard Prediction & Forecasts
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-400">
              Predictive Lookahead Window
            </span>
          </div>

          <div className="space-y-3">
            {predictions.map((pred, idx) => {
              const isRed = pred.severity === 'red';
              const isYellow = pred.severity === 'yellow';

              return (
                <div
                  key={idx}
                  className={`rounded-xl p-4 border transition-all ${
                    isRed
                      ? 'border-rose-600 bg-rose-950/30'
                      : isYellow
                      ? 'border-amber-600/60 bg-amber-950/20'
                      : 'border-stone-800 bg-stone-950/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-stone-400 font-bold">
                      {pred.zone}
                    </span>
                    <span className="text-xs font-mono text-stone-300">
                      Forecast Horizon: <span className="text-white font-bold">{pred.forecastHorizon}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {pred.hazardType}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-stone-400">Risk Prob:</span>
                      <span
                        className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${
                          isRed
                            ? 'bg-rose-600 text-white'
                            : isYellow
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {pred.probabilityPct}%
                      </span>
                    </div>
                  </div>

                  {/* Trigger factors */}
                  <div className="mb-2 text-xs font-mono text-stone-300">
                    <span className="text-stone-400 block mb-1">Trigger Correlation Factors:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pred.triggerFactors.map((f, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300 text-2xs"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mitigation */}
                  <div className="pt-2 border-t border-stone-800/80 text-xs font-mono text-emerald-300 flex items-start gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-400 font-bold">AI Recommended Action: </span>
                      {pred.recommendedMitigation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
