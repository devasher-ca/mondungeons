// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {CharacterNFT} from "../../src/core/CharacterNFT.sol";

contract CharacterNFTTest is Test {
    CharacterNFT public nft;
    address public owner;
    address public player;
    address public xpManager;

    // Test constants
    uint256 constant BASE_PRICE = 0.1 ether;
    uint256 constant PRICE_INCREMENT = 0.01 ether;
    uint256 constant NAME_CHANGE_PRICE = 0.05 ether;
    
    function setUp() public {
        owner = address(this);
        player = address(0xBEEF);
        xpManager = address(0xCAFE);
        
        // Deploy contract
        nft = new CharacterNFT();
        nft.initialize(
            BASE_PRICE,
            PRICE_INCREMENT,
            NAME_CHANGE_PRICE
        );
        
        // Setup test accounts
        vm.deal(player, 100 ether);
    }

    function test_Initialization() public view {
        assertEq(nft.basePrice(), BASE_PRICE);
        assertEq(nft.priceIncrement(), PRICE_INCREMENT);
        assertEq(nft.nameChangePrice(), NAME_CHANGE_PRICE);
        assertTrue(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), owner));
        assertTrue(nft.hasRole(nft.XP_MANAGER_ROLE(), owner));
        assertTrue(nft.hasRole(nft.PAUSER_ROLE(), owner));
    }

    function test_CreateCharacter() public {
        CharacterNFT.Attributes memory attrs = CharacterNFT.Attributes({
            strength: 10,
            dexterity: 5,
            constitution: 4,
            intelligence: 3,
            wisdom: 3,
            charisma: 2
        });

        vm.prank(player);
        uint256 tokenId = nft.createCharacter{value: BASE_PRICE}(
            "TestWarrior",
            CharacterNFT.ClassType.Warrior,
            CharacterNFT.Race.Human,
            attrs
        );

        assertEq(tokenId, 0);
        assertEq(nft.ownerOf(tokenId), player);
        assertTrue(nft.hasCharacter(player));
        
        CharacterNFT.Character memory character = nft.getCharacter(tokenId);
        assertEq(character.name, "TestWarrior");
        assertEq(uint(character.classType), uint(CharacterNFT.ClassType.Warrior));
        assertEq(uint(character.race), uint(CharacterNFT.Race.Human));
        assertEq(character.level, 1);
    }

    function testFuzz_CreateCharacter(
        string memory name,
        uint8 classId,
        uint8 raceId
    ) public {
        // Bound the fuzz inputs
        vm.assume(bytes(name).length > 0 && bytes(name).length <= 32);
        classId = uint8(bound(classId, 0, 2)); // 3 classes
        raceId = uint8(bound(raceId, 0, 2));   // 3 races

        CharacterNFT.Attributes memory attrs = CharacterNFT.Attributes({
            strength: 10,
            dexterity: 5,
            constitution: 4,
            intelligence: 3,
            wisdom: 3,
            charisma: 2
        });

        vm.prank(player);
        uint256 tokenId = nft.createCharacter{value: BASE_PRICE}(
            name,
            CharacterNFT.ClassType(classId),
            CharacterNFT.Race(raceId),
            attrs
        );

        CharacterNFT.Character memory character = nft.getCharacter(tokenId);
        assertEq(character.name, name);
        assertEq(uint(character.classType), classId);
        assertEq(uint(character.race), raceId);
    }

    function test_GainExperience() public {
        // First create a character
        CharacterNFT.Attributes memory attrs = CharacterNFT.Attributes({
            strength: 10,
            dexterity: 5,
            constitution: 4,
            intelligence: 3,
            wisdom: 3,
            charisma: 2
        });

        vm.prank(player);
        uint256 tokenId = nft.createCharacter{value: BASE_PRICE}(
            "TestWarrior",
            CharacterNFT.ClassType.Warrior,
            CharacterNFT.Race.Human,
            attrs
        );

        // Grant XP and check level up
        nft.gainExperience(tokenId, 1000);
        
        CharacterNFT.Character memory character = nft.getCharacter(tokenId);
        assertEq(character.level, 2);
        assertEq(nft.unassignedPoints(tokenId), 2); // POINTS_PER_LEVEL
    }

    function test_RevertWhen_InsufficientPayment() public {
        CharacterNFT.Attributes memory attrs = CharacterNFT.Attributes({
            strength: 10,
            dexterity: 5,
            constitution: 4,
            intelligence: 3,
            wisdom: 3,
            charisma: 2
        });

        vm.prank(player);
        vm.expectRevert("Insufficient payment");
        nft.createCharacter{value: 0.01 ether}(
            "TestWarrior",
            CharacterNFT.ClassType.Warrior,
            CharacterNFT.Race.Human,
            attrs
        );
    }

    function test_RevertWhen_DuplicateCharacter() public {
        CharacterNFT.Attributes memory attrs = CharacterNFT.Attributes({
            strength: 10,
            dexterity: 5,
            constitution: 4,
            intelligence: 3,
            wisdom: 3,
            charisma: 2
        });

        // Create first character
        vm.prank(player);
        nft.createCharacter{value: BASE_PRICE}(
            "TestWarrior",
            CharacterNFT.ClassType.Warrior,
            CharacterNFT.Race.Human,
            attrs
        );

        // Try to create second character
        vm.prank(player);
        vm.expectRevert("Already has a character");
        nft.createCharacter{value: BASE_PRICE}(
            "TestWarrior2",
            CharacterNFT.ClassType.Mage,
            CharacterNFT.Race.Elf,
            attrs
        );
    }

    function test_CheckpointPrices() public view {
        // Test that checkpoint prices follow the 1.6x multiplier pattern
        uint256 c1Price = BASE_PRICE + (PRICE_INCREMENT * 1000); // Price at 1000 population
        
        assertEq(nft.C1Price(), c1Price);
        assertEq(nft.C2Price(), (c1Price * 160) / 100);
        assertEq(nft.C3Price(), (nft.C2Price() * 160) / 100);
        assertEq(nft.C4Price(), (nft.C3Price() * 160) / 100);
        assertEq(nft.C5Price(), (nft.C4Price() * 160) / 100);
    }
} 