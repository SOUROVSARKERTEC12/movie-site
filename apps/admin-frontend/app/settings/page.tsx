'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Settings,
  User,
  HardDrive,
  Folder,
  Shield,
  Key,
  Check,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Server,
  RefreshCw,
  X,
  Sliders,
  Info,
} from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  DiskStoragePath,
  AdminProfileConfig,
  StoragePathCategory,
  StoragePathStatus,
} from '@movie-site/shared';
import {
  getDiskStoragePaths,
  saveDiskStoragePaths,
  getAdminProfile,
  saveAdminProfile,
  formatStorageSize,
  getStorageAggregateMetrics,
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_DISK_PATHS,
} from '@/data/mockStorage';
import { recordAuditLog } from '@/lib/auditLogger';

const STORAGE_CATEGORIES: StoragePathCategory[] = [
  'Movies & Series',
  'HLS Chunks / Transcode',
  'Trailers & Previews',
  'Backups',
  'General Media',
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80',
];

interface PathFormData {
  name: string;
  path: string;
  category: StoragePathCategory;
  maxLimitValue: number;
  maxLimitUnit: 'GB' | 'TB';
  usedValue: number;
  usedUnit: 'GB' | 'TB';
  status: StoragePathStatus;
  isDefault: boolean;
}

const DEFAULT_PATH_FORM: PathFormData = {
  name: '',
  path: '',
  category: 'Movies & Series',
  maxLimitValue: 2,
  maxLimitUnit: 'TB',
  usedValue: 0,
  usedUnit: 'GB',
  status: 'Active',
  isDefault: false,
};

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'storage' ? 'storage' : 'profile';

  const [activeTab, setActiveTab] = useState<'profile' | 'storage'>(initialTab);
  const [profile, setProfile] = useState<AdminProfileConfig>(DEFAULT_ADMIN_PROFILE);
  const [diskPaths, setDiskPaths] = useState<DiskStoragePath[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState<AdminProfileConfig>(DEFAULT_ADMIN_PROFILE);
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Storage Filter & Modal State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [editingPathId, setEditingPathId] = useState<string | null>(null);
  const [pathForm, setPathForm] = useState<PathFormData>(DEFAULT_PATH_FORM);
  const [deleteConfirmPath, setDeleteConfirmPath] = useState<DiskStoragePath | null>(null);

  // API inspection state
  const [isCheckingDisk, setIsCheckingDisk] = useState(false);
  const [diskCheckResult, setDiskCheckResult] = useState<{
    success: boolean;
    exists?: boolean;
    totalGb?: number;
    freeGb?: number;
    usedGb?: number;
    message?: string;
  } | null>(null);

  // Feedback notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [copiedPathId, setCopiedPathId] = useState<string | null>(null);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load profile and disk paths
  useEffect(() => {
    const timer = setTimeout(() => {
      const loadedProfile = getAdminProfile();
      const loadedPaths = getDiskStoragePaths();
      setProfile(loadedProfile);
      setProfileForm(loadedProfile);
      setDiskPaths(loadedPaths);
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Listen to external storage/profile changes
  useEffect(() => {
    const handleProfileUpdate = () => {
      const p = getAdminProfile();
      setProfile(p);
      setProfileForm(p);
    };

    const handleStorageUpdate = () => {
      const paths = getDiskStoragePaths();
      setDiskPaths(paths);
    };

    window.addEventListener('cineblack_profile_updated', handleProfileUpdate);
    window.addEventListener('cineblack_storage_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('cineblack_profile_updated', handleProfileUpdate);
      window.removeEventListener('cineblack_storage_updated', handleStorageUpdate);
    };
  }, []);

  // Filtered disk paths
  const filteredPaths = useMemo(() => {
    return diskPaths.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.path.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [diskPaths, searchQuery, categoryFilter]);

  // Aggregated Storage Metrics
  const storageMetrics = useMemo(() => {
    return getStorageAggregateMetrics(diskPaths);
  }, [diskPaths]);

  // Copy path helper
  const handleCopyPath = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPathId(id);
    setTimeout(() => setCopiedPathId(null), 2000);
  };

  // --- Profile Actions ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setToast({ message: 'Name and email are required.', type: 'error' });
      return;
    }

    const updatedProfile: AdminProfileConfig = {
      ...profileForm,
      lastUpdated: new Date().toISOString(),
    };

    saveAdminProfile(updatedProfile);
    setProfile(updatedProfile);

    recordAuditLog({
      action: 'UPDATE_PROFILE',
      resource: 'Admin Profile',
      details: `Updated admin profile for "${updatedProfile.name}" (${updatedProfile.email})`,
      actor: updatedProfile.name,
      actorRole: updatedProfile.title,
    });

    setToast({ message: 'Admin profile updated successfully!', type: 'success' });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordState.currentPassword) {
      setToast({ message: 'Please enter your current password.', type: 'error' });
      return;
    }
    if (passwordState.newPassword.length < 8) {
      setToast({ message: 'New password must be at least 8 characters.', type: 'error' });
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setToast({ message: 'New passwords do not match.', type: 'error' });
      return;
    }

    recordAuditLog({
      action: 'CHANGE_PASSWORD',
      resource: 'Security Credentials',
      details: `Admin password updated for account ${profile.email}`,
      actor: profile.name,
      actorRole: profile.title,
    });

    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setToast({ message: 'Password updated successfully!', type: 'success' });
  };

  const handleResetProfile = () => {
    if (confirm('Reset profile to factory system defaults?')) {
      saveAdminProfile(DEFAULT_ADMIN_PROFILE);
      setProfile(DEFAULT_ADMIN_PROFILE);
      setProfileForm(DEFAULT_ADMIN_PROFILE);
      setToast({ message: 'Profile reset to default.', type: 'info' });
    }
  };

  // --- Storage Path Actions ---
  const openCreatePathModal = () => {
    setEditingPathId(null);
    setPathForm(DEFAULT_PATH_FORM);
    setDiskCheckResult(null);
    setIsPathModalOpen(true);
  };

  const openEditPathModal = (pathItem: DiskStoragePath) => {
    setEditingPathId(pathItem.id);
    const isTbLimit = pathItem.maxLimitGb >= 1000 && pathItem.maxLimitGb % 100 === 0;
    const isTbUsed = pathItem.usedGb >= 1000 && pathItem.usedGb % 100 === 0;

    setPathForm({
      name: pathItem.name,
      path: pathItem.path,
      category: pathItem.category,
      maxLimitValue: isTbLimit ? pathItem.maxLimitGb / 1000 : pathItem.maxLimitGb,
      maxLimitUnit: isTbLimit ? 'TB' : 'GB',
      usedValue: isTbUsed ? pathItem.usedGb / 1000 : pathItem.usedGb,
      usedUnit: isTbUsed ? 'TB' : 'GB',
      status: pathItem.status,
      isDefault: !!pathItem.isDefault,
    });
    setDiskCheckResult(null);
    setIsPathModalOpen(true);
  };

  // Inspect host directory using API route
  const handleInspectHostPath = async (targetPath: string) => {
    if (!targetPath.trim()) {
      setToast({ message: 'Please enter a path to inspect.', type: 'error' });
      return;
    }

    setIsCheckingDisk(true);
    setDiskCheckResult(null);

    try {
      const res = await fetch(`/api/storage/check?path=${encodeURIComponent(targetPath.trim())}`);
      const data = await res.json();

      if (data.success && data.exists) {
        setDiskCheckResult({
          success: true,
          exists: true,
          totalGb: data.totalGb,
          freeGb: data.freeGb,
          usedGb: data.usedGb,
          message: `Verified on host filesystem. Total: ${data.totalGb} GB, Free: ${data.freeGb} GB, Used: ${data.usedGb} GB`,
        });
      } else {
        setDiskCheckResult({
          success: true,
          exists: false,
          message: data.message || 'Directory path was not found on the local host filesystem. You can still save it as a designated or network storage mount.',
        });
      }
    } catch {
      setDiskCheckResult({
        success: false,
        exists: false,
        message: 'Could not contact host filesystem inspector API.',
      });
    } finally {
      setIsCheckingDisk(false);
    }
  };

  // Auto-fill values from inspected host disk
  const handleApplyHostStatsToForm = () => {
    if (!diskCheckResult || !diskCheckResult.totalGb) return;

    const totalGb = diskCheckResult.totalGb;
    const usedGb = diskCheckResult.usedGb || 0;

    setPathForm((prev) => ({
      ...prev,
      maxLimitValue: totalGb >= 1000 ? Number((totalGb / 1000).toFixed(2)) : totalGb,
      maxLimitUnit: totalGb >= 1000 ? 'TB' : 'GB',
      usedValue: usedGb >= 1000 ? Number((usedGb / 1000).toFixed(2)) : usedGb,
      usedUnit: usedGb >= 1000 ? 'TB' : 'GB',
    }));

    setToast({ message: 'Applied host disk limit and used size to form.', type: 'info' });
  };

  const handleSavePath = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pathForm.name.trim() || !pathForm.path.trim()) {
      setToast({ message: 'Please provide both a label and a directory path.', type: 'error' });
      return;
    }

    const calculatedMaxLimitGb =
      pathForm.maxLimitUnit === 'TB'
        ? Number(pathForm.maxLimitValue) * 1000
        : Number(pathForm.maxLimitValue);

    const calculatedUsedGb =
      pathForm.usedUnit === 'TB'
        ? Number(pathForm.usedValue) * 1000
        : Number(pathForm.usedValue);

    if (calculatedMaxLimitGb <= 0) {
      setToast({ message: 'Max limit quota must be greater than 0.', type: 'error' });
      return;
    }

    if (calculatedUsedGb > calculatedMaxLimitGb) {
      setToast({ message: 'Used size cannot exceed the max quota limit.', type: 'error' });
      return;
    }

    // Determine status automatically if full
    let finalStatus = pathForm.status;
    const ratio = calculatedUsedGb / calculatedMaxLimitGb;
    if (ratio >= 0.98) {
      finalStatus = 'Full';
    } else if (ratio >= 0.85 && finalStatus === 'Active') {
      finalStatus = 'Warning';
    }

    let updatedPaths: DiskStoragePath[];

    if (editingPathId) {
      // Editing existing path
      updatedPaths = diskPaths.map((p) => {
        if (p.id === editingPathId) {
          return {
            ...p,
            name: pathForm.name.trim(),
            path: pathForm.path.trim(),
            category: pathForm.category,
            maxLimitGb: calculatedMaxLimitGb,
            usedGb: calculatedUsedGb,
            status: finalStatus,
            isDefault: pathForm.isDefault,
            updatedAt: new Date().toISOString(),
          };
        }
        // If this path is marked default, unmark others
        if (pathForm.isDefault) {
          return { ...p, isDefault: false };
        }
        return p;
      });

      recordAuditLog({
        action: 'UPDATE_STORAGE_PATH',
        resource: 'Local Storage Mount',
        details: `Updated storage mount "${pathForm.name}" (${pathForm.path}) with limit ${formatStorageSize(calculatedMaxLimitGb)}`,
        actor: profile.name,
        actorRole: profile.title,
      });

      setToast({ message: `Storage path "${pathForm.name}" updated successfully.`, type: 'success' });
    } else {
      // Creating new path
      const newPath: DiskStoragePath = {
        id: `disk_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        name: pathForm.name.trim(),
        path: pathForm.path.trim(),
        category: pathForm.category,
        maxLimitGb: calculatedMaxLimitGb,
        usedGb: calculatedUsedGb,
        status: finalStatus,
        isDefault: pathForm.isDefault || diskPaths.length === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updatedPaths = pathForm.isDefault
        ? [newPath, ...diskPaths.map((p) => ({ ...p, isDefault: false }))]
        : [...diskPaths, newPath];

      recordAuditLog({
        action: 'ADD_STORAGE_PATH',
        resource: 'Local Storage Mount',
        details: `Added new storage directory mount "${newPath.name}" (${newPath.path}) with limit ${formatStorageSize(newPath.maxLimitGb)}`,
        actor: profile.name,
        actorRole: profile.title,
      });

      setToast({ message: `Added new storage path "${newPath.name}".`, type: 'success' });
    }

    saveDiskStoragePaths(updatedPaths);
    setDiskPaths(updatedPaths);
    setIsPathModalOpen(false);
  };

  const handleDeletePath = () => {
    if (!deleteConfirmPath) return;

    const remaining = diskPaths.filter((p) => p.id !== deleteConfirmPath.id);
    // If deleted was default, make first remaining default
    if (deleteConfirmPath.isDefault && remaining.length > 0) {
      remaining[0].isDefault = true;
    }

    saveDiskStoragePaths(remaining);
    setDiskPaths(remaining);

    recordAuditLog({
      action: 'DELETE_STORAGE_PATH',
      resource: 'Local Storage Mount',
      details: `Removed storage mount "${deleteConfirmPath.name}" (${deleteConfirmPath.path})`,
      actor: profile.name,
      actorRole: profile.title,
    });

    setToast({ message: `Deleted storage path "${deleteConfirmPath.name}".`, type: 'info' });
    setDeleteConfirmPath(null);
  };

  const handleResetStorageDefaults = () => {
    if (confirm('Reset disk storage paths and limits to initial system seed?')) {
      saveDiskStoragePaths(DEFAULT_DISK_PATHS);
      setDiskPaths(DEFAULT_DISK_PATHS);
      setToast({ message: 'Reset storage paths to initial configurations.', type: 'info' });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-neutral-400">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-white" />
          <span className="font-mono text-sm">Loading system settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-neutral-900/90 border-neutral-700 text-neutral-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-neutral-300 flex-shrink-0" />}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 hover:text-white text-neutral-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <AdminHeader
        title="System Settings & Infrastructure"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              Environment: <span className="text-emerald-400 font-bold">Production Node</span>
            </span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-neutral-400" />
              <span>Platform Administration &amp; Configuration</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Manage your administrator credentials, configure multiple local storage mount directories, and enforce disk quota limits.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Admin Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'storage'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Disk Paths &amp; Quotas</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-neutral-800 text-neutral-300">
                {diskPaths.length}
              </span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ADMIN PROFILE SETTINGS                            */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Profile Card Preview */}
              <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-700 bg-neutral-900 shadow-xl group">
                  {profileForm.avatar ? (
                    <Image
                      src={profileForm.avatar}
                      alt={profileForm.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-2xl text-white">
                      {profileForm.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-black text-white">{profileForm.name || 'Unnamed Admin'}</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">{profileForm.email}</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      {profileForm.role.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-300">
                      {profileForm.title}
                    </span>
                  </div>
                </div>

                <div className="w-full pt-4 border-t border-neutral-900 text-left space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-neutral-900/60">
                    <span className="text-neutral-500">Department</span>
                    <span className="text-neutral-300 font-medium truncate max-w-[160px]">
                      {profileForm.department || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900/60">
                    <span className="text-neutral-500">Office Location</span>
                    <span className="text-neutral-300 font-medium">{profileForm.location || 'Dhaka, BD'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900/60">
                    <span className="text-neutral-500">Phone</span>
                    <span className="text-neutral-300 font-mono">{profileForm.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">2FA Security</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>{profileForm.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Avatar Presets */}
                <div className="w-full pt-4 border-t border-neutral-900 text-left">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                    Avatar Presets
                  </label>
                  <div className="flex items-center justify-between gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfileForm((prev) => ({ ...prev, avatar: preset }))}
                        className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                          profileForm.avatar === preset ? 'border-white ring-2 ring-emerald-500/50' : 'border-neutral-800'
                        }`}
                      >
                        <Image src={preset} alt={`Preset ${idx + 1}`} fill sizes="32px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetProfile}
                  className="w-full mt-2 py-2 px-3 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Defaults</span>
                </button>
              </div>

              {/* Right Column: Edit Profile Form */}
              <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleSaveProfile} className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>Edit Administrator Profile Details</span>
                    </h3>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Last Saved: {profile.lastUpdated ? new Date(profile.lastUpdated).toLocaleTimeString() : 'Synchronized'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="e.g. Sourov Sarker"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="admin@cineblack.tv"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                        Operational Title / Role
                      </label>
                      <input
                        type="text"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="SecOps & Infrastructure Lead"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                        Department / Org
                      </label>
                      <input
                        type="text"
                        value={profileForm.department || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="Global Media Streaming & Core Infra"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="+880 1712-345678"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                        Office Location / Region
                      </label>
                      <input
                        type="text"
                        value={profileForm.location || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="Dhaka, Bangladesh"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                      Avatar Image URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                      Operational Bio / Responsibilities
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                      placeholder="Outline operational ownership and cluster maintenance directives..."
                    />
                  </div>

                  {/* Notification and 2FA switches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 cursor-pointer hover:border-neutral-700">
                      <div>
                        <p className="text-xs font-bold text-white">System Alert Notifications</p>
                        <p className="text-[10px] text-neutral-400">Receive critical quota and telemetry alerts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileForm.notificationsEnabled}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, notificationsEnabled: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-white bg-neutral-800 border-neutral-700 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 cursor-pointer hover:border-neutral-700">
                      <div>
                        <p className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</p>
                        <p className="text-[10px] text-neutral-400">Enforce hardware/TOTP security token</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileForm.twoFactorEnabled}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, twoFactorEnabled: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-white bg-neutral-800 border-neutral-700 focus:ring-0"
                      />
                    </label>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-neutral-800/80">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>

                {/* Password / Security Credentials Card */}
                <form onSubmit={handleUpdatePassword} className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>Change Administrator Password</span>
                    </h3>
                    <span className="text-[11px] text-neutral-500 font-mono">256-bit Argon2 Salted</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordState.currentPassword}
                        onChange={(e) =>
                          setPasswordState({ ...passwordState, currentPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordState.newPassword}
                        onChange={(e) =>
                          setPasswordState({ ...passwordState, newPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="Min 8 characters"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordState.confirmPassword}
                        onChange={(e) =>
                          setPasswordState({ ...passwordState, confirmPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: LOCAL DISK STORAGE PATHS & MAX LIMITS             */}
        {/* ======================================================== */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            {/* Storage Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-emerald-400" />
                      <span>Total Quota Limit</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">Configured</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-mono">
                      {formatStorageSize(storageMetrics.totalLimitGb)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Across {storageMetrics.pathCount} storage directory mounts
                </p>
              </div>

              <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>Total Full (Used)</span>
                    </span>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">
                      {storageMetrics.percentFull}%
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-blue-400 font-mono">
                      {formatStorageSize(storageMetrics.totalUsedGb)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Consumed media content and chunk assets
                </p>
              </div>

              <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span>Total Remain (Free)</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {storageMetrics.percentRemain}%
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {formatStorageSize(storageMetrics.totalRemainGb)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Available space headroom before quota limits
                </p>
              </div>

              <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-neutral-400" />
                      <span>Cluster Status</span>
                    </span>
                    <StatusBadge
                      status={storageMetrics.warningCount > 0 ? 'Warning' : 'Optimal'}
                      variant={storageMetrics.warningCount > 0 ? 'warning' : 'healthy'}
                    />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-mono">
                      {storageMetrics.activeCount} / {storageMetrics.pathCount}
                    </span>
                    <span className="text-xs text-neutral-500 font-bold">active mounts</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  {storageMetrics.warningCount > 0
                    ? `${storageMetrics.warningCount} path(s) nearing capacity limit`
                    : 'All volume mounts within safe thresholds'}
                </p>
              </div>
            </div>

            {/* Aggregated Capacity Progress Bar */}
            <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Aggregated Storage Allocation Pool</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="text-blue-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Full: {formatStorageSize(storageMetrics.totalUsedGb)} ({storageMetrics.percentFull}%)
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Remain: {formatStorageSize(storageMetrics.totalRemainGb)} ({storageMetrics.percentRemain}%)
                  </span>
                </div>
              </div>

              {/* Dual Colored Progress Bar */}
              <div className="w-full h-3.5 bg-neutral-900 rounded-full overflow-hidden flex border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, storageMetrics.percentFull)}%` }}
                  title={`Full / Used: ${storageMetrics.percentFull}%`}
                />
                <div
                  className="h-full bg-gradient-to-r from-emerald-500/30 to-emerald-500/60 transition-all duration-500"
                  style={{ width: `${Math.min(100, storageMetrics.percentRemain)}%` }}
                  title={`Remain / Free: ${storageMetrics.percentRemain}%`}
                />
              </div>
            </div>

            {/* Path Management Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by path name or directory..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs focus:outline-none focus:border-white transition-colors"
                >
                  <option value="ALL">All Categories</option>
                  {STORAGE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetStorageDefaults}
                  className="px-3 py-2 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset storage to default demonstration mounts"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>

                <button
                  onClick={openCreatePathModal}
                  className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Disk Storage Path</span>
                </button>
              </div>
            </div>

            {/* Disk Paths Grid / List */}
            {filteredPaths.length === 0 ? (
              <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-12 text-center space-y-3">
                <HardDrive className="w-10 h-10 mx-auto text-neutral-600" />
                <h4 className="text-sm font-bold text-white">No disk storage paths found</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {searchQuery || categoryFilter !== 'ALL'
                    ? 'No storage mounts match your active search filters.'
                    : 'Click "Add Disk Storage Path" to configure your first local or mount directory.'}
                </p>
                <button
                  onClick={openCreatePathModal}
                  className="mt-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Configure First Mount Path
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPaths.map((item) => {
                  const usedPct = item.maxLimitGb > 0 ? (item.usedGb / item.maxLimitGb) * 100 : 0;
                  const remainGb = Math.max(0, item.maxLimitGb - item.usedGb);
                  const remainPct = Math.max(0, 100 - usedPct);

                  // Dynamic color based on used capacity
                  const isHighUsage = usedPct >= 85;
                  const isCritical = usedPct >= 95;

                  const barFillColor = isCritical
                    ? 'bg-rose-500'
                    : isHighUsage
                    ? 'bg-amber-500'
                    : 'bg-emerald-500';

                  return (
                    <div
                      key={item.id}
                      className="bg-[#0c0c0c] border border-neutral-800/80 hover:border-neutral-700 rounded-2xl p-5 transition-all space-y-4"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex-shrink-0 mt-0.5">
                            <Folder className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-extrabold text-sm text-white truncate">{item.name}</h4>
                              {item.isDefault && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-black">
                                  Default Vault
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300">
                                {item.category}
                              </span>
                              <StatusBadge status={item.status} />
                            </div>

                            {/* Directory Path with Copy Button */}
                            <div className="flex items-center gap-2 mt-1.5">
                              <code className="text-xs font-mono text-neutral-400 bg-neutral-900/90 border border-neutral-800/80 px-2 py-0.5 rounded truncate max-w-md">
                                {item.path}
                              </code>
                              <button
                                onClick={() => handleCopyPath(item.id, item.path)}
                                className="p-1 text-neutral-400 hover:text-white transition-colors"
                                title="Copy directory path"
                              >
                                {copiedPathId === item.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleInspectHostPath(item.path)}
                            className="px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="Verify and detect actual host disk metrics"
                          >
                            <RefreshCw className="w-3 h-3 text-neutral-400" />
                            <span>Inspect Host</span>
                          </button>

                          <button
                            onClick={() => openEditPathModal(item)}
                            className="px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="Edit path properties and quota limits"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Limit</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmPath(item)}
                            className="p-1.5 rounded-lg border border-neutral-800/80 hover:border-rose-800/80 bg-neutral-900 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete this mount path"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Storage Quota & Usage Details Banner */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-900">
                        {/* 1. Full (Used) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${isHighUsage ? 'bg-amber-400' : 'bg-blue-400'}`} />
                              <span>Full Size (Used)</span>
                            </span>
                            <span className="font-mono text-white font-bold">{usedPct.toFixed(1)}% Full</span>
                          </div>
                          <p className="text-base font-black text-white font-mono">
                            {formatStorageSize(item.usedGb)}
                          </p>
                          <p className="text-[10px] text-neutral-500">
                            {item.usedGb.toLocaleString()} GB consumed
                          </p>
                        </div>

                        {/* 2. Remain (Free) */}
                        <div className="space-y-1 sm:border-l sm:border-neutral-900 sm:pl-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>Remaining (Free)</span>
                            </span>
                            <span className="font-mono text-emerald-400 font-bold">{remainPct.toFixed(1)}% Remain</span>
                          </div>
                          <p className="text-base font-black text-emerald-400 font-mono">
                            {formatStorageSize(remainGb)}
                          </p>
                          <p className="text-[10px] text-neutral-500">
                            {remainGb.toLocaleString()} GB free headroom
                          </p>
                        </div>

                        {/* 3. Max Limit Quota */}
                        <div className="space-y-1 sm:border-l sm:border-neutral-900 sm:pl-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                              <Sliders className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Max Quota Limit</span>
                            </span>
                            <span className="font-mono text-neutral-500 text-[11px]">Hard Ceiling</span>
                          </div>
                          <p className="text-base font-black text-white font-mono">
                            {formatStorageSize(item.maxLimitGb)}
                          </p>
                          <p className="text-[10px] text-neutral-500">
                            {item.maxLimitGb.toLocaleString()} GB ceiling
                          </p>
                        </div>
                      </div>

                      {/* Visual Capacity Bar */}
                      <div className="space-y-1.5">
                        <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden flex border border-neutral-800">
                          <div
                            className={`h-full ${barFillColor} transition-all duration-500`}
                            style={{ width: `${Math.min(100, usedPct)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                          <span>0 GB</span>
                          <span className={isHighUsage ? 'text-amber-400 font-bold' : ''}>
                            {formatStorageSize(item.usedGb)} used ({usedPct.toFixed(1)}%)
                          </span>
                          <span>{formatStorageSize(item.maxLimitGb)} max</span>
                        </div>
                      </div>

                      {isHighUsage && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                          <span>
                            Warning: Directory path is at <strong>{usedPct.toFixed(1)}% capacity</strong>. Consider increasing max quota limit or pruning transcoded chunks.
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT DISK STORAGE PATH                      */}
      {/* ======================================================== */}
      {isPathModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-neutral-900 text-white">
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingPathId ? 'Edit Storage Path & Max Limit' : 'Configure New Disk Storage Path'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Define the directory path and assign hard maximum storage limits.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPathModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePath} className="space-y-4">
              {/* Directory Path Input */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                  Local Directory Path <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={pathForm.path}
                    onChange={(e) => setPathForm({ ...pathForm, path: e.target.value })}
                    placeholder="e.g. /Volumes/MediaDrive/4k-movies or /mnt/storage/chunks"
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleInspectHostPath(pathForm.path)}
                    disabled={isCheckingDisk || !pathForm.path.trim()}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                    title="Verify path on host and query actual filesystem stats"
                  >
                    {isCheckingDisk ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>{isCheckingDisk ? 'Inspecting...' : 'Detect Host'}</span>
                  </button>
                </div>

                {/* Path suggestions */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[11px] text-neutral-500">
                  <span>Quick paths:</span>
                  <button
                    type="button"
                    onClick={() => setPathForm({ ...pathForm, path: '/Volumes/CineVault-NVMe/4k-movies' })}
                    className="hover:text-white underline"
                  >
                    /Volumes/CineVault/4k
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setPathForm({ ...pathForm, path: '/mnt/fast-nvme/hls-chunks' })}
                    className="hover:text-white underline"
                  >
                    /mnt/fast-nvme/chunks
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setPathForm({ ...pathForm, path: '/Users/BBMLDP-40190/Movies' })}
                    className="hover:text-white underline"
                  >
                    /Users/.../Movies
                  </button>
                </div>

                {/* Host inspection feedback */}
                {diskCheckResult && (
                  <div
                    className={`mt-3 p-3 rounded-xl border text-xs space-y-2 ${
                      diskCheckResult.exists
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        {diskCheckResult.exists ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Info className="w-4 h-4 text-neutral-400" />
                        )}
                        <span>{diskCheckResult.exists ? 'Host Mount Found' : 'Remote / Custom Path'}</span>
                      </span>
                      {diskCheckResult.exists && diskCheckResult.totalGb && (
                        <button
                          type="button"
                          onClick={handleApplyHostStatsToForm}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
                        >
                          Auto-fill Limits
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-neutral-300">{diskCheckResult.message}</p>
                  </div>
                )}
              </div>

              {/* Path Label / Friendly Name */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                  Path Label / Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pathForm.name}
                  onChange={(e) => setPathForm({ ...pathForm, name: e.target.value })}
                  placeholder="e.g. Primary 4K Ultra HD Library"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                    Storage Category
                  </label>
                  <select
                    value={pathForm.category}
                    onChange={(e) =>
                      setPathForm({ ...pathForm, category: e.target.value as StoragePathCategory })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                  >
                    {STORAGE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                    Operating Status
                  </label>
                  <select
                    value={pathForm.status}
                    onChange={(e) =>
                      setPathForm({ ...pathForm, status: e.target.value as StoragePathStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white transition-colors"
                  >
                    <option value="Active">Active (Read/Write)</option>
                    <option value="Read-Only">Read-Only (Archive)</option>
                    <option value="Warning">Warning (Nearing Quota)</option>
                    <option value="Full">Full (Enforce Freeze)</option>
                  </select>
                </div>
              </div>

              {/* Quota Limit & Used Size Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Max Quota Limit */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                    Max Limit Quota <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      required
                      min={1}
                      step="any"
                      value={pathForm.maxLimitValue}
                      onChange={(e) =>
                        setPathForm({ ...pathForm, maxLimitValue: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
                      placeholder="e.g. 2"
                    />
                    <select
                      value={pathForm.maxLimitUnit}
                      onChange={(e) =>
                        setPathForm({ ...pathForm, maxLimitUnit: e.target.value as 'GB' | 'TB' })
                      }
                      className="px-2.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value="TB">TB</option>
                      <option value="GB">GB</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    {pathForm.maxLimitUnit === 'TB'
                      ? `${(pathForm.maxLimitValue * 1000).toLocaleString()} GB capacity`
                      : `${pathForm.maxLimitValue.toLocaleString()} GB capacity`}
                  </span>
                </div>

                {/* Used Space (Full) */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                    Current Used Size (Full)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={pathForm.usedValue}
                      onChange={(e) =>
                        setPathForm({ ...pathForm, usedValue: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
                      placeholder="e.g. 500"
                    />
                    <select
                      value={pathForm.usedUnit}
                      onChange={(e) =>
                        setPathForm({ ...pathForm, usedUnit: e.target.value as 'GB' | 'TB' })
                      }
                      className="px-2.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value="GB">GB</option>
                      <option value="TB">TB</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    {pathForm.usedUnit === 'TB'
                      ? `${(pathForm.usedValue * 1000).toLocaleString()} GB currently full`
                      : `${pathForm.usedValue.toLocaleString()} GB currently full`}
                  </span>
                </div>
              </div>

              {/* Calculated Preview Pill */}
              {(() => {
                const limitGb =
                  pathForm.maxLimitUnit === 'TB' ? pathForm.maxLimitValue * 1000 : pathForm.maxLimitValue;
                const usedGb =
                  pathForm.usedUnit === 'TB' ? pathForm.usedValue * 1000 : pathForm.usedValue;
                const remainGb = Math.max(0, limitGb - usedGb);
                const fullPct = limitGb > 0 ? (usedGb / limitGb) * 100 : 0;
                const remainPct = Math.max(0, 100 - fullPct);

                return (
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-900 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-neutral-400">
                        Full: <strong className="text-blue-400">{formatStorageSize(usedGb)} ({fullPct.toFixed(1)}%)</strong>
                      </span>
                      <span className="text-neutral-400">
                        Remain: <strong className="text-emerald-400">{formatStorageSize(remainGb)} ({remainPct.toFixed(1)}%)</strong>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden flex border border-neutral-800">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, fullPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Default Storage Toggle */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 cursor-pointer hover:border-neutral-700">
                <input
                  type="checkbox"
                  checked={pathForm.isDefault}
                  onChange={(e) => setPathForm({ ...pathForm, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-white bg-neutral-800 border-neutral-700 focus:ring-0"
                />
                <div>
                  <p className="text-xs font-bold text-white">Set as Primary Default Storage Path</p>
                  <p className="text-[10px] text-neutral-400">
                    New movie uploads and transcoding manifests will target this directory by default.
                  </p>
                </div>
              </label>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setIsPathModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
                >
                  {editingPathId ? 'Save Changes' : 'Create Storage Path'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE STORAGE PATH CONFIRMATION                  */}
      {/* ======================================================== */}
      {deleteConfirmPath && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Storage Path?</h3>
                <p className="text-xs text-neutral-400">This action removes the path configuration.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300">
              Are you sure you want to delete <strong className="text-white">{deleteConfirmPath.name}</strong> (
              <code className="text-[11px] font-mono text-neutral-400">{deleteConfirmPath.path}</code>)?
            </p>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
              Note: This unmounts the directory in CineBlack Ops telemetry. Files on the local disk will not be deleted from the host filesystem.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmPath(null)}
                className="px-4 py-2 rounded-xl border border-neutral-800 text-neutral-300 text-xs font-bold hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePath}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-neutral-400">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-white" />
            <span className="font-mono text-sm">Loading settings...</span>
          </div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
