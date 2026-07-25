import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const checkVoucher = (flightNumber, date) =>
  api.post("/api/check", { flightNumber, date });

export const generateVoucher = (payload) =>
  api.post("/api/generate", payload);

export default api;