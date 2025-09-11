"use client";

import * as React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user";
import { User as UserIcon, LogOut, Wallet, Repeat } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  user: User;
  onLogout: () => void;
  onRecurring?: () => void;
};

export default function AvatarDropdown({ user, onLogout, onRecurring }: Props) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
            <Image
              src={user?.imageUrl ?? "/images/default-avatar.png"}
              alt={user?.name ?? "User avatar"}
              width={60}
              height={60}
              className="object-cover cursor-pointer"
            />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            router.push("/home/wallet");
          }}
        >
          <Wallet className="mr-2 h-4 w-4" />
          <span>Ví của tôi</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRecurring}>
          <Repeat className="mr-2 h-4 w-4" />
          <span>Giao dịch định kì</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/profile");
          }}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Cập nhật trang cá nhân</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
