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

export const getTransaction = async (id: number): Promise<Transaction> => {
  const res = await apiPrivate.get(`/transaction/${id}`);
  return res.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await apiPrivate.delete(`/transaction/${id}`);
};
