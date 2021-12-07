//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC20 {
    /**
     * @dev Returns the total supply in the contract.
     * @return total amount of supply.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the balance of given account.
     * @param account account to fetch balance for.
     * @return total amount of supply.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Transfers amount of tokens from caller of the method to recipient.
     * @param recipient tokens recipient address.
     * @param amount amount to send to recipient.
     * @return result of the transfer.
     */
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    /**
     * @dev Returns the amount of tokens that owner allowed spender to use.
     * @param owner owner of tokens.
     * @param spender spender of tokens.
     * @return amount of tokens to spend.
     */
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    /**
     * @dev Sets the amount of tokens that caller of the function allows to be used by spender.
     * @param spender spender of tokens.
     * @param amount allowed amount to spend by spender.
     * @return result of the operation.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Transfers amount of tokens from sender to recipient.
     * @param sender sender of tokens.
     * @param recipient tokens recipient address.
     * @param amount amount to send to recipient.
     * @return result of the transfer.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}
