pragma solidity ^0.4.24;

contract BasketBallLeagueStorage {
    enum AssetType { Player, Augmentation, DraftPick, Coach }
     
    struct Team {
        string metaDataLink;
        address teamOrganizationAddress; //Will be the address of the DAO or individual owner
        uint256 rosterCount;
    }
    
    struct Asset {
        AssetType assetType;
        uint256 owningTeam;
        string metaDataLink;
    }

    //events
    event TeamAdded(uint256 teamId);
    event PlayerDrafted(uint256 assetId, uint256 teamId);
    event CommisionerChanged(address oldCommisioner, address newCommisioner);
    event NewAssetCreated(AssetType assetType, uint256 assetId);
    event EmergencyStopOn();
    event EmergencyStopOff();
    
    //variable declarations
    address public commisioner;
    address public leagueOrganizationAddress;
    
    uint256 private assetCount;
    mapping(uint256 => Asset) private assets;

    uint256 private constant rosterLimit = 10;
    
    uint256 private teamCount;
    mapping(uint256 => Team) private teams;

    bool public emergencyStop;
    
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
        Team memory newTeam = Team(_metaDataLink, _teamOrganizationAddress, 0);
        teams[teamCount] = newTeam;
        emit TeamAdded(teamCount);
    }
    
    function teamMetadata(uint256 _teamId) public view returns (string infoUrl) {
        return teams[_teamId].metaDataLink;
    }
    
    function ownerOfAsset(uint256 _assetId) public view assetMustExist(_assetId) returns (uint256 teamId) {
        Asset memory asset = assets[_assetId];
        return asset.owningTeam;
    }

    //When owningTeam is 0 that means it is undrafted and can be picked up by any team
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
        emit CommisionerChanged(commisioner, _newCommisioner);
        commisioner = _newCommisioner;
    }
    
    function setEmergencyStop(bool _emergency) public onlyThisAddress(leagueOrganizationAddress) {
        emergencyStop = _emergency;
        if(emergencyStop) {
            emit EmergencyStopOn();
        } else {
            emit EmergencyStopOff();
        }
    }


    //drafting and trading
    function draftAsset(uint256 _assetId, uint256 _teamId) public assetMustExist(_assetId) teamMustExistAndOnlyTeamOrg(_teamId) notOnEmergencyStop {
        //asset id must exist
        //teamId must exist
        //address must be equal to team org's address
        //asset must be team 0
        Asset storage asset = assets[_assetId];
        Team storage team = teams[_teamId];
        require(asset.owningTeam == 0 && team.rosterCount < rosterLimit);
        asset.owningTeam = _teamId;
        team.rosterCount++;
        emit PlayerDrafted(_assetId, _teamId);
    }

    //function modifiers
    modifier assetMustExist(uint256 _assetId) {
        require(_assetId > 0 && _assetId < (assetCount + 1));
        _;
    }

    modifier teamMustExistAndOnlyTeamOrg(uint256 _teamId) {
        require(_teamId > 0 && _teamId < (teamCount + 1));
        Team memory team = teams[_teamId];
        require(msg.sender == team.teamOrganizationAddress);
        _;
    }

    modifier onlyThisAddress(address _address) {
        require(msg.sender == _address);
        _;
    }

    modifier notOnEmergencyStop() {
        require(!emergencyStop);
        _;
    }

}