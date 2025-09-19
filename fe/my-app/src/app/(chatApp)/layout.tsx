"use client";
import Header from "@/components/layout/header";
import { useTransitionStore } from "@/store/transitionStore";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import SearchResults from "./(searchTransaction)/SearchResults";

export default function Layout({ children }: { children: React.ReactNode }) {
  const search = useTransitionStore((state) => state.search);
  const setSearch = useTransitionStore((state) => state.setSearch);
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    setSearch("");
  }, [pathname, setSearch]);

  return (
    <>
      <div>
        <Header />
        <main className="pt-32 relative ">
          {/* <div
            className="absolute inset-0 bg-cover bg-center -z-10 blur-xs min-h-screen"
            style={{ backgroundImage: "url('/images/background-main.jpg')" }}
          ></div> */}
          {search === "" ? <>{children}</> : <SearchResults />}
        </main>
      </div>
    </>
  );
}
