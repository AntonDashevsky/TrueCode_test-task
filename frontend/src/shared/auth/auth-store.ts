import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Tokens } from '@/shared/api/types';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (tokens: Tokens) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),
      clear: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
