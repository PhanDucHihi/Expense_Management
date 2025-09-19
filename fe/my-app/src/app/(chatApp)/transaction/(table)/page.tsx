/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useSearchParams, useRouter } from "next/navigation";
import { useWalletStore } from "@/store/walletStore";
import { getTransactionsByMonth } from "@/utils/apis/transactionApi";
import { transactionColumns } from "./transactionColumns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllWallet } from "@/utils/apis/walletApi";

export default function TransactionTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentWallet, setCurrentWallet } = useWalletStore();

  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  const [month, setMonth] = useState<number>(
    monthParam ? Number(monthParam) : new Date().getMonth() + 1
  );
  const [year, setYear] = useState<number>(
    yearParam ? Number(yearParam) : new Date().getFullYear()
  );

  // Frontend pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  const walletId = currentWallet?.id;

  const updateUrl = (newYear: number, newMonth: number) => {
    router.replace(`/transaction?year=${newYear}&month=${newMonth}`);
  };

  const onMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    setPage(1);
    updateUrl(year, newMonth);
  };

  const onYearChange = (newYear: number) => {
    setYear(newYear);
    setPage(1);
    updateUrl(newYear, month);
  };

  const { data: transactionsAll, isLoading } = useQuery({
    queryKey: ["transactions", walletId, year, month],
    queryFn: async () => {
      if (!walletId) return [];
      return await getTransactionsByMonth(walletId, year, month);
    },
    enabled: !!walletId,
  });

  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      return await getAllWallet();
    },
  });

  const total = transactionsAll?.length ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const transactions = useMemo(() => {
    if (!transactionsAll) return [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return transactionsAll.slice(start, end);
  }, [transactionsAll, page, pageSize]);

  const table = useReactTable({
    data: transactions,
    columns: transactionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!currentWallet)
    return <p className="text-center text-gray-500">Please select a wallet</p>;
  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        {walletsLoading ? (
          <p>Loading wallets...</p>
        ) : (
          <Select
            value={currentWallet?.id.toString() ?? ""}
            onValueChange={(val) => {
              const selected = wallets?.find((w) => w.id.toString() === val);
              if (selected) setCurrentWallet(selected); // setCurrentWallet từ store
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
        )}

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

      {/* <div className="flex gap-2 mb-4">
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
      </div> */}

      <table className="w-full border border-gray-200 bg-card">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2 text-left">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-700"
              onClick={() => {
                const transactionId = row.original.id; // 👈 lấy id từ dữ liệu gốc
                router.push(`/transaction/${transactionId}`);
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div>
          <Button
            className="px-3 py-1 border rounded mr-2"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <Button
            className="px-3 py-1 border rounded"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
        <div>
          Page {page} of {totalPages} | Total {total} transactions
        </div>
      </div>
    </div>
  );
}
