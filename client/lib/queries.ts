import { gql } from 'graphql-request'

// Character query
// for thegraph
// export const CHARACTER_QUERY = gql`
//   query GetCharacter($owner: String!) {
//     characterCreateds(first: 1, where: { owner: $owner }, orderBy: tokenId) {
//       id
//       owner
//       tokenId
//       name
//       classType
//       race
//       unassignedPoints
//       strength
//       dexterity
//       constitution
//       intelligence
//       wisdom
//       charisma
//       level
//       xp
//     }
//   }
// `

// for ghost
export const CHARACTER_QUERY = gql`
  query MyQuery($owner: String!) {
    characterCreateds(limit: 1, orderBy: "tokenId", where: { owner: $owner }) {
      items {
        charisma
        classType
        constitution
        dexterity
        id
        level
        intelligence
        name
        owner
        race
        strength
        tokenId
        unassignedPoints
        wisdom
        xp
      }
    }
  }
`
