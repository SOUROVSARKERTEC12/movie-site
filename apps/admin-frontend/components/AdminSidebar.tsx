'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Activity,
  Radio,
  Film,
  BarChart3,
  Layers,
  Cpu,
  MonitorSmartphone,
  Globe,
  Search,
  Server,
  FileText,
  Settings,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'User Activity', href: '/user-activity', icon: Activity },
  { label: 'Live Sessions', href: '/live-sessions', icon: Radio, badge: 'Live' },
  { label: 'Movies', href: '/movies', icon: Film },
  { label: 'Movie Analytics', href: '/movie-analytics', icon: BarChart3 },
  { label: 'Categories', href: '/categories', icon: Layers },
  { label: 'Streaming Telemetry', href: '/telemetry', icon: Cpu },
  { label: 'Devices & Platforms', href: '/devices', icon: MonitorSmartphone },
  { label: 'Geographic Analytics', href: '/geographic', icon: Globe },
  { label: 'Search Analytics', href: '/search-analytics', icon: Search },
  { label: 'System Health', href: '/system-health', icon: Server, badge: '99.9%' },
  { label: 'Activity Logs', href: '/logs', icon: FileText },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Trigger Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-black/90 border-b border-neutral-800/80 px-4 flex items-center justify-between z-40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs">
            C
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            CineBlack <span className="text-neutral-400 font-normal text-xs">Ops</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#080808] border-r border-neutral-800/80 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-neutral-800/80 px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              C
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight text-white leading-none">
                CINEBLACK
              </h2>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5 tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Ops Telemetry</span>
              </p>
            </div>
          </div>
        </div>

        {/* Live Stream Pulse Pill */}
        <div className="px-4 py-3 border-b border-neutral-900 bg-neutral-950/60">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="text-[11px] font-semibold text-neutral-300">Live Viewers</span>
            </div>
            <span className="text-xs font-mono font-bold text-white">3,842</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 custom-scrollbar">
          <p className="px-3 py-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            Platform Operations
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-md shadow-white/5'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-black' : 'text-neutral-500 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      item.badge === 'Live'
                        ? isActive
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : isActive
                        ? 'bg-neutral-800 text-white'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Switcher: Jump to Customer Streaming Site */}
        <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/80">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors text-xs font-medium group"
          >
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
              <span>User Movie Site</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
          </a>
        </div>
      </aside>
    </>
  );
};
