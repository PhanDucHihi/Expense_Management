import { Transaction } from "@/types/transition";
import { create } from "zustand";

type transitionState = {
  search: string | "";
  setSearch: (keyword: string) => void;
  resultSearch: Transaction[] | [];
  setResultSearch: (result: Transaction[]) => void;
};

export const useTransitionStore = create<transitionState>((set) => ({
  search: "",
  setSearch: (keyword) => set({ search: keyword }),
  resultSearch: [],
  setResultSearch: (result) => set({ resultSearch: result }),
}));
