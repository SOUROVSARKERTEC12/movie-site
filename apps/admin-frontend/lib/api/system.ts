import { apiClient } from './client';

export interface StorageTelemetry {
  total: number;
  free: number;
  used: number;
}

export const systemApi = {
  getStorageTelemetry: async (): Promise<StorageTelemetry> => {
    return apiClient<StorageTelemetry>('/system/storage');
  },
};
