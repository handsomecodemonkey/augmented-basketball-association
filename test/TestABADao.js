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

});