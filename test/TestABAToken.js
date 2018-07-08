const ABAToken = artifacts.require("ABAToken");

contract('ABAToken JS Test', async(accounts) => {

	it("should give total supply to first account", async() => {
		let abaToken = await ABAToken.deployed();
		let balance = await abaToken.balanceOf.call(accounts[0]);
		assert.equal(balance.valueOf(), 100);
	});

});