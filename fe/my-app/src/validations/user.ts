import { z } from "zod";

export const userUpdateSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  imageUrl: z.string().url("URL ảnh không hợp lệ").optional(),
});

export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;
