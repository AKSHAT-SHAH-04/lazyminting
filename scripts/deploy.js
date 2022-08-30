async function main() {
 const [deployer] = await ethers.getSigners();

 console.log("Deploying contracts with the account:", deployer.address);

 // Deploying token
 const lazyMinitng = await ethers.getContractFactory("MyNFT");
 const lazyMint = await lazyMinitng.deploy();
 await lazyMint.deployed();

 console.log(`Lazy mint address ${lazyMint.address}`);
 console.log("Account balance:", (await deployer.getBalance()).toString());
}

main()
 .then(() => process.exit(0))
 .catch((error) => {
  console.error(error);
  process.exit(1);
 });
