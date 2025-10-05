import { NetworkConfig, WalletType } from "@/types";
import { IBaseWallet, SendTransactionParams, TypedData } from "../types";
import { Coin98Wallet, MetamaskWallet } from "../wallets";

export class BaseWallet {
  protected provider: IBaseWallet;

  constructor(walletType: WalletType) {
    this.provider = this.connector(walletType);
  }

  connector(walletType: WalletType): IBaseWallet {
    switch (walletType) {
      case WalletType.METAMASK:
        return new MetamaskWallet();
      case WalletType.COIN98:
        return new Coin98Wallet();
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  connect(): Promise<string[]> {
    try {
      return this.provider.connect();
    } catch (error) {
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider.disconnect();
    } catch (err) {
      throw err;
    }
  }

  async requestSignTypedData(
    address: string,
    typedData: TypedData
  ): Promise<string> {
    try {
      const signature = await this.provider.requestSignTypedData(
        address,
        typedData
      );
      return signature;
    } catch (err) {
      throw err;
    }
  }

  async requestSignature(address: string, message: string): Promise<string> {
    try {
      const signature = await this.provider.requestSignature(address, message);
      return signature;
    } catch (err) {
      throw err;
    }
  }

  async switchNetwork(networkConfig: NetworkConfig): Promise<void> {
    try {
      await this.provider.switchNetwork(networkConfig);
    } catch (err) {
      throw err;
    }
  }

  async sendTransaction(params: SendTransactionParams): Promise<string> {
    return await this.provider.sendTransaction(params);
  }

  listenAccountChange(callback: (accounts: string[]) => void): void {
    try {
      this.provider.listenAccountChange(callback);
    } catch (err) {
      throw err;
    }
  }

  listenNetworkChange(callback: (chainId: string) => void): void {
    try {
      this.provider.listenNetworkChange(callback);
    } catch (err) {
      throw err;
    }
  }

  removeAllListenEvents(): void {
    this.provider.removeAllListenEvents();
  }

  isAvailable(): boolean {
    return this.provider.isAvailable();
  }

  async getChainId(): Promise<string> {
    return await this.provider.getChainId();
  }
}
