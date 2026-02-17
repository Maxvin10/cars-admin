import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "../api/auth";

const STORAGE_KEY = "car-admin-auth";

function formatApiError(err, fallback) {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    const parts = [];
    for (const key of Object.keys(data.errors)) {
      const arr = data.errors[key];
      if (Array.isArray(arr) && arr.length) parts.push(arr.join(". "));
    }
    if (parts.length) return parts.join(" ");
  }
  return (
    data?.message ??
    data?.title ??
    data?.error ??
    err?.message ??
    fallback
  );
}

/** @type {() => string | null} */
function getStoredToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export const useAuthstore = create(
  persist(
    (set, get) => ({
      token: getStoredToken(),
      user: null,
      isLoading: false,
      error: null,

      setToken: (token) => {
        if (token) localStorage.setItem("token", token);
        set({ token });
      },

      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login(credentials);
          const value = data?.value ?? data;
          const token = value?.accessToken ?? value?.token ?? data?.accessToken ?? data?.token ?? null;
          const user = value?.user ?? data?.user ?? null;
          if (!token) throw new Error("Token topilmadi");
          localStorage.setItem("token", token);
          set({
            token,
            user,
            isLoading: false,
            error: null,
          });
          return { success: true };
        } catch (err) {
          const message = formatApiError(err, "Login amalga oshmadi");
          set({
            isLoading: false,
            error: message,
          });
          return { success: false, error: message };
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.register(payload);
          const value = data?.value ?? data;
          const token = value?.accessToken ?? value?.token ?? data?.accessToken ?? data?.token ?? null;
          const user = value?.user ?? data?.user ?? null;
          if (token) {
            localStorage.setItem("token", token);
            set({
              token,
              user,
              isLoading: false,
              error: null,
            });
            return { success: true, hasToken: true };
          }
          set({ isLoading: false, error: null });
          return { success: true, hasToken: false };
        } catch (err) {
          const message = formatApiError(err, "Ro‘yxatdan o‘tish amalga oshmadi");
          set({
            isLoading: false,
            error: message,
          });
          return { success: false, error: message };
        }
      },

      logout: () => {
        try {
          localStorage.removeItem("token");
        } catch {}
        set({ token: null, user: null, error: null });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          try {
            localStorage.setItem("token", state.token);
          } catch {}
        }
      },
    }
  )
);
