"use client";

import Media from "@/components/media";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/contexts/WalletContext";
import { cn } from "@/lib/utils";
import { NFTService } from "@/services/nft/core";
import { useWalletStore } from "@/stores/useWalletStore";
import { NFTDetail } from "@/types";
import { checkSumAddress } from "@/utils/address";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface NFTWithId extends NFTDetail {
  id: string;
}

const formSchema = z.object({
  contractAddress: z.string(),
});

export default function HomePage() {
  const { activeWallet, isConnected } = useWallet();
  const [nfts, setNfts] = useState<NFTWithId[]>([]);
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      contractAddress: "",
    },
  });

  const loadNFTs = async (contractAddress: string) => {
    if (!isConnected || !activeWallet || !contractAddress) return;

    setLoading(true);
    try {
      const nftService = new NFTService(activeWallet.networkKey);

      // Get token ids of user
      const tokenIds = await nftService.getTokensOfOwner(
        contractAddress,
        activeWallet.address
      );

      const loadedNFTs: NFTWithId[] = [];

      // Limit 20 NFTs
      const maxLoad = Math.min(tokenIds.length, 20);

      for (let i = 0; i < maxLoad; i++) {
        try {
          const nftDetail = await nftService.getNFTDetailOnChain(
            contractAddress,
            tokenIds[i]
          );

          // Only add NFT if owner is current user
          if (
            checkSumAddress(nftDetail.owner) ===
            checkSumAddress(activeWallet.address)
          ) {
            loadedNFTs.push({
              ...nftDetail,
              id: `${contractAddress}-${i}`,
            });
          }
        } catch (error) {
          console.log(`Failed to load NFT ${i}:`, error);
          // throw error;
        }
      }

      setNfts(loadedNFTs);
      toast.success("NFTs loaded successfully.");
    } catch (error) {
      console.log("Failed to load NFTs:", error);
      toast.error("Failed to load NFTs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    if (!data.contractAddress) return;
    setContractAddress(data.contractAddress);
    loadNFTs(data.contractAddress);
  };

  if (!isConnected) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold mb-4">NFT Gallery</h1>
        <p className="text-gray-600">
          Please connect your wallet to view your NFTs
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-8">My NFT Gallery</h1>

        <Form {...form}>
          <form
            autoComplete="off"
            className="flex items-end gap-2 lg:gap-4 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="contractAddress"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base">Contract Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="shadow-shadow"
                      placeholder="0x..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="default">
              {loading ? "Loading..." : "Load NFTs"}
            </Button>
          </form>
        </Form>
      </div>

      {nfts.length === 0 && !loading && contractAddress && (
        <p className="text-center py-20">No NFTs found for this contract</p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <LoaderIcon className="size-10 animate-spin" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <Link
            key={nft.id}
            href={`/nft/${contractAddress}/${nft.tokenId}`}
            className="group cursor-pointer"
          >
            <Card
              shadowTransition
              className={cn(
                "group relative flex flex-col border-2 rounded-base bg-background overflow-hidden h-full",
                "py-0 gap-0"
              )}
            >
              <div className="relative">
                <Media
                  src={nft.metadata?.image || ""}
                  alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 flex-1 border-y-2 py-4">
                {/* Title */}
                <h2 className="text-lg font-medium line-clamp-2 px-4 break-words">
                  {nft.metadata?.name || `NFT #${nft.tokenId}`}
                </h2>

                {/* Token Id */}
                <p className="text-sm text-foreground line-clamp-2 px-4 break-words">
                  Token ID: {nft.tokenId}
                </p>

                {/* Description */}
                <p className="text-sm text-foreground line-clamp-2 px-4 break-words">
                  {nft.metadata?.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
