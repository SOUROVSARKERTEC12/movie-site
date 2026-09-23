'use client';

import React from 'react';

interface GaugeChartProps {
  value: number; // 0 - 100
  title: string;
  subtitle?: string;
  unit?: string;
  color?: string;
  size?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  title,
  subtitle,
  unit = '%',
  color,
  size = 170,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  // Choose color based on value if not specified
  let dialColor = color;
  if (!dialColor) {
    dialColor = clampedValue >= 80 ? '#10b981' : clampedValue >= 50 ? '#f59e0b' : '#f43f5e';
  }

  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#0c0c0c] border border-neutral-800/80 rounded-xl select-none">
      <div className="relative" style={{ width: size, height: size * 0.58 }}>
        <svg
          width={size}
          height={size * 0.65}
          viewBox={`0 0 ${size} ${size * 0.65}`}
          className="overflow-visible"
        >
          {/* Background track arc */}
          <path
            d={`M ${strokeWidth} ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${size * 0.55}`}
            fill="none"
            stroke="#1c1c1c"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value progress arc */}
          <path
            d={`M ${strokeWidth} ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${size * 0.55}`}
            fill="none"
            stroke={dialColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center reading */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center">
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-white">{value}</span>
            <span className="text-xs font-bold text-neutral-400">{unit}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h5 className="text-xs font-bold text-neutral-200">{title}</h5>
        {subtitle && <p className="text-[10px] text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};
