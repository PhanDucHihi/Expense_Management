"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string; // Có thể tùy chỉnh chữ hiển thị, mặc định "Back"
  className?: string; // Thêm class nếu muốn
}

export default function BackButton({
  label = "Quay lại",
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // quay lại trang trước
  };

  return (
    <Button
      variant={"default"}
      onClick={handleBack}
      className={`flex items-center gap-2 ${className ?? ""} cursor-pointer`}
    >
      <ArrowLeft size={16} />
      {label}
    </Button>
  );
}
