import { create } from "zustand";
import {login, register} from "../api/auth"

export const useAuthstore = create((set) => ({
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await login(credentials);

      const token =
        data?.token ||
        data?.accessToken ||
        data?.value?.token ||
        data?.value?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken;

      if (!token) throw new Error("Token topilmadi!");

      localStorage.setItem("token", token);
      set({ token, isLoading: false });
      return { success: true };
    } catch (err) {
      set({
        isLoading: false,
        error: err?.response?.data?.message || err?.message || "Login xato",
      });
      return { success: false };
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await register(payload);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      set({
        isLoading: false,
        error: err?.response?.data?.message || err?.message || "Registratsiya xatosi",
      });
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },
}));
