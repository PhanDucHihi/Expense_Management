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

type Props = {
  user: User;
  onLogout: () => void;
  onSettings: () => void;
};

export default function AvatarDropdown({ user, onLogout, onSettings }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Image
            src={user?.imageUrl ?? "/images/default-avatar.png"}
            alt={user?.name ?? "User avatar"}
            width={50}
            height={50}
            className="object-cover rounded-full cursor-pointer"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onSettings}>Cài đặt</DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
