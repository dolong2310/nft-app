import { BaseWallet } from "@/services/wallet";
import { Contract, ContractAbi } from "web3";

export interface IWeb3Service {
  getNonce: (address: string) => Promise<number>;
  getBalance: (address: string, tokenAddress?: string) => Promise<string>;
  getLatestBlock: () => Promise<number>;
  getTransactionReceipt: (
    txHash: string
  ) => Promise<{ txHash?: string; logs: any[] }>;
  getFungibleTokenAllowance: (
    tokenAddress: string,
    owner: string,
    spender: string
  ) => Promise<string>;
  approveFungibleToken: (
    from: string,
    spender: string,
    tokenAddress: string,
    amount: string,
    wallet: BaseWallet
  ) => Promise<string>;
  estimateGas: (transaction: any) => Promise<string>;
  getContract: (
    abi: ContractAbi,
    contractAddress: string
  ) => Contract<ContractAbi>;
  checkSumAddress: (address: string) => string;
  isValidAddress: (address: string) => boolean;
  isNativeToken: (address: string) => boolean;
  setProvider: (provider: any) => void;
  getWeb3Instance: () => any;
}
