import { api } from "./axios";

export const getUsers = async (params) => {
    const res = await api.get("/api/User", {params});
    return res.data;
};