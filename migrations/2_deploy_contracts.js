const SafeMath = artifacts.require("./SafeMath");
const ABAToken = artifacts.require("./ABAToken");
const ABADao = artifacts.require("./ABADao");

module.exports = function(deployer, network, accounts) {
	console.log("Deploying to network: " + network);

	deployer.deploy(SafeMath);
	deployer.link(SafeMath,ABAToken);
	deployer.deploy(ABAToken).then(function(a){
		return deployer.deploy(ABADao, a.address);
	}).then(function(abaDaoInstance) {
		return abaDaoInstance.changeABACommisioner(accounts[0], {from:accounts[0]});
	});
};
