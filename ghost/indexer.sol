// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./gen_schema.sol";
import "./gen_events.sol";
import "./gen_base.sol";
import "./gen_helpers.sol";

contract MyIndex is GhostGraph {
    using StringHelpers for EventDetails;
    using StringHelpers for uint256;
    using StringHelpers for address;
    
    function registerHandles() external {
        graph.registerHandle(0x3bE1bF844ab3E55E73fF038a39307Ae78a7dEc89);
    }
    
    function onCharacterCreated(EventDetails memory details, CharacterCreatedEvent memory ev) external {
        CharacterCreated memory entity = graph.getCharacterCreated(ev.tokenId);
        entity.tokenId = ev.tokenId;
        entity.level = 1;
        entity.xp = 0;
        entity.name = ev.name;
        entity.classType = ev.classType;
        entity.race = ev.race;
        entity.unassignedPoints = ev.unassignedPoints;
        entity.strength = ev.attributes.strength;
        entity.dexterity = ev.attributes.dexterity;
        entity.constitution = ev.attributes.constitution;
        entity.intelligence = ev.attributes.intelligence;
        entity.wisdom = ev.attributes.wisdom;
        entity.charisma = ev.attributes.charisma;

        graph.saveCharacterCreated(entity);
    }
    
    function onAttributePointsAssigned(EventDetails memory details, AttributePointsAssignedEvent memory ev) external {
        CharacterCreated memory entity = graph.getCharacterCreated(ev.tokenId);
        entity.unassignedPoints = ev.unassignedPoints;
        entity.strength = ev.strength;
        entity.dexterity = ev.dexterity;
        entity.constitution = ev.constitution;
        entity.intelligence = ev.intelligence;
        entity.wisdom = ev.wisdom;
        entity.charisma = ev.charisma;

        graph.saveCharacterCreated(entity);
    }
    
    function onTransfer(EventDetails memory details, TransferEvent memory ev) external {
        CharacterCreated memory entity = graph.getCharacterCreated(ev.tokenId);
        entity.owner = ev.to;

        graph.saveCharacterCreated(entity);
    }
}