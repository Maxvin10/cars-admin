import { api } from "./axios";

const CAR_BASE = "/api/Car";

export const getCars = async (params = {}) => {
  const res = await api.get(CAR_BASE, { params });
  return res.data;
};

export const getCarById = async (id) => {
  const res = await api.get(`${CAR_BASE}/get-car-id`, { params: { id } });
  return res.data;
};


export const createCar = async (params) => {
  const res = await api.post(CAR_BASE, null, { params });
  return res.data;
};


export const updateCar = async (id, params) => {
  const res = await api.put(`${CAR_BASE}/${id}`, null, { params });
  return res.data;
};


export const deleteCar = async (id) => {
  const res = await api.delete(`${CAR_BASE}/${id}`);
  return res.data;
};
