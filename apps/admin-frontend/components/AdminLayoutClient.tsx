'use client';

import React, { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { AdminSidebar } from './AdminSidebar';
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import { Film } from 'lucide-react';

interface AdminLayoutClientProps {
  children: ReactNode;
}

const AdminLayoutClientInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const { isAuthenticated, isLoading } = useAuth();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // If on login page, render clean full-screen view
  if (isLoginPage) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  // Loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-neutral-400 gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 animate-pulse">
          <Film className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          <span>INITIALIZING CINEBLACK OPS CONSOLE...</span>
        </div>
      </div>
    );
  }

  // If not authenticated and redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-neutral-500 text-xs font-mono">
        REDIRECTING TO SECURE LOGIN...
      </div>
    );
  }

  return (
    <>
      <AdminSidebar />
      <div
        className={`flex-1 flex flex-col w-full min-h-screen pt-14 lg:pt-0 transition-[padding] duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
};

export const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children }) => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AdminLayoutClientInner>{children}</AdminLayoutClientInner>
      </SidebarProvider>
    </AuthProvider>
  );
};

