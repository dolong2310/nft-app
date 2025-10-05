import { ERC721_ABI } from "@/contracts/abis/ERC721";
import { BaseWallet } from "@/services/wallet";
import { Web3Service } from "@/services/web3";
import { CollectionDetail, NetworkType, NFTDetail } from "@/types";
import { INFTService } from "../types";

export class EvmNFTService implements INFTService {
  private web3Service: Web3Service;
  private erc721InterfaceId = "0x80ac58cd";

  constructor(network: NetworkType) {
    this.web3Service = new Web3Service(network);
  }

  async mintNFT(
    from: string,
    to: string,
    contractAddress: string,
    tokenURI: string | null,
    wallet: BaseWallet
  ): Promise<string> {
    try {
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );

      let _tokenURI = tokenURI;
      if (!_tokenURI) {
        const totalSupply = await contract.methods.totalSupply().call();
        const id = (Number(totalSupply) + 1).toString();
        _tokenURI = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${id}.json`;
      }
      const data = await contract.methods.mint(to, _tokenURI).encodeABI();
      const txHash = await wallet.sendTransaction({
        from,
        to: contractAddress,
        data,
      });
      return txHash;
    } catch (error) {
      console.log("Failed to mint NFT:", error);
      throw error;
    }
  }

  async getApproved(contractAddress: string, tokenId: string): Promise<string> {
    try {
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );
      const approved = await contract.methods.getApproved(tokenId).call();
      return approved as unknown as string;
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
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );
      const data = await contract.methods.approve(to, tokenId).encodeABI();
      const txHash = await wallet.sendTransaction({
        from,
        to: contractAddress,
        data,
      });
      return txHash;
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
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );
      const isApproved = await contract.methods
        .isApprovedForAll(owner, operator)
        .call();
      return isApproved as unknown as boolean;
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
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );
      const data = await contract.methods
        .setApprovalForAll(operator, approved)
        .encodeABI();
      const txHash = await wallet.sendTransaction({
        from,
        to: contractAddress,
        data,
      });
      return txHash;
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
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );
      const data = contract.methods.transferFrom(from, to, tokenId).encodeABI();

      const txHash = await wallet.sendTransaction({
        from: sender,
        to: contractAddress,
        data,
      });

      return txHash;
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
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );
      const tokenIds = (await contract.methods
        .tokensOfOwner(ownerAddress)
        .call()) as string[];

      return tokenIds;
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
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );

      const [owner, tokenURI] = (await Promise.all([
        contract.methods.ownerOf(tokenId).call(),
        contract.methods.tokenURI(tokenId).call(),
      ])) as unknown as [string, string];

      let metadata;
      try {
        // Fetch metadata từ tokenURI nếu có
        if (tokenURI) {
          const response = await fetch(tokenURI);
          metadata = await response.json();
        }
      } catch (error) {
        console.log("Failed to fetch metadata:", error);
      }

      return {
        tokenId,
        owner: owner as string,
        tokenURI: tokenURI as string,
        metadata,
      };
    } catch (error) {
      console.log("Failed to get NFT detail:", error);
      throw error;
    }
  }

  async getCollectionDetailOnChain(
    contractAddress: string
  ): Promise<CollectionDetail> {
    try {
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );

      const isERC721 = await contract.methods
        .supportsInterface(this.erc721InterfaceId)
        .call();

      if (!isERC721) {
        throw new Error("Token standard is not supported");
      }

      const [name, symbol, owner, totalSupply] = (await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods
          .owner()
          .call()
          .catch(() => ""), // Owner may not exist
        contract.methods.totalSupply().call(),
      ])) as unknown as [string, string, string, string];

      return {
        name,
        symbol,
        owner,
        totalSupply,
      };
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
      const contract = this.web3Service.getContract(
        ERC721_ABI,
        contractAddress
      );
      const balance = await contract.methods.balanceOf(owner).call();
      return (balance as any).toString();
    } catch (error) {
      console.log("Failed to get NFT balance:", error);
      throw error;
    }
  }
}
