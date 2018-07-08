var ABAToken = artifacts.require("./ABAToken.sol");

module.exports = function(deployer) {
  deployer.deploy(ABAToken);
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(MetaCoin);
};
