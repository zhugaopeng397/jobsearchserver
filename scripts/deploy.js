const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // const [deployer, owner2, owner3] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const weiAmount = (await deployer.getBalance()).toString();
  
  console.log("Account balance:", (await ethers.utils.formatEther(weiAmount)));

  const Token = await ethers.getContractFactory("MultiSig");

  const addresses = [deployer.address, '0x81B6d525C8077d0966bf82CcDccB55eeF4f919A7', '0x9915540CDb0d3692B0BE06017b0f92C52C491857'];
  const token = await Token.deploy(addresses, 3);
  await token.deployed();
  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});