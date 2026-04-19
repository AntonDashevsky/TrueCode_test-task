import axios from 'axios';
import { useAuthStore } from '@/shared/auth/auth-store';
import type { PagedPosts, Profile, Tokens } from './types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshPromise: Promise<Tokens> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || error.response?.status !== 401) {
      throw error;
    }

    const path = String(originalRequest.url ?? '');
    const isAuthLogin = path.includes('auth/login');
    const isAuthRefresh = path.includes('auth/refresh');
    // Неверный пароль и т.п. - не трогаем refresh и не чистим сессию здесь
    if (isAuthLogin) {
      throw error;
    }
    // Refresh отклонён - сбрасываем локальную сессию
    if (isAuthRefresh) {
      useAuthStore.getState().clear();
      throw error;
    }

    if (originalRequest._retry) {
      useAuthStore.getState().clear();
      throw error;
    }
    originalRequest._retry = true;

    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      useAuthStore.getState().clear();
      throw error;
    }

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post<Tokens>('/auth/refresh', { refreshToken })
          .then((res) => res.data)
          .finally(() => {
            refreshPromise = null;
          });
      }
      const tokens = await refreshPromise;
      useAuthStore.getState().setTokens(tokens);
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return api.request(originalRequest);
    } catch {
      useAuthStore.getState().clear();
      throw error;
    }
  },
);

export const authApi = {
  login: (email: string, password: string) =>
    api
      .post<Tokens>('/auth/login', { email, password })
      .then((res) => res.data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
};

export const profileApi = {
  me: () => api.get<Profile>('/profile/me').then((res) => res.data),
  update: (payload: Partial<Profile>) =>
    api.patch<Profile>('/profile/me', payload).then((res) => res.data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api
      .post<Profile>('/profile/avatar', formData)
      .then((res) => res.data);
  },
};

export const postsApi = {
  list: (page: number, limit: number, sort: 'newest' | 'oldest') =>
    api
      .get<PagedPosts>('/posts', { params: { page, limit, sort } })
      .then((res) => res.data),
  create: (text: string, images: File[]) => {
    const formData = new FormData();
    formData.append('text', text);
    images.forEach((file) => formData.append('images', file));
    return api.post('/posts', formData).then((res) => res.data);
  },
  update: (
    id: string,
    payload: { text?: string; removeImageIds?: string[]; images?: File[] },
  ) => {
    const formData = new FormData();
    if (payload.text !== undefined) formData.append('text', payload.text);
    if (payload.removeImageIds?.length) {
      formData.append('removeImageIds', JSON.stringify(payload.removeImageIds));
    }
    payload.images?.forEach((file) => formData.append('images', file));
    return api.patch(`/posts/${id}`, formData).then((res) => res.data);
  },
  remove: (id: string) => api.delete(`/posts/${id}`),
};
