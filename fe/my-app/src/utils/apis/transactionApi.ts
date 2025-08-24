import { apiPrivate } from "@/lib/api";
import { Transaction } from "@/types/transition";

export const getTransactionsByMonth = async (
  walletId: number,
  year: number,
  month: number
): Promise<Transaction[]> => {
  const res = await apiPrivate.get<Transaction[]>(
    `/transaction/wallet/${walletId}`,
    { params: { year, month } }
  );
  return res.data;
};
