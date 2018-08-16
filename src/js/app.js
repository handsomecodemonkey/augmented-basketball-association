App = {
  web3Provider: null,
  contracts: {},
  leagueStorageAddress: "",
  commisionerAddress: "",
  emergencyStop: false,

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

          if(commisionerAddress === web3.eth.accounts[0]){
            $('#greeting').text("Welcome back commisioner!");
            $('#commisioner-only-section').removeClass('invisible');
          }

          return App.initEmergencyStopStatus();
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
      }).then(function(instance){
        return instance.balanceOf(web3.eth.accounts[0]);
      }).then(function(balance){
        if(balance >=20) {
          $('#abaDaoOnlySection').removeClass('invisible');
          $('#abaTokenBalance').text(balance);
        }
        return;
      });

      return;
    });
    return;
  },

  initEmergencyStopStatus: function() {
    App.contracts.BasketBallLeagueStorage.at(App.leagueStorageAddress)
    .then(function(instance) {
      return instance.emergencyStop();
    }).then(function(emergencyStopStatus) {
      $('#emergencyStopStatus').text(emergencyStopStatus);
      App.emergencyStop = emergencyStopStatus;
      return;
    });

    return;
  },

  addAsset: function() {
    var assetType = $('#assetType').val();
    var owningTeam = $('#owningTeam').val();
    var assetNameOrHash = $('#assetName').val();

    App.contracts.BasketBallLeagueStorage.at(App.leagueStorageAddress)
    .then(function(instance) {
      instance.createNewAsset(assetType, owningTeam, assetNameOrHash, {from: web3.eth.accounts[0]});
    });
  },

  emergencyToggle: function() {

    App.contracts.ABADao.deployed()
    .then(function(instance) {
      if(App.emergencyStop) {
        instance.turnOffEmergencyStop({from: web3.eth.accounts[0]});
      } else {
        instance.turnOnEmergencyStop({from: web3.eth.accounts[0]});
      }
    });
  },

  changeCommisioner: function() {
    let newAddress = $('#newCommisionerAddress').val();
    
    if(newAddress === "") {
      alert("Please insert an address");
      return;
    }

    App.contracts.ABADao.deployed()
    .then(function(instance) {
      instance.changeABACommisioner(newAddress, {from: web3.eth.accounts[0]});
    });

  }
};

$(function() {
  $(window).load(function() {
    App.init();
    $('#addAsset').click(App.addAsset);
    $('#emergencyOnOff').click(App.emergencyToggle);
    $('#changeCommisioner').click(App.changeCommisioner);
  });
});
