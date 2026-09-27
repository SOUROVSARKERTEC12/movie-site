'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_COLLAPSED_KEY = 'cineblack_admin_sidebar_collapsed';

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Restore user preference safely after initial mount (avoid SSR hydration mismatch)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          const saved = localStorage.getItem(STORAGE_COLLAPSED_KEY);
          if (saved !== null) {
            setIsCollapsed(saved === 'true');
          }
        } catch (e) {
          console.error('Failed to read sidebar state from localStorage', e);
        }
        setIsLoaded(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, []);

  // Persist preference whenever state updates
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_COLLAPSED_KEY, isCollapsed ? 'true' : 'false');
      } catch (e) {
        console.error('Failed to save sidebar state to localStorage', e);
      }
    }
  }, [isCollapsed, isLoaded]);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        // Only trigger if not actively typing in an input/textarea
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          setIsCollapsed((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCollapsed = () => setIsCollapsed((prev) => !prev);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapsed,
        setIsCollapsed,
        mobileOpen,
        toggleMobile,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
