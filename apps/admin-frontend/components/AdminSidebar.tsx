'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Activity,
  Film,
  Layers,
  MonitorSmartphone,
  FileText,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  LucideIcon,
  Settings,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'User Activity', href: '/user-activity', icon: Activity },
  { label: 'Movies', href: '/movies', icon: Film },
  { label: 'Categories', href: '/categories', icon: Layers },
  { label: 'Devices & Platforms', href: '/devices', icon: MonitorSmartphone },
  { label: 'Activity Logs', href: '/logs', icon: FileText },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();

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
        className={`fixed top-0 bottom-0 left-0 bg-[#080808] border-r border-neutral-800/80 flex flex-col z-50 overflow-x-hidden transition-[width,transform] duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 border-b border-neutral-800/80 flex items-center overflow-hidden transition-all duration-300 ${
            isCollapsed ? 'px-3 justify-center' : 'px-5 justify-between'
          }`}
        >
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={() => {
                if (isCollapsed) toggleCollapsed();
              }}
              title={isCollapsed ? 'Click to expand sidebar (Ctrl+B)' : 'CineBlack Ops'}
              className="w-8 h-8 rounded-lg bg-white text-black flex-shrink-0 flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform cursor-pointer"
            >
              C
            </button>
            {!isCollapsed && (
              <div className="whitespace-nowrap overflow-hidden transition-opacity duration-200">
                <h2 className="font-black text-sm tracking-tight text-white leading-none truncate">
                  CINEBLACK
                </h2>
                <p className="text-[10px] text-neutral-400 font-mono mt-0.5 tracking-wider uppercase flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span>Ops Telemetry</span>
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button (Expanded mode) */}
          {!isCollapsed && (
            <button
              onClick={toggleCollapsed}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              title="Collapse sidebar (Ctrl+B)"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden space-y-1 custom-scrollbar transition-all duration-300 ${
            isCollapsed ? 'px-2 py-3' : 'px-3 py-3'
          }`}
        >
          {!isCollapsed ? (
            <p className="px-3 py-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest truncate">
              Platform Operations
            </p>
          ) : (
            <div className="w-8 h-px bg-neutral-800/80 mx-auto my-2" />
          )}

          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <div key={item.href} className="w-full">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={isCollapsed ? (item.badge ? `${item.label} (${item.badge})` : item.label) : undefined}
                  aria-label={item.label}
                  className={`flex items-center rounded-xl text-xs font-medium transition-all ${
                    isCollapsed
                      ? 'justify-center p-2.5 mx-auto'
                      : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md shadow-white/5'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 relative min-w-0">
                    <Icon
                      className={`w-4 h-4 transition-colors flex-shrink-0 ${
                        isActive ? 'text-black' : 'text-neutral-400 group-hover:text-white'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}

                    {/* Collapsed notification pip indicator */}
                    {isCollapsed && item.badge === 'Live' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold flex-shrink-0 ${
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
              </div>
            );
          })}
        </nav>

        {/* Bottom Switcher: Jump to Customer Streaming Site */}
        <div
          className={`border-t border-neutral-800/80 bg-neutral-950/80 space-y-2 overflow-x-hidden transition-all duration-300 ${
            isCollapsed ? 'p-2' : 'p-3'
          }`}
        >
          {/* External site link */}
          <div className="w-full">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              title={isCollapsed ? 'User Movie Site' : undefined}
              aria-label="User Movie Site"
              className={`flex items-center rounded-lg border border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors text-xs font-medium ${
                isCollapsed
                  ? 'justify-center p-2.5 mx-auto'
                  : 'justify-between px-3 py-2.5'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Film className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white flex-shrink-0" />
                {!isCollapsed && <span className="truncate">User Movie Site</span>}
              </div>
              {!isCollapsed && (
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white flex-shrink-0" />
              )}
            </a>
          </div>

          {/* Desktop Expand / Collapse Bar */}
          <div className="hidden lg:block pt-1 border-t border-neutral-900 overflow-x-hidden">
            {isCollapsed ? (
              <button
                onClick={toggleCollapsed}
                className="w-full flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
                title="Expand sidebar (Ctrl+B)"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={toggleCollapsed}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/60 transition-colors text-[11px] font-mono group cursor-pointer"
                title="Collapse sidebar (Ctrl+B)"
                aria-label="Collapse sidebar"
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <PanelLeftClose className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 flex-shrink-0" />
                  <span className="truncate">Collapse Rail</span>
                </span>
                <kbd className="px-1.5 py-0.5 rounded text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-400 flex-shrink-0">
                  Ctrl+B
                </kbd>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
