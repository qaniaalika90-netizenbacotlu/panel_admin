// src/lib/api.js
import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_BASE || "https://panel-api-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ---- Health
export const getHealth = () => api.get("/health");

// ---- Deposits
export const listDeposits = () => api.get("/api/deposits");
export const approveDeposit = (id) => api.post("/api/deposit/approve", { id });
export const rejectDeposit = (id) => api.post("/api/deposit/reject", { id });

// ---- Withdrawals
export const listWithdrawals = () => api.get("/api/withdrawals");
export const approveWithdraw = (id) => api.post("/api/withdraw/approve", { id });
export const rejectWithdraw = (id) => api.post("/api/withdraw/reject", { id });

// ---- Members
export const listUsers = () => api.get("/api/users");

// ---- History
export const listHistory = (params = {}) =>
  api.get("/api/history", { params }); // {type,status,limit}

// ---- Banks
export const listBanks = () => api.get("/api/banks");
export const createBank = (payload) => api.post("/api/banks", payload);
export const updateBank = (id, payload) => api.put(`/api/banks/${id}`, payload);
export const deleteBank = (id) => api.delete(`/api/banks/${id}`);

export default api;
