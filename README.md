# Solidity ERC20 Realization

This contract is NOT safe!!!

Some functions like mint and burn left 'public' on purpose.
## Development

The contract is written with solidity.

Hardhat development environment being used to write this contract.

The test coverage is %100 (result from solidity-coverage).

For linting solhint and prettier is being used.

Contract could be deployed to rinkeby testnet using infura api key and wallet private key.
Environment file has to be created to use test network and contract validation. (.env.example file contains example template)

Scripts folder contains the script for contract deployment.

For the easier contract interaction, hardhat tasks are created.
To see the list of tasks, write `npx hardhat` to the terminal.