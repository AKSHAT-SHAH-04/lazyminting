const { voucherData } = require("../models/voucher");
const catchAsync = require("../utils/catchAsync");
const { logger } = require("../config/logger");

const getNft = catchAsync(async (req, res, next) => {
 const data = await voucherData.find();

 const result = data.map((nft) => ({
  tokenId: nft.tokenId,
  minPrice: nft.minPrice,
  uri: nft.uri,
 }));
 res.status(200).json(result);
 next();
});

const createItem = catchAsync(async (req, res, next) => {
 const data = {
  tokenId: req.body.tokenId,
  minPrice: req.body.minPrice,
  uri: req.body.uri,
  signature: req.body.signature,
 };

 try {
  const newVoucher = await voucherData.create(data);
  res.status(200).send("Voucher has been stored to the Database");
 } catch (error) {
  res.status(500).send("A Voucher with id already exits");
 }
 next();
});

const getUserItems = catchAsync(async (req, res, next) => {
 const tokenId = req.params.id;

 const userData = await voucherData.find({ tokenId });
 const result = userData.map((nft) => ({
  tokenId: nft.tokenId,
  minPrice: nft.minPrice,
  uri: nft.uri,
  signature: nft.signature,
 }));

 logger.info(result);
 res.status(200).json(userData);
 next();
});

module.exports = { getNft, createItem, getUserItems };
