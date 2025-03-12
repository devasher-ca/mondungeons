import { gql } from 'graphql-request'

// Character query
export const CHARACTER_QUERY = gql`
  query GetCharacter($owner: String!) {
    characterCreateds(first: 1, where: { owner: $owner }, orderBy: tokenId) {
      id
      owner
      tokenId
      name
      classType
      race
      unassignedPoints
      strength
      dexterity
      constitution
      intelligence
      wisdom
      charisma
      level
      xp
    }
  }
`
