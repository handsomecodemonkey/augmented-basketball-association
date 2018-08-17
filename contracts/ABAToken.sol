/**
* Token Contract for the ABA
*
* @file ABAToken.sol
* @author Erick Kusnadi
*/

pragma solidity 0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC20/BasicToken.sol';

/** @title ABAToken. */
contract ABAToken is BasicToken {
    
    /**
    * @dev Constructor assigns all tokens to original message sender
    */
    constructor() public {
        totalSupply_ = 100;
        balances[msg.sender] = totalSupply_;
    }
    
}