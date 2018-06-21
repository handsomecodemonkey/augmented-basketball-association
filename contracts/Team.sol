pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Team is Ownable {
    
    bytes32 public city;
    bytes32 public name;
    
    address [] public roster;
    
    constructor(bytes32 _city, bytes32 _name) public {
        city = _city;
        name = _name;
    }
    
    function changeName(bytes32 _newName) public onlyOwner {
        name = _newName;
    }
    
    function moveCity(bytes32 _newCity) public onlyOwner {
        city = _newCity;
    }
    
    function addPlayerToRoster(address _player) public onlyOwner {
        //TODO make sure not full roster
        //TODO make sure player is not already in another team
        roster.push(_player);   
    }
    
    function removePlayerFromRoster()
    
    
}