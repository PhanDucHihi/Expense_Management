import z from "zod";

export const budgetSchema = z
  .object({
    amount_limit: z.number().positive("Số tiền phải > 0"),
    start_date: z.string(),
    end_date: z.string(),
    walletId: z.number(),
    categoryId: z.number(),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["end_date"],
  });

export type budgetSchemaType = z.infer<typeof budgetSchema>;
