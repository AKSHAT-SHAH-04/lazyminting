//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract MyNFT is ERC721URIStorage, EIP712, AccessControl {
 bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
 string private constant SIGNING_DOMAIN = "MyNFT-Voucher";
 string private constant SIGNATURE_VERSION = "1";

 address private initiater;

 constructor()
  ERC721("LazyMINT", "LAZY")
  EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION)
 {}

 function setMinter(address _initiater) internal {
  initiater = _initiater;
  _setupRole(MINTER_ROLE, initiater);
 }

 function getMinter() public view returns (address) {
  return initiater;
 }

 /// @notice Redeems an NFTVoucher for an actual NFT, creating it in the process.
 /// @param redeemer The address of the account which will receive the NFT upon success.
 function redeem(
  address redeemer,
  uint256 tokenId,
  uint256 minPrice,
  string memory uri,
  bytes memory signature
 ) public payable  {
  // make sure signature is valid and get the address of the initiater
  initiater = _verify(tokenId, minPrice, uri, signature);

  // set the minter address in _setupRole
  setMinter(initiater);

  // make sure that the initiater is authorized to mint NFTs
  require(hasRole(MINTER_ROLE, initiater), "Signature invalid or unauthorized");

  // make sure that the redeemer is paying enough to cover the buyer's cost
  require(msg.value >= minPrice, "Insufficient funds to redeem");

  // first assign the token to the initiater, to establish provenance on-chain
  _mint(initiater, tokenId);
  _setTokenURI(tokenId, uri);

  _transfer(initiater, redeemer, tokenId);

  // send amount to the initiater
  (bool sent, ) = payable(initiater).call{value: msg.value}("");
  require(sent, "Failed to send Ether");
 }

 /// @notice Verifies the signature for a given voucher data, returning the address of the initiater.
 /// @dev Will revert if the signature is invalid. Does not verify that the initiater is authorized to mint NFTs.
 function _verify(
  uint256 tokenId,
  uint256 minPrice,
  string memory uri,
  bytes memory signature
 ) public view returns (address) {
  bytes32 digest = _hash(tokenId, minPrice, uri);
  return ECDSA.recover(digest, signature);
 }

 /// @notice Returns a hash of the given data, prepared using EIP712 typed data hashing rules.
 /// @param  tokenId for id of token
 ///@param minPrice price of nft
 ///@param uri metadata of the token
 function _hash(
  uint256 tokenId,
  uint256 minPrice,
  string memory uri
 ) internal view returns (bytes32) {
  return
   _hashTypedDataV4(
    keccak256(
     abi.encode(
      keccak256("NFTVoucher(uint256 tokenId,uint256 minPrice,string uri)"),
      tokenId,
      minPrice,
      keccak256(bytes(uri))
     )
    )
   );
 }

 /// @notice Returns the chain id of the current blockchain.
 function getChainID() external view returns (uint256) {
  uint256 id;
  assembly {
   id := chainid()
  }
  return id;
 }

 function supportsInterface(bytes4 interfaceId)
  public
  view
  virtual
  override(AccessControl, ERC721)
  returns (bool)
 {
  return super.supportsInterface(interfaceId);
 }
}
