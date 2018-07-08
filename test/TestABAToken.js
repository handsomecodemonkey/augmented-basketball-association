const ABAToken = artifacts.require("ABAToken");

contract('ABAToken JS Test', async(accounts) => {

	let abaToken;

	beforeEach(async() => {
		abaToken = await ABAToken.new({from:accounts[0]});
	});

	it("should have total supply of 100", async() => {
		let totalSupply = await abaToken.totalSupply();
		assert.equal(totalSupply, 100);
	});

	it("should give total supply to first account", async() => {
		let balance = await abaToken.balanceOf(accounts[0]);
		assert.equal(balance.valueOf(), 100);
	});

	it("should transfer tokens", async() => {
		await abaToken.transfer(accounts[1], 50, {from: accounts[0]});
		let balanceOfFirstAccount = await abaToken.balanceOf(accounts[0]);
		let balanceOfSecondAccount = await abaToken.balanceOf(accounts[1]);

		assert.equal(balanceOfFirstAccount.valueOf(), 50);
		assert.equal(balanceOfSecondAccount.valueOf(), 50);
	});

	it("should not allow illegal over balance transfers", async() => {
		try{
			await abaToken.transfer(accounts[1], 200, {from: accounts[0]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should not allow double transfers", async() => {
		try{
			await abaToken.transfer(accounts[1], 100, {from: accounts[0]});
			await abaToken.transfer(accounts[1], 100, {from: accounts[0]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

});