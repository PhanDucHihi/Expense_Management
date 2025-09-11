"use client";

import TransactionTale from "./(table)/page";
import Header, { ActionType } from "../header";
import { useWalletStore } from "@/store/walletStore";
import { WalletType } from "@/types/wallet";
import { SavingProgressCard } from "./SavingProgressCard";

export default function Transaction() {
  const currentWallet = useWalletStore((state) => state.currentWallet);

  return (
    <div className="p-5 space-y-5">
      <Header title="Thêm mới giao dịch" actionType={ActionType.TRANSACTION} />

      {currentWallet?.type === WalletType.GOAL && (
        <SavingProgressCard
          balance={currentWallet.balance}
          targetAmount={currentWallet.targetAmount || 0}
          deadline={currentWallet.deadline}
        />
      )}
      <TransactionTale />
    </div>
  );
}
