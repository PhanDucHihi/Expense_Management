import { Category } from "./category";
import { Wallet } from "./wallet";

export type Transaction = {
  id: number;
  amount: number;
  type: "EXPENSE" | "INCOME";
  transaction_date: string; // ISO date string
  note: string;
  walletId: number;
  categoryId: number;
  userId: number;
  wallet: Wallet;
  category: Category;
};
