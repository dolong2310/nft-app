"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { NFTDetail } from "@/types";
import { NFTService } from "@/services/nft";
import Media from "@/components/media";
import PreviewImageModal from "@/components/preview-image-modal";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import useNftHistory from "@/hooks/use-nft-history";

export default function NFTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected, activeWallet, adapter } = useWallet();

  const { getNFTHistory } = useNftHistory();

  const contractAddress = params.contractAddress as string;
  const tokenId = params.tokenId as string;

  const [nft, setNft] = useState<NFTDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [transferTo, setTransferTo] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadNFTDetail = async () => {
    if (!activeWallet) {
      toast.error("Please connect your wallet");
      return;
    }
    setLoading(true);
    try {
      const nftService = new NFTService(activeWallet.networkKey);

      const nftDetail = await nftService.getNFTDetailOnChain(
        contractAddress,
        tokenId
      );

      setNft(nftDetail);
    } catch (error) {
      console.log("Failed to load NFT detail:", error);
      toast.error("Failed to load NFT detail");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeWallet || !nft) return;

    setTransferring(true);
    try {
      const nftService = new NFTService(activeWallet.networkKey);

      const txHash = await nftService.transferNFT(
        activeWallet.address,
        nft.owner,
        transferTo,
        contractAddress,
        tokenId,
        adapter!
      );

      toast.success(`NFT transferred successfully! Tx: ${txHash}`);
      router.push("/");
    } catch (error: any) {
      console.log("Failed to transfer NFT:", error);
      toast.error(error.message || "Failed to transfer NFT");
    } finally {
      setTransferring(false);
    }
  };

  useEffect(() => {
    if (isConnected && contractAddress && tokenId) {
      getNFTHistory(contractAddress, tokenId);
      // getAllNFTHistory(contractAddress);
    }
  }, [isConnected, contractAddress, tokenId]);

  useEffect(() => {
    if (isConnected && contractAddress && tokenId) {
      loadNFTDetail();
    }
  }, [isConnected, contractAddress, tokenId]);

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <p className="text-gray-600">Please connect your wallet</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderIcon className="size-10 animate-spin" />
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <p className="text-gray-600">NFT not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-12 py-6 lg:py-10">
      <div className="flex flex-col md:flex-row md:flex-nowrap gap-4 md:gap-8">
        {/* Left Column */}
        <div className="w-full md:w-3/5 space-y-6">
          <div className="relative">
            <Media
              src={nft.metadata?.image || ""}
              alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
              title={nft.metadata?.name || `NFT #${nft.tokenId}`}
              fill
              shadow
              shadowTransition
              containerClassName="aspect-square cursor-pointer"
              className="size-full object-cover"
              onClick={() => setIsPreviewOpen(true)}
            />
            <PreviewImageModal
              src={nft.metadata?.image || ""}
              alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
              isOpen={isPreviewOpen}
              onOpenChange={setIsPreviewOpen}
            />
          </div>

          {/* <div className="border-2 shadow-shadow rounded-base bg-background overflow-hidden">
            <div className="p-6">
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold">NFT Activity:</h3>
                <div className="flex flex-wrap gap-2">ABC</div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Column */}
        <div className="w-full md:w-2/5">
          <div className="border-2 shadow-shadow rounded-base bg-background py-6 space-y-4 sticky top-4 right-0">
            <div className="px-6">
              <h1 className="text-4xl font-medium line-clamp-2 break-words">
                {nft.metadata?.name || `NFT #${tokenId}`}
              </h1>
            </div>

            <div className="px-6 pt-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Token ID:</span>
                  <span className="text-sm font-medium">{tokenId}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Owner:</span>
                  <span className="text-sm font-medium">{nft.owner}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    Contract address:
                  </span>
                  <span className="text-sm font-medium">{contractAddress}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Description:</span>
                  <span className="text-sm font-medium">
                    {nft.metadata?.description || "No description available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 pt-2">
              <span className="text-sm text-foreground">Token URI:</span>
              <Link
                href={nft.tokenURI}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all block"
              >
                {nft.tokenURI}
              </Link>
            </div>

            <div className="px-6 pt-2">
              {nft.metadata?.attributes &&
                nft.metadata.attributes.length > 0 && (
                  <div className="">
                    <label className="text-sm text-foreground block mb-2">
                      Attributes:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {nft.metadata.attributes.map((attr, index) => (
                        <div
                          key={index}
                          className="bg-main shadow-shadow border-2 p-3 rounded-base text-main-foreground"
                        >
                          <span className="text-xs">{attr.trait_type}</span>
                          <p className="font-medium">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="px-6 pt-2">
              {/* Transfer Form */}
              {activeWallet?.address.toLowerCase() ===
                nft.owner.toLowerCase() && (
                <form onSubmit={handleTransfer} className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Transfer NFT</h2>
                  <div className="space-y-4">
                    <Input
                      className="shadow-shadow"
                      type="text"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      placeholder="Recipient address (0x...)"
                      required
                    />
                    <Button
                      className="w-full"
                      variant="default"
                      type="submit"
                      disabled={transferring}
                    >
                      {transferring ? "Transferring..." : "Transfer NFT"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
