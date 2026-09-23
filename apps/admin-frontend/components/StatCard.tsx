'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Sparkline } from './charts/Sparkline';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon?: LucideIcon;
  sparklineData?: number[];
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  subtitle,
  icon: Icon,
  sparklineData,
  color = '#ffffff',
}) => {
  return (
    <div className="bg-[#0c0c0c] border border-neutral-800/80 hover:border-neutral-700/80 transition-all rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Bottom row: trend + sparkline or subtitle */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-900">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {change && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-bold ${
                trend === 'up'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : trend === 'down'
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-neutral-400 bg-neutral-800'
              }`}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{change}</span>
            </span>
          )}
          {subtitle && (
            <span className="text-neutral-500 text-[11px] truncate max-w-[150px]">
              {subtitle}
            </span>
          )}
        </div>

        {sparklineData && sparklineData.length > 1 && (
          <div className="ml-auto">
            <Sparkline
              data={sparklineData}
              color={trend === 'up' ? '#10b981' : trend === 'down' ? '#f43f5e' : color}
              height={26}
              width={75}
            />
          </div>
        )}
      </div>
    </div>
  );
};
