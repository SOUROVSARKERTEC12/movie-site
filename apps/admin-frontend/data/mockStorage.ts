import { DiskStoragePath, AdminProfileConfig } from '@movie-site/shared';

export const STORAGE_PATHS_KEY = 'cineblack_disk_paths';
export const ADMIN_PROFILE_KEY = 'cineblack_admin_profile';

export const DEFAULT_DISK_PATHS: DiskStoragePath[] = [
  {
    id: 'disk_nvme_01',
    name: 'Primary 4K Ultra HD Library',
    path: '/Volumes/CineVault-NVMe/4k-movies',
    category: 'Movies & Series',
    maxLimitGb: 4000, // 4.0 TB
    usedGb: 2840,     // 2.84 TB (71% full)
    status: 'Active',
    isDefault: true,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-05-18T14:32:00.000Z',
  },
  {
    id: 'disk_nvme_cache',
    name: 'HLS Fast Transcode Rail',
    path: '/mnt/fast-nvme/hls-chunks',
    category: 'HLS Chunks / Transcode',
    maxLimitGb: 1500, // 1.5 TB
    usedGb: 630,      // 630 GB (42% full)
    status: 'Active',
    isDefault: false,
    createdAt: '2025-01-15T11:20:00.000Z',
    updatedAt: '2025-05-20T09:15:00.000Z',
  },
  {
    id: 'disk_hdd_bangla',
    name: 'Bangla & Regional Vault',
    path: '/Volumes/StoragePool-2/bangla-catalog',
    category: 'Movies & Series',
    maxLimitGb: 2500, // 2.5 TB
    usedGb: 2150,     // 2.15 TB (86% full - High usage)
    status: 'Warning',
    isDefault: false,
    createdAt: '2025-02-01T10:00:00.000Z',
    updatedAt: '2025-05-22T17:45:00.000Z',
  },
  {
    id: 'disk_trailers_ssd',
    name: 'Trailers & Promotional Media',
    path: '/mnt/media/trailers-and-backdrops',
    category: 'Trailers & Previews',
    maxLimitGb: 800,  // 800 GB
    usedGb: 240,      // 240 GB (30% full)
    status: 'Active',
    isDefault: false,
    createdAt: '2025-02-14T12:00:00.000Z',
    updatedAt: '2025-05-15T08:10:00.000Z',
  },
  {
    id: 'disk_cold_backup',
    name: 'Disaster Recovery Cold Storage',
    path: '/Volumes/ColdStorage/archive-snapshots',
    category: 'Backups',
    maxLimitGb: 6000, // 6.0 TB
    usedGb: 1500,     // 1.5 TB (25% full)
    status: 'Active',
    isDefault: false,
    createdAt: '2025-03-01T15:30:00.000Z',
    updatedAt: '2025-05-19T11:00:00.000Z',
  },
];

export const DEFAULT_ADMIN_PROFILE: AdminProfileConfig = {
  id: 'usr_root_001',
  name: 'Sourov Sarker',
  email: 'admin@cineblack.tv',
  title: 'SecOps & Infrastructure Lead',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  role: 'super_admin',
  phone: '+880 1712-345678',
  department: 'Global Operations & Streaming Infrastructure',
  location: 'Dhaka, Bangladesh',
  bio: 'Overseeing global streaming telemetry, edge CDN clusters, local storage arrays, and real-time transcode workers for CineBlack.',
  notificationsEnabled: true,
  twoFactorEnabled: true,
  lastUpdated: '2025-05-22T12:00:00.000Z',
};

/**
 * Format raw GB size into human-readable representation (GB or TB).
 */
export function formatStorageSize(gb: number): string {
  if (gb >= 1000) {
    const tb = gb / 1000;
    return `${tb % 1 === 0 ? tb.toFixed(0) : tb.toFixed(2)} TB`;
  }
  return `${gb % 1 === 0 ? gb.toFixed(0) : gb.toFixed(1)} GB`;
}

/**
 * Format bytes into human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Calculate aggregated storage statistics across all configured paths.
 */
export function getStorageAggregateMetrics(paths: DiskStoragePath[]) {
  const totalLimitGb = paths.reduce((sum, p) => sum + (p.maxLimitGb || 0), 0);
  const totalUsedGb = paths.reduce((sum, p) => sum + (p.usedGb || 0), 0);
  const totalRemainGb = Math.max(0, totalLimitGb - totalUsedGb);
  const percentFull = totalLimitGb > 0 ? (totalUsedGb / totalLimitGb) * 100 : 0;
  const percentRemain = Math.max(0, 100 - percentFull);
  const warningCount = paths.filter((p) => (p.usedGb / (p.maxLimitGb || 1)) >= 0.85).length;
  const activeCount = paths.filter((p) => p.status === 'Active').length;

  return {
    totalLimitGb,
    totalUsedGb,
    totalRemainGb,
    percentFull: Number(percentFull.toFixed(1)),
    percentRemain: Number(percentRemain.toFixed(1)),
    pathCount: paths.length,
    warningCount,
    activeCount,
  };
}

/**
 * Retrieve all disk storage paths from localStorage or fallback to defaults.
 */
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

/**
 * Persist disk storage paths to localStorage and trigger real-time event.
 */
export function saveDiskStoragePaths(paths: DiskStoragePath[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_PATHS_KEY, JSON.stringify(paths));
    window.dispatchEvent(new CustomEvent('cineblack_storage_updated', { detail: paths }));
  }
}

/**
 * Retrieve the current admin profile from localStorage or fallback to default.
 */
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

/**
 * Persist admin profile to localStorage and trigger real-time event.
 */
export function saveAdminProfile(profile: AdminProfileConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('cineblack_profile_updated', { detail: profile }));
  }
}
