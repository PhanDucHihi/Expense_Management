"use client";

import InputWithLabel from "@/components/inputs-form/InputWithLabel";
import { signupType, signupSchema } from "@/validations/auth";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function SignUpForm() {
  const router = useRouter();

  const form = useForm<signupType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: signupType) => {
      const res = await api.post("/user", data);
      console.log(res);
      return res.data;
    },
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      router.push("/login");
    },
  });

  const handleSignup = (values: signupType) => {
    mutate(values);
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-center bg-cover"
        style={{ backgroundImage: "url('/images/background-login.jpg')" }}
      >
        <div className="w-full max-w-sm bg-card p-6 rounded-xl shadow-lg border">
          <h1 className="text-2xl font-bold text-center mb-6">Đăng ký</h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className="space-y-4"
            >
              <InputWithLabel<signupType>
                nameInSchema="name"
                fieldTitle="Tên người dùng"
              />
              <InputWithLabel<signupType>
                nameInSchema="email"
                fieldTitle="Email"
              />
              <InputWithLabel<signupType>
                nameInSchema="password"
                fieldTitle="Mật khẩu"
                type="password"
              />
              <InputWithLabel<signupType>
                nameInSchema="confirmPassword"
                fieldTitle="Xác nhận mật khẩu"
                type="password"
              />

              <Button
                disabled={isPending}
                type="submit"
                className="w-full cursor-pointer"
              >
                {isPending ? <Loading /> : "Đăng ký"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
