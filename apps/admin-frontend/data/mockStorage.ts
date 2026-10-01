import { DiskStoragePath, AdminProfileConfig } from '@movie-site/shared';

export const STORAGE_PATHS_KEY = 'cineblack_disk_paths';
export const ADMIN_PROFILE_KEY = 'cineblack_admin_profile';

export const DEFAULT_DISK_PATHS: DiskStoragePath[] = [
  {
    id: 'disk_nvme_01',
    name: 'Primary 4K Ultra HD Library',
    path: '/Volumes/CineVault-NVMe/4k-movies',
    maxLimitGb: 4000,
    usedGb: 2840,
  },
  {
    id: 'disk_nvme_cache',
    name: 'HLS Fast Transcode Rail',
    path: '/mnt/fast-nvme/hls-chunks',
    maxLimitGb: 1500,
    usedGb: 630,
  }
];

export const DEFAULT_ADMIN_PROFILE: AdminProfileConfig = {
  name: 'Admin User',
  email: 'admin@cineblack.tv',
};

export function formatStorageSize(gb: number): string {
  if (gb >= 1000) {
    const tb = gb / 1000;
    return `${tb % 1 === 0 ? tb.toFixed(0) : tb.toFixed(2)} TB`;
  }
  return `${gb % 1 === 0 ? gb.toFixed(0) : gb.toFixed(1)} GB`;
}

export function getStorageAggregateMetrics(paths: DiskStoragePath[]) {
  const totalLimitGb = paths.reduce((sum, p) => sum + (p.maxLimitGb || 0), 0);
  const totalUsedGb = paths.reduce((sum, p) => sum + (p.usedGb || 0), 0);
  const totalRemainGb = Math.max(0, totalLimitGb - totalUsedGb);
  const percentFull = totalLimitGb > 0 ? (totalUsedGb / totalLimitGb) * 100 : 0;
  const percentRemain = Math.max(0, 100 - percentFull);

  return {
    totalLimitGb,
    totalUsedGb,
    totalRemainGb,
    percentFull: Number(percentFull.toFixed(1)),
    percentRemain: Number(percentRemain.toFixed(1)),
    pathCount: paths.length,
  };
}

export function getDiskStoragePaths(): DiskStoragePath[] {
  if (typeof window === 'undefined') {
    return DEFAULT_DISK_PATHS;
  }

  const saved = localStorage.getItem(STORAGE_PATHS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse storage paths from localStorage', e);
    }
  }

  localStorage.setItem(STORAGE_PATHS_KEY, JSON.stringify(DEFAULT_DISK_PATHS));
  return DEFAULT_DISK_PATHS;
}

export function saveDiskStoragePaths(paths: DiskStoragePath[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_PATHS_KEY, JSON.stringify(paths));
    window.dispatchEvent(new CustomEvent('cineblack_storage_updated', { detail: paths }));
  }
}

export function getAdminProfile(): AdminProfileConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_ADMIN_PROFILE;
  }

  const saved = localStorage.getItem(ADMIN_PROFILE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.name) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse admin profile from localStorage', e);
    }
  }

  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(DEFAULT_ADMIN_PROFILE));
  return DEFAULT_ADMIN_PROFILE;
}

export function saveAdminProfile(profile: AdminProfileConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('cineblack_profile_updated', { detail: profile }));
  }
}
