"use client";

import ErrorMessage from "@/components/error-message";
import { apiPrivate } from "@/lib/api";
import { Wallet, WalletType } from "@/types/wallet";
import { formatNumber } from "@/utils/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "sonner";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import WalletForm from "./walletForm";

export default function MyWallets() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [walletToDelete, setWalletToDelete] = useState<Wallet | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editWallet, setEditWallet] = useState<Wallet | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const setCurrentWallet = useWalletStore((state) => state.setCurrentWallet);

  const { data: wallets } = useQuery<Wallet[]>({
    queryKey: ["wallets"],
    queryFn: async () => {
      const res = await apiPrivate.get("/wallet");
      return res.data;
    },
  });

  const { mutate: deleteWallet } = useMutation({
    mutationFn: async (walletId: number) => {
      await apiPrivate.delete(`/wallet/${walletId}`);
    },
    onSuccess: () => {
      toast.success("Xóa ví thành công");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  const totalBalance = wallets?.reduce((sum, w) => sum + Number(w.balance), 0);

  if (!wallets) {
    return <ErrorMessage />;
  }

  const handleOpenForm = (wallet?: Wallet) => {
    setEditWallet(wallet || null);
    setOpenFormDialog(true);
  };
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

              <DropdownMenu
                open={openDropdownId === w.id}
                onOpenChange={(open) => {
                  if (open) setOpenDropdownId(w.id);
                  else setOpenDropdownId(null);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <CircleEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenForm(w);
                      setOpenDropdownId(null);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setWalletToDelete(w);
                      setOpenDialog(true);
                      setOpenDropdownId(null);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        title="Xác nhận xóa ví"
        description={`Bạn có chắc chắn muốn xóa ví "${walletToDelete?.name}" không?`}
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) setWalletToDelete(null); // reset wallet khi đóng dialog
        }}
        onConfirm={() => {
          if (walletToDelete) deleteWallet(walletToDelete.id);
        }}
      />

      {/* Dialog form create/edit */}
      <Dialog open={openFormDialog} onOpenChange={setOpenFormDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <WalletForm
            selectedType={editWallet?.type || WalletType.BASIS}
            initialData={editWallet || undefined}
            onSuccess={() => setOpenFormDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
