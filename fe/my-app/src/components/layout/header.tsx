// components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/constants";
import { ModeToggle } from "../mode-toggle";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import AvatarDropdown from "./AvatarDropdown";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiPrivate } from "@/lib/api";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const route = useRouter();

  const handleLogout = async () => {
    try {
      await apiPrivate.post("/auth/logout"); // credentials: true nếu cần
      toast.success("Logout thành công");
      route.push("/login");
    } catch {
      toast.error("Logout thất bại");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden ">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={64}
              height={64}
              className="object-cover"
              priority
            />
          </div>
          {/* Nếu muốn text tên kèm logo */}
          <span className="ml-3 text-xl font-bold text-blue-600 dark:text-blue-400">
            Quản lí chi tiêu
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-blue-500 dark:hover:text-blue-300 flex flex-col items-center justify-center"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}

          <AvatarDropdown
            user={user!}
            onLogout={() => handleLogout()}
            onSettings={() => console.log("Settings clicked")}
          />

          <ModeToggle />
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700 dark:text-gray-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pb-4 space-y-5 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block hover:text-blue-500 dark:hover:text-blue-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className=" bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
