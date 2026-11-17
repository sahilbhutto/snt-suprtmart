import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
}

interface AuthState {
  user: AuthUser | null;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
}

/**
 * TEMPORARY. When the backend exists, the session lives in an httpOnly cookie
 * and this store is filled from GET /api/me. Never keep tokens in localStorage.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: "snt-auth" },
  ),
);

export const useIsAuthenticated = () => useAuthStore((s) => s.user !== null);
