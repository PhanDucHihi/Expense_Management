import { Category } from "./category";
import { Wallet } from "./wallet";

export type Budget = {
  id: number;
  amount_limit: number;
  start_date: string;
  end_date: string;
  userId: number;
  categoryId: number;
  walletId: number;
  category: Category;
  wallet: Wallet;
  spent: number;
  remaining: number;
};
