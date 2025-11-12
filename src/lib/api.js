import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    "x-admin-key": import.meta.env.VITE_ADMIN_KEY || ""
  },
  withCredentials: false,
});

// EXISTING
export const getHealth = () => api.get("/health");
export const listDeposits = () => api.get("/api/deposits");
export const approveDeposit = (id) => api.post("/api/deposit/approve", { id });
export const rejectDeposit  = (id) => api.post("/api/deposit/reject",  { id });

export const listWithdrawals = () => api.get("/api/withdrawals");
export const approveWithdraw = (id) => api.post("/api/withdraw/approve", { id });
export const rejectWithdraw  = (id) => api.post("/api/withdraw/reject",  { id });

export const listUsers = () => api.get("/api/users");

// NEW: Banks
export const listBanks   = () => api.get("/api/banks");
export const createBank  = (payload) => api.post("/api/banks", payload);
export const updateBank  = (id, payload) => api.put(`/api/banks/${id}`, payload);
export const deleteBank  = (id) => api.delete(`/api/banks/${id}`);

// NEW: History
export const listHistory = (params) => api.get("/api/history", { params });

export default api;
