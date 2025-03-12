import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  AttributePointsAssigned,
  CharacterCreated,
  ExperienceGained,
  Initialized,
  LevelUp,
  NameChanged,
  OwnershipTransferred,
  Paused,
  PopulationChanged,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer,
  Unpaused,
  UpgradeAuthorized,
  Upgraded,
  XPManagerAdded,
  XPManagerRemoved
} from "../generated/CharacterNFT/CharacterNFT"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createAttributePointsAssignedEvent(
  tokenId: BigInt,
  pointsUsed: i32
): AttributePointsAssigned {
  let attributePointsAssignedEvent = changetype<AttributePointsAssigned>(
    newMockEvent()
  )

  attributePointsAssignedEvent.parameters = new Array()

  attributePointsAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  attributePointsAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "pointsUsed",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(pointsUsed))
    )
  )

  return attributePointsAssignedEvent
}

export function createCharacterCreatedEvent(
  tokenId: BigInt,
  name: string,
  classType: i32,
  race: i32
): CharacterCreated {
  let characterCreatedEvent = changetype<CharacterCreated>(newMockEvent())

  characterCreatedEvent.parameters = new Array()

  characterCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  characterCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  characterCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "classType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(classType))
    )
  )
  characterCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "race",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(race))
    )
  )

  return characterCreatedEvent
}

export function createExperienceGainedEvent(
  tokenId: BigInt,
  amount: BigInt
): ExperienceGained {
  let experienceGainedEvent = changetype<ExperienceGained>(newMockEvent())

  experienceGainedEvent.parameters = new Array()

  experienceGainedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  experienceGainedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return experienceGainedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createLevelUpEvent(tokenId: BigInt, newLevel: i32): LevelUp {
  let levelUpEvent = changetype<LevelUp>(newMockEvent())

  levelUpEvent.parameters = new Array()

  levelUpEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  levelUpEvent.parameters.push(
    new ethereum.EventParam(
      "newLevel",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newLevel))
    )
  )

  return levelUpEvent
}

export function createNameChangedEvent(
  tokenId: BigInt,
  newName: string
): NameChanged {
  let nameChangedEvent = changetype<NameChanged>(newMockEvent())

  nameChangedEvent.parameters = new Array()

  nameChangedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nameChangedEvent.parameters.push(
    new ethereum.EventParam("newName", ethereum.Value.fromString(newName))
  )

  return nameChangedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createPopulationChangedEvent(
  oldPopulation: BigInt,
  newPopulation: BigInt
): PopulationChanged {
  let populationChangedEvent = changetype<PopulationChanged>(newMockEvent())

  populationChangedEvent.parameters = new Array()

  populationChangedEvent.parameters.push(
    new ethereum.EventParam(
      "oldPopulation",
      ethereum.Value.fromUnsignedBigInt(oldPopulation)
    )
  )
  populationChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newPopulation",
      ethereum.Value.fromUnsignedBigInt(newPopulation)
    )
  )

  return populationChangedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createUpgradeAuthorizedEvent(
  newImplementation: Address,
  authorizer: Address
): UpgradeAuthorized {
  let upgradeAuthorizedEvent = changetype<UpgradeAuthorized>(newMockEvent())

  upgradeAuthorizedEvent.parameters = new Array()

  upgradeAuthorizedEvent.parameters.push(
    new ethereum.EventParam(
      "newImplementation",
      ethereum.Value.fromAddress(newImplementation)
    )
  )
  upgradeAuthorizedEvent.parameters.push(
    new ethereum.EventParam(
      "authorizer",
      ethereum.Value.fromAddress(authorizer)
    )
  )

  return upgradeAuthorizedEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}

export function createXPManagerAddedEvent(manager: Address): XPManagerAdded {
  let xpManagerAddedEvent = changetype<XPManagerAdded>(newMockEvent())

  xpManagerAddedEvent.parameters = new Array()

  xpManagerAddedEvent.parameters.push(
    new ethereum.EventParam("manager", ethereum.Value.fromAddress(manager))
  )

  return xpManagerAddedEvent
}

export function createXPManagerRemovedEvent(
  manager: Address
): XPManagerRemoved {
  let xpManagerRemovedEvent = changetype<XPManagerRemoved>(newMockEvent())

  xpManagerRemovedEvent.parameters = new Array()

  xpManagerRemovedEvent.parameters.push(
    new ethereum.EventParam("manager", ethereum.Value.fromAddress(manager))
  )

  return xpManagerRemovedEvent
}
