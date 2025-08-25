"use client";

import ErrorMessage from "@/components/error-message";
import { apiPrivate } from "@/lib/api";
import { Wallet } from "@/types/wallet";
import { formatNumber } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CircleEllipsis } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MyWallets() {
  const router = useRouter();

  const setCurrentWallet = useWalletStore((state) => state.setCurrentWallet);

  const { data: wallets } = useQuery<Wallet[]>({
    queryKey: ["wallets"],
    queryFn: async () => {
      const res = await apiPrivate.get("/wallet");
      return res.data;
    },
  });

  const totalBalance = wallets?.reduce((sum, w) => sum + Number(w.balance), 0);

  if (!wallets) {
    return <ErrorMessage />;
  }

  return (
    <>
      <div className="mt-10 space-y-5">
        <div className="bg-card flex items-center gap-5 py-5 px-5 rounded-2xl">
          <Image
            src="/images/total.jpg"
            alt="Total"
            width={30}
            height={30}
            className="object-cover rounded-full"
          />
          <div>
            <p className="text-xl">Tổng cộng</p>
            <span className="text-gray-400">
              {formatNumber(totalBalance!)} đ
            </span>
          </div>
        </div>

        <p className="px-5">Tính vào tổng</p>

        <div className="bg-card px-5 py-5 space-y-5 rounded-2xl">
          {wallets.map((w) => (
            <div
              key={w.id}
              className="flex justify-between items-center"
              onClick={() => {
                setCurrentWallet(w);
                router.push(`/transaction`);
              }}
            >
              <div className="flex items-center gap-5">
                <Image
                  src="/images/wallet.jpg"
                  alt="wallet picture"
                  width={30}
                  height={30}
                  className="object-cover rounded-full"
                />
                <div>
                  <p>{w.name}</p>
                  <span className="text-gray-400">
                    {formatNumber(w.balance)} đ
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CircleEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => alert("Edit")}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert("Delete")}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
