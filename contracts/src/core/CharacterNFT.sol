// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CharacterNFT is 
    Initializable, 
    ERC721Upgradeable, 
    OwnableUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    // Override supportsInterface to resolve the conflict between ERC721Upgradeable and AccessControlUpgradeable
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    bytes16 private constant HEX_DIGITS = "0123456789abcdef";
    // Character creation fee related
    uint256 public basePrice;
    uint256 public priceIncrement;
    
    // Name change fee
    uint256 public nameChangePrice;
    
    // Role permissions
    bytes32 public constant XP_MANAGER_ROLE = keccak256("XP_MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Attribute points related
    uint8 public constant BASE_ATTRIBUTE_VALUE = 8;
    uint8 public constant INITIAL_ATTRIBUTE_POINTS = 27;
    uint8 public constant POINTS_PER_LEVEL = 2;
    
    // Record unassigned attribute points
    mapping(uint256 => uint8) public unassignedPoints;
    
    // Record if an address has created a character
    mapping(address => bool) public hasCharacter;

    // State variables
    mapping(uint256 => Character) private characters;
    uint256 private _tokenIdCounter;
    uint256 public constant MAX_NAME_LENGTH = 32;
    
    // Population thresholds
    uint256 public constant PHASE1_THRESHOLD = 1000;
    uint256 public constant PHASE2_THRESHOLD = 5000;
    uint256 public constant PHASE3_THRESHOLD = 10000;
        
    // Add current population tracking
    uint256 public currentPopulation;
    
    // Add price checkpoint state variables
    uint256 public C1Price; // Price at 1000 population
    uint256 public C2Price; // Price at 2000 population
    uint256 public C3Price; // Price at 3000 population
    uint256 public C4Price; // Price at 4000 population
    uint256 public C5Price; // Price at 5000 population

    // Base URI for tokenURI function
    string private _baseTokenURI;

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

    uint256[50] private __gap; // Storage gap for future upgrades

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Events
    event CharacterCreated(uint256 indexed tokenId, string name, Class class, Race race);
    event LevelUp(uint256 indexed tokenId, uint8 newLevel);
    event ExperienceGained(uint256 indexed tokenId, uint256 amount);
    event NameChanged(uint256 indexed tokenId, string newName);
    event AttributePointsAssigned(uint256 indexed tokenId, uint8 pointsUsed);
    event XPManagerAdded(address manager);
    event XPManagerRemoved(address manager);
    event PopulationChanged(uint256 oldPopulation, uint256 newPopulation);
    event UpgradeAuthorized(address indexed newImplementation, address indexed authorizer);


    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        emit UpgradeAuthorized(newImplementation, msg.sender);
    }

    function initialize(
        uint256 _basePrice,
        uint256 _priceIncrement,
        uint256 _nameChangePrice
    ) public initializer {
        __ERC721_init("Mondungeons Character", "MDC");
        __Ownable_init(msg.sender);
        __AccessControl_init();
        __Pausable_init();
        
        basePrice = _basePrice;
        // priceIncrement will be 1-5% of the base price
        priceIncrement = _priceIncrement;
        nameChangePrice = _nameChangePrice;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(XP_MANAGER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        
        _updateCheckpointPrices();
    }

    function calculateMintPrice() public view returns (uint256) {
        uint256 population = currentPopulation;
        
        // Phase 1: Linear growth (0-1000)
        if (population < PHASE1_THRESHOLD) {
            return basePrice + (priceIncrement * population);
        }
        
        // Phase 2: Stepped growth (1000-5000)
        if (population < PHASE2_THRESHOLD) {
            // Use pre-calculated checkpoint prices
            if (population < 2000) return C1Price;
            if (population < 3000) return C2Price;
            if (population < 4000) return C3Price;
            if (population < 5000) return C4Price;
            return C5Price;
        }
        
        // Phase 3: Exponential growth (5000+)
        uint256 excessPopulation = population - PHASE2_THRESHOLD;

        uint256 scaleFactor = 1e18;
        uint256 exponent = (6 * excessPopulation * scaleFactor) / 10000; 

        uint256 expResult = scaleFactor; // 1.0 * 10^18
        uint256 term = scaleFactor; 

        for (uint256 i = 1; i <= 5; i++) {
            term = (term * exponent) / (i * scaleFactor);
            expResult += term;
        }

        return (C5Price * expResult) / scaleFactor;
    }

    function createCharacter(
        string memory name,
        Class class,
        Race race,
        Attributes calldata attributeDistribution
    ) public payable whenNotPaused nonReentrant returns (uint256) {
        require(!hasCharacter[msg.sender], "Already has a character");
        require(bytes(name).length > 0 && bytes(name).length <= MAX_NAME_LENGTH, "Invalid name length");
        
        uint256 currentPrice = calculateMintPrice();
        
        require(msg.value >= currentPrice, "Insufficient payment");
        
        uint256 refund = msg.value - currentPrice;
        
        unchecked {
            currentPopulation++;
        }
        emit PopulationChanged(currentPopulation - 1, currentPopulation);
        
        require(_validateAttributeDistribution(attributeDistribution, INITIAL_ATTRIBUTE_POINTS), 
            "Invalid attribute distribution");
        
        Attributes memory finalAttributes = _calculateFinalAttributes(
            attributeDistribution, 
            class, 
            race
        );
        
        uint256 tokenId = _tokenIdCounter++;
        
        characters[tokenId] = Character({
            name: name,
            class: class,
            race: race,
            xp: 0,
            level: 1,
            attributes: finalAttributes,
            createdAt: block.timestamp
        });

        uint8 usedPoints = attributeDistribution.strength + 
                          attributeDistribution.dexterity + 
                          attributeDistribution.constitution +
                          attributeDistribution.intelligence + 
                          attributeDistribution.wisdom + 
                          attributeDistribution.charisma;
        
        if (usedPoints < INITIAL_ATTRIBUTE_POINTS) {
            unassignedPoints[tokenId] = INITIAL_ATTRIBUTE_POINTS - usedPoints;
        }

        hasCharacter[msg.sender] = true;
        _safeMint(msg.sender, tokenId);
        emit CharacterCreated(tokenId, name, class, race);
        
        if (refund > 0) {
            (bool success, ) = msg.sender.call{value: refund}("");
            require(success, "Refund failed");
        }
        
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
        _requireOwned(tokenId);
        
        Character storage character = characters[tokenId];
        character.xp += amount;

        uint256 requiredXPForNextLevel = _getRequiredXPForNextLevel(character.level);
        while (character.xp >= requiredXPForNextLevel) {
            character.xp -= requiredXPForNextLevel;
            character.level++;
            unassignedPoints[tokenId] += POINTS_PER_LEVEL;
            emit LevelUp(tokenId, character.level);
            requiredXPForNextLevel = _getRequiredXPForNextLevel(character.level);
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
        
        _updateCheckpointPrices();
    }

    // Validate attribute distribution
    function _validateAttributeDistribution(Attributes memory attrs, uint8 maxPoints) private pure returns (bool) {
        uint8 total = attrs.strength + attrs.dexterity + attrs.constitution +
                     attrs.intelligence + attrs.wisdom + attrs.charisma;
        return total <= maxPoints;
    }

    // Calculate final attributes
    function _calculateFinalAttributes(
        Attributes memory playerDistribution,
        Class class,
        Race race
    ) private pure returns (Attributes memory) {
        // Start with base attributes
        Attributes memory finalAttrs;
        finalAttrs.strength = BASE_ATTRIBUTE_VALUE;
        finalAttrs.dexterity = BASE_ATTRIBUTE_VALUE;
        finalAttrs.constitution = BASE_ATTRIBUTE_VALUE;
        finalAttrs.intelligence = BASE_ATTRIBUTE_VALUE;
        finalAttrs.wisdom = BASE_ATTRIBUTE_VALUE;
        finalAttrs.charisma = BASE_ATTRIBUTE_VALUE;
        
        // Add race bonuses
        if (race == Race.Human) {
            finalAttrs.strength += 1;
            finalAttrs.dexterity += 1;
            finalAttrs.constitution += 1;
            finalAttrs.intelligence += 1;
            finalAttrs.wisdom += 1;
            finalAttrs.charisma += 1;
        } else if (race == Race.Elf) {
            finalAttrs.dexterity += 2;
            finalAttrs.intelligence += 2;
            finalAttrs.wisdom += 1;
            finalAttrs.charisma += 1;
        } else if (race == Race.Dwarf) {
            finalAttrs.strength += 2;
            finalAttrs.constitution += 3;
            finalAttrs.wisdom += 1;
        }
        
        // Add class bonuses
        if (class == Class.Warrior) {
            finalAttrs.strength += 3;
            finalAttrs.constitution += 2;
            finalAttrs.dexterity += 1;
        } else if (class == Class.Mage) {
            finalAttrs.intelligence += 3;
            finalAttrs.wisdom += 2;
            finalAttrs.charisma += 1;
        } else if (class == Class.Rogue) {
            finalAttrs.dexterity += 3;
            finalAttrs.charisma += 2;
            finalAttrs.intelligence += 1;
        }
        
        // Add player-allocated points
        finalAttrs.strength += playerDistribution.strength;
        finalAttrs.dexterity += playerDistribution.dexterity;
        finalAttrs.constitution += playerDistribution.constitution;
        finalAttrs.intelligence += playerDistribution.intelligence;
        finalAttrs.wisdom += playerDistribution.wisdom;
        finalAttrs.charisma += playerDistribution.charisma;
        
        return finalAttrs;
    }

    // Get character information
    function getCharacter(uint256 tokenId) public view returns (Character memory) {
        _requireOwned(tokenId);

        return characters[tokenId];
    }

    // Calculate required experience for level up
    function _getRequiredXPForNextLevel(uint8 currentLevel) private pure returns (uint256) {
        uint256 baseXP = 100;
        return baseXP * currentLevel * (currentLevel + 1) / 2;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn their NFT");
        
        // Update population before burning
        unchecked {
            currentPopulation--;
        }
        emit PopulationChanged(currentPopulation + 1, currentPopulation);
        
        // Update hasCharacter mapping before burning
        hasCharacter[msg.sender] = false;
        
        // Burn the token
        _burn(tokenId);
    }

    // Optional: Add function to get current price for frontend
    function getCurrentPrice() external view returns (uint256) {
        uint256 price = calculateMintPrice();
        return price;
    }

    // Add function to update checkpoint prices
    function _updateCheckpointPrices() internal {
        // Calculate C1 (price at 1000)
        C1Price = basePrice + (priceIncrement * PHASE1_THRESHOLD);
        
        // Calculate subsequent checkpoints using 1.6 multiplier
        uint256 multiplier = 160;
        C2Price = (C1Price * multiplier) / 100;
        C3Price = (C2Price * multiplier) / 100;
        C4Price = (C3Price * multiplier) / 100;
        C5Price = (C4Price * multiplier) / 100;
    }

    // Override tokenURI function to include character data in the URI
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        
        Character memory character = characters[tokenId];
        
        // Convert enum values to integers
        uint8 classId = uint8(character.class);
        uint8 raceId = uint8(character.race);
        
        // Encode character data in the URI
        return string(abi.encodePacked(
            _baseTokenURI,
            "?tokenId=", Strings.toString(tokenId),
            "&name=", character.name,
            "&class=", Strings.toString(classId),
            "&race=", Strings.toString(raceId),
            "&level=", Strings.toString(character.level),
            "&str=", Strings.toString(character.attributes.strength),
            "&dex=", Strings.toString(character.attributes.dexterity),
            "&con=", Strings.toString(character.attributes.constitution),
            "&int=", Strings.toString(character.attributes.intelligence),
            "&wis=", Strings.toString(character.attributes.wisdom),
            "&cha=", Strings.toString(character.attributes.charisma)
        ));
    }
    
    // Set base URI (only owner)
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}