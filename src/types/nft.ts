export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface NFTDetail {
  tokenId: string;
  owner: string;
  tokenURI: string;
  metadata?: NFTMetadata;
}

export interface CollectionDetail {
  owner: string;
  name: string;
  symbol: string;
  totalSupply?: string;
}
