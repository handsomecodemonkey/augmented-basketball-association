const ABADao = artifacts.require("./ABADao");
const BasketBallLeagueStorage = artifacts.require("./BasketBallLeagueStorage");

//This file is used to initialize some testing data
//Teams
//Players

module.exports = function(deployer, network, accounts) {
	console.log("Deploying to network: " + network);

	deployer.then(function(a){
		return ABADao.deployed();
	}).then(function(abaDaoInstance) {
        abaDaoInstance.addABATeam("Los Angeles Rivers", accounts[1],{from:accounts[0]});
		return abaDaoInstance;
	}).then(function(abaDaoInstance) {
        abaDaoInstance.addABATeam("Houston Fireworks", accounts[2],{from:accounts[0]});
		return abaDaoInstance;
	}).then(function(abaDaoInstance) {
        abaDaoInstance.addABATeam("Golden Country Fighters", accounts[3],{from:accounts[0]});
		return abaDaoInstance;
	}).then(function(abaDaoInstance) {
        abaDaoInstance.addABATeam("Atlanta Falcons", accounts[4],{from:accounts[0]});
		return abaDaoInstance;
	}).then(function(abaDaoInstance) {
		return abaDaoInstance.getBasketBallLeagueStorageContractAddress();
	}).then(function(leagueStorageAddress) {
		console.log("League Storage Address: " + leagueStorageAddress);
		return BasketBallLeagueStorage.at(leagueStorageAddress);
    }).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "Anthony Melo", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "LeJames Brownie", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "Davis Brow", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "Steven Soupbased", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "Jamie Soften", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "Dagger Whiskey", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "Victory Olong", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "George Paulie", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "Thom Kalyson", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "Yawnis Antelope", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        basketBallInstance.createNewAsset(1, 0, "Joey Embed", {from:accounts[0]});
        return basketBallInstance;
	}).then(function(basketBallInstance) {
        console.log("Finished");
        return basketBallInstance;
	});

};
