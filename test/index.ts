import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC20Token } from "../typechain-types/";
import { ERC20Token__factory } from "../typechain-types/factories/ERC20Token__factory";

describe("ERC20Token", function () {

    let accounts: SignerWithAddress[];
    let owner: SignerWithAddress;
    let contract: ERC20Token;

    before(async function () {
        accounts = await ethers.getSigners();
        owner = accounts[0];
    });

    beforeEach(async function () {
        const tokenFactory = new ERC20Token__factory(owner);
        contract = await tokenFactory.deploy();
        await contract.deployed();
    })

    it("Should mint token", async function () {
        await expect(contract.mint(ethers.constants.AddressZero, 0))
            .to.be.revertedWith('Account address cannot be 0');

        const amount = 100;

        await contract.mint(owner.address, amount);

        // Mint should increase total supply
        expect(await contract.totalSupply())
            .to.equal(amount);

        // Mint should increase balance of account
        expect(await contract.balanceOf(owner.address))
            .to.equal(amount);
    });

    it("Should burn token", async function () {
        await expect(contract.burn(ethers.constants.AddressZero, 0))
            .to.be.revertedWith('Account address cannot be 0');

        const amountToMint = 100;

        await expect(contract.burn(owner.address, amountToMint))
            .to.be.revertedWith('Amount exceeds account balance');

        // Owner and total supply should have increased 'amount' amount of token
        await contract.mint(owner.address, amountToMint);

        const amountToBurn = 50;

        await contract.burn(owner.address, amountToBurn);

        // Burn should decrease total supply
        expect(await contract.totalSupply())
            .to.equal(amountToMint - amountToBurn);

        // Burn should decrease balance of account
        expect(await contract.balanceOf(owner.address))
            .to.equal(amountToMint - amountToBurn);
    });

    it("Should approve token", async function () {
        const amount = 100;

        await expect(contract.approve(ethers.constants.AddressZero, amount))
            .to.be.revertedWith('Spender address cannot be 0');

        await expect(contract.connect(ethers.constants.AddressZero).approve(accounts[1].address, amount))
            .to.be.revertedWith('Owner address cannot be 0');

        // Before approve allowance should be 0
        expect(await contract.allowance(owner.address, accounts[1].address))
            .to.equal(0);

        // owner approves accounts[1]
        await contract.approve(accounts[1].address, amount);

        expect(await contract.allowance(owner.address, accounts[1].address))
            .to.equal(amount);

        // accounts[1] approves owner
        await contract.connect(accounts[1]).approve(owner.address, amount);

        expect(await contract.allowance(accounts[1].address, owner.address))
            .to.equal(amount);
    });

    it("Should transfer token", async function () {
        const amount = 100;

        await expect(contract.transfer(ethers.constants.AddressZero, amount))
            .to.be.revertedWith('Recipient address cannot be 0');

        await expect(contract.connect(ethers.constants.AddressZero).transfer(accounts[1].address, amount))
            .to.be.revertedWith('Sender address cannot be 0');

        await expect(contract.transfer(accounts[1].address, amount))
            .to.be.revertedWith("Amount exceeds the sender's balance");

        // Before approve allowance should be 0
        expect(await contract.allowance(owner.address, accounts[1].address))
            .to.equal(0);

        await contract.mint(owner.address, amount);

        await contract.transfer(accounts[1].address, amount);

        // owner approves accounts[1]
        await contract.approve(accounts[1].address, amount);

        expect(await contract.balanceOf(owner.address))
            .to.equal(0);
        expect(await contract.balanceOf(accounts[1].address))
            .to.equal(amount);
    });

    it("Should transfer token from sender to recipient", async function () {
        const amount = 100;

        await expect(contract.transferFrom(owner.address, accounts[1].address, amount))
            .to.be.revertedWith('Amount exceeds allowance');

        await contract.approve(accounts[1].address, amount);

        // In case method callers address is 0
        await expect(contract.connect(ethers.constants.AddressZero).transferFrom(owner.address, accounts[1].address, amount))
            .to.be.revertedWith('Spender address cannot be 0');

        // In case senders address is 0
        await expect(contract.connect(accounts[1]).transferFrom(ethers.constants.AddressZero, accounts[1].address, amount))
            .to.be.revertedWith('Sender address cannot be 0');

        // In case recipients address is 0
        await expect(contract.connect(accounts[1]).transferFrom(owner.address, ethers.constants.AddressZero, amount))
            .to.be.revertedWith('Recipient address cannot be 0');

        // In case sender does not have enough fund in his account, even tho allowance is enough
        await expect(contract.connect(accounts[1]).transferFrom(owner.address, accounts[1].address, amount))
            .to.be.revertedWith("Amount exceeds the sender's balance");

        // Give owner 'amount' amount of fund
        await contract.mint(owner.address, amount);

        // Transfer funds to account[1]'s account
        await contract.connect(accounts[1]).transferFrom(owner.address, accounts[1].address, amount);

        expect(await contract.balanceOf(owner.address))
            .to.equal(0);
        expect(await contract.balanceOf(accounts[1].address))
            .to.equal(amount);
        // Allowance should decrease after transfer
        expect(await contract.allowance(owner.address, accounts[1].address))
            .to.equal(0);

        // Transfer tokens from sender to another account
        await contract.approve(accounts[1].address, amount);
        await contract.mint(owner.address, amount);

        // Send funds to account[2] even tho caller of the method is account[1]
        await contract.connect(accounts[1]).transferFrom(owner.address, accounts[2].address, amount);

        expect(await contract.balanceOf(owner.address))
            .to.equal(0);
        expect(await contract.balanceOf(accounts[2].address))
            .to.equal(amount);
        expect(await contract.allowance(owner.address, accounts[1].address))
            .to.equal(0);
    });
})
