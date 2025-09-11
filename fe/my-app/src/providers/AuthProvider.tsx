"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.post("/auth/refresh-token"); // cookie tự động gửi
        console.log(res);
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch {
        // user chưa login thì không làm gì
      }
    };

    checkAuth();
  }, [setUser, setAccessToken]);

  return <>{children}</>;
}
