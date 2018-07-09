const ABADao = artifacts.require("ABADao");
const ABAToken = artifacts.require("ABAToken");
const LeagueStorage = artifacts.require("BasketBallLeagueStorage");

contract('ABADao JS Test', async(accounts) => {

	let abaToken;
	let abaDao;
	let leagueStorage;

	beforeEach(async() => {
		abaToken = await ABAToken.new({from:accounts[0]});
		abaDao = await ABADao.new(abaToken.address, {from:accounts[0]});

		let leagueStorageAddress = await abaDao.getBasketBallLeagueStorageContractAddress();
		leagueStorage = await LeagueStorage.at(leagueStorageAddress);
	});

	it("should have the abaToken address saved", async() => {
		let addressToCheck = await abaDao.getABATokenContractAddress();
		assert.equal(abaToken.address, addressToCheck);
	});

	it("should not allow just anyone to change commisioner", async() => {
		try{
			await abaDao.changeABACommisioner(accounts[1],{from:accounts[1]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should allow 51% share holder to change commisioner", async() => {
		await abaDao.changeABACommisioner(accounts[1],{from:accounts[0]});
		let newCommisionerAddress = await leagueStorage.commisioner();
		assert.equal(accounts[1], newCommisionerAddress);
	});

	it("should not allow just anyone to add a new team", async() => {
		try{
			await abaDao.addABATeam("", accounts[1],{from:accounts[1]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should allow 20% shareholder to add a new team", async() => {
		await abaDao.addABATeam("TEST", accounts[1],{from:accounts[0]});
		let metaData = await leagueStorage.teamMetadata(1);
		assert.equal("TEST", metaData);
	});

	it("should not allow just anyone to turn on emergency stop", async() => {
		try{
			await abaDao.turnOnEmergencyStop({from:accounts[1]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should allow 51% share holder to turn on emergency stop", async() => { 
		await abaDao.turnOnEmergencyStop({from:accounts[0]});
		let emergencyStop = await leagueStorage.emergencyStop();
		assert.equal(true, emergencyStop);
	});

	it("should not allow just anyone to turn off emergency stop", async() => {
		await abaDao.turnOnEmergencyStop({from:accounts[0]});
		try{
			await abaDao.turnOffEmergencyStop({from:accounts[1]});
			assert.fail(); //Should throw exception
		} catch(error) {
			assert.isTrue(error.message.includes("revert"));
		}
	});

	it("should allow 51% shareholder to turn on emergency stop", async() => {
		await abaDao.turnOnEmergencyStop({from:accounts[0]});
		await abaDao.turnOffEmergencyStop({from:accounts[0]});
		let emergencyStop = await leagueStorage.emergencyStop();
		assert.equal(false, emergencyStop);
	});

});