import { NetworkConfig } from "@/types";

export interface TypedData {
  domain: any;
  types: any;
  primaryType: string;
  message: any;
}

export interface SendTransactionParams {
  from: string;
  to: string;
  value?: string;
  data?: string;
  gas?: string;
  gasPrice?: string;
}

export interface IBaseWallet {
  provider: any;
  connect(): Promise<string[]>;
  disconnect(): Promise<void>;
  requestSignTypedData(address: string, typedData: TypedData): Promise<string>;
  requestSignature(address: string, message: string): Promise<string>;
  switchNetwork(networkConfig: NetworkConfig): Promise<void>;
  sendTransaction(params: SendTransactionParams): Promise<string>;
  listenAccountChange(callback: (accounts: string[]) => void): void;
  listenNetworkChange(callback: (chainId: string) => void): void;
  removeAllListenEvents(): void;
  isAvailable(): boolean;
  getChainId(): Promise<string>;
}
