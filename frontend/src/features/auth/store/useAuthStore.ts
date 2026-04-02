import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthStore, LoginResponse } from '../types/auth';

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  hasHydrated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (payload: LoginResponse) => {
        set({
          accessToken: payload.accessToken,
          user: payload.user,
          isAuthenticated: true,
        });
      },
      clearAuth: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
      setHydrated: (value: boolean) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: 'smhc-auth-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
