import { api } from "./axios";

const AUTH_BASE = "/api/Auth";

export async function login(credentials) {
  const { data } = await api.post(`${AUTH_BASE}/login`, credentials);
  return data;
}

export async function register(payload) {
  const { data } = await api.post(`${AUTH_BASE}/register`, payload);
  return data;
}
