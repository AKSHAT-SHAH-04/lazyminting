const { expect } = require("chai");
const hardhat = require("hardhat");
const { ethers } = hardhat;
const { LazyMinter } = require("../helper/initiater");

async function deploy() {
 const [minter, redeemer, _] = await ethers.getSigners();

 let factory = await ethers.getContractFactory("MyNFT", minter);
 const contract = await factory.deploy();

 return {
  minter,redeemer,contract,
 };
}

describe("MyNFT", function () {
 it("The Token Contract should deploy", async function () {
  const initiaters = await ethers.getSigners();
  const minter = initiaters.address;

  const lazyNFT = await ethers.getContractFactory("MyNFT");
  const lazyFT = await lazyNFT.deploy();
  await lazyFT.deployed();
 });

 it("Should redeem an NFT from a signed voucher", async function () {
  const { contract, redeemer, minter } = await deploy();

  const lazyMinter = new LazyMinter({ contract, initiater: minter });
  // console.log(lazyMinter);
  const voucher = await lazyMinter.createVoucher(
   1,
   "https://picsum.photos/seed/picsum/200/300"
  );

  const tokenId = voucher.tokenId;
  const minPrice = voucher.minPrice;
  const uri = voucher.uri;
  const signature = voucher.signature;

  await expect(
   contract.redeem(redeemer.address, tokenId, minPrice, uri, signature)
  )
   .to.emit(contract, "Transfer") // transfer from null address to minter
   .withArgs(
    "0x0000000000000000000000000000000000000000",
    minter.address,
    voucher.tokenId
   )
   .and.to.emit(contract, "Transfer") // transfer from minter to redeemer
   .withArgs(minter.address, redeemer.address, voucher.tokenId);
 });

 it("Should fail to redeem an NFT that's already been claimed", async function () {
  const { contract, redeemer, minter } = await deploy();

  const lazyMinter = new LazyMinter({ contract, initiater: minter });
  const voucher = await lazyMinter.createVoucher(
   1,
   "https://picsum.photos/seed/picsum/200/300"
  );

  const tokenId = voucher.tokenId;
  const minPrice = voucher.minPrice;
  const uri = voucher.uri;
  const signature = voucher.signature;

  await expect(
   contract.redeem(redeemer.address, tokenId, minPrice, uri, signature)
  )
   .to.emit(contract, "Transfer") // transfer from null address to minter
   .withArgs(
    "0x0000000000000000000000000000000000000000",
    minter.address,
    voucher.tokenId
   )
   .and.to.emit(contract, "Transfer") // transfer from minter to redeemer
   .withArgs(minter.address, redeemer.address, voucher.tokenId);

  await expect(
   contract.redeem(redeemer.address, tokenId, minPrice, uri, signature)
  ).to.be.revertedWith("ERC721: token already minted");
 });

 it("it should make the nft transfer if the payment is greater or equal to minimum price", async function () {
  const { contract, redeemer, minter } = await deploy();

  const lazyMinter = new LazyMinter({ contract, initiater: minter });
  const amount = ethers.constants.WeiPerEther; // charge 1 Eth
  const voucher = await lazyMinter.createVoucher(
   1,
   "https://picsum.photos/seed/picsum/200/300",
   amount
  );

  const tokenId = voucher.tokenId;
  const minPrice = voucher.minPrice;
  const uri = voucher.uri;
  const signature = voucher.signature;

  await expect(
   contract.redeem(redeemer.address, tokenId, minPrice, uri, signature, {
    value: amount,
   })
  )
   .to.emit(contract, "Transfer") // transfer from null address to minter
   .withArgs(
    "0x0000000000000000000000000000000000000000",
    minter.address,
    tokenId
   )
   .and.to.emit(contract, "Transfer") // transfer from minter to redeemer
   .withArgs(minter.address, redeemer.address, tokenId);
 });

 it("should not reciever if the payment is less than min price", async function () {
  const { contract, redeemer, minter } = await deploy();

  const lazyMinter = new LazyMinter({ contract, initiater: minter });
  const amount = 100; // charge 1 Eth
  const voucher = await lazyMinter.createVoucher(
   1,
   "https://picsum.photos/seed/picsum/200/300",
   amount
  );

  const tokenId = voucher.tokenId;
  const minPrice = voucher.minPrice;
  const uri = voucher.uri;
  const signature = voucher.signature;

  const payment = 0;
  await expect(
   contract.redeem(redeemer.address, tokenId, minPrice, uri, signature, {
    value: payment,
   })
  ).to.be.revertedWith("Insufficient funds to redeem");
 });
});
