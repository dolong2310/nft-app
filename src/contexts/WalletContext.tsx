"use client";

import { NETWORKS } from "@/constants/networks";
import { BaseWallet } from "@/services/wallet";
import { Web3Service } from "@/services/web3";
import { useWalletStore } from "@/stores/useWalletStore";
import { NetworkType, WalletInfo, WalletType } from "@/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface WalletContextType {
  adapter: BaseWallet | null;
  activeWallet: WalletInfo | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (network: NetworkType) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // stores
  const {
    activeWallet,
    setMainBalance,
    setActiveWallet,
    setIsWalletConnected,
  } = useWalletStore();

  // states
  const [adapter, setAdapter] = useState<BaseWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // functions
  const updateWalletInfo = async (
    address: string,
    chainId: string,
    walletType: WalletType
  ) => {
    try {
      const networkKey =
        activeWallet?.networkKey ||
        (Object.keys(NETWORKS).find(
          (key) => NETWORKS[key as NetworkType].chainId === chainId
        ) as NetworkType);

      const web3Service = new Web3Service(networkKey);
      const balance = await web3Service.getBalance(address);

      setMainBalance(balance);
      setActiveWallet({
        name: walletType,
        address,
        balance,
        chainId,
        network: NETWORKS[networkKey]?.chainName || "Unknown",
        networkKey: networkKey,
      });
    } catch (error) {
      console.log("Failed to update wallet info:", error);
    }
  };

  const connectWallet = async (walletType: WalletType) => {
    setIsConnecting(true);
    try {
      const newWallet = new BaseWallet(walletType);

      if (!newWallet.isAvailable()) {
        throw new Error(`${walletType} is not installed`);
      }

      const accounts = await newWallet.connect();
      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const chainId = await newWallet.getChainId();

      setAdapter(newWallet);
      setIsConnected(true);

      await updateWalletInfo(accounts[0], chainId, walletType);

      // Listen to account and network changes
      newWallet.listenAccountChange(async (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          const chainId = await newWallet.getChainId();
          await updateWalletInfo(accounts[0], chainId, walletType);
        }
      });

      newWallet.listenNetworkChange(async (chainId) => {
        if (activeWallet) {
          await updateWalletInfo(activeWallet.address, chainId, walletType);
        }
      });
    } catch (error) {
      console.log("Failed to connect wallet:", error);
      toast.error((error as Error).message || "Failed to connect wallet");
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    if (adapter) {
      adapter.removeAllListenEvents();
    }
    setAdapter(null);
    setActiveWallet(null);
    setIsConnected(false);
    setIsConnecting(false);
  };

  const switchNetwork = async (network: NetworkType) => {
    if (!adapter) {
      throw new Error("Wallet not connected");
    }

    try {
      const networkConfig = NETWORKS[network];
      await adapter.switchNetwork(networkConfig);
      setActiveWallet({
        ...activeWallet!,
        networkKey: network,
      });
    } catch (error) {
      console.log("Failed to switch network:", error);
      throw error;
    }
  };

  // effects
  useEffect(() => {
    if (activeWallet) {
      connectWallet(activeWallet.name);
    }
  }, [activeWallet?.name]);

  useEffect(() => {
    if (adapter) {
      setIsWalletConnected(true);
    }
  }, [adapter]);

  useEffect(() => {
    return () => {
      if (adapter) {
        adapter.removeAllListenEvents();
      }
    };
  }, [adapter]);

  return (
    <WalletContext.Provider
      value={{
        adapter,
        activeWallet,
        isConnecting,
        isConnected,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
