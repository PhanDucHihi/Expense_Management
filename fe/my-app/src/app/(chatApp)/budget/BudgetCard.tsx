// components/BudgetCardCompact.tsx
"use client";

import { Budget } from "@/types/budget";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBudget } from "@/utils/apis/budgetApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BudgetForm from "./budgetForm";

type Props = {
  budget: Budget;
};

export default function BudgetCardCompact({ budget }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { mutate: deleteBud } = useMutation({
    mutationFn: async () => {
      await deleteBudget(Number(budget.id));
    },
    onSuccess: () => {
      toast.success("Xóa ngân sách thành công");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      router.push("/budget");
    },
  });

  const percent = Math.min((budget.spent / budget.amount_limit) * 100, 100);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col justify-between transition hover:scale-[1.02] duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {budget.category.name}
          </h4>
          <div className="flex gap-1">
            <Button
              className="p-2 rounded-full hover:bg-muted transition cursor-pointer"
              aria-label="Edit budget"
              onClick={() => setOpenEditDialog(true)}
            >
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              className="p-2 rounded-full hover:bg-muted transition cursor-pointer"
              aria-label="Delete budget"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Amount info */}
        <div className="mb-2 text-sm">
          <div className="flex gap-2">
            <p className="text-gray-400 dark:text-gray-300">Ngân sách:</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {budget.amount_limit.toLocaleString()} đ
            </p>
          </div>

          <div className="flex gap-2">
            <p className="text-gray-400 dark:text-gray-300">Đã chi:</p>
            <p className="text-red-500 font-medium">
              {budget.spent.toLocaleString()} đ
            </p>
          </div>

          <p className="text-gray-500 dark:text-gray-300">
            Còn lại:{" "}
            <span className="font-medium text-gray-800 dark:text-gray-300">
              {budget.remaining.toLocaleString()} đ
            </span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-1">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              percent < 50
                ? "bg-green-500"
                : percent < 80
                ? "bg-yellow-400"
                : "bg-red-500"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Duration */}
        <p className="text-xs text-gray-400 dark:text-gray-300 mt-1">
          {new Date(budget.start_date).toLocaleDateString()} -{" "}
          {new Date(budget.end_date).toLocaleDateString()}
        </p>
      </div>

      {/* xoa ngan sach */}
      <ConfirmDialog
        title="Xác nhận xóa giao dịch"
        description={`Bạn có chắc chắn muốn xóa giao dịch không?`}
        open={openDeleteDialog}
        onOpenChange={(open) => {
          setOpenDeleteDialog(open);
        }}
        onConfirm={() => {
          deleteBud();
        }}
      />

      {/* Edit giao dich */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa giao dịch</DialogTitle>
          </DialogHeader>

          <BudgetForm
            initalData={budget} // truyền dữ liệu hiện tại
            onSuccess={() => {
              setOpenEditDialog(false);
              //   router.refresh(); // refresh lại trang detail
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
