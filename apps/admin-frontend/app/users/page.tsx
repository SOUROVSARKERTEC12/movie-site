'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Users,
  Shield,
  Monitor,
  Tv,
  Smartphone,
  MapPin,
  Clock,
  Film,
  X,
  CheckCircle,
  Ban,
  Crown,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { MOCK_USERS } from '@/data/mockUsers';
import { UserProfile } from '@movie-site/shared';

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Summary Metrics
  const totalUsers = MOCK_USERS.length;
  const activeCount = MOCK_USERS.filter((u) => u.status === 'Active' || u.status === 'VIP').length;
  const vipCount = MOCK_USERS.filter((u) => u.subscriptionTier === 'Family VIP' || u.subscriptionTier === 'Premium 4K').length;
  const avgWatchTime = Math.round(
    MOCK_USERS.reduce((acc, u) => acc + u.totalWatchTimeHours, 0) / totalUsers
  );

  const columns: Column<UserProfile>[] = [
    {
      key: 'name',
      header: 'Subscriber',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 flex-shrink-0">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs hover:underline">{user.name}</span>
              {user.status === 'VIP' && <Crown className="w-3 h-3 text-amber-400" />}
            </div>
            <p className="text-[11px] text-neutral-500 font-mono">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'id',
      header: 'User ID',
      sortable: true,
      render: (user) => <span className="font-mono text-neutral-400 text-[11px]">{user.id}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (user) => <StatusBadge status={user.status} />,
    },
    {
      key: 'subscriptionTier',
      header: 'Tier',
      sortable: true,
      render: (user) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            user.subscriptionTier.includes('VIP')
              ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
              : user.subscriptionTier.includes('4K')
              ? 'bg-neutral-800 text-white border border-neutral-600'
              : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
          }`}
        >
          {user.subscriptionTier}
        </span>
      ),
    },
    {
      key: 'totalWatchTimeHours',
      header: 'Watch Hours',
      sortable: true,
      render: (user) => (
        <div className="font-mono font-bold text-white">
          {user.totalWatchTimeHours} hrs
        </div>
      ),
    },
    {
      key: 'moviesWatchedCount',
      header: 'Watched',
      sortable: true,
      render: (user) => (
        <span className="text-neutral-300 font-mono">{user.moviesWatchedCount} films</span>
      ),
    },
    {
      key: 'currentDevice',
      header: 'Device',
      render: (user) => (
        <span className="text-neutral-400 text-[11px] truncate max-w-[130px] block" title={user.currentDevice}>
          {user.currentDevice}
        </span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (user) => (
        <span className="text-neutral-300 text-[11px] flex items-center gap-1">
          <span>{user.location.flag}</span>
          <span>{user.location.city}, {user.location.country}</span>
        </span>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP (Fictional)',
      render: (user) => <span className="font-mono text-neutral-500 text-[11px]">{user.ipAddress}</span>,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      sortable: true,
      render: (user) => (
        <span
          className={`text-[11px] font-mono ${
            user.lastActive.includes('now') || user.lastActive.includes('m ago')
              ? 'text-emerald-400 font-semibold'
              : 'text-neutral-400'
          }`}
        >
          {user.lastActive}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="User Management & Audience Directory"
        subtitle="Manage 120+ active subscribers, session status, device allocations, and streaming tiers"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Registered"
            value={totalUsers}
            subtitle="Fictional mock profiles"
            icon={Users}
            sparklineData={[90, 100, 110, 115, 120]}
          />
          <StatCard
            title="Active / VIP"
            value={activeCount}
            subtitle="Engaged within 48h"
            trend="up"
            change="86%"
            icon={CheckCircle}
            sparklineData={[70, 78, 85, 92, 103]}
          />
          <StatCard
            title="Premium 4K & VIP"
            value={vipCount}
            subtitle="Top tier plans"
            trend="up"
            change="+14%"
            icon={Crown}
            sparklineData={[40, 48, 55, 62, 70]}
          />
          <StatCard
            title="Avg Watch Time"
            value={`${avgWatchTime} hrs`}
            subtitle="Per subscriber"
            icon={Clock}
            sparklineData={[180, 200, 210, 225, 240]}
          />
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={MOCK_USERS}
          searchKeys={['name', 'email', 'id', 'ipAddress', 'currentDevice']}
          searchPlaceholder="Search by subscriber name, email, user ID, device or IP..."
          defaultSortKey="lastActive"
          defaultSortDir="asc"
          onRowClick={(user) => setSelectedUser(user)}
          filters={[
            {
              label: 'Status',
              key: 'status',
              options: [
                { label: 'Active', value: 'Active' },
                { label: 'VIP', value: 'VIP' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Suspended', value: 'Suspended' },
              ],
            },
            {
              label: 'Tier',
              key: 'subscriptionTier',
              options: [
                { label: 'Free Tier', value: 'Free' },
                { label: 'Standard HD', value: 'Standard HD' },
                { label: 'Premium 4K', value: 'Premium 4K' },
                { label: 'Family VIP', value: 'Family VIP' },
              ],
            },
          ]}
        />
      </div>

      {/* User Detail Drawer / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-800 border-2 border-neutral-700">
                  <Image
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-neutral-400 font-mono">{selectedUser.email}</p>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">ID: {selectedUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-neutral-900 text-xs">
              <div className="p-3 bg-neutral-900/60 rounded-xl">
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Status &amp; Tier</span>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedUser.status} />
                  <span className="font-bold text-white">{selectedUser.subscriptionTier}</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 rounded-xl">
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Total Watch Hours</span>
                <span className="text-lg font-black text-white font-mono mt-0.5 block">
                  {selectedUser.totalWatchTimeHours} hrs
                </span>
              </div>

              <div className="p-3 bg-neutral-900/60 rounded-xl">
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Films Watched</span>
                <span className="text-lg font-black text-white font-mono mt-0.5 block">
                  {selectedUser.moviesWatchedCount} titles
                </span>
              </div>

              <div className="p-3 bg-neutral-900/60 rounded-xl">
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Registered</span>
                <span className="text-xs font-bold text-neutral-300 font-mono mt-1 block">
                  {selectedUser.registrationDate}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-neutral-900">
                <span className="text-neutral-400">Current Device:</span>
                <span className="text-white font-medium">{selectedUser.currentDevice}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-900">
                <span className="text-neutral-400">Location:</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <span>{selectedUser.location.flag}</span>
                  <span>{selectedUser.location.city}, {selectedUser.location.country}</span>
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-900">
                <span className="text-neutral-400">Demo IP Address:</span>
                <span className="font-mono text-neutral-300">{selectedUser.ipAddress}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-400">Preferred Quality:</span>
                <span className="font-bold text-emerald-400">{selectedUser.preferences?.preferredQuality}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
