"use client";

import { apiPrivate } from "@/lib/api";
import { useWalletStore } from "@/store/walletStore";
import { Wallet, WalletType } from "@/types/wallet";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WalletList() {
  const router = useRouter();

  const { data: wallets } = useQuery<Wallet[]>({
    queryKey: ["wallets"],
    queryFn: async () => {
      const res = await apiPrivate.get("/wallet");
      console.log(res);
      return res.data;
    },
  });

  const setCurrentWallet = useWalletStore((state) => state.setCurrentWallet);

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      console.log("hello");

      const basisWallet = wallets.find((w) => w.type === WalletType.BASIS);
      console.log(basisWallet, "hererree");

      if (basisWallet) {
        setCurrentWallet(basisWallet);
      }
    }
  }, [wallets, setCurrentWallet]);

  const latestWallets = wallets ? wallets.slice(-3).reverse() : [];

  return (
    <div className="space-y-4 w-full">
      {/* Danh sách wallet */}
      <div className="bg-card rounded-2xl p-2">
        <div className="grid grid-cols-3 border-b border-gray-500 p-5 gap-4">
          <h3 className="text-2xl">My Wallets</h3>
          <p className="text-green-200 text-center">Type</p>
          <p
            className="text-green-600 text-center cursor-pointer"
            onClick={() => {
              router.push("/home/wallet");
            }}
          >
            See all
          </p>
        </div>
        {latestWallets.map((wallet) => (
          <div
            key={wallet.id}
            className="grid grid-cols-3 gap-4 text-center border-b border-gray-500 p-5 last:border-b-0 cursor-pointer hover:bg-gray-600"
            onClick={() => {
              setCurrentWallet(wallet);
              router.push(`/transaction`);
            }}
          >
            <div className="flex gap-2">
              <Image
                src="/images/wallet.jpg"
                alt="wallet picture"
                width={30}
                height={30}
                className="object-cover rounded-full"
              />
              <div>{wallet.name}</div>
            </div>

            <div>{wallet.type}</div>
            <div>{wallet.balance} Đ</div>
          </div>
        ))}
      </div>
    </div>
  );
}
