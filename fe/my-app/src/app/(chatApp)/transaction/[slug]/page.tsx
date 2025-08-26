"use client";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import { deleteTransaction, getTransaction } from "@/utils/apis/transactionApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { use, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  //   const [openFormDialog, setOpenFormDialog] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["transaction"],
    queryFn: async () => {
      const res = await getTransaction(Number(slug));
      return res;
    },
  });

  const { mutate: deleteTran } = useMutation({
    mutationFn: async () => {
      await deleteTransaction(Number(slug));
    },
    onSuccess: () => {
      toast.success("Xóa giao dịch thành công");
      router.push("/transaction");
    },
  });

  if (isLoading) {
    return <Loading className="w-30 h-30" />;
  }

  if (!data) {
    return <ErrorMessage message={`Không tồn tại giao dịch với id ${slug}`} />;
  }

  const category = data.category;
  const wallet = data.wallet;

  return (
    <>
      <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-background ">
        <div className="relative bg-card w-full max-w-lg space-y-6 py-6 px-6 rounded-2xl shadow-lg">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <Button
              className="p-2 rounded-full hover:bg-muted transition cursor-pointer"
              aria-label="Edit transaction"
              onClick={() => console.log("Edit", data.id)}
            >
              <Pencil className="w-5 h-5 text-blue-500" />
            </Button>
            <Button
              className="p-2 rounded-full hover:bg-muted transition cursor-pointer"
              aria-label="Delete transaction"
              onClick={(e) => {
                setOpenDialog(true);
              }}
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
          </div>

          {/* Category */}
          <div className="flex items-center gap-4 border-b border-muted pb-4">
            <span className="text-3xl">{category.icon}</span>
            <p className="text-lg font-semibold">{category.name}</p>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">💰 Số tiền</span>
            <p className="text-lg font-bold text-primary">
              {data.amount.toLocaleString("vi-VN")} đ
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/images/calendar.jpg"
                alt="calendar"
                width={36}
                height={36}
                className="rounded-full object-cover shadow"
              />
              <span className="text-muted-foreground">Ngày</span>
            </div>
            <p className="text-base font-medium">
              {format(new Date(data.transaction_date), "dd/MM/yyyy", {
                locale: vi,
              })}
            </p>
          </div>

          {/* Wallet */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/images/wallet.jpg"
                alt="wallet"
                width={36}
                height={36}
                className="rounded-full object-cover shadow"
              />
              <span className="text-muted-foreground">Ví</span>
            </div>
            <p className="text-base font-medium">{wallet.name}</p>
          </div>
        </div>
      </div>

      {/* xoa giao dich */}
      <ConfirmDialog
        title="Xác nhận xóa giao dịch"
        description={`Bạn có chắc chắn muốn xóa giao dịch không?`}
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
        }}
        onConfirm={() => {
          deleteTran();
        }}
      />
    </>
  );
}
