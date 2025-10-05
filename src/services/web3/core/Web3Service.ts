import { NETWORKS } from "@/constants/networks";
import { isEVMChain } from "@/lib/chain";
import { BaseWallet } from "@/services/wallet";
import { NetworkType } from "@/types";
import Web3, { Contract, ContractAbi } from "web3";
import { EvmWeb3Service } from "../evm";
import { IWeb3Service } from "../types";

export class Web3Service {
  protected service: IWeb3Service;

  constructor(network: NetworkType) {
    const networkConfig = NETWORKS[network];
    if (!networkConfig) {
      throw new Error(`Network ${network} is not supported`);
    }
    const rpcUrl = networkConfig.rpcUrls[0];

    this.service = this.getService(network, rpcUrl);
  }

  private getService(network: NetworkType, rpcUrl: string): IWeb3Service {
    switch (true) {
      case isEVMChain(network):
        return new EvmWeb3Service(rpcUrl);
      default:
        throw new Error("Unsupported chain");
    }
  }

  async getBalance(address: string, tokenAddress?: string): Promise<string> {
    try {
      return await this.service.getBalance(address, tokenAddress);
    } catch (error) {
      console.log("Failed to get balance:", error);
      throw error;
    }
  }

  async getNonce(address: string): Promise<number> {
    try {
      return await this.service.getNonce(address);
    } catch (error) {
      console.log("Failed to get nonce:", error);
      throw error;
    }
  }

  async getLatestBlock(): Promise<number> {
    try {
      return await this.service.getLatestBlock();
    } catch (error) {
      console.log("Failed to get latest block:", error);
      throw error;
    }
  }

  async getTransactionReceipt(
    txHash: string
  ): Promise<{ txHash?: string; logs: any[] }> {
    try {
      return await this.service.getTransactionReceipt(txHash);
    } catch (error) {
      console.log("Failed to get transaction receipt:", error);
      throw error;
    }
  }

  async getFungibleTokenAllowance(
    tokenAddress: string,
    owner: string,
    spender: string
  ): Promise<string> {
    try {
      return await this.service.getFungibleTokenAllowance(
        tokenAddress,
        owner,
        spender
      );
    } catch (error) {
      console.log("Failed to get allowance:", error);
      throw error;
    }
  }

  async approveFungibleToken(
    from: string,
    spender: string,
    tokenAddress: string,
    amount: string,
    wallet: BaseWallet
  ): Promise<string> {
    try {
      return await this.service.approveFungibleToken(
        from,
        spender,
        tokenAddress,
        amount,
        wallet
      );
    } catch (error) {
      console.log("Failed to approve token:", error);
      throw error;
    }
  }

  async estimateGas(transaction: any): Promise<string> {
    try {
      return await this.service.estimateGas(transaction);
    } catch (error) {
      console.log("Failed to estimate gas:", error);
      throw error;
    }
  }

  getContract(
    abi: ContractAbi,
    contractAddress: string
  ): Contract<ContractAbi> {
    return this.service.getContract(abi, contractAddress);
  }

  checkSumAddress(address: string): string {
    return this.service.checkSumAddress(address);
  }

  isValidAddress(address: string): boolean {
    return this.service.isValidAddress(address);
  }

  isNativeToken(address: string): boolean {
    return this.service.isNativeToken(address);
  }

  setProvider(provider: any): void {
    this.service.setProvider(provider);
  }

  getWeb3Instance(): Web3 {
    return this.service.getWeb3Instance();
  }
}
