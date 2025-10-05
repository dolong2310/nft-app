// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract MyNFT is ERC721, ERC721URIStorage, Ownable {
//     uint256 private _nextTokenId;

//     constructor(
//         string memory name,
//         string memory symbol
//     ) ERC721(name, symbol) Ownable(msg.sender) {}

//     /**
//      * @dev Mint a new NFT
//      * @param to Address to mint the NFT to
//      * @param uri Token URI for the NFT metadata
//      * @return tokenId The ID of the minted token
//      */
//     function mint(address to, string memory uri) public returns (uint256) {
//         uint256 tokenId = _nextTokenId++;
//         _safeMint(to, tokenId);
//         _setTokenURI(tokenId, uri);
//         return tokenId;
//     }

//     /**
//      * @dev Mint NFT only by owner
//      */
//     function mintByOwner(address to, string memory uri) public onlyOwner returns (uint256) {
//         uint256 tokenId = _nextTokenId++;
//         _safeMint(to, tokenId);
//         _setTokenURI(tokenId, uri);
//         return tokenId;
//     }

//     /**
//      * @dev Batch mint multiple NFTs
//      */
//     function batchMint(address to, string[] memory uris) public returns (uint256[] memory) {
//         uint256[] memory tokenIds = new uint256[](uris.length);
        
//         for (uint256 i = 0; i < uris.length; i++) {
//             uint256 tokenId = _nextTokenId++;
//             _safeMint(to, tokenId);
//             _setTokenURI(tokenId, uris[i]);
//             tokenIds[i] = tokenId;
//         }
        
//         return tokenIds;
//     }

//     /**
//      * @dev Get total number of minted tokens
//      */
//     function totalSupply() public view returns (uint256) {
//         return _nextTokenId;
//     }

//     /**
//      * @dev Get all token IDs owned by an address
//      */
//     function tokensOfOwner(address owner) public view returns (uint256[] memory) {
//         uint256 balance = balanceOf(owner);
//         uint256[] memory tokens = new uint256[](balance);
//         uint256 index = 0;

//         for (uint256 tokenId = 0; tokenId < _nextTokenId; tokenId++) {
//             if (_ownerOf(tokenId) == owner) {
//                 tokens[index] = tokenId;
//                 index++;
//             }
//         }

//         return tokens;
//     }

//     // Override functions required by Solidity
//     function tokenURI(uint256 tokenId)
//         public
//         view
//         override(ERC721, ERC721URIStorage)
//         returns (string memory)
//     {
//         return super.tokenURI(tokenId);
//     }

//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721, ERC721URIStorage)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }
// }