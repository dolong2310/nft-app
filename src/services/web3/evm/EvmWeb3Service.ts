import { ZERO_ADDRESS } from "@/constants/networks";
import { ERC20_ABI } from "@/contracts/abis/ERC20";
import { BaseWallet } from "@/services/wallet";
import Web3, { Contract, ContractAbi, validator } from "web3";
import { IWeb3Service } from "../types";

export class EvmWeb3Service implements IWeb3Service {
  protected web3: Web3;

  constructor(rpcUrl: string) {
    this.web3 = new Web3(rpcUrl);
  }

  async getBalance(address: string, tokenAddress?: string): Promise<string> {
    try {
      // Native token
      if (!tokenAddress || this.isNativeToken(tokenAddress)) {
        const balance = await this.web3.eth.getBalance(address);
        return this.web3.utils.fromWei(balance, "ether");
      }

      const contract = this.getContract(ERC20_ABI, tokenAddress);
      const balance = (await contract.methods.balanceOf(address).call()) as any;
      const decimals = (await contract.methods.decimals().call()) as any;
      const unit = this.getUnitByDecimals(Number(decimals)) as any;

      return this.web3.utils.fromWei(balance.toString(), unit);
    } catch (error) {
      console.log("Failed to get balance:", error);
      throw error;
    }
  }

  async getNonce(address: string): Promise<number> {
    try {
      const nonce = await this.web3.eth.getTransactionCount(address, "latest");
      return Number(nonce);
    } catch (error) {
      console.log("Failed to get nonce:", error);
      throw error;
    }
  }

  async getLatestBlock(): Promise<number> {
    try {
      const block = await this.web3.eth.getBlock("latest");
      return Number(block.timestamp);
    } catch (error) {
      console.log("Failed to get latest block:", error);
      throw error;
    }
  }

  async getTransactionReceipt(
    txHash: string
  ): Promise<{ txHash?: string; logs: any[] }> {
    try {
      const receipt = await this.web3.eth
        .getTransactionReceipt(txHash)
        .catch(() => null);
      return { txHash: receipt?.transactionHash, logs: receipt?.logs || [] };
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
      const contract = this.getContract(ERC20_ABI, tokenAddress);
      const allowance = (await contract.methods
        .allowance(owner, spender)
        .call()) as unknown as string;
      const decimals = await contract.methods.decimals().call();
      const unit = this.getUnitByDecimals(Number(decimals)) as any;

      return this.web3.utils.fromWei(allowance.toString(), unit);
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
      const contract = this.getContract(ERC20_ABI, tokenAddress);
      const decimals = await contract.methods.decimals().call();
      const unit = this.getUnitByDecimals(Number(decimals)) as any;
      const amountInWei = this.web3.utils.toWei(amount, unit);

      const data = await contract.methods
        .approve(spender, amountInWei)
        .encodeABI();

      const txHash = await wallet.sendTransaction({
        from,
        to: tokenAddress,
        data,
        value: "0",
      });

      return txHash;
    } catch (error) {
      console.log("Failed to approve token:", error);
      throw error;
    }
  }

  async estimateGas(transaction: any): Promise<string> {
    try {
      const gas = await this.web3.eth.estimateGas(transaction);
      return gas.toString();
    } catch (error) {
      console.log("Failed to estimate gas:", error);
      throw error;
    }
  }

  getContract(
    abi: ContractAbi,
    contractAddress: string
  ): Contract<ContractAbi> {
    return new this.web3.eth.Contract(abi, contractAddress);
  }

  checkSumAddress(address: string): string {
    return this.web3.utils.toChecksumAddress(address);
  }

  isValidAddress(address: string): boolean {
    return validator.isAddress(address, true);
    // return this.web3.utils.isAddress(address);
  }

  isNativeToken(address: string): boolean {
    return (
      address.toLowerCase() === ZERO_ADDRESS.toLowerCase() ||
      address === "" ||
      !address
    );
  }

  private getUnitByDecimals(decimals: number): string {
    const units: Record<number, string> = {
      18: "ether",
      9: "gwei",
      6: "mwei",
      3: "kwei",
      0: "wei",
    };
    return units[decimals] || "ether";
  }

  setProvider(provider: any): void {
    this.web3.setProvider(provider);
  }

  getWeb3Instance(): Web3 {
    return this.web3;
  }

  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.web3.eth.getGasPrice();
      return gasPrice.toString();
    } catch (error) {
      console.log("Failed to get gas price:", error);
      throw error;
    }
  }

  async waitForTransaction(
    txHash: string,
    confirmations: number = 1
  ): Promise<any> {
    let receipt = null;
    while (receipt === null) {
      try {
        receipt = await this.web3.eth.getTransactionReceipt(txHash);
        if (receipt === null) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.log("Error while waiting for transaction:", error);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    // Wait for confirmations
    if (confirmations > 0) {
      const currentBlock = await this.web3.eth.getBlockNumber();
      const confirmationBlock = Number(receipt.blockNumber) + confirmations;

      while (Number(currentBlock) < confirmationBlock) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    return receipt;
  }
}
