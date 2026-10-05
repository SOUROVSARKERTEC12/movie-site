'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, HardDrive, Plus, Trash2, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { AdminHeader } from '@/components/AdminHeader';
import { DiskStoragePath, AdminProfileConfig } from '@movie-site/shared';
import {
  getDiskStoragePaths,
  saveDiskStoragePaths,
  getAdminProfile,
  saveAdminProfile,
  DEFAULT_ADMIN_PROFILE,
} from '@/data/mockStorage';

import { api } from '@/lib/api';

interface PathFormData {
  name: string;
  path: string;
  maxLimitValue: number;
}

const DEFAULT_PATH_FORM: PathFormData = {
  name: '',
  path: '',
  maxLimitValue: 100,
};

export default function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'storage' ? 'storage' : 'profile';

  const [activeTab, setActiveTab] = useState<'profile' | 'storage'>(initialTab);
  const [profileForm, setProfileForm] = useState<AdminProfileConfig>(DEFAULT_ADMIN_PROFILE);
  const [diskPaths, setDiskPaths] = useState<DiskStoragePath[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Storage Form State
  const [pathForm, setPathForm] = useState<PathFormData>(DEFAULT_PATH_FORM);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // 1. Load Admin Profile
      try {
        const prof = await api.auth.getProfile();
        if (isMounted && prof) {
          setProfileForm({
            name: prof.name,
            email: prof.email,
          });
        }
      } catch {
        if (isMounted) setProfileForm(getAdminProfile());
      }

      // 2. Load Storage Paths
      try {
        const paths = await api.storage.getPaths();
        if (isMounted && paths && paths.length > 0) {
          const mapped: DiskStoragePath[] = paths.map((p) => ({
            id: p.id,
            name: p.name,
            path: p.path,
            maxLimitGb: p.maxLimitGb,
            usedGb: p.usedGb || 0,
          }));
          setDiskPaths(mapped);
        } else if (isMounted) {
          setDiskPaths(getDiskStoragePaths());
        }
      } catch {
        if (isMounted) setDiskPaths(getDiskStoragePaths());
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setToast({ message: 'Name and email are required.', type: 'error' });
      return;
    }
    saveAdminProfile(profileForm);
    setToast({ message: 'Profile updated successfully!', type: 'success' });
  };

  const handleAddPath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathForm.name.trim() || !pathForm.path.trim()) {
      setToast({ message: 'Please provide a name and path.', type: 'error' });
      return;
    }
    if (pathForm.maxLimitValue <= 0) {
      setToast({ message: 'Limit must be greater than 0.', type: 'error' });
      return;
    }

    try {
      const created = await api.storage.createPath({
        name: pathForm.name.trim(),
        path: pathForm.path.trim(),
        maxLimitGb: Number(pathForm.maxLimitValue) || 100,
      });

      const newPath: DiskStoragePath = {
        id: created.id,
        name: created.name,
        path: created.path,
        maxLimitGb: created.maxLimitGb,
        usedGb: created.usedGb || 0,
      };

      setDiskPaths((prev) => [...prev, newPath]);
      setPathForm(DEFAULT_PATH_FORM);
      setToast({ message: 'Storage path registered with backend.', type: 'success' });
    } catch (err: any) {
      setToast({ message: err?.message || 'Failed to add storage path', type: 'error' });
    }
  };

  const handleDeletePath = async (id: string) => {
    try {
      await api.storage.deletePath(id);
      setDiskPaths((prev) => prev.filter((p) => p.id !== id));
      setToast({ message: 'Storage path deleted from backend.', type: 'success' });
    } catch (err: any) {
      setToast({ message: err?.message || 'Failed to delete storage path', type: 'error' });
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#050505] pb-16">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/90 border-rose-500/50 text-rose-200'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)}><X className="w-3.5 h-3.5 text-neutral-400" /></button>
        </div>
      )}

      <AdminHeader title="Settings" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex gap-2 border-b border-neutral-800/80 pb-4">
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'profile' ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-800/60'}`}>
            <User className="w-4 h-4" /> Profile
          </button>
          <button onClick={() => setActiveTab('storage')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'storage' ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-800/60'}`}>
            <HardDrive className="w-4 h-4" /> Storage Paths
          </button>
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Name</label>
                <input required type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Email</label>
                <input required type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Password</label>
                <input type="password" value={profileForm.password || ''} onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white" placeholder="Leave blank to keep unchanged" />
              </div>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg">Save Profile</button>
          </form>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            <form onSubmit={handleAddPath} className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">Add New Disk Path</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Name</label>
                  <input required type="text" value={pathForm.name} onChange={(e) => setPathForm({ ...pathForm, name: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white" placeholder="e.g. Movies Drive" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Path</label>
                  <input required type="text" value={pathForm.path} onChange={(e) => setPathForm({ ...pathForm, path: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white" placeholder="/mnt/movies" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Max Limit (GB)</label>
                  <input required type="number" min="1" value={pathForm.maxLimitValue} onChange={(e) => setPathForm({ ...pathForm, maxLimitValue: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-white" />
                </div>
              </div>
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold text-xs rounded-lg hover:bg-neutral-200">
                <Plus className="w-4 h-4" /> Add Path
              </button>
            </form>

            <div className="space-y-3">
              {diskPaths.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{item.path}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">Quota: {item.maxLimitGb} GB (Used: {item.usedGb} GB)</p>
                  </div>
                  <button onClick={() => handleDeletePath(item.id)} className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
