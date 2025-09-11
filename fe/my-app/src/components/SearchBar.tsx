"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useTransitionStore } from "@/store/transitionStore";
import { apiPrivate } from "@/lib/api";
// import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useEffect } from "react";

export default function SearchBar() {
  const search = useTransitionStore((state) => state.search);
  const setSearch = useTransitionStore((state) => state.setSearch);
  const setResultSearch = useTransitionStore((state) => state.setResultSearch);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearch.trim() === "") return;

      try {
        const res = await apiPrivate.get(
          `/transaction/search?keyword=${encodeURIComponent(debouncedSearch)}`
        );
        setResultSearch(res.data);
        console.log("Kết quả tìm kiếm:", res.data);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      }
    };

    fetchData();
  }, [debouncedSearch, setResultSearch]);

  return (
    <div className="flex items-center gap-2 w-full max-w-sm">
      <div className="relative flex-1">
        {search !== "" ? (
          <X
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
            onClick={() => setSearch("")}
          />
        ) : (
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        )}

        <Input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            pl-8 pr-3 py-2
            rounded-xl
            border
            transition
            bg-white text-gray-700 placeholder:text-gray-400 border-gray-300
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-700
            dark:focus:border-blue-400 dark:focus:ring-2 dark:focus:ring-blue-500/40
            "
        />
      </div>
      {/* <Button variant="default">Tìm</Button> */}
    </div>
  );
}
