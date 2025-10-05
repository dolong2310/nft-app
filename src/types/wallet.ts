import { NetworkType } from "./chain";

export enum WalletType {
  METAMASK = "metamask",
  COIN98 = "coin98",
}

export interface WalletInfo {
  name: WalletType;
  address: string;
  balance: string;
  chainId: string;
  network: string;
  networkKey: NetworkType;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  from: string;
  to: string;
  status: boolean;
}
