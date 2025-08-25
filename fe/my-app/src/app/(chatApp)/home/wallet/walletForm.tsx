"use client";

import { Wallet, WalletType } from "@/types/wallet";
import { useForm } from "react-hook-form";
import { walletSchemaType, walletSchema } from "@/validations/wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWithLabel from "@/components/inputs-form/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api";
import { toast } from "sonner";
import Loading from "@/components/loading";

type Props = {
  selectedType: string;
  onSuccess: () => void;
  initialData?: Wallet;
};

export default function WalletForm({
  selectedType,
  onSuccess,
  initialData,
}: Props) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(walletSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          balance: Number(initialData.balance),
          targetAmount: initialData.targetAmount
            ? Number(initialData.targetAmount)
            : undefined,
          deadline: initialData.deadline
            ? new Date(initialData.deadline).toISOString().split("T")[0]
            : "",
        }
      : selectedType === WalletType.BASIS
      ? { name: "", balance: 0, type: WalletType.BASIS }
      : { name: "", targetAmount: 0, deadline: "", type: WalletType.GOAL },
  });

  // create
  // const { mutate, isPending } = useMutation({
  //   mutationFn: async (data: walletSchemaType) => {
  //     const res = await apiPrivate.post("/wallet", data);
  //     return res.data;
  //   },
  //   onError: (err) => {
  //     console.log(err);
  //   },
  //   onSuccess: () => {
  //     toast.success("Tạo ví thành công");
  //     onSuccess();
  //     queryClient.invalidateQueries({ queryKey: ["wallets"] });
  //   },
  // });

  // Edit
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: walletSchemaType) => {
      if (initialData) {
        // edit
        const res = await apiPrivate.patch(`/wallet/${initialData.id}`, data);
        console.log(res);
        return res.data;
      } else {
        // create
        const res = await apiPrivate.post("/wallet", data);
        return res.data;
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error("Lỗi khi lưu ví");
    },
    onSuccess: () => {
      toast.success(
        initialData ? "Cập nhật ví thành công" : "Tạo ví thành công"
      );
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  const handleSubmit = (values: walletSchemaType) => {
    console.log(values);
    // Chỉ convert deadline nếu có
    const dataToSend = {
      ...values,
      targetAmount: values.targetAmount ? values.targetAmount : undefined,
      deadline: values.deadline
        ? new Date(values.deadline).toISOString()
        : undefined,
    };

    mutate(dataToSend);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <InputWithLabel<walletSchemaType>
          nameInSchema="name"
          fieldTitle="Tên ví"
        />

        <InputWithLabel<walletSchemaType>
          nameInSchema="balance"
          typeValue="number"
          fieldTitle="Số tiền hiện có"
        />

        {selectedType === WalletType.GOAL && (
          <>
            <InputWithLabel<walletSchemaType>
              typeValue="number"
              nameInSchema="targetAmount"
              fieldTitle="Số tiền mục tiêu"
            />
            <InputWithLabel<walletSchemaType>
              nameInSchema="deadline"
              fieldTitle="Deadline"
              type="date"
            />
          </>
        )}

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? <Loading /> : initialData ? "Cập nhật ví" : "Tạo ví"}
        </Button>
      </form>
    </Form>
  );
}
