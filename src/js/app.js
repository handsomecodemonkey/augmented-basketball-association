App = {
  web3Provider: null,
  contracts: {},
  leagueStorageAddress: "",
  commisionerAddress: "",
  emergencyStop: false,
  assetCount: 0,
  teamCount: 4,
  currentPlayer: {},

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
      return App.initAssetCount();
    });

    return;
  },

  initAssetCount: function() {
    App.contracts.BasketBallLeagueStorage.at(App.leagueStorageAddress)
    .then(function(instance) {
      return instance.numberOfAssets();
    }).then(function(numAssets) {
      App.assetCount = numAssets.c[0];
      $('#assetCount').text(numAssets);
      return;
    });
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
  },

  searchForPlayer: function() {
    //check id between
    var playerId = $('#playerIdSearch').val();
    if(playerId === "" || isNaN(playerId) || playerId <= 0 || playerId > App.assetCount) {
      alert("Please enter a valid player id");
      return;
    } 

    App.currentPlayer.playerId = playerId;

    App.contracts.BasketBallLeagueStorage.at(App.leagueStorageAddress)
    .then(function(instance) {
      return instance.ownerOfAsset(playerId);
    }).then(function(owner) {

      App.currentPlayer.teamId = owner.c[0];

      var team = "No Team";

      if(1 == owner) {
        team = "Los Angeles Rivers";
      } else if (2 == owner) {
        team = "Houston Fireworks";
      } else if (3 == owner) {
        team = "Golden Country Fighters";
      } else if (4 == owner) {
        team = "Atlanta Falcons";
      }

      App.currentPlayer.team = team;

      return owner;
    }).then(function(){
      App.contracts.BasketBallLeagueStorage.at(App.leagueStorageAddress)
      .then(function(instance) {
        return instance.assetMetadata(playerId);
      }).then(function(data) {
        App.currentPlayer.playerName = data;
        return;
      }).then(function() {
        return App.displayPlayer();
      });

      return;
    });

    return;
  },

  displayPlayer: function() {
    $('#draftButton').attr('disabled','disabled');
    $('#renounceButton').attr('disabled','disabled');

    $('#playerName').text("Player Name: " + App.currentPlayer.playerName);
    $('#playerId').text("Player Id: " + App.currentPlayer.playerId);
    $('#playerOwner').text("Team: " + App.currentPlayer.team);

    $('#shooting').text("Shooting: " + (Math.floor(Math.random() * 100) + 1));
    $('#passing').text("Passing: " + (Math.floor(Math.random() * 100) + 1));
    $('#rebounding').text("Rebounding: " + (Math.floor(Math.random() * 100) + 1));

    if(App.currentPlayer.teamId === 0) {
      $('#draftButton').removeAttr('disabled');
    } else {
      $('#renounceButton').removeAttr('disabled');
    }
  },

  draftPlayer: function() {
    
    var selectedTeamId = prompt("Please enter a team id: LA-1, Houston-2, Golden-3, Atlanta -4");

    if(selectedTeamId === "" || isNaN(selectedTeamId) || selectedTeamId <= 0 || selectedTeamId > 4) {
      alert("Please enter a valid team id");
      return;
    } 

    App.contracts.BasketBallLeagueStorage.at(App.leagueStorageAddress)
      .then(function(instance) {
        return instance.draftAsset(App.currentPlayer.playerId, selectedTeamId, {from: web3.eth.accounts[0]});
      });
  },

  renouncePlayer: function() {
    App.contracts.BasketBallLeagueStorage.at(App.leagueStorageAddress)
      .then(function(instance) {
        return instance.renounceAsset(App.currentPlayer.playerId, App.currentPlayer.teamId, {from: web3.eth.accounts[0]});
      });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
    $('#addAsset').click(App.addAsset);
    $('#emergencyOnOff').click(App.emergencyToggle);
    $('#changeCommisioner').click(App.changeCommisioner);
    $('#playerSearchButton').click(App.searchForPlayer);
    $('#draftButton').click(App.draftPlayer);
    $('#renounceButton').click(App.renouncePlayer);
  });
});
