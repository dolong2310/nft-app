import { NetworkType } from "../types";

export const isEVMChain = (chain: NetworkType): boolean => {
  return [
    NetworkType.BSC,
    NetworkType.POLYGON,
    NetworkType.ETHEREUM,
    NetworkType.BSC_TESTNET,
    NetworkType.POLYGON_TESTNET,
    NetworkType.SEPOLIA,
  ].includes(chain);
};
