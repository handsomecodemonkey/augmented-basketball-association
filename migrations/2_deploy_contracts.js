const SafeMath = artifacts.require("./SafeMath");
const ABAToken = artifacts.require("./ABAToken");
var ABADao = artifacts.require("./ABADao");

let abaToken;
let abaDAO;

module.exports = function(deployer, network) {
	console.log("Deploying to network: " + network);

	deployer.deploy(SafeMath);
	deployer.link(SafeMath,ABAToken);
	deployer.deploy(ABAToken);

	deployer
		.then(() => ABAToken.deployed())
		.then(tokenInstance => {
			abaToken = tokenInstance;
			return ABADao.new(abaToken.address);
		})
		.then(abaDAOInstance => {
			abaDAO = abaDAOInstance;
			return abaDAO.getBasketBallLeagueStorageContractAddress();
		}).then(address => {
			console.log("LeagueStorage Address: " + address);
		});
};
