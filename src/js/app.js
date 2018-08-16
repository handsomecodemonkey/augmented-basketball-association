App = {
  web3Provider: null,
  contracts: {},
  leagueStorageAddress: "",
  commisionerAddress: "",

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    
    if(typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      $('#web3Modal').modal();
      return;
    }

    web3 = new Web3(App.web3Provider);
    return App.initBasketBallLeagueContract();
  },

  initBasketBallLeagueContract: function() {
    $.getJSON('BasketBallLeagueStorage.json', function(data) {

      App.contracts.BasketBallLeagueStorage = TruffleContract(data);
      App.contracts.BasketBallLeagueStorage.setProvider(App.web3Provider);
      return App.initABADaoContract();
    });

    return;
  },

  initABADaoContract: function() {
    $.getJSON('ABADao.json', function(data) {

      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.ABADao = TruffleContract(data);
      // Set the provider for our contract
      App.contracts.ABADao.setProvider(App.web3Provider);

      App.contracts.ABADao.deployed()
      .then(function(instance){
        $('#abaDaoAddress').text(instance.address);
        let leagueStorageAddress = instance.getBasketBallLeagueStorageContractAddress();
        return leagueStorageAddress;
      }).then(function(leagueStorageAddress) {
        $('#leageStorageAddress').text(leagueStorageAddress);
        App.leagueStorageAddress = leagueStorageAddress;

        App.contracts.BasketBallLeagueStorage.at(App.leagueStorageAddress).then(function(instance){
          return instance.commisioner();
        }).then(function(commisionerAddress) {
          $('#commisionerAddress').text(commisionerAddress);
          App.commisionerAddress = commisionerAddress;
          return commisionerAddress;
        });

        return;
      })

      return App.initABATokenContract();
    });
    
    return;
  },

  initABATokenContract: function() {
    $.getJSON('ABAToken.json', function(data) {

      App.contracts.ABAToken = TruffleContract(data);
      App.contracts.ABAToken.setProvider(App.web3Provider);

      App.contracts.ABAToken.deployed()
      .then(function(instance){
        $('#abaTokenAddress').text(instance.address);
        return instance;
      });

      return;
    });
    return;
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
