pragma solidity ^0.4.24;

contract BasketBallLeagueStorage {
    enum AssetType { Player, Augmentation, DraftPick, Coach }
     
    struct Team {
        string metaDataLink;
        address teamOrganizationAddress; //Will be the address of the DAO
    }
    
    struct Asset {
        AssetType assetType;
        uint256 owningTeam;
        string metaDataLink;
        //TODO address agent;
    }
    
    //variable declarations
    address public commisioner;
    address public leagueOrganizationAddress;
    
    uint256 private assetCount;
    mapping(uint256 => Asset) private assets;
    
    uint256 private teamCount;
    mapping(uint256 => Team) private teams;

    bool public emergencyStop;
    
    //events
    event TeamAdded(uint256 teamId);

    //player added
    //player traded

    event NewAssetCreated(AssetType assetType, uint256 assetId);
    event EmergencyStopOn();
    event EmergencyStopOff();
    
    constructor() public{
        //Set contract creator as original commisioner and leagueOrganizationAddress (they can update this later)
        commisioner = msg.sender;
        leagueOrganizationAddress = msg.sender;
        assetCount = 0; //Start at 0 so ids will start counting from 1
        teamCount = 0;
        emergencyStop = false;
    }
    
    //functions
    
    function createNewTeam(string _metaDataLink, address _teamOrganizationAddress) public onlyThisAddress(leagueOrganizationAddress) notOnEmergencyStop {
        teamCount++;
        Team memory newTeam = Team(_metaDataLink, _teamOrganizationAddress);
        teams[teamCount] = newTeam;
        emit TeamAdded(teamCount);
    }
    
    function teamMetadata(uint256 _teamId) public view returns (string infoUrl) {
        return teams[_teamId].metaDataLink;
    }
    
    function createNewAsset(AssetType _assetType, uint256 _owningTeam, string _metaDataLink) public onlyThisAddress(commisioner) notOnEmergencyStop {
        assetCount++;
        Asset memory newAsset = Asset({assetType:_assetType, owningTeam:_owningTeam,metaDataLink:_metaDataLink});
        assets[assetCount] = newAsset;
        emit NewAssetCreated(_assetType, assetCount);
    }
    
    function assetMetadata(uint256 _assetId) public view returns (string infoUrl) {
        return assets[_assetId].metaDataLink;
    }
    
    function changeCommisioner(address _newCommisioner) public onlyThisAddress(leagueOrganizationAddress) notOnEmergencyStop {
        commisioner = _newCommisioner;
        //TODO: Emit Event
    }
    
    function setEmergencyStop(bool _emergency) public onlyThisAddress(leagueOrganizationAddress) {
        emergencyStop = _emergency;
        if(emergencyStop) {
            emit EmergencyStopOn();
        } else {
            emit EmergencyStopOff();
        }
    }

    //function modifiers
    
    modifier onlyThisAddress(address _address) {
        require(msg.sender == _address);
        _;
    }

    modifier notOnEmergencyStop() {
        require(!emergencyStop);
        _;
    }

}