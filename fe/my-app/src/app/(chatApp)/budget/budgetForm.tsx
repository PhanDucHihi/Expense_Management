// components/BudgetForm.tsx
"use client";

import { useWalletStore } from "@/store/walletStore";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { getAllWallet } from "@/utils/apis/walletApi";
import { getAllCategories } from "@/utils/apis/categoriyApi";
import { Form } from "@/components/ui/form";
import { SelectWithLabel } from "@/components/inputs-form/SelectWithLabel";
import InputWithLabel from "@/components/inputs-form/InputWithLabel";
import { SelectCategory } from "@/components/SelectCategory";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import { toast } from "sonner";
import { Budget } from "@/types/budget";
import { budgetSchema, budgetSchemaType } from "@/validations/budget";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

type Props = {
  onSuccess: () => void;
  initalData?: Budget;
};

export default function BudgetForm({ onSuccess, initalData }: Props) {
  const queryClient = useQueryClient();
  const [openWarning, setOpenWarning] = useState<boolean>(false);
  const [pendingBudget, setPendingBudget] = useState<budgetSchemaType | null>(
    null
  );
  const { currentWallet } = useWalletStore();

  const form = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: initalData
      ? {
          ...initalData,
          amount_limit: Number(initalData.amount_limit),
          start_date: format(new Date(initalData.start_date), "yyyy-MM-dd"),
          end_date: format(new Date(initalData.end_date), "yyyy-MM-dd"),
        }
      : {
          walletId: currentWallet?.id ?? undefined,
          categoryId: undefined,
          amount_limit: 0,
          start_date: format(new Date(), "yyyy-MM-dd"),
          end_date: format(new Date(), "yyyy-MM-dd"),
        },
  });

  // Lấy wallets
  const { data: wallets = [] } = useQuery({
    queryKey: ["wallets"],
    queryFn: getAllWallet,
  });

  // Lấy categories (chỉ khoản chi)
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      data,
      force,
    }: {
      data: budgetSchemaType;
      force?: boolean;
    }) => {
      if (initalData) {
        const res = await apiPrivate.patch(`/budget/${initalData.id}`, data);
        return { res: res.data, input: data };
      } else {
        const res = await apiPrivate.post("/budget", data, {
          params: force ? { force: true } : {},
        });
        console.log(res.data);

        return { res: res.data, input: data };
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error("Lỗi khi lưu ngân sách");
    },
    onSuccess: ({ res, input }) => {
      if (res?.warning) {
        setPendingBudget(input);
        setOpenWarning(true);
        return;
      }
      toast.success(
        initalData
          ? "Cập nhật ngân sách thành công"
          : "Tạo ngân sách thành công"
      );
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      if (initalData) {
        queryClient.invalidateQueries({
          queryKey: ["budget", initalData.id],
        });
      }
    },
  });

  const handleSubmit = (values: budgetSchemaType) => {
    const dataToSend = {
      ...values,
      start_date: new Date(values.start_date).toISOString(),
      end_date: new Date(values.end_date).toISOString(),
    };
    console.log(values);
    mutate({ data: dataToSend });
  };

  // handle confirm force
  const handleForceCreate = () => {
    if (!pendingBudget) return;
    mutate({ data: pendingBudget, force: true });
    setOpenWarning(false);
    setPendingBudget(null);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <SelectWithLabel<budgetSchemaType>
            nameInSchema="walletId"
            fieldTitle="Wallet"
            data={wallets.map((w) => ({
              id: w.id.toString(),
              description: w.name,
            }))}
          />

          <SelectCategory<budgetSchemaType>
            nameInSchema="categoryId"
            fieldTitle="Category"
            categories={categories}
          />

          <InputWithLabel<budgetSchemaType>
            nameInSchema="amount_limit"
            fieldTitle="Ngân sách"
            typeValue="number"
            className="w-full max-w-xs"
          />

          <InputWithLabel<budgetSchemaType>
            nameInSchema="start_date"
            fieldTitle="Bắt đầu"
            type="date"
          />

          <InputWithLabel<budgetSchemaType>
            nameInSchema="end_date"
            fieldTitle="Kết thúc"
            type="date"
          />

          <div className="flex justify-center">
            <Button
              className="max-w-sm w-full"
              disabled={isPending}
              type="submit"
            >
              Lưu
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={openWarning} onOpenChange={setOpenWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cảnh báo</AlertDialogTitle>
            <AlertDialogDescription>
              Budget trùng thời gian với budget khác cùng category. Bạn có muốn
              tiếp tục tạo mới không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleForceCreate}>
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
