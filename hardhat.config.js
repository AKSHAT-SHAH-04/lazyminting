require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("solidity-coverage");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
 solidity: "0.8.4",
 defaultNetwork: "hardhat",
 networks: {
  hardhat: {},
  rinkeby: {
   url: `https://eth-rinkeby.alchemyapi.io/v2/${API_KEY}`,
   accounts: [`${PRIVATE_KEY}`],
  },
 },
 plugins: ["solidity-coverage"],
};
