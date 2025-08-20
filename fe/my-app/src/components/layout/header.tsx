// components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/constants";
import { ModeToggle } from "../mode-toggle";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  // ds
  // hello world
  // const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-white shadow-md dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          MyWebsite
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-blue-500 dark:hover:text-blue-300"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Image
              src={user.imageUrl ?? "/default-avatar.png"}
              alt={user.name ?? "User avatar"}
              width={50}
              height={50}
              className="object-cover rounded-full"
            />
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Sign In
            </Link>
          )}

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
