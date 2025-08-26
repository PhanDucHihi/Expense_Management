import { apiPrivate } from "@/lib/api";
import { Wallet } from "@/types/wallet";

export const getAllWallet = async (): Promise<Wallet[]> => {
  const res = await apiPrivate.get("/wallet");
  return res.data;
};
