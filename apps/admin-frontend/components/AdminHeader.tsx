'use client';

import React from 'react';
import { Bell, Activity, Wifi } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  actions,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#050505]/85 border-b border-neutral-800/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1 hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls: Telemetry Health Pill & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {actions}

        {/* Global Cluster Status Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-3 py-1 rounded-full text-xs">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-neutral-300 font-medium">CDN Global</span>
          <span className="w-1 h-1 rounded-full bg-neutral-600" />
          <span className="text-emerald-400 font-mono font-bold">18ms p50</span>
          <StatusBadge status="Healthy" variant="healthy" />
        </div>

        {/* Alerts & Notifications */}
        <button
          className="relative p-2 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white transition-colors"
          title="System Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-xs text-white">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-white leading-tight">SecOps Admin</p>
            <p className="text-[10px] text-neutral-400 font-mono">cluster-admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
