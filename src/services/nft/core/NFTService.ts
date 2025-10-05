import { isEVMChain } from "@/lib/chain";
import { BaseWallet } from "@/services/wallet";
import { CollectionDetail, NetworkType, NFTDetail } from "@/types";
import { EvmNFTService } from "../evm";
import { INFTService } from "../types";

export class NFTService {
  protected service: INFTService;

  constructor(currentNetwork: NetworkType) {
    this.service = this.getService(currentNetwork);
  }

  private getService(network: NetworkType): INFTService {
    switch (true) {
      case isEVMChain(network):
        return new EvmNFTService(network);
      default:
        throw new Error("Unsupported chain");
    }
  }

  async mintNFT(
    from: string,
    to: string,
    contractAddress: string,
    tokenURI: string | null,
    wallet: BaseWallet
  ): Promise<string> {
    try {
      return await this.service.mintNFT(
        from,
        to,
        contractAddress,
        tokenURI,
        wallet
      );
    } catch (error) {
      console.log("Failed to mint NFT:", error);
      throw error;
    }
  }

  async getApproved(contractAddress: string, tokenId: string): Promise<string> {
    try {
      return await this.service.getApproved(contractAddress, tokenId);
    } catch (error) {
      console.log("Failed to get approved:", error);
      throw error;
    }
  }

  async approve(
    from: string,
    to: string,
    contractAddress: string,
    tokenId: string,
    wallet: BaseWallet
  ): Promise<string> {
    try {
      return await this.service.approve(
        from,
        to,
        contractAddress,
        tokenId,
        wallet
      );
    } catch (error) {
      console.log("Failed to approve:", error);
      throw error;
    }
  }

  async isApprovedForAll(
    contractAddress: string,
    owner: string,
    operator: string
  ): Promise<boolean> {
    try {
      return await this.service.isApprovedForAll(
        contractAddress,
        owner,
        operator
      );
    } catch (error) {
      console.log("Failed to check approval for all:", error);
      throw error;
    }
  }

  async setApprovalForAll(
    from: string,
    operator: string,
    contractAddress: string,
    approved: boolean,
    wallet: BaseWallet
  ): Promise<string> {
    try {
      return await this.service.setApprovalForAll(
        from,
        operator,
        contractAddress,
        approved,
        wallet
      );
    } catch (error) {
      console.log("Failed to set approval for all:", error);
      throw error;
    }
  }

  async transferNFT(
    sender: string,
    from: string,
    to: string,
    contractAddress: string,
    tokenId: string,
    wallet: BaseWallet
  ): Promise<string> {
    console.log({ sender, from, to, contractAddress, tokenId });
    try {
      return await this.service.transferNFT(
        sender,
        from,
        to,
        contractAddress,
        tokenId,
        wallet
      );
    } catch (error) {
      console.log("Failed to transfer NFT:", error);
      throw error;
    }
  }

  async getTokensOfOwner(
    contractAddress: string,
    ownerAddress: string
  ): Promise<string[]> {
    try {
      return await this.service.getTokensOfOwner(contractAddress, ownerAddress);
    } catch (error) {
      console.log("Failed to get tokens of owner:", error);
      throw error;
    }
  }

  async getNFTDetailOnChain(
    contractAddress: string,
    tokenId: string
  ): Promise<NFTDetail> {
    try {
      return await this.service.getNFTDetailOnChain(contractAddress, tokenId);
    } catch (error) {
      console.log("Failed to get NFT detail:", error);
      throw error;
    }
  }

  async getCollectionDetailOnChain(
    contractAddress: string
  ): Promise<CollectionDetail> {
    try {
      return await this.service.getCollectionDetailOnChain(contractAddress);
    } catch (error) {
      console.log("Failed to get collection detail:", error);
      throw error;
    }
  }

  async getBalanceNFTOfUser(
    contractAddress: string,
    owner: string
  ): Promise<string> {
    try {
      return await this.service.getBalanceNFTOfUser(contractAddress, owner);
    } catch (error) {
      console.log("Failed to get NFT balance:", error);
      throw error;
    }
  }
}
