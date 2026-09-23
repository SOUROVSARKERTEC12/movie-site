'use client';

import React, { useState } from 'react';

export interface BarChartItem {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  title?: string;
  subtitle?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  defaultColor?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  subtitle,
  valuePrefix = '',
  valueSuffix = '',
  defaultColor = '#ffffff',
  height = 240,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15 || 100;
  const barWidth = Math.min(36, (chartWidth / data.length) * 0.65);
  const step = chartWidth / data.length;

  return (
    <div className="w-full bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 select-none">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 min-h-[44px]">
          <div>
            {title && <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>}
            {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="text-right">
            {hoverIndex !== null ? (
              <div>
                <span className="text-xs text-neutral-400 mr-2">{data[hoverIndex].label}:</span>
                <span className="text-sm font-extrabold text-white font-mono">
                  {valuePrefix}
                  {data[hoverIndex].value.toLocaleString()}
                  {valueSuffix}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-neutral-500 font-mono">Hover bar for details</span>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Horizontal gridlines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = paddingTop + chartHeight - ratio * chartHeight;
            const val = Math.round(ratio * maxVal);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#1c1c1c"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  fill="#666666"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, idx) => {
            const barHeight = Math.max(4, (item.value / maxVal) * chartHeight);
            const x = paddingLeft + idx * step + (step - barWidth) / 2;
            const y = paddingTop + chartHeight - barHeight;
            const isHovered = hoverIndex === idx;
            const color = item.color || defaultColor;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill={color}
                  opacity={isHovered ? 1 : 0.8}
                  className="transition-all duration-200"
                />

                {/* X-axis Label */}
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  fill={isHovered ? '#ffffff' : '#777777'}
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
