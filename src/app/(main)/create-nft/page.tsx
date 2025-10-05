"use client";

import { Button } from "@/components/ui/button";
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
import { NFTService } from "@/services/nft";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  contractAddress: z.string(),
  tokenURI: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export default function CreateNFTPage() {
  const { activeWallet, isConnected, adapter } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      contractAddress: "",
      tokenURI: "",
      name: "",
      description: "",
      image: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleSubmit = async ({
    contractAddress,
    tokenURI,
  }: {
    contractAddress: string;
    tokenURI: string;
  }) => {
    if (!isConnected || !activeWallet) {
      toast.warning("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setTxHash("");

    try {
      const nftService = new NFTService(activeWallet.networkKey);

      const hash = await nftService.mintNFT(
        activeWallet.address,
        activeWallet.address,
        contractAddress,
        tokenURI,
        adapter!
      );

      setTxHash(hash);
      toast.success("NFT minted successfully!");
    } catch (error: any) {
      console.log("Failed to mint NFT:", error);
      toast.error(error.message || "Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    if (!data.contractAddress) return;
    handleSubmit({
      contractAddress: data.contractAddress,
      tokenURI: data.tokenURI || "",
    });
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Create NFT</h1>
        <p className="text-gray-600">
          Please connect your wallet to create an NFT
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New NFT</h1>
      <Form {...form}>
        <form
          autoComplete="off"
          className="w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="contractAddress"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base">
                  Contract Address <span className="text-red-500">*</span>
                </FormLabel>
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

          <FormField
            name="tokenURI"
            render={({ field }) => (
              <FormItem className="w-full mt-4">
                <FormLabel className="text-base">Token URI</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="shadow-shadow"
                    placeholder="https://... or ipfs://..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="default" className="w-full mt-8">
            {loading ? "Minting..." : "Mint NFT"}
          </Button>

          {txHash && (
            <div className="p-4 bg-green-600 border-2 shadow-shadow rounded-base mt-8">
              <p className="text-base text-main-foreground break-all">
                Tx Hash: {txHash}
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
