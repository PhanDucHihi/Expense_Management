/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { error } from "console";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

export const apiPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

apiPrivate.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/auth/refresh-token");
        const newAccessToken = res.data.accessToken;

        // Lưu vào Zustand
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Gắn lại vào request cũ
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiPrivate(originalRequest);
      } catch (error) {
        useAuthStore.getState().setAccessToken(null);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
