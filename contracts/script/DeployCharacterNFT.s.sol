// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {CharacterNFT} from "../src/core/CharacterNFT.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {console} from "forge-std/console.sol";

contract DeployCharacterNFT is Script {
    // Configuration values
    uint256 public constant BASE_PRICE = 0.1 ether;
    uint256 public constant PRICE_INCREMENT = 0.04 ether;
    uint256 public constant NAME_CHANGE_PRICE = 500 ether;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy the implementation contract
        CharacterNFT implementation = new CharacterNFT();
        
        // 2. Encode the initialization data
        bytes memory initData = abi.encodeWithSelector(
            CharacterNFT.initialize.selector,
            BASE_PRICE,
            PRICE_INCREMENT,
            NAME_CHANGE_PRICE
        );
        
        // 3. Deploy the proxy pointing to the implementation
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            initData
        );
        
        CharacterNFT characterNFT = CharacterNFT(address(proxy));
        
        characterNFT.setBaseURI("https://api.mondungeons.xyz/characters");
        
        vm.stopBroadcast();
        
        console.log("CharacterNFT implementation deployed at:", address(implementation));
        console.log("CharacterNFT proxy deployed at:", address(proxy));
    }
}