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

	it("should not allow just anyone to create a new asset", async() => {
		try{
			await leagueStorage.createNewAsset(1, 0, "TEST", {from:accounts[1]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should allow commisioner to create a new asset", async() => {
		await leagueStorage.createNewAsset(1, 0, "TEST", {from:accounts[0]});
		let test = await leagueStorage.assetMetadata(1);
		let owner = await leagueStorage.ownerOfAsset(1);
		assert.equal(0,owner);
		assert.equal("TEST", test);
	});

	it("should not allow just anyone to change commisioner", async() => {
		try{
			await leagueStorage.changeCommisioner(accounts[1],{from:accounts[1]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should allow leagueOrganization to change commisioner", async() => {
		await leagueStorage.changeCommisioner(accounts[1],{from:accounts[0]});
		let newCommisionerAddress = await leagueStorage.commisioner();
		assert.equal(accounts[1], newCommisionerAddress);
	});

	it("should not allow just anyone to add a new team", async() => {
		try{
			await leagueStorage.createNewTeam("", accounts[1],{from:accounts[1]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should allow league organization to add a new team", async() => {
		await leagueStorage.createNewTeam("TEST", accounts[1],{from:accounts[0]});
		let metaData = await leagueStorage.teamMetadata(1);
		assert.equal("TEST", metaData);
	});

	it("should not be on emergency stop when contract is created", async() => {
		let emergencyStop = await leagueStorage.emergencyStop();
		assert.equal(false, emergencyStop);
	});

	it("should not let just anyone turn on emergency stop", async() => {
		try{
			await leagueStorage.setEmergencyStop(true,{from:accounts[1]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should allow league organization to turn on emergency stop", async() => {
		await leagueStorage.setEmergencyStop(true,{from:accounts[0]});
		let emergencyStop = await leagueStorage.emergencyStop();
		assert.equal(true, emergencyStop);
	});

	it("should return empty string for non existant asset meta data", async() => {
		let assetURL = await leagueStorage.assetMetadata(100);
		assert.equal("", assetURL);
	});

	it("should return empty string for non existant team meta data", async() => {
		let teamURL = await leagueStorage.teamMetadata(100);
		assert.equal("", teamURL);
	});

	//tODO test functions should not allow functions when emergency stop is on

	it("should not let allow commisioner change on emergency stop", async() => {
		await leagueStorage.setEmergencyStop(true, {from: accounts[0]});
		try{
			await leagueStorage.changeCommisioner(accounts[1],{from:accounts[0]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should not allow asset creation on emergency stop", async() => {
		await leagueStorage.setEmergencyStop(true, {from: accounts[0]});
		try{
			await leagueStorage.createNewAsset(1, 0, "TEST", {from:accounts[0]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should not allow team creation on emergency stop", async() => {
		await leagueStorage.setEmergencyStop(true, {from: accounts[0]});
		try{
			await leagueStorage.createNewTeam("TEST", accounts[1],{from:accounts[0]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});



});