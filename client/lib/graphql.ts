import { request } from 'graphql-request'

import {
  Character,
  CharacterAttributes,
  CharacterQueryResult,
  RawCharacterQueryResult,
  RawCharacter,
} from './interfaces'
import { CHARACTER_QUERY } from './queries'

// The Graph API endpoint
const API_URL = process.env.NEXT_PUBLIC_GRAPH_API_URL || ''

// Function to fetch character data
export const fetchCharacterData = async (
  ownerAddress: string,
): Promise<CharacterQueryResult> => {
  const rawData = await request<RawCharacterQueryResult>(
    API_URL,
    CHARACTER_QUERY,
    {
      owner: ownerAddress,
    },
  )

  // Transform the raw data to match our interface structure
  const transformedData = {
    characterCreateds: rawData.characterCreateds.map((char: RawCharacter) => {
      const attributes: CharacterAttributes = {
        strength: char.strength,
        dexterity: char.dexterity,
        constitution: char.constitution,
        intelligence: char.intelligence,
        wisdom: char.wisdom,
        charisma: char.charisma,
      }

      return {
        id: char.id,
        owner: char.owner,
        tokenId: char.tokenId,
        name: char.name,
        classType: char.classType,
        race: char.race,
        unassignedPoints: char.unassignedPoints,
        attributes,
        level: char.level,
        xp: char.xp,
      } as Character
    }),
  }

  return transformedData as CharacterQueryResult
}
