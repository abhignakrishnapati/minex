import React, { useState } from 'react';
import { LineChart, BarChart3, Info, Eye, Droplets, Thermometer, CloudFog, Sparkles } from 'lucide-react';
import { HISTORICAL_ENVIRONMENTAL_DATA, SCATTER_PLOT_DATA } from '../data/mineData';
import { ResearchDataPoint } from '../types';

export const EnvironmentalResearchCharts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeseries' | 'scatter'>('timeseries');
  const [hoveredPoint, setHoveredPoint] = useState<ResearchDataPoint | null>(null);

  // Dimensions for Time Series SVG
  const width = 880;
  const heightTop = 140;
  const heightBottom = 170;
  const paddingLeft = 60;
  const paddingRight = 45;
  const plotWidth = width - paddingLeft - paddingRight;

  const dataCount = HISTORICAL_ENVIRONMENTAL_DATA.length;
  const getX = (index: number) => paddingLeft + (index / (dataCount - 1)) * plotWidth;

  // Visibility scale: 0 to 5000 m
  const getYVis = (vis: number) => heightTop - 15 - (vis / 5000) * (heightTop - 30);

  // Dual scale for bottom plot:
  // RH: 0 to 100% -> maps to heightBottom
  // BC880: 0 to 50 μg/m³
  // Temp: 0 to 40 °C
  const getYRH = (rh: number) => heightBottom - 25 - (rh / 100) * (heightBottom - 45);
  const getYBC = (bc: number) => heightBottom - 25 - (bc / 50) * (heightBottom - 45);
  const getYTemp = (t: number) => heightBottom - 25 - (t / 40) * (heightBottom - 45);

  // Generate SVG path for Visibility
  const visPath = HISTORICAL_ENVIRONMENTAL_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getYVis(d.visibility)}`).join(' ');

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <LineChart className="w-5 h-5 text-amber-400" />
              Environmental Telemetry & Correlation Research
            </h2>
            <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-md font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
              BC880 • RH • Temp • Visibility (1-Sec Resolution)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Empirical multi-variate analysis showing optical obscuration, particulate concentration, and microclimate bands
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-stone-950 p-1 rounded-xl text-xs sm:text-sm border border-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab('timeseries')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'timeseries'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            (a) Time-Series Microclimate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scatter')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'scatter'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            (b) Scatter Correlation Models
          </button>
        </div>
      </div>

      {activeTab === 'timeseries' ? (
        <div>
          {/* Legend and Parameters Bar in Dark Theme with larger fonts */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1 text-xs sm:text-sm font-mono">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-stone-200">
              <span className="flex items-center gap-2 font-bold text-amber-400">
                <span className="w-4 h-1.5 bg-amber-400 rounded-full inline-block"></span>
                Visibility (m)
              </span>
              <span className="flex items-center gap-2 font-bold text-sky-400">
                <span className="w-4 h-1.5 bg-sky-400 rounded-full inline-block"></span>
                Relative Humidity (%)
              </span>
              <span className="flex items-center gap-2 font-bold text-rose-400">
                <span className="w-4 h-1.5 bg-rose-400 rounded-full inline-block"></span>
                Temperature (°C)
              </span>
              <span className="flex items-center gap-2 font-bold text-slate-100">
                <span className="w-4 h-1.5 bg-slate-100 rounded-full inline-block"></span>
                BC880 Dust (μg/m³)
              </span>
            </div>

            {/* Condition Zones Legend */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-300">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-rose-950 border border-rose-500"></span>
                Fog (Critical Red)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-emerald-950 border border-emerald-500"></span>
                Haze (Safe/Normal)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-amber-950 border border-amber-500"></span>
                Mist (Caution)
              </span>
            </div>
          </div>

          {/* Scalable SVG for Figure (a) in Dark Theme */}
          <div className="w-full overflow-x-auto bg-stone-950 rounded-xl p-3 border border-stone-800">
            <svg
              viewBox={`0 0 ${width} ${heightTop + heightBottom + 35}`}
              className="w-full h-auto min-w-[760px]"
            >
              {/* Vertical Condition Shaded Bands */}
              {HISTORICAL_ENVIRONMENTAL_DATA.map((d, i) => {
                const x = getX(i);
                const nextX = i < dataCount - 1 ? getX(i + 1) : x + 20;
                const bandWidth = nextX - x;
                let fill = 'transparent';
                if (d.condition === 'Fog') fill = 'rgba(244, 63, 94, 0.18)';
                if (d.condition === 'Haze') fill = 'rgba(16, 185, 129, 0.15)';
                if (d.condition === 'Mist') fill = 'rgba(245, 158, 11, 0.16)';

                return (
                  <rect
                    key={`band-${i}`}
                    x={x - bandWidth / 2}
                    y={5}
                    width={bandWidth}
                    height={heightTop + heightBottom + 12}
                    fill={fill}
                  />
                );
              })}

              {/* ---------------- TOP PLOT: VISIBILITY (m) ---------------- */}
              {[0, 1000, 2000, 3000, 4000, 5000].map((val) => {
                const y = getYVis(val);
                return (
                  <g key={`vis-grid-${val}`}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="#292524"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 4}
                      fill="#a8a29e"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
              <text
                x={16}
                y={heightTop / 2}
                fill="#d6d3d1"
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
                transform={`rotate(-90 16 ${heightTop / 2})`}
                textAnchor="middle"
              >
                Visibility (m)
              </text>

              {/* Visibility Line */}
              <path
                d={visPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.6"
                strokeLinecap="round"
              />

              {/* Divider between subplots */}
              <line
                x1={paddingLeft}
                y1={heightTop + 10}
                x2={width - paddingRight}
                y2={heightTop + 10}
                stroke="#57534e"
                strokeWidth="1.5"
              />

              {/* ---------------- BOTTOM PLOT: BC, RH, TEMP ---------------- */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = heightTop + 15 + getYRH(val);
                return (
                  <g key={`rh-grid-${val}`}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="#292524"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 4}
                      fill="#a8a29e"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              <text
                x={16}
                y={heightTop + 15 + heightBottom / 2}
                fill="#d6d3d1"
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
                transform={`rotate(-90 16 ${heightTop + 15 + heightBottom / 2})`}
                textAnchor="middle"
              >
                BC / Temp / RH (%)
              </text>

              {/* RH curve (sky blue) */}
              <path
                d={HISTORICAL_ENVIRONMENTAL_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${heightTop + 15 + getYRH(d.relativeHumidity)}`).join(' ')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Temp curve (rose red) */}
              <path
                d={HISTORICAL_ENVIRONMENTAL_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${heightTop + 15 + getYTemp(d.temperature)}`).join(' ')}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* BC880 Dust curve (slate-100 high contrast white) */}
              <path
                d={HISTORICAL_ENVIRONMENTAL_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${heightTop + 15 + getYBC(d.bcConcentration)}`).join(' ')}
                fill="none"
                stroke="#f8fafc"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Mouseover bars */}
              {HISTORICAL_ENVIRONMENTAL_DATA.map((d, i) => {
                const x = getX(i);
                const isHovered = hoveredPoint?.date === d.date;

                return (
                  <g
                    key={`point-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(d)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <rect
                      x={x - 10}
                      y={5}
                      width={20}
                      height={heightTop + heightBottom + 12}
                      fill={isHovered ? 'rgba(255,255,255,0.1)' : 'transparent'}
                    />

                    {/* 1-second interval tick marks */}
                    <line
                      x1={x}
                      y1={heightTop + 15 + heightBottom}
                      x2={x}
                      y2={heightTop + 15 + heightBottom + (i % 5 === 0 ? 8 : 4)}
                      stroke={i % 5 === 0 ? '#a8a29e' : '#57534e'}
                      strokeWidth={i % 5 === 0 ? '1.5' : '1'}
                    />

                    {i % 2 === 0 && (
                      <text
                        x={x}
                        y={heightTop + heightBottom + 30}
                        fill="#d6d3d1"
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight={i % 5 === 0 ? 'bold' : 'normal'}
                        textAnchor="middle"
                        transform={`rotate(45 ${x} ${heightTop + heightBottom + 30})`}
                      >
                        {d.date}
                      </text>
                    )}

                    {isHovered && (
                      <>
                        <circle cx={x} cy={getYVis(d.visibility)} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                        <circle cx={x} cy={heightTop + 15 + getYRH(d.relativeHumidity)} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                        <circle cx={x} cy={heightTop + 15 + getYTemp(d.temperature)} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                        <circle cx={x} cy={heightTop + 15 + getYBC(d.bcConcentration)} r="5" fill="#ffffff" stroke="#1c1917" strokeWidth="2" />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Inspection Tooltip Banner */}
          {hoveredPoint ? (
            <div className="mt-3 p-3 bg-stone-950 text-white rounded-xl border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono shadow-xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">{hoveredPoint.date}</span>
                <span className="text-stone-600">|</span>
                <span>Atmospheric: <strong className="uppercase text-white">{hoveredPoint.condition}</strong></span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span>Visibility: <strong className="text-amber-400">{hoveredPoint.visibility} m</strong></span>
                <span>Dust (BC880): <strong className="text-white">{hoveredPoint.bcConcentration} μg/m³</strong></span>
                <span>RH: <strong className="text-sky-400">{hoveredPoint.relativeHumidity}%</strong></span>
                <span>Temp: <strong className="text-rose-400">{hoveredPoint.temperature}°C</strong></span>
                <span className={`px-2.5 py-0.5 rounded-md uppercase font-bold text-xs ${
                  hoveredPoint.severity === 'red' ? 'bg-rose-600 text-white' : hoveredPoint.severity === 'yellow' ? 'bg-amber-500 text-stone-950' : 'bg-emerald-600 text-white'
                }`}>
                  {hoveredPoint.severity} ZONE
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-2.5 text-center text-stone-400 text-xs sm:text-sm font-mono">
              Hover over dates along the curves to inspect correlated parameters and zone classifications
            </div>
          )}
        </div>
      ) : (
        /* ---------------- FIGURE (b): SCATTER CORRELATION MODELS ---------------- */
        <div>
          <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-mono">
            <span className="text-stone-300">
              Parameter Legend: <strong className="text-emerald-400">■ Relative Humidity (%)</strong> • <strong className="text-sky-400">■ Temperature (°C)</strong>
            </span>
            <span className="text-stone-400 text-xs">
              X-Axis: BC880 Concentration (0 - 40 μg/m³)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1. FOG SUBPLOT */}
            <div className="rounded-xl p-4 bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-bold text-white uppercase">Fog Condition</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                  Critical Red Zone
                </span>
              </div>
              <div className="h-48 w-full bg-stone-900 rounded-lg border border-stone-800 p-2 relative">
                <svg viewBox="0 0 200 140" className="w-full h-full">
                  <line x1="25" y1="120" x2="190" y2="120" stroke="#57534e" />
                  <line x1="25" y1="10" x2="25" y2="120" stroke="#57534e" />
                  {SCATTER_PLOT_DATA.fog.points.map((pt, i) => (
                    <circle
                      key={`fog-rh-${i}`}
                      cx={25 + (pt.bc / 40) * 160}
                      cy={120 - (pt.rh / 100) * 105}
                      r="4"
                      fill="#10b981"
                      fillOpacity="0.85"
                    />
                  ))}
                  {SCATTER_PLOT_DATA.fog.points.map((pt, i) => (
                    <circle
                      key={`fog-temp-${i}`}
                      cx={25 + (pt.bc / 40) * 160}
                      cy={120 - (pt.temp / 40) * 105}
                      r="4"
                      fill="#38bdf8"
                      fillOpacity="0.85"
                    />
                  ))}
                  <line x1="28" y1="25" x2="185" y2="40" stroke="#10b981" strokeWidth="2" />
                  <line x1="28" y1="105" x2="185" y2="105" stroke="#38bdf8" strokeWidth="2" />
                </svg>
              </div>
              <div className="mt-2.5 text-xs font-mono text-stone-300 bg-stone-900 p-2 rounded-lg border border-stone-800 flex justify-between">
                <span>Temp-BC: <strong className="text-white">{SCATTER_PLOT_DATA.fog.tempBcCorr}</strong></span>
                <span>RH-BC: <strong className="text-white">{SCATTER_PLOT_DATA.fog.rhBcCorr}</strong></span>
              </div>
            </div>

            {/* 2. HAZE SUBPLOT */}
            <div className="rounded-xl p-4 bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-bold text-white uppercase">Haze Condition</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                  Caution Yellow Zone
                </span>
              </div>
              <div className="h-48 w-full bg-stone-900 rounded-lg border border-stone-800 p-2 relative">
                <svg viewBox="0 0 200 140" className="w-full h-full">
                  <line x1="25" y1="120" x2="190" y2="120" stroke="#57534e" />
                  <line x1="25" y1="10" x2="25" y2="120" stroke="#57534e" />
                  {SCATTER_PLOT_DATA.haze.points.map((pt, i) => (
                    <circle
                      key={`haze-rh-${i}`}
                      cx={25 + (pt.bc / 40) * 160}
                      cy={120 - (pt.rh / 100) * 105}
                      r="4"
                      fill="#10b981"
                      fillOpacity="0.85"
                    />
                  ))}
                  {SCATTER_PLOT_DATA.haze.points.map((pt, i) => (
                    <circle
                      key={`haze-temp-${i}`}
                      cx={25 + (pt.bc / 40) * 160}
                      cy={120 - (pt.temp / 40) * 105}
                      r="4"
                      fill="#38bdf8"
                      fillOpacity="0.85"
                    />
                  ))}
                  <line x1="28" y1="70" x2="185" y2="35" stroke="#10b981" strokeWidth="2" />
                  <line x1="28" y1="90" x2="185" y2="105" stroke="#38bdf8" strokeWidth="2" />
                </svg>
              </div>
              <div className="mt-2.5 text-xs font-mono text-stone-300 bg-stone-900 p-2 rounded-lg border border-stone-800 flex justify-between">
                <span>Temp-BC: <strong className="text-white">{SCATTER_PLOT_DATA.haze.tempBcCorr}</strong></span>
                <span>RH-BC: <strong className="text-white">{SCATTER_PLOT_DATA.haze.rhBcCorr}</strong></span>
              </div>
            </div>

            {/* 3. MIST SUBPLOT */}
            <div className="rounded-xl p-4 bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-bold text-white uppercase">Mist Condition</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                  Caution Range
                </span>
              </div>
              <div className="h-48 w-full bg-stone-900 rounded-lg border border-stone-800 p-2 relative">
                <svg viewBox="0 0 200 140" className="w-full h-full">
                  <line x1="25" y1="120" x2="190" y2="120" stroke="#57534e" />
                  <line x1="25" y1="10" x2="25" y2="120" stroke="#57534e" />
                  {SCATTER_PLOT_DATA.mist.points.map((pt, i) => (
                    <circle
                      key={`mist-rh-${i}`}
                      cx={25 + (pt.bc / 40) * 160}
                      cy={120 - (pt.rh / 100) * 105}
                      r="4"
                      fill="#10b981"
                      fillOpacity="0.85"
                    />
                  ))}
                  {SCATTER_PLOT_DATA.mist.points.map((pt, i) => (
                    <circle
                      key={`mist-temp-${i}`}
                      cx={25 + (pt.bc / 40) * 160}
                      cy={120 - (pt.temp / 40) * 105}
                      r="4"
                      fill="#38bdf8"
                      fillOpacity="0.85"
                    />
                  ))}
                  <line x1="28" y1="30" x2="185" y2="30" stroke="#10b981" strokeWidth="2" />
                  <line x1="28" y1="95" x2="185" y2="95" stroke="#38bdf8" strokeWidth="2" />
                </svg>
              </div>
              <div className="mt-2.5 text-xs font-mono text-stone-300 bg-stone-900 p-2 rounded-lg border border-stone-800 flex justify-between">
                <span>Temp-BC: <strong className="text-white">{SCATTER_PLOT_DATA.mist.tempBcCorr}</strong></span>
                <span>RH-BC: <strong className="text-white">{SCATTER_PLOT_DATA.mist.rhBcCorr}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
