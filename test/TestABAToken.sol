pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ABAToken.sol";

contract TestABAToken {

 	uint256 private constant totalSupply = 100;
 	ABAToken private abaToken;

 	function beforeEach() public {
    	abaToken = new ABAToken();
  	}

  	function testTotalSupply() public {
		Assert.equal(abaToken.totalSupply(), totalSupply, "Total supply should be 100");
	}

	function testInitialBalance() public {
	    Assert.equal(abaToken.balanceOf(address(this)), totalSupply, "Creator should have 100 ABA Tokens initially");
	}

}