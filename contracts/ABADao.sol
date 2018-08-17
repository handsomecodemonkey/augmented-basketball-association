/**
* Contract for a simple share based DAO for the ABA.
* Storage variables and events are stored in a seperate contract.
*
* @file ABADao.sol
* @author Erick Kusnadi
*/

pragma solidity 0.4.24;

import "./ABAToken.sol";
import "./BasketBallLeagueStorage.sol";

/** @title ABADao. */
contract ABADao {
    
    /** Variables */

    ABAToken private abaTokenContract;
    BasketBallLeagueStorage private basketballLeagueStorageContract;
    
    /** Function modifiers */

    modifier requirePercentageShare(uint256 _amount) {
        require(abaTokenContract.balanceOf(msg.sender) >= _amount);
        _;
    }

    /** Functions */

    /**
    * @dev Constructor that creates the league storage and connects to an ERC20 token address
    * 
    * @param _tokenContractAddress Address of the ERC20 token
    *
    */
    constructor(address _tokenContractAddress) public {
        abaTokenContract = ABAToken(_tokenContractAddress); //Connect the token contract
        basketballLeagueStorageContract = new BasketBallLeagueStorage(); //Create the league storage/state
    }
    
    /**
    * @dev  Changes the commisioner in the storage contract
    *       requires 51% of the token shares
    *
    * @param _newCommisioner address of the new commisioner
    *
    */
    function changeABACommisioner(address _newCommisioner) public requirePercentageShare(51) {
        basketballLeagueStorageContract.changeCommisioner(_newCommisioner);
    }

    /**
    * @dev  Adds a new team to the basketball league
    *       Requires 20% of the token shares
    *
    * @param _metaDataLink URL Link to the teams metadata
    * @param _teamOrganizationAddress address to the new team owner or the team's DAO
    *
    */
    function addABATeam(string _metaDataLink, address _teamOrganizationAddress) public requirePercentageShare(20) {
        basketballLeagueStorageContract.createNewTeam(_metaDataLink, _teamOrganizationAddress);
    }

    /**
    * @dev  Turns on the emergency stop in the storage contract
    *       not allowing storage change functions.
    *
    */
    function turnOnEmergencyStop() public requirePercentageShare(51) {
        basketballLeagueStorageContract.setEmergencyStop(true);
    }

    /**
    * @dev  Turns off the emergency stop in the storage contract
    *       allowing storage change functions.
    *
    */
    function turnOffEmergencyStop() public requirePercentageShare(51) {
        basketballLeagueStorageContract.setEmergencyStop(false);
    }

    /**
    * @dev  Returns address of the ABA Token contract
    *
    * @return address
    */
    function getABATokenContractAddress() public view returns(address) {
        return abaTokenContract;
    }
    
    /**
    * @dev  Returns address of the BasketBallLeagueStorage contract
    *
    * @return address
    */
    function getBasketBallLeagueStorageContractAddress() public view returns(address) {
        return basketballLeagueStorageContract;
    }
    
}