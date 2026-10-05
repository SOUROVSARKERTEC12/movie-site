import { apiClient } from './client';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  isCustom?: boolean | null;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isCustom?: boolean;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export const categoriesApi = {
  findAll: async (): Promise<CategoryItem[]> => {
    return apiClient<CategoryItem[]>('/categories');
  },

  findOne: async (id: string): Promise<CategoryItem> => {
    return apiClient<CategoryItem>(`/categories/${id}`);
  },

  create: async (data: CreateCategoryInput): Promise<CategoryItem> => {
    return apiClient<CategoryItem>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateCategoryInput): Promise<CategoryItem> => {
    return apiClient<CategoryItem>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  remove: async (id: string): Promise<{ success: boolean }> => {
    return apiClient<{ success: boolean }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
