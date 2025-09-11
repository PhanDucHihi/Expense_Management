"use client";

import { useTransitionStore } from "@/store/transitionStore";
import { Transaction } from "@/types/transition";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function SearchResults() {
  const resultSearch = useTransitionStore((state) => state.resultSearch);

  if (resultSearch.length === 0) {
    return <p className="text-white px-10 text-xl">Không có kết quả</p>;
  }

  // Gom dữ liệu theo ngày
  const grouped = resultSearch.reduce((acc, item) => {
    const dateKey = format(new Date(item.transaction_date), "dd/MM/yyyy", {
      locale: vi,
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="space-y-6 px-5 mb-5">
      {/* dòng tổng số kết quả */}
      <p className="text-xl text-gray-300">
        🔍 Tìm thấy <span className="font-semibold">{resultSearch.length}</span>{" "}
        kết quả
      </p>

      {/* nhóm theo ngày */}
      <div className="space-y-8 max-w-3xl mx-auto">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="space-y-2">
            {/* tiêu đề ngày */}
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              📅 {date}
            </h2>

            {/* danh sách của ngày đó */}
            <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 bg-card">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 gap-4 items-center p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {/* Category */}
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.category?.icon}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-base">
                        {item.category?.name}
                      </span>
                      {item.note && (
                        <span className="text-sm text-gray-400">
                          {item.note}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-end">
                    <span
                      className={`font-bold text-lg ${
                        item.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {Number(item.amount).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
