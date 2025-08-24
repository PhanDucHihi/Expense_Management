"use client";

import { apiPrivate } from "@/lib/api";
import { Wallet } from "@/types/wallet";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function WalletList() {
  const { data: wallets } = useQuery<Wallet[]>({
    queryKey: ["wallets"],
    queryFn: async () => {
      const res = await apiPrivate.get("/wallet");
      console.log(res);
      return res.data;
    },
  });

  return (
    <div className="space-y-4 w-full">
      {/* Form tạo wallet mới */}
      {/* <div className="flex gap-2">
        <input
          value={newWalletName}
          onChange={(e) => setNewWalletName(e.target.value)}
          placeholder="Tên wallet mới"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={() => mutate(newWalletName)}
          disabled={isMutating || !newWalletName}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isMutating ? <Loading className="h-4 w-4" /> : "Thêm"}
        </button>
      </div> */}
      {/* Danh sách wallet */}
      <div className="bg-card rounded-2xl p-2">
        <div className="grid grid-cols-3 border-b border-gray-500 p-5 gap-4">
          <h3 className="text-2xl">My Wallets</h3>
          <p className="text-green-200 text-center">Type</p>
          <p className="text-green-600 text-center cursor-pointer">See all</p>
        </div>
        {wallets?.map((wallet) => (
          <div
            key={wallet.id}
            className="grid grid-cols-3 gap-4 text-center border-b border-gray-500 p-5 last:border-b-0"
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
