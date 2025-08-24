"use client";

import { apiPrivate } from "@/lib/api";
import { Transaction } from "@/types/transition";
import { useQuery } from "@tanstack/react-query";

export default function RecentTransactions() {
  const { data: recentTransactions } = useQuery<Transaction[]>({
    queryKey: ["recentTracsactions"],
    queryFn: async () => {
      const res = await apiPrivate.get("/transaction/recent");
      return res.data;
    },
  });

  return (
    <div className="max-w-xl w-full space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-300">Recent transactions</span>
        <p className="text-green-600 text-center cursor-pointer">See all</p>
      </div>
      <div className="bg-card rounded-2xl p-2">
        {recentTransactions?.map((transaction) => (
          <div
            key={transaction.id}
            className="grid grid-cols-2 gap-4 text-center border-b border-gray-500 p-5 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <span>{transaction.category.icon}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{transaction.category.name}</span>
                <span className="text-sm text-gray-400">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="text-end">
              <span className="ml-auto font-semibold text-red-500">
                {Number(transaction.amount).toLocaleString()} đ
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
