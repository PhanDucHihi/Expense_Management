import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive("Số tiền phải > 0"),
  transaction_date: z.string(), // "YYYY-MM-DD"
  note: z.string().optional(),
  walletId: z.number(),
  categoryId: z.number(),
});

export type transactionSchemaType = z.infer<typeof transactionSchema>;
