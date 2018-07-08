pragma solidity ^0.4.24;

contract BasketballLeagueStorage {
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
    
    //events
    //team added
    //draft pick created
    //player added
    //player traded
    
    constructor() public{
        //Set contract creator as original commisioner and leagueOrganizationAddress (they can update this later)
        commisioner = msg.sender;
        leagueOrganizationAddress = msg.sender;
        assetCount = 0; //Start at 0 so ids will start counting from 1
        teamCount = 0;
    }
    
    //functions
    
    function setNewLeagueOrganizationAddress(address _newLeagueOrganizationAddress) public onlyLeagueOrganization {
        leagueOrganizationAddress = _newLeagueOrganizationAddress;
    }
    
    function createNewTeam(string _metaDataLink, address _teamOrganizationAddress) public onlyLeagueOrganization {
        teamCount++;
        Team memory newTeam = Team(_metaDataLink, _teamOrganizationAddress);
        teams[teamCount] = newTeam;
        //TODO: Emit Event
    }
    
    function teamMetadata(uint256 _teamId) public view returns (string infoUrl) {
        return teams[_teamId].metaDataLink;
    }
    
    function createNewAsset(AssetType _assetType, uint256 _owningTeam, string _metaDataLink) public onlyCommisioner {
        assetCount++;
        Asset memory newAsset = Asset({assetType:_assetType, owningTeam:_owningTeam,metaDataLink:_metaDataLink});
        assets[assetCount] = newAsset;
        //TODO: Emit Event
    }
    
    function assetMetadata(uint256 _assetId) public view returns (string infoUrl) {
        return assets[_assetId].metaDataLink;
    }
    
    function changeCommisioner(address _newCommisioner) public onlyLeagueOrganization {
        commisioner = _newCommisioner;
        //TODO: Emit Event
    }
    
    //TODO
    //function removeAsset
    //function removeTeam
    
    //function modifiers
    
    modifier onlyCommisioner() {
        require(msg.sender == commisioner);
        _;
    }
    
    modifier onlyLeagueOrganization() {
        require(msg.sender == leagueOrganizationAddress);
        _;
    }
}