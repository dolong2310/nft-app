"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatAddress, formatBalance } from "@/utils/address";
import { CheckIcon, ChevronDown, Copy, LogOut } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { NETWORKS } from "../../constants/networks";
import { useWallet } from "../../contexts/WalletContext";
import { NetworkType, WalletType } from "../../types";

export const WalletConnect: React.FC = () => {
  const {
    activeWallet,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWallet();

  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [showNetworkOptions, setShowNetworkOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleConnect = async (walletType: WalletType) => {
    setLoading(true);
    try {
      await connectWallet(walletType);
      setShowWalletOptions(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchNetwork = async (network: NetworkType) => {
    setLoading(true);
    try {
      await switchNetwork(network);
      setShowNetworkOptions(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(activeWallet?.address || "");
    toast.message("Address copied to clipboard", { duration: 1000 });

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  if (isConnected && activeWallet) {
    return (
      <div className="flex items-center gap-4">
        {/* Network Selector */}
        <div className="relative">
          <Popover
            open={showNetworkOptions}
            onOpenChange={setShowNetworkOptions}
          >
            <PopoverTrigger asChild>
              <Button variant="default">
                <ChevronDown className="text-main-foreground size-4" />
                <p className="text-main-foreground text-sm">
                  {formatAddress(activeWallet.address)}
                </p>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-min p-0" align="end">
              <Button
                disabled={isCopied}
                variant="noShadowNeutral"
                className="flex items-center justify-end gap-2 w-full h-full rounded-none border-0 border-b-2 hover:bg-background hover:text-foreground"
                onClick={handleCopy}
              >
                {/* <Icon
                  name={NETWORKS[activeWallet.networkKey]?.nativeCurrency.symbol}
                  size={32}
                /> */}

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span>{formatAddress(activeWallet.address)}</span>
                    {isCopied ? <CheckIcon size={14} /> : <Copy size={14} />}
                  </div>
                  <span className="text-xs text-right">
                    {formatBalance(activeWallet.balance)}{" "}
                    {NETWORKS[activeWallet.networkKey]?.nativeCurrency.symbol}
                  </span>
                </div>
              </Button>

              {Object.entries(NETWORKS).map(([key, network]) => (
                <Button
                  key={key}
                  variant="ghost"
                  className={cn(
                    "rounded-none w-full text-main-foreground hover:bg-background hover:text-foreground",
                    activeWallet.networkKey === key &&
                      "bg-background text-foreground"
                  )}
                  disabled={loading}
                  onClick={() => handleSwitchNetwork(key as NetworkType)}
                >
                  {network.chainName}
                </Button>
              ))}

              <Button
                variant="noShadowNeutral"
                className="rounded-none w-full border-0 border-t-2 hover:bg-background"
                onClick={disconnectWallet}
              >
                <LogOut className="size-4" />
                <span>Disconnect</span>
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }

  return (
    <Popover open={showWalletOptions} onOpenChange={setShowWalletOptions}>
      <PopoverTrigger asChild>
        <Button variant="default" disabled={loading}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Button
          variant="ghost"
          className="rounded-none w-full text-main-foreground hover:bg-background hover:text-foreground"
          disabled={loading}
          onClick={() => handleConnect(WalletType.METAMASK)}
        >
          MetaMask
        </Button>

        <Button
          variant="ghost"
          className="rounded-none w-full text-main-foreground hover:bg-background hover:text-foreground"
          disabled={loading}
          onClick={() => handleConnect(WalletType.COIN98)}
        >
          Coin98
        </Button>
      </PopoverContent>
    </Popover>
  );
};
