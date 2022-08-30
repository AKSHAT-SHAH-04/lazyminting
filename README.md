NFT LAZY MINTING

This Project is regarding lazy minting implementation on NFT's and it manages the data from the backend and also stores all the data into the mongo db.


Technology addons and Uses

- [Hardhat](https://github.com/nomiclabs/hardhat): compile and run the smart contracts on a local development network
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Waffle](https://github.com/EthWorks/Waffle): tooling for writing comprehensive smart contract tests
- [Solhint](https://github.com/protofire/solhint): linter
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter

## Usage

### Pre Requisites

Before running any command, make sure to install dependencies:

```sh
$ npm install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ npx hardhat compile
```

### Test

Run the Mocha tests:

```sh
$ npx hardhat test
```

### Deploy contract to netowrk (requires Mnemonic and infura API key)

```
npx hardhat run --network rinkeby ./scripts/deploy.ts
```

### Validate a contract with etherscan (requires API ke)

```
npx hardhat verify --network <network> <DEPLOYED_CONTRACT_ADDRESS> "Constructor argument 1"
```

### Transaction Hashes
Contract is deployed on 0xc12dc9161bC03A67BF7cB6f52D928EfA2daDfb08
 
 NFT Purchase after being minted transaction 0xaaadec6be5803060aea62cf9a76d05f7cdf529d6b0fa029bd9fb47278109c39c
 
 The Tranasction of the rinkeby etherscan
 https://rinkeby.etherscan.io/tx/0xe1ca579ac9f705f5f281ae138d5188165ea341bd6504ca21b91e1f9091abea66

### Added plugins

- Gas reporter [hardhat-gas-reporter](https://hardhat.org/plugins/hardhat-gas-reporter.html)
- Etherscan [hardhat-etherscan](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html)

## License

UNKNOWN
