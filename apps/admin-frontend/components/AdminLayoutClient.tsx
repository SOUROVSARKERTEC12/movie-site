'use client';

import React, { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutClientProps {
  children: ReactNode;
}

const AdminLayoutClientInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isCollapsed } = useSidebar();

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
    <SidebarProvider>
      <AdminLayoutClientInner>{children}</AdminLayoutClientInner>
    </SidebarProvider>
  );
};
