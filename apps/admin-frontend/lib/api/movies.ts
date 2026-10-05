import { apiClient } from './client';

export interface MovieItem {
  id: string;
  title: string;
  originalTitle?: string | null;
  description: string;
  category: string;
  subcategory?: string | null;
  releaseYear: number;
  rating: number;
  duration: string;
  language: string;
  quality: string;
  poster?: string | null;
  backdrop?: string | null;
  videoUrl?: string | null;
  trailerUrl?: string | null;
  trailerYoutubeId?: string | null;
  director: string;
  status?: string | null;
  createdAt?: string | Date | null;
}

export interface CreateMovieInput {
  title: string;
  originalTitle?: string;
  description: string;
  category: string;
  subcategory?: string;
  releaseYear: number;
  rating: number;
  duration: string;
  language: string;
  quality: string;
  poster?: string;
  backdrop?: string;
  videoUrl?: string;
  trailerUrl?: string;
  trailerYoutubeId?: string;
  director: string;
  status?: 'Published' | 'Draft' | 'Featured' | 'Archived';
}

export type UpdateMovieInput = Partial<CreateMovieInput>;

export const moviesApi = {
  findAll: async (): Promise<MovieItem[]> => {
    return apiClient<MovieItem[]>('/movies');
  },

  findOne: async (id: string): Promise<MovieItem> => {
    return apiClient<MovieItem>(`/movies/${id}`);
  },

  create: async (data: CreateMovieInput): Promise<MovieItem> => {
    return apiClient<MovieItem>('/movies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateMovieInput): Promise<MovieItem> => {
    return apiClient<MovieItem>(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<MovieItem> => {
    return apiClient<MovieItem>(`/movies/${id}`, {
      method: 'DELETE',
    });
  },
};
