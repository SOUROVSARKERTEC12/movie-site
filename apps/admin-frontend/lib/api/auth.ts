import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async (): Promise<AdminProfile> => {
    return apiClient<AdminProfile>('/admin/profile', {
      method: 'GET',
    });
  },
};
