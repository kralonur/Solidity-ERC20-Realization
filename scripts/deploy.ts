import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const Erc20Token = await ethers.getContractFactory("ERC20Token");
  const erc20Token = await Erc20Token.deploy();

  await erc20Token.deployed();

  console.log("ERC20Token deployed to:", erc20Token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
