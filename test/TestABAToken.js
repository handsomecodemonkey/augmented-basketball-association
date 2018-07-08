const ABAToken = artifacts.require("ABAToken");

contract('ABAToken JS Test', async(accounts) => {

	let abaToken;

	before(async() => {
		abaToken = await ABAToken.deployed();
	});

	it("should have total supply of 100", async() => {
		let totalSupply = await abaToken.totalSupply();
		assert.equal(totalSupply, 100);
	});

	it("should give total supply to first account", async() => {
		let balance = await abaToken.balanceOf(accounts[0]);
		assert.equal(balance.valueOf(), 100);
	});

});