// These constants must match the ones used in the smart contract.
const SIGNING_DOMAIN_NAME = "MyNFT-Voucher";
const SIGNING_DOMAIN_VERSION = "1";

class LazyMinter {
 constructor({ contract, initiater }) {
  this.contract = contract;
  this.initiater = initiater;
 }

 async createVoucher(tokenId, uri, minPrice = 0) {
  const voucher = { tokenId, uri, minPrice };
  const domain = await this._signingDomain();
  const types = {
   NFTVoucher: [
    { name: "tokenId", type: "uint256" },
    { name: "minPrice", type: "uint256" },
    { name: "uri", type: "string" },
    
   ],
  };
  const signature = await this.initiater._signTypedData(domain, types, voucher);
  return {
   ...voucher,
   signature,
  };
 }

 async _signingDomain() {
  if (this._domain != null) {
   return this._domain;
  }

  const chainId = await this.contract.getChainID();
  this._domain = {
   name: SIGNING_DOMAIN_NAME,
   version: SIGNING_DOMAIN_VERSION,
   verifyingContract: this.contract.address,
   chainId,
  };
  return this._domain;
 }
}

module.exports = {
 LazyMinter,
};
