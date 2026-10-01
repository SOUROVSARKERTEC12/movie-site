'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, PanelLeft, Settings } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { getAdminProfile, DEFAULT_ADMIN_PROFILE } from '@/data/mockStorage';
import { AdminProfileConfig } from '@movie-site/shared';

interface AdminHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  actions,
}) => {
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const [profile, setProfile] = useState<AdminProfileConfig>(DEFAULT_ADMIN_PROFILE);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setProfile(getAdminProfile());
      }, 0);

      const handleProfileUpdate = () => {
        setProfile(getAdminProfile());
      };

      window.addEventListener('cineblack_profile_updated', handleProfileUpdate);
      window.addEventListener('storage', handleProfileUpdate);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('cineblack_profile_updated', handleProfileUpdate);
        window.removeEventListener('storage', handleProfileUpdate);
      };
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#050505]/85 border-b border-neutral-800/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Page Title & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex items-center justify-center p-2 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
          aria-label="Toggle sidebar collapse"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
          {title}
        </h1>
      </div>

      {/* Right Controls: Telemetry Health Pill & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {actions}



        {/* Quick Settings Shortcut */}
        <Link
          href="/settings"
          className="p-2 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white transition-colors"
          title="System & Storage Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Alerts & Notifications */}
        <button
          className="relative p-2 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white transition-colors"
          title="System Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        {/* Admin Profile - Clickable to Settings */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 pl-2 border-l border-neutral-800 group hover:opacity-90 transition-opacity"
          title="Manage Profile & System Settings"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-xs text-white group-hover:border-neutral-500 transition-colors flex-shrink-0">
            <span>{profile.name.substring(0, 2).toUpperCase()}</span>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-white leading-tight group-hover:text-neutral-200 transition-colors truncate max-w-[130px]">
              {profile.name}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

