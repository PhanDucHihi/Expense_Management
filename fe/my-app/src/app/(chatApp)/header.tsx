"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BackButton from "@/components/back-button";
import { WalletType } from "@/types/wallet";
import WalletForm from "./home/wallet/walletForm";
import TransactionForm from "./transaction/transactionForm";
import BudgetForm from "./budget/budgetForm";

export enum ActionType {
  WALLET = "wallet",
  TRANSACTION = "transaction",
  BUDGET = "budget",
}

type Props = {
  title: string;
  actionType: ActionType;
};

export default function Header({ title, actionType }: Props) {
  console.log("actionType:", actionType);
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<WalletType | null>(null);

  function renderDialogContent() {
    switch (actionType) {
      case ActionType.WALLET:
        return (
          <>
            {!selectedType ? (
              <>
                <DialogHeader>
                  <DialogTitle>Chọn loại ví</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <Button
                    variant="outline"
                    className="w-full py-6 text-base rounded-xl border-2 hover:border-destructive"
                    onClick={() => setSelectedType(WalletType.BASIS)}
                  >
                    💳 Ví cơ bản
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-6 text-base rounded-xl border-2 hover:border-destructive"
                    onClick={() => setSelectedType(WalletType.GOAL)}
                  >
                    🏦 Ví tiết kiệm
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {selectedType === WalletType.BASIS
                      ? "Tạo ví cơ bản"
                      : "Tạo ví tiết kiệm"}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <WalletForm
                    selectedType={selectedType}
                    onSuccess={() => {
                      setSelectedType(null);
                      setOpen(false); // đóng dialog
                    }}
                  />
                </div>
                <div className="flex justify-center mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedType(null)}
                    className="text-sm"
                  >
                    ← Quay lại chọn loại ví
                  </Button>
                </div>
              </>
            )}
          </>
        );
      case ActionType.TRANSACTION:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Tạo giao dịch</DialogTitle>
            </DialogHeader>
            {/* Form giao dịch */}
            <TransactionForm
              onSuccess={() => {
                setOpen(false); // đóng dialog
              }}
            />
          </>
        );
      case ActionType.BUDGET:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Tạo ngân sách</DialogTitle>
            </DialogHeader>
            {/* Form budget */}
            <BudgetForm
              onSuccess={() => {
                setOpen(false);
              }}
            />
          </>
        );
      default:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Thông báo</DialogTitle>
            </DialogHeader>
          </>
        );
    }
  }

  return (
    <div className="flex justify-between items-center">
      <BackButton />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            {title}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
