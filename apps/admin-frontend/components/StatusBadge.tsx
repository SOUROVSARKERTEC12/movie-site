import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'healthy' | 'warning' | 'error' | 'info' | 'neutral' | 'vip';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  pulse = false,
}) => {
  // Infer variant if not provided
  let computedVariant = variant;
  if (!computedVariant) {
    const s = status.toLowerCase();
    if (s.includes('active') || s.includes('healthy') || s.includes('optimal') || s.includes('success') || s.includes('published') || s.includes('stable')) {
      computedVariant = 'healthy';
    } else if (s.includes('warning') || s.includes('slow') || s.includes('adequate') || s.includes('buffering') || s.includes('reconnecting') || s.includes('draft')) {
      computedVariant = 'warning';
    } else if (s.includes('error') || s.includes('down') || s.includes('critical') || s.includes('suspended') || s.includes('failed')) {
      computedVariant = 'error';
    } else if (s.includes('vip') || s.includes('featured') || s.includes('premium')) {
      computedVariant = 'vip';
    } else if (s.includes('info')) {
      computedVariant = 'info';
    } else {
      computedVariant = 'neutral';
    }
  }

  const styles = {
    healthy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    vip: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    neutral: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  }[computedVariant];

  const dotColor = {
    healthy: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-rose-400',
    vip: 'bg-purple-400',
    info: 'bg-cyan-400',
    neutral: 'bg-neutral-400',
  }[computedVariant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md ${styles}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColor} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      <span>{status}</span>
    </span>
  );
};
