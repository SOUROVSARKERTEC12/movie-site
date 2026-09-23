'use client';

import React, { useState } from 'react';

export interface AreaChartPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface AreaChartProps {
  data: AreaChartPoint[];
  title?: string;
  subtitle?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  color?: string;
  secondaryColor?: string;
  height?: number;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title,
  subtitle,
  valuePrefix = '',
  valueSuffix = '',
  color = '#ffffff',
  secondaryColor = '#3b82f6',
  height = 260,
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

  const values = data.map((d) => d.value);
  const secondaryValues = data.map((d) => d.secondaryValue ?? 0);
  const allValues = [
    ...values,
    ...(data.some((d) => d.secondaryValue !== undefined) ? secondaryValues : []),
  ];

  const minVal = 0;
  const maxVal = Math.max(...allValues) * 1.15 || 100;

  const getX = (idx: number) =>
    paddingLeft + (idx / (data.length - 1)) * chartWidth;
  const getY = (val: number) =>
    paddingTop +
    chartHeight -
    ((val - minVal) / (maxVal - minVal)) * chartHeight;

  // Build SVG Path for Primary Series
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(data.length - 1)},${
    paddingTop + chartHeight
  } L ${getX(0)},${paddingTop + chartHeight} Z`;

  // Build SVG Path for Secondary Series (if present)
  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);
  let secondaryLinePath = '';
  if (hasSecondary) {
    const secPoints = data.map(
      (d, i) => `${getX(i)},${getY(d.secondaryValue || 0)}`
    );
    secondaryLinePath = `M ${secPoints.join(' L ')}`;
  }

  // Y-axis ticks
  const yTicks = [0, 0.33, 0.66, 1].map((ratio) => {
    const val = minVal + ratio * (maxVal - minVal);
    const y = paddingTop + chartHeight - ratio * chartHeight;
    return { val: Math.round(val), y };
  });

  // Smooth continuous mouse tracking handler: eliminates gaps and flickering
  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, relX / rect.width));
    const idx = Math.round(ratio * (data.length - 1));
    setHoverIndex(idx);
  };

  return (
    <div className="w-full bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 sm:p-5 relative select-none">
      {/* Stable Header with fixed height and permanent legend */}
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 min-h-[44px]">
          <div>
            {title && (
              <h4 className="text-sm font-bold text-white tracking-wide">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            {hasSecondary ? (
              <div className="flex items-center gap-3 text-[11px] font-medium bg-neutral-900/60 border border-neutral-800 px-2.5 py-1 rounded-lg">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span>Total Streams</span>
                </span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <span>4K Viewers</span>
                </span>
              </div>
            ) : hoverIndex !== null ? (
              <div className="text-right">
                <span className="text-xs text-neutral-400 mr-2">
                  {data[hoverIndex].label}:
                </span>
                <span className="text-sm font-extrabold text-white font-mono">
                  {valuePrefix}
                  {data[hoverIndex].value.toLocaleString()}
                  {valueSuffix}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-neutral-500 font-mono">
                Hover chart for details
              </span>
            )}
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="#1a1a1a"
                strokeDasharray="3 3"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 3}
                fill="#666666"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {tick.val >= 1000
                  ? `${(tick.val / 1000).toFixed(0)}k`
                  : tick.val}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Primary Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary Line (if present) */}
          {hasSecondary && (
            <path
              d={secondaryLinePath}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}

          {/* X-axis labels */}
          {data.map((d, i) => {
            const skip = data.length > 15 ? Math.ceil(data.length / 7) : 1;
            if (i % skip !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={i}
                x={getX(i)}
                y={height - 8}
                fill="#777777"
                fontSize="10"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {d.label}
              </text>
            );
          })}

          {/* Continuous Overlay Tracker: Eliminates gaps, dead zones, and seam flicker */}
          <rect
            x={paddingLeft}
            y={paddingTop}
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
            className="cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIndex(null)}
          />

          {/* Active Hover Marker with pointer-events-none: Never intercepts cursor */}
          {hoverIndex !== null && (
            <g pointerEvents="none" className="transition-all duration-75">
              {/* Vertical Guide Line */}
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={paddingTop + chartHeight}
                stroke="#555555"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Primary Series Circle Marker */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].value)}
                r="5"
                fill={color}
                stroke="#000000"
                strokeWidth="2.5"
              />

              {/* Secondary Series Circle Marker (if present) */}
              {hasSecondary &&
                data[hoverIndex].secondaryValue !== undefined && (
                  <circle
                    cx={getX(hoverIndex)}
                    cy={getY(data[hoverIndex].secondaryValue || 0)}
                    r="4.5"
                    fill={secondaryColor}
                    stroke="#000000"
                    strokeWidth="2"
                  />
                )}

              {/* Tooltip Card: Snaps cleanly next to vertical line */}
              <g
                transform={`translate(${
                  getX(hoverIndex) > width - 170
                    ? getX(hoverIndex) - 165
                    : getX(hoverIndex) + 12
                }, ${paddingTop + 10})`}
              >
                <rect
                  width="155"
                  height={hasSecondary ? 64 : 44}
                  rx="8"
                  fill="#111111"
                  stroke="#2c2c2c"
                  strokeWidth="1"
                  className="filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                />

                {/* Timestamp header */}
                <text
                  x="10"
                  y="16"
                  fill="#888888"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Time: {data[hoverIndex].label}
                </text>

                {/* Primary metric */}
                <circle cx="14" cy="30" r="3.5" fill={color} />
                <text
                  x="23"
                  y="33"
                  fill="#cccccc"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  Total:
                </text>
                <text
                  x="145"
                  y="33"
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  {valuePrefix}
                  {data[hoverIndex].value.toLocaleString()}
                  {valueSuffix}
                </text>

                {/* Secondary metric (if present) */}
                {hasSecondary &&
                  data[hoverIndex].secondaryValue !== undefined && (
                    <>
                      <circle cx="14" cy="48" r="3.5" fill={secondaryColor} />
                      <text
                        x="23"
                        y="51"
                        fill="#93c5fd"
                        fontSize="10"
                        fontFamily="sans-serif"
                      >
                        4K Streams:
                      </text>
                      <text
                        x="145"
                        y="51"
                        fill="#93c5fd"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="end"
                      >
                        {valuePrefix}
                        {data[hoverIndex].secondaryValue?.toLocaleString()}
                        {valueSuffix}
                      </text>
                    </>
                  )}
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
