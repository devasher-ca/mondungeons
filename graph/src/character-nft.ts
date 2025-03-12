import { Bytes, BigInt, Address } from '@graphprotocol/graph-ts'

import {
  AttributePointsAssigned as AttributePointsAssignedEvent,
  CharacterCreated as CharacterCreatedEvent,
  Transfer as TransferEvent,
} from '../generated/CharacterNFT/CharacterNFT'
import { CharacterCreated } from '../generated/schema'

export function handleAttributePointsAssigned(
  event: AttributePointsAssignedEvent,
): void {
  let tokenId = event.params.tokenId
  let id = Bytes.fromI32(tokenId.toI32())

  let entity = CharacterCreated.load(id)

  if (!entity) {
    return
  }

  entity.unassignedPoints = event.params.unassignedPoints
  entity.strength = event.params.strength
  entity.dexterity = event.params.dexterity
  entity.constitution = event.params.constitution
  entity.intelligence = event.params.intelligence
  entity.wisdom = event.params.wisdom
  entity.charisma = event.params.charisma

  entity.save()
}

export function handleCharacterCreated(event: CharacterCreatedEvent): void {
  let tokenId = event.params.tokenId
  let id = Bytes.fromI32(tokenId.toI32())

  let entity = CharacterCreated.load(id)
  if (!entity) {
    entity = new CharacterCreated(id)
  }

  entity.owner = Address.zero()
  entity.tokenId = tokenId
  entity.name = event.params.name
  entity.classType = event.params.classType
  entity.race = event.params.race
  entity.unassignedPoints = event.params.unassignedPoints
  entity.strength = event.params.attributes.strength
  entity.dexterity = event.params.attributes.dexterity
  entity.constitution = event.params.attributes.constitution
  entity.intelligence = event.params.attributes.intelligence
  entity.wisdom = event.params.attributes.wisdom
  entity.charisma = event.params.attributes.charisma

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.level = 1
  entity.xp = BigInt.fromI32(0)

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let tokenId = event.params.tokenId
  let id = Bytes.fromI32(tokenId.toI32())

  let entity = CharacterCreated.load(id)
  if (!entity) {
    entity = new CharacterCreated(id)

    entity.tokenId = tokenId
    entity.name = ''
    entity.classType = 0
    entity.race = 0
    entity.unassignedPoints = 0
    entity.strength = 0
    entity.dexterity = 0
    entity.constitution = 0
    entity.intelligence = 0
    entity.wisdom = 0
    entity.charisma = 0
    entity.level = 1
    entity.xp = BigInt.fromI32(0)
  }

  entity.owner = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
