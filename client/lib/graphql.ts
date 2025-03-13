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
// const API_URL = process.env.NEXT_PUBLIC_GRAPH_API_URL || ''

// Function to fetch character data
// export const fetchCharacterData = async (
//   ownerAddress: string,
// ): Promise<CharacterQueryResult> => {
//   const rawData = await request<RawCharacterQueryResult>(
//     API_URL,
//     CHARACTER_QUERY,
//     {
//       owner: ownerAddress,
//     },
//   )

//   // Transform the raw data to match our interface structure
//   const transformedData = {
//     characterCreateds: rawData.characterCreateds.map((char: RawCharacter) => {
//       const attributes: CharacterAttributes = {
//         strength: char.strength,
//         dexterity: char.dexterity,
//         constitution: char.constitution,
//         intelligence: char.intelligence,
//         wisdom: char.wisdom,
//         charisma: char.charisma,
//       }

//       return {
//         id: char.id,
//         owner: char.owner,
//         tokenId: char.tokenId,
//         name: char.name,
//         classType: char.classType,
//         race: char.race,
//         unassignedPoints: char.unassignedPoints,
//         attributes,
//         level: char.level,
//         xp: char.xp,
//       } as Character
//     }),
//   }

//   return transformedData as CharacterQueryResult
// }

// Ghost API endpoint

const GHOST_API_URL =
  'https://api.ghostlogs.xyz/gg/pub/9257783a-33ed-4291-aa35-5d98c56f803e/ghostgraph'

const GHOST_API_KEY = process.env.NEXT_PUBLIC_GHOST_API_KEY || ''

// Function to fetch character data
export const fetchCharacterData = async (
  ownerAddress: string,
): Promise<CharacterQueryResult> => {
  const headers = {
    'X-GHOST-KEY': GHOST_API_KEY,
    'content-type': 'application/json',
  }

  const rawData = await request<RawCharacterQueryResult>(
    GHOST_API_URL,
    CHARACTER_QUERY,
    {
      owner: ownerAddress,
    },
    headers,
  )

  const transformedData = {
    characterCreateds: rawData.characterCreateds.items.map(
      (char: RawCharacter) => {
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
      },
    ),
  }

  return transformedData as CharacterQueryResult
}
