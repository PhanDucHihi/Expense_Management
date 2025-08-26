"use client";

import { useWalletStore } from "@/store/walletStore";
import {
  transactionSchema,
  transactionSchemaType,
} from "@/validations/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { getAllWallet } from "@/utils/apis/walletApi";
import { Form } from "@/components/ui/form";
import { SelectWithLabel } from "@/components/inputs-form/SelectWithLabel";
import InputWithLabel from "@/components/inputs-form/InputWithLabel";
import { getAllCategories } from "@/utils/apis/categoriyApi";
import { SelectCategory } from "@/components/SelectCategory";
import { TextAreaWithLabel } from "@/components/inputs-form/TextAreaWithLabel";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transition";
import { apiPrivate } from "@/lib/api";
import { toast } from "sonner";

type Props = {
  onSuccess: () => void;
  initalData?: Transaction;
};

export default function TransactionForm({ onSuccess, initalData }: Props) {
  const queryClient = useQueryClient();
  const { currentWallet } = useWalletStore();

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: initalData
      ? { ...initalData }
      : {
          walletId: currentWallet?.id ?? undefined,
          amount: 0,
          note: "",
          transaction_date: format(new Date(), "yyyy-MM-dd"),
          categoryId: undefined,
        },
  });

  // lấy danh sách wallets
  const { data: wallets = [] } = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      return await getAllWallet();
    },
  });

  // lấy danh sách categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await getAllCategories();
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: transactionSchemaType) => {
      if (initalData) {
        const res = await apiPrivate.patch(
          `/transaction/${initalData.id}`,
          data
        );
        return res.data;
      } else {
        // create
        const res = await apiPrivate.post("/transaction", data);
        return res.data;
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error("Lỗi khi lưu giao dịch");
    },
    onSuccess: () => {
      toast.success(
        initalData
          ? "Cập nhật giao dịch thành công"
          : "Tạo giao dịch thành công"
      );
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const handleSubmit = async (values: transactionSchemaType) => {
    console.log("Values:", values);
    mutate(values);
    // TODO: gọi API createTransaction
    // await apiPrivate.post("/transactions", values)
    // if (onSuccess) onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <SelectWithLabel<transactionSchemaType>
          nameInSchema="walletId"
          fieldTitle="Wallet"
          data={wallets!.map((w) => ({
            id: w.id.toString(),
            description: w.name,
          }))}
        />

        <InputWithLabel<transactionSchemaType>
          nameInSchema="amount"
          fieldTitle="Số tiền"
          typeValue="number"
          className="w-full max-w-xs"
        />

        <SelectCategory<transactionSchemaType>
          nameInSchema="categoryId"
          fieldTitle="Nhóm"
          categories={categories ?? []}
        />

        <TextAreaWithLabel<transactionSchemaType>
          nameInSchema="note"
          fieldTitle="Ghi chú"
          placeHolder="Thêm ghi chú"
        />

        <InputWithLabel<transactionSchemaType>
          nameInSchema="transaction_date"
          fieldTitle="Chọn ngày"
          type="date"
        />

        <div className="flex justify-end">
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  );
}
