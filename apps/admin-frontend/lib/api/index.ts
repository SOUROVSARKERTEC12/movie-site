export * from './client';
export * from './auth';
export * from './movies';
export * from './categories';
export * from './users';
export * from './storage';
export * from './logs';
export * from './system';

import { authApi } from './auth';
import { moviesApi } from './movies';
import { categoriesApi } from './categories';
import { usersApi } from './users';
import { storageApi } from './storage';
import { logsApi } from './logs';
import { systemApi } from './system';

export const api = {
  auth: authApi,
  movies: moviesApi,
  categories: categoriesApi,
  users: usersApi,
  storage: storageApi,
  logs: logsApi,
  system: systemApi,
};

export default api;
