import SignUpForm from "./signupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký | My App",
  description: "Tạo tài khoản mới để bắt đầu sử dụng My App",
};

export default function SignupPage() {
  return <SignUpForm />;
}
