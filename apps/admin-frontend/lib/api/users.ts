import { apiClient } from './client';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  totalWatchTimeHours?: number | null;
  moviesWatchedCount?: number | null;
  createdAt?: string | Date | null;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}

export const usersApi = {
  findAll: async (): Promise<UserItem[]> => {
    return apiClient<UserItem[]>('/users');
  },

  findOne: async (id: string): Promise<UserItem> => {
    return apiClient<UserItem>(`/users/${id}`);
  },

  create: async (data: CreateUserInput): Promise<UserItem> => {
    return apiClient<UserItem>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateUserInput): Promise<UserItem> => {
    return apiClient<UserItem>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  remove: async (id: string): Promise<{ success: boolean }> => {
    return apiClient<{ success: boolean }>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};
