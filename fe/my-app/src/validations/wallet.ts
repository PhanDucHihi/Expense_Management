// types/walletSchema.ts
import { z } from "zod";
import { WalletType } from "@/types/wallet";

export const walletSchema = z.object({
  name: z.string().min(1, "Tên ví không được để trống"),
  type: z.nativeEnum(WalletType),
  balance: z.number(),
  targetAmount: z.number().min(1, "Số tiền mục tiêu phải lớn hơn 0").optional(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Deadline phải là ngày hợp lệ")
    .optional(),
});

export type walletSchemaType = z.infer<typeof walletSchema>;
