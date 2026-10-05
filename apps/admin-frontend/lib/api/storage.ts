import { apiClient } from './client';

export interface StoragePathItem {
  id: string;
  name: string;
  path: string;
  maxLimitGb: number;
  usedGb?: number | null;
}

export interface CreateStoragePathInput {
  name: string;
  path: string;
  maxLimitGb: number;
}

export type UpdateStoragePathInput = Partial<CreateStoragePathInput>;

export interface StorageMetrics {
  totalMaxLimitGb: number;
  totalUsedGb: number;
  totalFreeGb: number;
}

export const storageApi = {
  getPaths: async (): Promise<StoragePathItem[]> => {
    return apiClient<StoragePathItem[]>('/storage/paths');
  },

  createPath: async (data: CreateStoragePathInput): Promise<StoragePathItem> => {
    return apiClient<StoragePathItem>('/storage/paths', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updatePath: async (id: string, data: UpdateStoragePathInput): Promise<StoragePathItem> => {
    return apiClient<StoragePathItem>(`/storage/paths/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deletePath: async (id: string): Promise<StoragePathItem> => {
    return apiClient<StoragePathItem>(`/storage/paths/${id}`, {
      method: 'DELETE',
    });
  },

  getMetrics: async (): Promise<StorageMetrics> => {
    return apiClient<StorageMetrics>('/storage/metrics');
  },
};
