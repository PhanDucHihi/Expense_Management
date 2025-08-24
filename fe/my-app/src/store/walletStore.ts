import { create } from "zustand";
import { Wallet } from "@/types/wallet";
import { persist } from "zustand/middleware";

type WalletState = {
  currentWallet: Wallet | null;
  setCurrentWallet: (wallet: Wallet) => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      currentWallet: null,
      setCurrentWallet: (wallet) => set({ currentWallet: wallet }),
    }),
    { name: "wallet-storage" }
  )
);
