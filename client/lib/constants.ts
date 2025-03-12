export const CHARACTER_CONTRACT_ADDRESS =
  '0x3bE1bF844ab3E55E73fF038a39307Ae78a7dEc89'

export const RACES = ['Human', 'Elf', 'Dwarf']
export const CLASSES = ['Warrior', 'Mage', 'Rogue']

export const ATTRIBUTES = [
  { name: 'Strength', abbr: 'STR', desc: 'Physical power and melee damage' },
  {
    name: 'Dexterity',
    abbr: 'DEX',
    desc: 'Agility, reflexes, and ranged attacks',
  },
  { name: 'Constitution', abbr: 'CON', desc: 'Health, stamina, and vitality' },
  { name: 'Intelligence', abbr: 'INT', desc: 'Magical ability and knowledge' },
  { name: 'Wisdom', abbr: 'WIS', desc: 'Perception and insight' },
  { name: 'Charisma', abbr: 'CHA', desc: 'Social influence and leadership' },
]

export const BASE_ATTRIBUTE_VALUE = 8
export const INIT_POINTS = 27

export const EMPTY_CHARACTER = {
  id: '',
  owner: '',
  tokenId: '',
  name: '',
  classType: 0,
  race: 0,
  unassignedPoints: INIT_POINTS,
  attributes: {
    strength: BASE_ATTRIBUTE_VALUE,
    dexterity: BASE_ATTRIBUTE_VALUE,
    constitution: BASE_ATTRIBUTE_VALUE,
    intelligence: BASE_ATTRIBUTE_VALUE,
    wisdom: BASE_ATTRIBUTE_VALUE,
    charisma: BASE_ATTRIBUTE_VALUE,
  },
  level: 1,
  xp: 0,
}
