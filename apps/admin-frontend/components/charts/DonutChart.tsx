'use client';

import React, { useState, useMemo } from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  title?: string;
  subtitle?: string;
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  valueSuffix?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  subtitle,
  centerLabel,
  centerValue,
  size = 160,
  valueSuffix = '%',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const total = data?.reduce((acc, d) => acc + d.value, 0) || 0;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segmentsWithOffset = useMemo(() => {
    if (!data || data.length === 0 || total === 0) return [];
    return data.map((seg, idx) => {
      const pct = seg.value / total;
      const strokeDasharray = `${pct * circumference} ${circumference}`;
      const accumulatedAngle = data.slice(0, idx).reduce((sum, item) => sum + item.value / total, 0);
      const strokeDashoffset = -accumulatedAngle * circumference;
      return {
        ...seg,
        pct,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [data, total, circumference]);

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none flex flex-col justify-between">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>}
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
        {/* SVG Donut */}
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {segmentsWithOffset.map((seg, idx) => {
              const isHovered = hoverIndex === idx;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
              {hoverIndex !== null
                ? `${Math.round((data[hoverIndex].value / total) * 100)}%`
                : centerValue || `${total.toLocaleString()}${valueSuffix}`}
            </span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold truncate max-w-[100px]">
              {hoverIndex !== null ? data[hoverIndex].label : centerLabel || 'Total'}
            </span>
          </div>
        </div>

        {/* Legend with progress indicators */}
        <div className="flex flex-col gap-2 w-full min-w-0 flex-1">
          {data.map((seg, idx) => {
            const pct = Math.round((seg.value / total) * 100);
            const isHovered = hoverIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className={`flex flex-col gap-1 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  isHovered ? 'bg-neutral-800/80 ring-1 ring-neutral-700' : 'hover:bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-xs text-neutral-300 font-medium truncate" title={seg.label}>
                      {seg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-xs">
                    <span className="font-bold text-white font-mono">{seg.value.toLocaleString()}{valueSuffix}</span>
                    <span className="text-neutral-500 font-mono text-[11px]">({pct}%)</span>
                  </div>
                </div>
                {/* Mini progress bar */}
                <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: seg.color,
                      opacity: isHovered ? 1 : 0.7,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
