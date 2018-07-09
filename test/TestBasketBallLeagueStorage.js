const BasketballLeagueStorage = artifacts.require("BasketBallLeagueStorage");

contract('BasketBallLeagueStorage JS Test', async(accounts) => {

	let leagueStorage;

	beforeEach(async() => {
		leagueStorage = await BasketballLeagueStorage.new({from: accounts[0]});
	});

	
	it("should set commisioner address to contract creator address", async() => {
		let commisionerAddress = await leagueStorage.commisioner();
		assert.equal(accounts[0], commisionerAddress);
	});
	
	it("should set league organization address to contract creator address", async() => {
		let leagueOrgAddress = await leagueStorage.leagueOrganizationAddress();
		assert.equal(accounts[0], leagueOrgAddress);
	});

	it("should return empty string for non existant asset meta data", async() => {
		let assetURL = await leagueStorage.assetMetadata(100);
		assert.equal("", assetURL);
	});

	it("should return empty string for non existant team meta data", async() => {
		let teamURL = await leagueStorage.teamMetadata(100);
		assert.equal("", teamURL);
	});

});