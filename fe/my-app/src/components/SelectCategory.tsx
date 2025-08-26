"use client";

import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Category } from "@/types/category";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 🛠️ Build tree từ danh sách phẳng
function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<number, Category>();

  categories.forEach((c) => map.set(c.id, { ...c, children: [] }));

  const roots: Category[] = [];

  map.forEach((c) => {
    if (c.parentId) {
      map.get(c.parentId)?.children?.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
}

type Props<S> = {
  nameInSchema: keyof S & string;
  fieldTitle: string;
  categories: Category[];
  className?: string;
};

export function SelectCategory<S>({
  nameInSchema,
  fieldTitle,
  categories,
  className,
}: Props<S>) {
  const form = useFormContext();
  const [activeType, setActiveType] = useState<"EXPENSE" | "INCOME">("EXPENSE");

  const expenseCategories = buildCategoryTree(
    categories.filter((c) => c.type === "EXPENSE")
  );
  const incomeCategories = buildCategoryTree(
    categories.filter((c) => c.type === "INCOME")
  );

  const renderCategory = (cat: Category, prefix = ""): React.ReactNode[] => {
    const items: React.ReactNode[] = [
      <SelectItem key={cat.id} value={cat.id.toString()}>
        {prefix}
        {cat.icon} {cat.name}
      </SelectItem>,
    ];

    if (cat.children && cat.children.length > 0) {
      cat.children.forEach((child) => {
        items.push(...renderCategory(child, prefix + "— "));
      });
    }

    return items;
  };
  const activeCategories =
    activeType === "EXPENSE" ? expenseCategories : incomeCategories;

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{fieldTitle}</FormLabel>
          <Select
            onValueChange={(val) => field.onChange(Number(val))}
            value={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger className={`w-full max-w-xs ${className}`}>
                <SelectValue placeholder={`Chọn ${fieldTitle}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent side="top">
              {/* 🔘 Toggle EXPENSE / INCOME */}
              <div className="flex gap-2 p-2 sticky top-0 bg-background z-10">
                <Button
                  size="sm"
                  variant={activeType === "EXPENSE" ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveType("EXPENSE");
                  }}
                >
                  Khoản chi
                </Button>
                <Button
                  size="sm"
                  variant={activeType === "INCOME" ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveType("INCOME");
                  }}
                >
                  Khoản thu
                </Button>
              </div>

              {/* 📂 Hiện category theo loại đang chọn */}
              {activeCategories.length > 0 ? (
                activeCategories.map((cat) => renderCategory(cat))
              ) : (
                <div className="px-2 py-1 text-gray-500">Không có danh mục</div>
              )}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
