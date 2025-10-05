export enum ChainType {
  EVM = "evm",
  SOLANA = "solana",
}

export enum NetworkType {
  BSC = "bsc",
  POLYGON = "polygon",
  ETHEREUM = "ethereum",
  BSC_TESTNET = "bsc_testnet",
  POLYGON_TESTNET = "polygon_testnet",
  SEPOLIA = "sepolia",
}

export interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}
