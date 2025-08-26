import { apiPrivate } from "@/lib/api";
import { Category } from "@/types/category";

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await apiPrivate.get("/category");
  return res.data;
};
