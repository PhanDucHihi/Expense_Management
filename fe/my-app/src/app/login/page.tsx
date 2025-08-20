import type { Metadata } from "next";
import LoginForm from "./loginForm";

export const metadata: Metadata = {
  title: "Đăng nhập | My App",
  description: "Đăng nhập để sử dụng My App",
};

export default function LoginPage() {
  return <LoginForm />;
}
