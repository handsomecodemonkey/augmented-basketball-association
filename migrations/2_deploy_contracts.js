const SafeMath = artifacts.require("./SafeMath");
const ABAToken = artifacts.require("./ABAToken");
var ABADao = artifacts.require("./ABADao");

module.exports = async function(deployer, network) {
	console.log("Deploying to network: " + network);

	deployer.deploy(SafeMath);
	deployer.link(SafeMath,ABAToken);
	deployer.deploy(ABAToken);

	let abaToken = await ABAToken.deployed();
	let abaDAO = await ABADao.new(abaToken.address);

	let leageStorageAddress = await abaDAO.getBasketBallLeagueStorageContractAddress();
	console.log("LeagueStorage Address: " + leageStorageAddress);
};
