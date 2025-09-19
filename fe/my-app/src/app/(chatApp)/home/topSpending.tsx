"use client";

import { apiPrivate } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type TopSpending = {
  categoryId: number;
  category: {
    name: string;
    icon: string;
  } | null;
  total: number;
  percentage: number;
};

export default function TopSpending() {
  const { data: topSpending } = useQuery<TopSpending[]>({
    queryKey: ["topSpending"],
    queryFn: async () => {
      const res = await apiPrivate.get("/transaction/top-spending");
      return res.data;
    },
  });

  return (
    <div className="max-w-xl w-full space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-300">Chi tiêu nhiều nhất</span>
        <p className="text-green-600 text-center cursor-pointer">See all</p>
      </div>
      <div className="bg-card rounded-2xl p-2">
        {topSpending?.map((item) => (
          <div
            key={item.categoryId}
            className="grid grid-cols-2 gap-4 text-center border-b border-gray-500 p-5 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <span>{item.category?.icon}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{item.category?.name}</span>
                <span className="text-sm text-gray-400">
                  {item.percentage}% of total
                </span>
              </div>
            </div>

            <div className="text-end">
              <span className="ml-auto font-semibold text-red-500">
                {Number(item.total).toLocaleString()} đ
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
