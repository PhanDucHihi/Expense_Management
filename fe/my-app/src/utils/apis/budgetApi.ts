import { apiPrivate } from "@/lib/api";
import { Budget } from "@/types/budget";

export const getBudgetsByMonth = async (
  walletId: number,
  year: number,
  month: number
): Promise<Budget[]> => {
  const res = await apiPrivate.get(`/budget/month/${walletId}`, {
    params: { year, month },
  });
  return res.data;
};

export const deleteBudget = async (id: number): Promise<void> => {
  await apiPrivate.delete(`/budget/${id}`);
};
