"use client";

import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = "Có lỗi xảy ra",
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 rounded-2xl bg-red-100 p-3 text-red-700 shadow-sm">
      <AlertCircle className="h-5 w-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
