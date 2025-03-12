import { Bytes } from '@graphprotocol/graph-ts'
import {
  AttributePointsAssigned as AttributePointsAssignedEvent,
  CharacterCreated as CharacterCreatedEvent,
  CharacterNFT,
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

  let contract = CharacterNFT.bind(event.address)

  let unassignedPoints = contract.unassignedPoints(tokenId)
  entity.unassignedPoints = unassignedPoints

  let character = contract.getCharacter(tokenId)
  entity.strength = character.attributes.strength
  entity.dexterity = character.attributes.dexterity
  entity.constitution = character.attributes.constitution
  entity.intelligence = character.attributes.intelligence
  entity.wisdom = character.attributes.wisdom
  entity.charisma = character.attributes.charisma

  entity.save()
}

export function handleCharacterCreated(event: CharacterCreatedEvent): void {
  let tokenId = event.params.tokenId
  let id = Bytes.fromI32(tokenId.toI32())

  let entity = CharacterCreated.load(id)
  if (!entity) {
    entity = new CharacterCreated(id)
  }

  entity.tokenId = tokenId
  entity.name = event.params.name
  entity.classType = event.params.classType
  entity.race = event.params.race

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  let contract = CharacterNFT.bind(event.address)

  let unassignedPoints = contract.unassignedPoints(tokenId)
  entity.unassignedPoints = unassignedPoints

  let character = contract.getCharacter(tokenId)
  entity.strength = character.attributes.strength
  entity.dexterity = character.attributes.dexterity
  entity.constitution = character.attributes.constitution
  entity.intelligence = character.attributes.intelligence
  entity.wisdom = character.attributes.wisdom
  entity.charisma = character.attributes.charisma

  entity.level = character.level
  entity.xp = character.xp

  entity.save()
}
