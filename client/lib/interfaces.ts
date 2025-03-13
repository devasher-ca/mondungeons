// Character attributes interface
export interface CharacterAttributes {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

// Character interface
export interface Character {
  id: string
  owner: string
  tokenId: string
  name: string
  classType: number
  race: number
  unassignedPoints: number
  attributes: CharacterAttributes
  level: number
  xp: number
}

// Raw character data from GraphQL query
export interface RawCharacter {
  id: string
  owner: string
  tokenId: string
  name: string
  classType: number
  race: number
  unassignedPoints: number
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  level: number
  xp: number
}

// Raw query result interface
// export interface RawCharacterQueryResult {
//   characterCreateds: RawCharacter[]
// }

export interface RawCharacterQueryResult {
  characterCreateds: {
    items: RawCharacter[]
  }
}

// Query result interface
export interface CharacterQueryResult {
  characterCreateds: Character[]
}
