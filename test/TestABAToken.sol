pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ABAToken.sol";

contract TestABAToken {

	function testInitialBalance() public {
		ABAToken abaToken = new ABAToken();
	    uint256 expected = 100;
	    Assert.equal(abaToken.balanceOf(address(this)), expected, "Creator should have 100 ABA Tokens initially");
	}

}