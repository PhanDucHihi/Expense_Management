"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { differenceInDays } from "date-fns";

type SavingProgressCardProps = {
  balance: number; // số dư hiện tại
  targetAmount: number; // mục tiêu
  deadline?: string; // deadline (ISO string)
};

export function SavingProgressCard({
  balance,
  targetAmount,
  deadline,
}: SavingProgressCardProps) {
  const percent = Math.min((balance / targetAmount) * 100, 100);
  const remaining = targetAmount - balance;

  console.log(deadline);

  const daysLeft = deadline
    ? differenceInDays(new Date(deadline), new Date())
    : null;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Tiến độ tiết kiệm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Đã đạt: {balance.toLocaleString()} đ</span>
          <span>Mục tiêu: {targetAmount.toLocaleString()} đ</span>
        </div>

        <Progress value={percent} className="h-2" />

        {remaining > 0 ? (
          daysLeft !== null ? (
            daysLeft >= 0 ? (
              <p className="text-gray-200 text-sm">
                Cần thêm{" "}
                <span className="font-semibold">
                  {remaining.toLocaleString()}đ
                </span>
                trong {daysLeft} ngày tới
              </p>
            ) : (
              <p className="text-red-600 text-sm">
                ⏳ Đã hết hạn {Math.abs(daysLeft)} ngày trước. Bạn cần thêm{" "}
                <span className="font-semibold">
                  {remaining.toLocaleString()} đ
                </span>
                .
              </p>
            )
          ) : (
            <p className="text-gray-600 text-sm">
              Cần thêm{" "}
              <span className="font-semibold">
                {remaining.toLocaleString()} đ
              </span>
              .
            </p>
          )
        ) : (
          <p className="text-green-600 font-semibold">
            🎉 Bạn đã đạt mục tiêu!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
