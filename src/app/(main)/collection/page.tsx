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
import { CollectionDetail } from "@/types";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  contractAddress: z.string(),
});

export default function CollectionPage() {
  const { isConnected, activeWallet } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      contractAddress: "",
    },
  });

  const [contractAddress, setContractAddress] = useState("");
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (contractAddress: string) => {
    if (!activeWallet || !isConnected) {
      toast.warning("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const nftService = new NFTService(activeWallet.networkKey);

      const collectionDetail = await nftService.getCollectionDetailOnChain(
        contractAddress
      );

      setContractAddress(contractAddress);
      setCollection(collectionDetail);
    } catch (error: any) {
      console.log("Failed to load collection:", error);
      toast.error(error.message || "Failed to load collection detail");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    if (!data.contractAddress) return;
    handleSubmit(data.contractAddress);
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Collection Info</h1>
        <p className="text-gray-600">
          Please connect your wallet to view collection details
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Collection Information</h1>

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
            {loading ? "Loading..." : "Get Info"}
          </Button>
        </form>
      </Form>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <LoaderIcon className="size-10 animate-spin" />
        </div>
      )}

      {collection && !loading && (
        <div className="bg-main border-2 shadow-shadow rounded-base p-8 mt-8">
          <div className="grid gap-6 text-main-foreground">
            <div>
              <label className="text-base block mb-1">Collection Name:</label>
              <p className="text-2xl font-semibold">{collection.name}</p>
            </div>

            <div>
              <label className="text-base block mb-1">Symbol:</label>
              <p className="text-xl font-semibold">{collection.symbol}</p>
            </div>

            <div>
              <label className="text-base block mb-1">Contract Address:</label>
              <p className="text-xl font-semibold break-all">
                {contractAddress}
              </p>
            </div>

            {collection.owner && (
              <div>
                <label className="text-base block mb-1">Owner:</label>
                <p className="text-xl font-semibold break-all">
                  {collection.owner}
                </p>
              </div>
            )}

            {collection.totalSupply && (
              <div>
                <label className="text-base block mb-1">Total Supply:</label>
                <p className="text-xl font-semibold">
                  {collection.totalSupply}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!collection && !loading && contractAddress && (
        <div className="text-center py-20 text-gray-500">
          <p>Enter a contract address to view collection details</p>
        </div>
      )}
    </div>
  );
}
