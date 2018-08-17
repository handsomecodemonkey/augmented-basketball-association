/**
* Storage Contract that saves the state of the basketball league.
* Delegates permissions to team organization addresses and league organization address.
*
* @file BasketBallLeagueStorage.sol
* @author Erick Kusnadi
*/

pragma solidity 0.4.24;

/** @title BasketBallLeagueStorage. */
contract BasketBallLeagueStorage {

    /** Enums + Structs */
    enum AssetType { Player, Augmentation, DraftPick, Coach }
     
    struct Team {
        string metaDataLink;
        address teamOrganizationAddress; //Will be the address of a team DAO or can be an individual owner
        uint256 rosterCount;
    }
    
    struct Asset {
        AssetType assetType;
        uint256 owningTeam;
        string metaDataLink;
    }

    /** Events */
    event LogTeamAdded(uint256 teamId);
    event LogPlayerDrafted(uint256 assetId, uint256 teamId);
    event LogPlayerRenounced(uint256 assetId, uint256 teamId);
    event LogCommisionerChanged(address oldCommisioner, address newCommisioner);
    event LogNewAssetCreated(AssetType assetType, uint256 assetId);
    event LogEmergencyStopOn();
    event LogEmergencyStopOff();
    
    /** Variables */
    address public commisioner; //Commisioner's job is to make new assets (players, coaches, etc.)
    address public leagueOrganizationAddress; //Will be the address of the league DAO or can be an individual owner

    uint256 private assetCount;
    mapping(uint256 => Asset) private assets;
    
    uint256 private teamCount;
    mapping(uint256 => Team) private teams;

    bool public emergencyStop;
    uint256 private constant rosterLimit = 10;
    
    /** Function Modifiers */
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

    /** Functions */

    /**
    * @dev  Constructor sets contract creator as the original commisioner and leagueOrganizationAddress
    *       Supposed to be called from the ABADao contract, but can be deployed by an individual
    *
    */
    constructor() public{
        
        commisioner = msg.sender;
        leagueOrganizationAddress = msg.sender;
        assetCount = 0; //Start at 0 so ids will start counting from 1
        teamCount = 0;
        emergencyStop = false;
    }
    
    /**
    * @dev  Function that creates a new team in the league
    *       Can only be done by the leagueOrganization from
    *       someone with at least 20 tokens.
    *
    * @param _metaDataLink The URL Link to the team's metadata
    * @param _teamOrganizationAddress The address of the team's owner can be an individual or a DAO
    *
    */
    function createNewTeam(string _metaDataLink, address _teamOrganizationAddress) public onlyThisAddress(leagueOrganizationAddress) notOnEmergencyStop {
        teamCount++;
        Team memory newTeam = Team(_metaDataLink, _teamOrganizationAddress, 0);
        teams[teamCount] = newTeam;
        emit LogTeamAdded(teamCount);
    }
    
    /**
    * @dev  Retrieves a team's metadata URL Link (could be json or an IPFS Hash)
    *
    * @param _teamId The Id of the team
    *
    * @return infoUrl metadata url string of the team. Blank if team does not exist.
    */
    function teamMetadata(uint256 _teamId) public view returns (string infoUrl) {
        return teams[_teamId].metaDataLink;
    }

    /**
    * @dev Returns the number of current teams in the league
    *
    * @return uint256 teamCount
    */
    function numberOfTeams() public view returns (uint256) {
        return teamCount;
    }
    
    /**
    * @dev  Retrieves the owner of an asset.
    *
    * @param _assetId The Id of the asset
    *
    * @return teamId Id of the team that owns the asset. 0 means it is not owned by anyone.
    */
    function ownerOfAsset(uint256 _assetId) public view assetMustExist(_assetId) returns (uint256 teamId) {
        Asset memory asset = assets[_assetId];
        return asset.owningTeam;
    }

    
    /**
    * @dev Returns the number of assets in the league
    *
    * @return uint256 assetId
    */
    function numberOfAssets() public view returns (uint256) {
        return assetCount;
    }

    /**
    * @dev  Creates a new asset in the basketball league
    *       Only the commisioner has permission to do so.
    *
    * @param _assetType The type of the newly created asset.
    * @param _owningTeam The team that will own the new asset. 0 means it will be initially unowned and a team can draft it.
    * @param _metaDataLink The metadata URL link of the asset.
    */
    function createNewAsset(AssetType _assetType, uint256 _owningTeam, string _metaDataLink) public onlyThisAddress(commisioner) notOnEmergencyStop {
        require(_owningTeam >= 0 && _owningTeam < (teamCount + 1));

        if(_owningTeam != 0) {
            Team storage team = teams[_owningTeam];
            team.rosterCount++;
        }

        assetCount++;
        Asset memory newAsset = Asset({assetType:_assetType, owningTeam:_owningTeam,metaDataLink:_metaDataLink});
        assets[assetCount] = newAsset;
        emit LogNewAssetCreated(_assetType, assetCount);
    }
    
    /**
    * @dev  Retrieves an asset's metadata URL Link 
    *
    * @param _assetId The Id of the asset
    *
    * @return infoUrl metadata url string of the asset. Blank if asset does not exist.
    */
    function assetMetadata(uint256 _assetId) public view returns (string infoUrl) {
        return assets[_assetId].metaDataLink;
    }
    
    /**
    * @dev  Changes the commisioner of the league.
    *       Can only be done by the league's organization dao or owner of the league.
    *
    * @param _newCommisioner An address of the new commisioner
    *
    */
    function changeCommisioner(address _newCommisioner) public onlyThisAddress(leagueOrganizationAddress) notOnEmergencyStop {
        emit LogCommisionerChanged(commisioner, _newCommisioner);
        commisioner = _newCommisioner;
    }
    
    /**
    * @dev  Change the Emergency Stop state.
    *       Can only be done by the league's organization.
    *       State changing functions are disallowed when emergency stop is on.
    *
    * @param _emergency boolean value of whether or not the emergency stop should be on.
    *
    */
    function setEmergencyStop(bool _emergency) public onlyThisAddress(leagueOrganizationAddress) {
        emergencyStop = _emergency;
        if(emergencyStop) {
            emit LogEmergencyStopOn();
        } else {
            emit LogEmergencyStopOff();
        }
    }

    /**
    * @dev  Function for a team to draft a player to their organziation.
    *       Cannot go past the roster limit, and asset must be unowned.
    *
    * @param _assetId Id of the asset a team would like to draft. Asset must exist.
    * @param _teamId Id of the team that is drafting the asset. Team must exist.
    *
    */
    function draftAsset(uint256 _assetId, uint256 _teamId) public assetMustExist(_assetId) teamMustExistAndOnlyTeamOrg(_teamId) notOnEmergencyStop {
        Asset storage asset = assets[_assetId];
        Team storage team = teams[_teamId];
        require(asset.owningTeam == 0 && team.rosterCount < rosterLimit);
        asset.owningTeam = _teamId;
        team.rosterCount++;
        emit LogPlayerDrafted(_assetId, _teamId);
    }

    function renounceAsset(uint256 _assetId, uint256 _teamId) public assetMustExist(_assetId) teamMustExistAndOnlyTeamOrg(_teamId) notOnEmergencyStop {
        Asset storage asset = assets[_assetId];
        Team storage team = teams[_teamId];
        require(asset.owningTeam == _teamId);
        asset.owningTeam = 0;
        team.rosterCount--;
        emit LogPlayerRenounced(_assetId, _teamId);
    }

}