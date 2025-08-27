"use client";

import { useWalletStore } from "@/store/walletStore";
import { getBudgetsByMonth } from "@/utils/apis/budgetApi";
import { getAllWallet } from "@/utils/apis/walletApi";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import BudgetCard from "./BudgetCard";

export default function BudgetDashBoard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentWallet, setCurrentWallet } = useWalletStore();

  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  const [month, setMonth] = useState<number>(
    monthParam ? Number(monthParam) : new Date().getMonth() + 1
  );
  const [year, setYear] = useState<number>(
    yearParam ? Number(yearParam) : new Date().getFullYear()
  );

  const updateUrl = (newYear: number, newMonth: number) => {
    router.replace(`/budget?year=${newYear}&month=${newMonth}`);
  };

  const onMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    updateUrl(year, newMonth);
  };

  const onYearChange = (newYear: number) => {
    setYear(newYear);
    updateUrl(newYear, month);
  };

  const { data: budgets, isLoading } = useQuery({
    queryKey: ["budgets", currentWallet?.id, year, month],
    queryFn: async () => {
      if (!currentWallet?.id) return [];
      return await getBudgetsByMonth(currentWallet.id, year, month);
    },
    enabled: !!currentWallet?.id,
  });

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      return await getAllWallet();
    },
  });

  if (!currentWallet)
    return <p className="text-center text-gray-500">Please select a wallet</p>;
  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      {/* Wallet + Month/Year selectors */}
      <div className="flex gap-4 items-center">
        <Select
          value={currentWallet?.id.toString() ?? ""}
          onValueChange={(val) => {
            const selected = wallets?.find((w) => w.id.toString() === val);
            if (selected) setCurrentWallet(selected);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select wallet" />
          </SelectTrigger>
          <SelectContent>
            {wallets?.map((wallet) => (
              <SelectItem key={wallet.id} value={wallet.id.toString()}>
                {wallet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={month.toString()}
          onValueChange={(val) => onMonthChange(Number(val))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <SelectItem key={m} value={m.toString()}>
                Month {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          placeholder="Year"
          className="w-28"
        />
      </div>

      {/* Budget Cards */}
      {budgets?.length === 0 ? (
        <p className="text-center text-gray-500">No budgets found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets?.map((b) => (
            <BudgetCard key={b.id} budget={b} />
          ))}
        </div>
      )}
    </div>
  );
}
