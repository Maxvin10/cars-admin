import { api } from "./axios";

export async function getCars(params = {}) {
  const { data } = await api.get("/api/Car", { params });
  return data;
}
