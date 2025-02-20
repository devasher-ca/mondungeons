// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";


contract CharacterNFT is 
    Initializable, 
    ERC721Upgradeable, 
    OwnableUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable
{
    // Character creation fee related
    uint256 public basePrice;
    uint256 public priceIncrement;
    
    // Name change fee
    uint256 public nameChangePrice;
    
    // Role permissions
    bytes32 public constant XP_MANAGER_ROLE = keccak256("XP_MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Attribute points related
    uint8 public constant INITIAL_ATTRIBUTE_POINTS = 27; // Initial allocatable points
    uint8 public constant POINTS_PER_LEVEL = 2; // Points gained per level
    
    // Record unassigned attribute points
    mapping(uint256 => uint8) public unassignedPoints;
    
    // Record if an address has created a character
    mapping(address => bool) public hasCharacter;

    // Enum definitions
    enum Class { Warrior, Mage, Rogue }
    enum Race { Human, Elf, Dwarf }

    // Attribute structure
    struct Attributes {
        uint8 strength;
        uint8 dexterity;
        uint8 constitution;
        uint8 intelligence;
        uint8 wisdom;
        uint8 charisma;
    }

    // Character structure
    struct Character {
        string name;
        Class class;
        Race race;
        uint256 xp;
        uint8 level;
        Attributes attributes;
        uint256 createdAt;
    }

    // State variables
    mapping(uint256 => Character) private characters;
    uint256 private _tokenIdCounter;
    uint256 public constant MAX_NAME_LENGTH = 32;
    
    // Events
    event CharacterCreated(uint256 indexed tokenId, string name, Class class, Race race);
    event LevelUp(uint256 indexed tokenId, uint8 newLevel);
    event ExperienceGained(uint256 indexed tokenId, uint256 amount);
    event NameChanged(uint256 indexed tokenId, string newName);
    event AttributePointsAssigned(uint256 indexed tokenId, uint8 pointsUsed);
    event PriceUpdated(uint256 newBasePrice, uint256 newIncrement);
    event XPManagerAdded(address manager);
    event XPManagerRemoved(address manager);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        uint256 _basePrice,
        uint256 _priceIncrement,
        uint256 _nameChangePrice
    ) public initializer {
        __ERC721_init("Mondungeons Character", "MDC");
        __Ownable_init();
        __AccessControl_init();
        __Pausable_init();
        
        basePrice = _basePrice;
        priceIncrement = _priceIncrement;
        nameChangePrice = _nameChangePrice;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(XP_MANAGER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    function createCharacter(
        string memory name,
        Class class,
        Race race,
        Attributes calldata initialAttributes
    ) public payable whenNotPaused returns (uint256) {
        require(!hasCharacter[msg.sender], "Already has a character");
        require(bytes(name).length > 0 && bytes(name).length <= MAX_NAME_LENGTH, "Invalid name length");
        
        // Calculate and collect creation fee
        uint256 mintPrice = basePrice + (priceIncrement * _tokenIdCounter);
        require(msg.value >= mintPrice, "Insufficient payment");
        
        // Validate initial attribute distribution
        require(_validateAttributes(initialAttributes, INITIAL_ATTRIBUTE_POINTS), "Invalid attribute distribution");
        
        uint256 tokenId = _tokenIdCounter++;
        
        characters[tokenId] = Character({
            name: name,
            class: class,
            race: race,
            xp: 0,
            level: 1,
            attributes: initialAttributes,
            createdAt: block.timestamp
        });

        hasCharacter[msg.sender] = true;
        _safeMint(msg.sender, tokenId);
        emit CharacterCreated(tokenId, name, class, race);
        
        return tokenId;
    }

    function changeName(uint256 tokenId, string memory newName) public payable whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "Not character owner");
        require(bytes(newName).length > 0 && bytes(newName).length <= MAX_NAME_LENGTH, "Invalid name length");
        require(msg.value >= nameChangePrice, "Insufficient payment");
        
        characters[tokenId].name = newName;
        emit NameChanged(tokenId, newName);
    }

    // Assign attribute points
    function assignAttributePoints(
        uint256 tokenId, 
        uint8 str,
        uint8 dex,
        uint8 con,
        uint8 int_,
        uint8 wis,
        uint8 cha
    ) public whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "Not character owner");
        require(unassignedPoints[tokenId] > 0, "No points to assign");
        
        uint8 pointsToUse = str + dex + con + int_ + wis + cha;
        require(pointsToUse <= unassignedPoints[tokenId], "Not enough points");
        
        Character storage character = characters[tokenId];
        character.attributes.strength += str;
        character.attributes.dexterity += dex;
        character.attributes.constitution += con;
        character.attributes.intelligence += int_;
        character.attributes.wisdom += wis;
        character.attributes.charisma += cha;
        
        unassignedPoints[tokenId] -= pointsToUse;
        emit AttributePointsAssigned(tokenId, pointsToUse);
    }

    // Increase experience (only addresses with the XP_MANAGER_ROLE can call)
    function gainExperience(uint256 tokenId, uint256 amount) public onlyRole(XP_MANAGER_ROLE) {
        require(_exists(tokenId), "Character does not exist");
        
        Character storage character = characters[tokenId];
        uint8 oldLevel = character.level;
        character.xp += amount;
        
        // Check if the character can level up
        uint8 newLevel = _calculateLevel(character.xp);
        if (newLevel > oldLevel) {
            // Subtract the required experience for the level up
            character.xp -= _getRequiredXP(oldLevel);
            character.level = newLevel;
            
            // Add allocatable points
            unassignedPoints[tokenId] += (newLevel - oldLevel) * POINTS_PER_LEVEL;
            
            emit LevelUp(tokenId, newLevel);
        }
        
        emit ExperienceGained(tokenId, amount);
    }

    // Add XP manager
    function addXPManager(address manager) public onlyOwner {
        grantRole(XP_MANAGER_ROLE, manager);
        emit XPManagerAdded(manager);
    }

    // Remove XP manager
    function removeXPManager(address manager) public onlyOwner {
        revokeRole(XP_MANAGER_ROLE, manager);
        emit XPManagerRemoved(manager);
    }

    // Update price parameters
    function updatePrices(
        uint256 _basePrice,
        uint256 _priceIncrement,
        uint256 _nameChangePrice
    ) public onlyOwner {
        basePrice = _basePrice;
        priceIncrement = _priceIncrement;
        nameChangePrice = _nameChangePrice;
        emit PriceUpdated(_basePrice, _priceIncrement);
    }

    // Validate attribute point distribution
    function _validateAttributes(Attributes memory attrs, uint8 maxPoints) private pure returns (bool) {
        uint8 total = attrs.strength + attrs.dexterity + attrs.constitution +
                     attrs.intelligence + attrs.wisdom + attrs.charisma;
        return total <= maxPoints;
    }

    // Calculate required experience for level up
    function _getRequiredXP(uint8 currentLevel) private pure returns (uint256) {
        // Simple level experience calculation formula, can be adjusted as needed
        return currentLevel * 1000;
    }

    // Get character information
    function getCharacter(uint256 tokenId) public view returns (Character memory) {
        require(_exists(tokenId), "Character does not exist");
        return characters[tokenId];
    }

    // Private function: generate initial attributes
    function _generateInitialAttributes(Class class, Race race) private pure returns (Attributes memory) {
        // Here implement the initial attribute distribution logic based on class and race
        // This is an example implementation, you can adjust the game balance as needed
        Attributes memory attrs;
        
        // Base attributes
        attrs.strength = 10;
        attrs.dexterity = 10;
        attrs.constitution = 10;
        attrs.intelligence = 10;
        attrs.wisdom = 10;
        attrs.charisma = 10;

        // Adjust based on class
        if (class == Class.Warrior) {
            attrs.strength += 2;
            attrs.constitution += 1;
        } else if (class == Class.Mage) {
            attrs.intelligence += 2;
            attrs.wisdom += 1;
        } else if (class == Class.Rogue) {
            attrs.dexterity += 2;
            attrs.charisma += 1;
        }

        // Adjust based on race
        if (race == Race.Human) {
            // Human all attributes +1
            attrs.strength += 1;
            attrs.dexterity += 1;
            attrs.constitution += 1;
            attrs.intelligence += 1;
            attrs.wisdom += 1;
            attrs.charisma += 1;
        } else if (race == Race.Elf) {
            attrs.dexterity += 2;
            attrs.intelligence += 1;
        } else if (race == Race.Dwarf) {
            attrs.constitution += 2;
            attrs.strength += 1;
        }

        return attrs;
    }

    // Private function: check and process level up
    function _checkAndProcessLevelUp(uint256 tokenId) private {
        Character storage character = characters[tokenId];
        uint8 newLevel = _calculateLevel(character.xp);
        
        if (newLevel > character.level) {
            character.level = newLevel;
            // Here you can add attribute improvement logic during level up
            emit LevelUp(tokenId, newLevel);
        }
    }

    // Private function: calculate level
    function _calculateLevel(uint256 xp) private pure returns (uint8) {
        // Simple level calculation formula, can be adjusted as needed
        if (xp < 300) return 1;
        if (xp < 900) return 2;
        if (xp < 2700) return 3;
        // ... continue adding more levels
        return 20; // Highest level limit
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}