// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

interface IPausable {
    function pause() external;
    function unpause() external;
}

/**
 * @title GameRegistry
 * @dev Central registry for managing game contract addresses and their interactions
 */
contract GameRegistry is Initializable, OwnableUpgradeable, PausableUpgradeable {
    // Contract addresses
    address public characterNFT;
    address public combatSystem;
    address public questSystem;
    address public inventorySystem;
    address public equipmentNFT;
    address public gameToken;

    // Mapping for additional contracts
    mapping(bytes32 => address) public contracts;
    
    // Events
    event ContractAddressUpdated(bytes32 indexed contractName, address indexed oldAddress, address indexed newAddress);
    event ContractPaused(bytes32 indexed contractName);
    event ContractUnpaused(bytes32 indexed contractName);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
    }

    // Core contract setters
    function setCharacterNFT(address _address) external onlyOwner {
        emit ContractAddressUpdated("CHARACTER_NFT", characterNFT, _address);
        characterNFT = _address;
    }

    function setCombatSystem(address _address) external onlyOwner {
        emit ContractAddressUpdated("COMBAT_SYSTEM", combatSystem, _address);
        combatSystem = _address;
    }

    // Generic contract management
    function setContract(bytes32 _name, address _address) external onlyOwner {
        emit ContractAddressUpdated(_name, contracts[_name], _address);
        contracts[_name] = _address;
    }

    // Validation functions
    function isValidContract(bytes32 _name) public view returns (bool) {
        if (_name == "CHARACTER_NFT") return characterNFT != address(0);
        if (_name == "COMBAT_SYSTEM") return combatSystem != address(0);
        // ... other core contracts
        return contracts[_name] != address(0);
    }

    // Emergency controls
    function pauseContract(bytes32 _contractName) external onlyOwner {
        require(isValidContract(_contractName), "Invalid contract");
        address contractAddress = getContractAddress(_contractName);
        IPausable(contractAddress).pause();
        emit ContractPaused(_contractName);
    }

    function unpauseContract(bytes32 _contractName) external onlyOwner {
        require(isValidContract(_contractName), "Invalid contract");
        address contractAddress = getContractAddress(_contractName);
        IPausable(contractAddress).unpause();
        emit ContractUnpaused(_contractName);
    }

    // Utility functions
    function getContractAddress(bytes32 _name) public view returns (address) {
        if (_name == "CHARACTER_NFT") return characterNFT;
        if (_name == "COMBAT_SYSTEM") return combatSystem;
        // ... other core contracts
        return contracts[_name];
    }
} 