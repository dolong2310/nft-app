import { NetworkConfig } from "@/types";
import { IBaseWallet, SendTransactionParams, TypedData } from "../../types";

declare global {
  interface Window {
    coin98?: any;
  }
}

export class Coin98Wallet implements IBaseWallet {
  public provider: any;

  constructor() {
    this.provider = window.coin98;
  }

  async connect(): Promise<string[]> {
    if (!this.isAvailable()) {
      throw new Error("Coin98 wallet is not installed");
    }

    try {
      const accounts = await this.provider.request({
        method: "eth_requestAccounts",
      });
      return accounts;
    } catch (error) {
      console.log("Failed to connect Coin98:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    console.log("Please disconnect from Coin98 wallet extension");
  }

  async requestSignTypedData(
    address: string,
    typedData: TypedData
  ): Promise<string> {
    try {
      const signature = await this.provider.request({
        method: "eth_signTypedData_v4",
        params: [address, JSON.stringify(typedData)],
      });
      return signature;
    } catch (error) {
      console.log("Failed to sign typed data:", error);
      throw error;
    }
  }

  async requestSignature(address: string, message: string): Promise<string> {
    try {
      const signature = await this.provider.request({
        method: "personal_sign",
        params: [message, address],
      });
      return signature;
    } catch (error) {
      console.log("Failed to sign message:", error);
      throw error;
    }
  }

  async switchNetwork(networkConfig: NetworkConfig): Promise<void> {
    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkConfig.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await this.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkConfig],
          });
        } catch (addError) {
          console.log("Failed to add network:", addError);
          throw addError;
        }
      } else {
        console.log("Failed to switch network:", error);
        throw error;
      }
    }
  }

  async sendTransaction(params: SendTransactionParams): Promise<string> {
    try {
      const txHash = await this.provider.request({
        method: "eth_sendTransaction",
        params: [params],
      });
      return txHash;
    } catch (error) {
      console.log("Failed to send transaction:", error);
      throw error;
    }
  }

  listenAccountChange(callback: (accounts: string[]) => void): void {
    if (this.provider) {
      this.provider.on("accountsChanged", callback);
    }
  }

  listenNetworkChange(callback: (chainId: string) => void): void {
    if (this.provider) {
      this.provider.on("chainChanged", callback);
    }
  }

  removeAllListenEvents(): void {
    if (this.provider) {
      this.provider.removeAllListeners("accountsChanged");
      this.provider.removeAllListeners("chainChanged");
    }
  }

  async getChainId(): Promise<string> {
    const chainId = await this.provider.request({
      method: "eth_chainId",
    });
    return chainId;
  }

  isAvailable(): boolean {
    const isDetected = this.provider;
    return !!isDetected;
  }
}
