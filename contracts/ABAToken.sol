pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC20/BasicToken.sol';

contract ABAToken is BasicToken {
    
    constructor() public {
        //Initialize by assigning all tokens to message sender
        totalSupply_ = 100;
        balances[msg.sender] = totalSupply_;
    }
    
}