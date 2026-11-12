import axios from "axios";
import { API_BASE_URL, DEMO_MODE, LOGIN_ENDPOINT } from "../config/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("atlas_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("atlas_token");
      localStorage.removeItem("atlas_user");
      window.dispatchEvent(new Event("atlas:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  if (DEMO_MODE) {
    const user = { name: "Alex Morgan", role: "Administrator", email };
    localStorage.setItem("atlas_token", "demo-token");
    localStorage.setItem("atlas_user", JSON.stringify(user));
    return user;
  }
  const { data } = await api.post(LOGIN_ENDPOINT, { email, password });
  const token = data.token || data.accessToken || data.data?.token;
  if (!token) throw new Error("Login response did not contain a token. Map the response in src/lib/api.js.");
  localStorage.setItem("atlas_token", token);
  const user = data.user || data.data?.user || { name: "Administrator", role: "Admin", email };
  localStorage.setItem("atlas_user", JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem("atlas_token");
  localStorage.removeItem("atlas_user");
};

export const getList = async (endpoint) => {
  const { data } = await api.get(endpoint);
  const payload = data.data || data.results || data;
  return Array.isArray(payload) ? payload : payload.items || payload.docs || [];
};

export const createRecord = async (endpoint, payload) => (await api.post(endpoint, payload)).data;
export const updateRecord = async (endpoint, id, payload) => (await api.patch(`${endpoint}/${id}`, payload)).data;
export const deleteRecord = async (endpoint, id) => (await api.delete(`${endpoint}/${id}`)).data;
export { DEMO_MODE };