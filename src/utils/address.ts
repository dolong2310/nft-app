import Web3 from "web3";

export const checkSumAddress = (address: string) => {
  try {
    return Web3.utils.toChecksumAddress(address);
  } catch (error) {
    return address;
  }
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: string) => {
  return parseFloat(balance).toFixed(4);
};
