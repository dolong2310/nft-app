import { BaseWallet } from "@/services/wallet";
import { CollectionDetail, NFTDetail } from "@/types";

export interface INFTService {
  mintNFT(
    from: string,
    to: string,
    contractAddress: string,
    tokenURI: string | null,
    wallet: BaseWallet
  ): Promise<string>;
  getApproved(contractAddress: string, tokenId: string): Promise<string>;
  approve(
    from: string,
    to: string,
    contractAddress: string,
    tokenId: string,
    wallet: BaseWallet
  ): Promise<string>;

  isApprovedForAll(
    contractAddress: string,
    owner: string,
    operator: string
  ): Promise<boolean>;
  setApprovalForAll(
    from: string,
    operator: string,
    contractAddress: string,
    approved: boolean,
    wallet: BaseWallet
  ): Promise<string>;
  transferNFT(
    sender: string,
    from: string,
    to: string,
    contractAddress: string,
    tokenId: string,
    wallet: BaseWallet
  ): Promise<string>;
  getTokensOfOwner(
    contractAddress: string,
    ownerAddress: string
  ): Promise<string[]>;
  getNFTDetailOnChain(
    contractAddress: string,
    tokenId: string
  ): Promise<NFTDetail>;
  getCollectionDetailOnChain(
    contractAddress: string
  ): Promise<CollectionDetail>;
  getBalanceNFTOfUser(contractAddress: string, owner: string): Promise<string>;
}
