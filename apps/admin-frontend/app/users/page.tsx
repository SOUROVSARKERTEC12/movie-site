'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Shield,
  ShieldAlert,
  Crown,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  User as UserIcon,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { MOCK_USERS } from '@/data/mockUsers';
import { UserProfile, UserRole, UserStatus } from '@movie-site/shared';

const STORAGE_KEY = 'cineblack_admin_users';

interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  city: string;
  currentDevice: string;
}

const DEFAULT_FORM_DATA: UserFormData = {
  name: '',
  email: '',
  role: 'user',
  status: 'Active',
  country: 'Bangladesh',
  city: 'Dhaka',
  currentDevice: 'Chrome • Windows',
};

const COUNTRY_FLAGS: Record<string, string> = {
  Bangladesh: '🇧🇩',
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  Canada: '🇨🇦',
  India: '🇮🇳',
  Germany: '🇩🇪',
  Singapore: '🇸🇬',
  Australia: '🇦🇺',
  Other: '🌐',
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);

  // Form state
  const [formData, setFormData] = useState<UserFormData>(DEFAULT_FORM_DATA);
  const [formError, setFormError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load users from localStorage or fallback to MOCK_USERS
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setUsers(parsed);
              setIsLoaded(true);
              return;
            }
          } catch (e) {
            console.error('Failed to parse saved users from localStorage', e);
          }
        }
        setUsers(MOCK_USERS);
        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save users to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users, isLoaded]);

  // Reset to default seed users
  const handleResetToDefault = () => {
    if (confirm('Reset user directory to initial system defaults? All custom changes will be restored.')) {
      setUsers(MOCK_USERS);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
      }
      setToastMessage('User list restored to defaults');
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setFormData(DEFAULT_FORM_DATA);
    setFormError('');
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      status: user.status,
      country: user.location?.country || 'Bangladesh',
      city: user.location?.city || 'Dhaka',
      currentDevice: user.currentDevice,
    });
    setFormError('');
  };

  // Create User Handler
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('User name is required');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('A valid email address is required');
      return;
    }

    // Check duplicate email
    if (users.some((u) => u.email.toLowerCase() === formData.email.trim().toLowerCase())) {
      setFormError('A user with this email address already exists');
      return;
    }

    const flag = COUNTRY_FLAGS[formData.country] || '🌐';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      formData.name.trim()
    )}&background=${formData.role === 'super_admin' ? 'b45309' : formData.role === 'admin' ? '1d4ed8' : '262626'}&color=fff&size=120`;

    const newUser: UserProfile = {
      id: `usr_${Date.now().toString(36)}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      avatar: avatarUrl,
      role: formData.role,
      registrationDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      status: formData.status,
      totalWatchTimeHours: 0,
      moviesWatchedCount: 0,
      currentDevice: formData.currentDevice,
      location: {
        country: formData.country,
        city: formData.city,
        flag: flag,
      },
      ipAddress: `192.168.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`,
      preferences: {
        subtitlesEnabled: true,
        autoplayNext: true,
      },
    };

    setUsers([newUser, ...users]);
    setIsCreateModalOpen(false);
    setToastMessage(`Created user "${newUser.name}" as ${newUser.role}`);
  };

  // Update User Handler
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!formData.name.trim()) {
      setFormError('User name is required');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('A valid email address is required');
      return;
    }

    // Check duplicate email on other users
    if (
      users.some(
        (u) =>
          u.id !== editingUser.id &&
          u.email.toLowerCase() === formData.email.trim().toLowerCase()
      )
    ) {
      setFormError('Another user is already using this email address');
      return;
    }

    const flag = COUNTRY_FLAGS[formData.country] || editingUser.location?.flag || '🌐';

    const updatedUser: UserProfile = {
      ...editingUser,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      status: formData.status,
      currentDevice: formData.currentDevice,
      location: {
        country: formData.country,
        city: formData.city,
        flag: flag,
      },
      preferences: {
        subtitlesEnabled: editingUser.preferences?.subtitlesEnabled ?? true,
        autoplayNext: editingUser.preferences?.autoplayNext ?? true,
      },
    };

    setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
    if (selectedUser?.id === editingUser.id) {
      setSelectedUser(updatedUser);
    }
    setEditingUser(null);
    setToastMessage(`Updated user "${updatedUser.name}"`);
  };

  // Delete User Handler
  const handleDeleteUser = () => {
    if (!deletingUser) return;
    setUsers(users.filter((u) => u.id !== deletingUser.id));
    if (selectedUser?.id === deletingUser.id) {
      setSelectedUser(null);
    }
    setToastMessage(`Deleted user "${deletingUser.name}"`);
    setDeletingUser(null);
  };

  // Metrics
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length;
  const activeCount = users.filter((u) => u.status === 'Active' || u.status === 'VIP').length;
  const subscriberCount = users.filter((u) => u.role === 'user').length;

  // Render role badge helper
  const renderRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Super Admin</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Shield className="w-3 h-3 text-blue-400" />
            <span>Admin</span>
          </span>
        );
      case 'user':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800">
            <UserIcon className="w-3 h-3 text-neutral-400" />
            <span>User</span>
          </span>
        );
    }
  };

  // DataTable Columns
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
              <span className="font-bold text-white text-xs hover:underline cursor-pointer">
                {user.name}
              </span>
              {user.status === 'VIP' && <Crown className="w-3 h-3 text-amber-400" />}
            </div>
            <p className="text-[11px] text-neutral-500 font-mono">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (user) => renderRoleBadge(user.role),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (user) => <StatusBadge status={user.status} />,
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
      key: 'location',
      header: 'Location',
      render: (user) => (
        <span className="text-neutral-300 text-[11px] flex items-center gap-1">
          <span>{user.location?.flag || '🌐'}</span>
          <span>{user.location?.city || 'N/A'}, {user.location?.country || ''}</span>
        </span>
      ),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      sortable: true,
      render: (user) => (
        <span
          className={`text-[11px] font-mono ${
            user.lastActive?.includes('now') || user.lastActive?.includes('m ago')
              ? 'text-emerald-400 font-semibold'
              : 'text-neutral-400'
          }`}
        >
          {user.lastActive}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedUser(user)}
            title="Inspect user details"
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openEditModal(user)}
            title="Edit user"
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 text-neutral-400 hover:text-blue-400 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingUser(user)}
            title="Delete user"
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 text-neutral-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-12">
      <AdminHeader
        title="User & Access Management"
        subtitle="Manage user roles (super_admin, admin, user), accounts, permissions, and CRUD operations"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white font-medium text-xs transition-colors"
              title="Reset to default seed users"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </button>
          </div>
        }
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Accounts"
            value={totalUsers.toString()}
            subtitle="Registered users in directory"
            icon={Users}
          />
          <StatCard
            title="Admins & Super Admins"
            value={adminCount.toString()}
            subtitle="Privileged role accounts"
            icon={ShieldAlert}
          />
          <StatCard
            title="Active / VIP"
            value={activeCount.toString()}
            subtitle="Active subscriber accounts"
            icon={CheckCircle}
          />
          <StatCard
            title="Standard Users"
            value={subscriberCount.toString()}
            subtitle="Platform subscriber accounts"
            icon={UserIcon}
          />
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={users}
          searchKeys={['name', 'email', 'id', 'role', 'currentDevice']}
          searchPlaceholder="Search by subscriber name, email, user ID, or role..."
          defaultSortKey="role"
          defaultSortDir="asc"
          onRowClick={(user) => setSelectedUser(user)}
          filters={[
            {
              label: 'Role',
              key: 'role',
              options: [
                { label: 'Super Admin', value: 'super_admin' },
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
              ],
            },
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
          ]}
          actions={
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-bold text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Create User</span>
            </button>
          }
        />
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>Create New User</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Assign user roles (super_admin, admin, user) and platform permissions
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@domain.com"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Roles Selection */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1.5">User Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'super_admin' as UserRole, label: 'Super Admin', desc: 'Full System Control' },
                    { role: 'admin' as UserRole, label: 'Admin', desc: 'Catalog & Ops' },
                    { role: 'user' as UserRole, label: 'User', desc: 'Subscriber Only' },
                  ].map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: item.role })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        formData.role === item.role
                          ? item.role === 'super_admin'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : item.role === 'admin'
                            ? 'bg-blue-500/10 border-blue-500 text-white'
                            : 'bg-white/10 border-white text-white'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-bold text-xs">
                        {item.role === 'super_admin' && <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />}
                        {item.role === 'admin' && <Shield className="w-3.5 h-3.5 text-blue-400" />}
                        {item.role === 'user' && <UserIcon className="w-3.5 h-3.5 text-neutral-400" />}
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Account Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Bangladesh">Bangladesh 🇧🇩</option>
                    <option value="United States">United States 🇺🇸</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="Canada">Canada 🇨🇦</option>
                    <option value="India">India 🇮🇳</option>
                    <option value="Germany">Germany 🇩🇪</option>
                    <option value="Singapore">Singapore 🇸🇬</option>
                    <option value="Australia">Australia 🇦🇺</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Dhaka"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Current Device</label>
                <input
                  type="text"
                  value={formData.currentDevice}
                  onChange={(e) => setFormData({ ...formData, currentDevice: e.target.value })}
                  placeholder="e.g. Chrome • macOS"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setEditingUser(null)}
          />
          <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-400" />
                  <span>Edit User Profile</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Update role, tier, permissions, and status for {editingUser.name}
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Roles Selection */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1.5">User Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'super_admin' as UserRole, label: 'Super Admin', desc: 'Full System Control' },
                    { role: 'admin' as UserRole, label: 'Admin', desc: 'Catalog & Ops' },
                    { role: 'user' as UserRole, label: 'User', desc: 'Subscriber Only' },
                  ].map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: item.role })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        formData.role === item.role
                          ? item.role === 'super_admin'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : item.role === 'admin'
                            ? 'bg-blue-500/10 border-blue-500 text-white'
                            : 'bg-white/10 border-white text-white'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-bold text-xs">
                        {item.role === 'super_admin' && <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />}
                        {item.role === 'admin' && <Shield className="w-3.5 h-3.5 text-blue-400" />}
                        {item.role === 'user' && <UserIcon className="w-3.5 h-3.5 text-neutral-400" />}
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Account Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Bangladesh">Bangladesh 🇧🇩</option>
                    <option value="United States">United States 🇺🇸</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="Canada">Canada 🇨🇦</option>
                    <option value="India">India 🇮🇳</option>
                    <option value="Germany">Germany 🇩🇪</option>
                    <option value="Singapore">Singapore 🇸🇬</option>
                    <option value="Australia">Australia 🇦🇺</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Current Device</label>
                <input
                  type="text"
                  value={formData.currentDevice}
                  onChange={(e) => setFormData({ ...formData, currentDevice: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setDeletingUser(null)}
          />
          <div className="relative w-full max-w-md bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete User Account</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-bold">{deletingUser.name}</span> (
                <span className="font-mono text-neutral-300">{deletingUser.email}</span>)? All session allocations and profile records will be purged.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-500 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAIL INSPECTOR DRAWER */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-800 border-2 border-neutral-700 flex-shrink-0">
                  <Image
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedUser.name}</h3>
                    {selectedUser.status === 'VIP' && <Crown className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-neutral-500 font-mono">ID: {selectedUser.id}</span>
                    {renderRoleBadge(selectedUser.role)}
                  </div>
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
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Account Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedUser.status} />
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
                  <span>{selectedUser.location?.flag || '🌐'}</span>
                  <span>{selectedUser.location?.city || 'N/A'}, {selectedUser.location?.country || ''}</span>
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-400">IP Address:</span>
                <span className="font-mono text-neutral-300">{selectedUser.ipAddress}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const u = selectedUser;
                    setSelectedUser(null);
                    openEditModal(u);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 text-neutral-300 hover:text-blue-400 text-xs font-semibold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    const u = selectedUser;
                    setSelectedUser(null);
                    setDeletingUser(u);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 text-neutral-300 hover:text-rose-400 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
