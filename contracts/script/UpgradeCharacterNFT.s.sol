// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {CharacterNFT} from "../src/core/CharacterNFT.sol";
import {console} from "forge-std/console.sol";

contract UpgradeCharacterNFT is Script {
    // Address of the existing proxy contract
    address public constant PROXY_ADDRESS = 0xE31D2ef09Cd58EC4f8d5AbAB770966880e836B1C;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy the new implementation contract
        CharacterNFT newImplementation = new CharacterNFT();
        
        // 2. Get the proxy as the CharacterNFT interface
        CharacterNFT proxy = CharacterNFT(PROXY_ADDRESS);
        
        // 3. Upgrade the proxy to the new implementation
        // This calls the upgradeToAndCall function on the UUPSUpgradeable contract
        proxy.upgradeToAndCall(
            address(newImplementation),
            "" // No additional initialization data needed for upgrade
        );
        
        vm.stopBroadcast();
        
        console.log("New CharacterNFT implementation deployed at:", address(newImplementation));
        console.log("Proxy successfully upgraded to new implementation");
    }
} 