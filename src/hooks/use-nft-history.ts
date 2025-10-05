import { ERC721_ABI } from "@/contracts/abis/ERC721";
import { Web3Service } from "@/services/web3";
import { useWalletStore } from "@/stores/useWalletStore";
import { useMemo } from "react";

const useNftHistory = () => {
  const { activeWallet } = useWalletStore();

  const web3Service = useMemo(() => {
    if (!activeWallet) return null;
    return new Web3Service(activeWallet.networkKey);
  }, [activeWallet?.networkKey]);

  const getNFTHistory = async (
    contractAddress: string,
    tokenId: string,
    startBlock: number = 0,
    blockRange: number = 50000
  ) => {
    try {
      const contract = web3Service?.getContract(ERC721_ABI, contractAddress);
      if (!contract) {
        throw new Error("Contract not found");
      }

      const web3Client = web3Service?.getWeb3Instance();
      const latestBlock = Number(await web3Client?.eth.getBlockNumber());

      let allEvents: any[] = [];
      let fromBlock = startBlock;

      console.log("fromBlock: ", fromBlock);
      console.log("blockRange: ", blockRange);
      console.log("latestBlock: ", latestBlock);

      while (fromBlock <= latestBlock) {
        const toBlock = Math.min(fromBlock + blockRange - 1, latestBlock);
        console.log(`Scan from block ${fromBlock} to ${toBlock}...`);

        // @ts-ignore
        const events = await contract.getPastEvents("Transfer", {
          filter: { tokenId },
          fromBlock: fromBlock,
          toBlock: toBlock,
        });
        console.log("events: ", events);

        allEvents = allEvents.concat(events);
        fromBlock += blockRange;
      }

      if (allEvents.length === 0) {
        console.log(`Tx not found for tokenId ${tokenId}`);
        return allEvents;
      }

      console.log(`Tx history for NFT with tokenId ${tokenId}:`);
      for (const event of allEvents) {
        const { from, to, tokenId } = event.returnValues;
        const txHash = event.transactionHash;
        const blockNumber = event.blockNumber;

        console.log(`Transaction Hash: ${txHash}`);
        console.log(`Block: ${blockNumber}`);
        console.log(`From: ${from}`);
        console.log(`To: ${to}`);
        console.log(`Token ID: ${tokenId}`);
        console.log("---");
      }

      return allEvents;
    } catch (error) {
      console.error("error:", error);
    }
  };

  //   const getAllNFTHistory = async (contractAddress: string) => {
  //     try {
  //       const contract = web3Service?.getContract(ERC721_ABI, contractAddress);
  //       if (!contract) {
  //         throw new Error("Contract not found");
  //       }

  //       const events = await contract.getPastEvents("allEvents", {
  //         fromBlock: 0,
  //         toBlock: "latest",
  //       });

  //       for (const event of events) {
  //         // const { from, to, tokenId } = event.returnValues;
  //         // const txHash = event.transactionHash;
  //         // const blockNumber = event.blockNumber;

  //         // console.log(`Transaction Hash: ${txHash}`);
  //         // console.log(`Block: ${blockNumber}`);
  //         // console.log(`From: ${from}`);
  //         // console.log(`To: ${to}`);
  //         // console.log(`Token ID: ${tokenId}`);
  //         console.log(`Event: ${event}`);
  //         console.log("---");
  //       }

  //       return events;
  //     } catch (error) {
  //       console.error("error: ", error);
  //     }
  //   };

  return { getNFTHistory };
};

export default useNftHistory;
