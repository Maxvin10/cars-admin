import axios from "axios";

const baseURL = import.meta.env.DEV ? "" : "https://avtosavdo-api.crmuz.uz";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem("token");
      } catch {}
      const event = new CustomEvent("auth:logout");
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  },
);
