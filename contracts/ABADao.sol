pragma solidity ^0.4.24;

import "./ABAToken.sol";
import "./BasketballLeagueStorage.sol";

contract ABADao {
    
    ABAToken private abaTokenContract;
    BasketballLeagueStorage private basketballLeagueStorageContract;
    
    constructor(address _tokenContractAddress) public {
        abaTokenContract = ABAToken(_tokenContractAddress); //Connect the token contract
        basketballLeagueStorageContract = new BasketballLeagueStorage(); //Create the league storage/state
    }
    
    //variables
    
    //functions
    
    function getABATokenContractAddress() public view returns(address) {
        return abaTokenContract;
    }
    
    function getBasketBallLeagueContractAddress() public view returns(address) {
        return basketballLeagueStorageContract;
    }
    
        //internal function call
    
    
    //events
    
    //function modifiers
    modifier requirePercentageShare(uint256 _amount) {
        require(abaTokenContract.balanceOf(msg.sender) >= _amount);
        _;
    }
    
}