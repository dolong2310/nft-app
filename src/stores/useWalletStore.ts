import { WalletInfo } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface WalletStoreProps {
  selectedChain: string;
  setSelectedChain: (chain: string) => void;

  activeWallet: WalletInfo | null;
  setActiveWallet: (wallet: WalletInfo | null) => void;
  isWalletConnected: boolean;
  setIsWalletConnected: (status: boolean) => void;

  mainBalance: string;
  isBalanceLoading: boolean;
  setMainBalance: (balance: string) => void;
  setIsBalanceLoading: (isLoading: boolean) => void;
}

const notPersistStates = ["isBalanceLoading"];

const STATE_DEFAULT = {
  selectedChain: "Ethereum",
  activeWallet: null,
  mainBalance: "0",
  isBalanceLoading: true,
  isWalletConnected: false,
};

export const useWalletStore = create<WalletStoreProps>()(
  devtools(
    persist(
      (set) => ({
        ...STATE_DEFAULT,

        // Set state
        setSelectedChain: (chain) => set({ selectedChain: chain }),
        setActiveWallet: (wallet) => set({ activeWallet: wallet }),
        setMainBalance: (balance) => set({ mainBalance: balance }),
        setIsBalanceLoading: (isLoading) =>
          set({ isBalanceLoading: isLoading }),
        setIsWalletConnected: (status) => set({ isWalletConnected: status }),
      }),
      {
        name: "wallet",
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !notPersistStates.includes(key)
            )
          ),
      }
    )
  )
);
