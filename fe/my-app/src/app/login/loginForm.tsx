"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { loginSchema, loginType } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import InputWithLabel from "@/components/inputs-form/InputWithLabel";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import Link from "next/link";
import Loading from "@/components/loading";

export default function LoginForm() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.replace("/home"); // nếu đã login thì chuyển hướng sang home
    }
  }, [accessToken, router]);

  const form = useForm<loginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: loginType) => {
      const res = await api.post("/auth/login", data);
      console.log(res);
      return res.data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Email or password is invalid");
      } else {
        toast.error("Something went wrong");
      }
    },
    onSuccess: (data) => {
      console.log(data);
      router.push("/home");
      setAccessToken(data.accessToken);
      setUser(data.user);
      toast.success("Login successfully");
    },
  });

  const handleLogin = (values: loginType) => {
    mutate(values);
    // TODO: Gọi API đăng nhập
  };

  if (accessToken) {
    return null; // tránh render form login trong lúc redirect
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: "url('/images/background-login.jpg')" }}
    >
      <div className="w-full max-w-sm bg-card p-6 rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            <InputWithLabel<loginType>
              nameInSchema="email"
              fieldTitle="Email"
            />
            <InputWithLabel<loginType>
              nameInSchema="password"
              fieldTitle="Mật khẩu"
              type="password"
            />
            <div className="flex flex-col gap-2">
              <Button
                disabled={isPending}
                type="submit"
                className="w-full cursor-pointer"
              >
                {isPending ? <Loading /> : "Đăng nhập"}
              </Button>

              <p className="text-sm text-center">
                Chưa có tài khoản?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-bold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
