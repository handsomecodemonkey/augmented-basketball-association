pragma solidity ^0.4.24;

import "./ABAToken.sol";
import "./BasketBallLeagueStorage.sol";

contract ABADao {
    
    ABAToken private abaTokenContract;
    BasketBallLeagueStorage private basketballLeagueStorageContract;
    
    constructor(address _tokenContractAddress) public {
        abaTokenContract = ABAToken(_tokenContractAddress); //Connect the token contract
        basketballLeagueStorageContract = new BasketBallLeagueStorage(); //Create the league storage/state
    }
    
    //variables
    
    //functions
    
    function changeABACommisioner(address _newCommisioner) public requirePercentageShare(51) {
        basketballLeagueStorageContract.changeCommisioner(_newCommisioner);
    }

    function addABATeam(string _metaDataLink, address _teamOrganizationAddress) public requirePercentageShare(20) {
        basketballLeagueStorageContract.createNewTeam(_metaDataLink, _teamOrganizationAddress);
    }

    function turnOnEmergencyStop() public requirePercentageShare(51) {
        basketballLeagueStorageContract.setEmergencyStop(true);
    }

    function turnOffEmergencyStop() public requirePercentageShare(51) {
        basketballLeagueStorageContract.setEmergencyStop(false);
    }

    function getABATokenContractAddress() public view returns(address) {
        return abaTokenContract;
    }
    
    function getBasketBallLeagueStorageContractAddress() public view returns(address) {
        return basketballLeagueStorageContract;
    }
    
    //events
    
    //function modifiers
    modifier requirePercentageShare(uint256 _amount) {
        require(abaTokenContract.balanceOf(msg.sender) >= _amount);
        _;
    }
    
}