import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type loginType = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(6, "Name must be at least 6 characters"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // lỗi sẽ hiển thị ở confirmPassword
  });

export type signupType = z.infer<typeof signupSchema>;
