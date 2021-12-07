import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";
import { ERC20Token } from "./typechain-types/";
import { ERC20Token__factory } from "./typechain-types/factories/ERC20Token__factory";

dotenv.config();

task("total-supply", "Shows the total supply")
  .addParam("contract", "The address of the contract")
  .setAction(async (taskArgs, hre) => {
    const MyContract: ERC20Token__factory = <ERC20Token__factory>await hre.ethers.getContractFactory("ERC20Token");
    const contract: ERC20Token = MyContract.attach(taskArgs.contract);


    const totalSupply = (await contract.totalSupply()).toNumber();
    console.log(totalSupply + " (" + hre.ethers.utils.formatEther(totalSupply) + " ether)");
  });

task("balance", "Shows the balance of an account")
  .addParam("contract", "The address of the contract")
  .addParam("address", "The address of the account")
  .setAction(async (taskArgs, hre) => {
    const MyContract: ERC20Token__factory = <ERC20Token__factory>await hre.ethers.getContractFactory("ERC20Token");
    const contract: ERC20Token = MyContract.attach(taskArgs.contract);


    const balance = (await contract.balanceOf(taskArgs.address)).toNumber();
    console.log(balance + " (" + hre.ethers.utils.formatEther(balance) + " ether)");
  });

task("allowance", "Shows the allowance amount")
  .addParam("contract", "The address of the contract")
  .addParam("owner", "The address of the owner")
  .addParam("spender", "The address of the spender")
  .setAction(async (taskArgs, hre) => {
    const owner = taskArgs.owner;
    const spender = taskArgs.spender;
    const MyContract: ERC20Token__factory = <ERC20Token__factory>await hre.ethers.getContractFactory("ERC20Token");
    const contract: ERC20Token = MyContract.attach(taskArgs.contract);

    const amount = (await contract.allowance(owner, spender)).toNumber();

    await contract.approve(spender, amount);
    console.log(owner + " allowed " + spender + " to spend " + amount + " tokens");
  });

task("approve", "Approves")
  .addParam("contract", "The address of the contract")
  .addParam("spender", "The address of the spender")
  .addParam("amount", "The amount to approve")
  .setAction(async (taskArgs, hre) => {
    const owner = (await hre.ethers.getSigners())[0];
    const spender = taskArgs.spender;
    const amount = taskArgs.amount;
    const MyContract: ERC20Token__factory = <ERC20Token__factory>await hre.ethers.getContractFactory("ERC20Token");
    const contract: ERC20Token = MyContract.attach(taskArgs.contract);


    await contract.connect(owner).approve(spender, amount);
    console.log(owner.address + " allowed " + spender + " to spend " + amount + " tokens");
  });

task("mint", "Mint amount of tokens to the address")
  .addParam("contract", "The address of the contract")
  .addParam("address", "The address to get tokens")
  .addParam("amount", "The amount to mint")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const amount = taskArgs.amount;
    const MyContract: ERC20Token__factory = <ERC20Token__factory>await hre.ethers.getContractFactory("ERC20Token");
    const contract: ERC20Token = MyContract.attach(taskArgs.contract);

    await contract.mint(address, amount);
    console.log(amount + " tokens minted to the address " + address);
  });

task("burn", "Burn amount of tokens from the address")
  .addParam("contract", "The address of the contract")
  .addParam("address", "The address to burn tokens from")
  .addParam("amount", "The amount to burn")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const amount = taskArgs.amount;
    const MyContract: ERC20Token__factory = <ERC20Token__factory>await hre.ethers.getContractFactory("ERC20Token");
    const contract: ERC20Token = MyContract.attach(taskArgs.contract);

    await contract.burn(address, amount);
    console.log(amount + " tokens burned from the address " + address);
  });

task("transfer", "Transfers funds from function caller to recipient")
  .addParam("contract", "The address of the contract")
  .addParam("recipient", "The address of the recipient")
  .addParam("amount", "The amount to transfer")
  .setAction(async (taskArgs, hre) => {
    const owner = (await hre.ethers.getSigners())[0];
    const recipient = taskArgs.recipient;
    const amount = taskArgs.amount;
    const MyContract: ERC20Token__factory = <ERC20Token__factory>await hre.ethers.getContractFactory("ERC20Token");
    const contract: ERC20Token = MyContract.attach(taskArgs.contract);

    await contract.transfer(recipient, amount);
    console.log(owner.address + " transferred " + amount + " tokens to " + recipient);
  });

task("transfer-from", "Transfers funds from sender to recipient")
  .addParam("contract", "The address of the contract")
  .addParam("sender", "The address of the sender")
  .addParam("recipient", "The address of the recipient")
  .addParam("amount", "The amount to transfer")
  .setAction(async (taskArgs, hre) => {
    const owner = (await hre.ethers.getSigners())[0];
    const sender = taskArgs.sender;
    const recipient = taskArgs.recipient;
    const amount = taskArgs.amount;
    const MyContract: ERC20Token__factory = <ERC20Token__factory>await hre.ethers.getContractFactory("ERC20Token");
    const contract: ERC20Token = MyContract.attach(taskArgs.contract);

    await contract.transferFrom(sender, recipient, amount);
    console.log(owner.address + " transferred " + amount + " tokens from " + sender + " to " + recipient);
  });

const INFURA_KEY = process.env.INFURA_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];
const ETHERSCAN_TOKEN = process.env.ETHERSCAN_TOKEN;

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545"
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + INFURA_KEY,
      accounts: PRIVATE_KEY
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_TOKEN
  }
};

export default config;
