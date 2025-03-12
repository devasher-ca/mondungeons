import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CharacterAttributes } from './interfaces'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateBonusAttributes = (race: number, classType: number) => {
  const attributes: CharacterAttributes = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  }

  if (race === 0) {
    Object.keys(attributes).forEach((attr) => {
      attributes[attr as keyof typeof attributes] += 1
    })
  } else if (race === 1) {
    attributes.dexterity += 2
    attributes.intelligence += 2
    attributes.wisdom += 1
    attributes.charisma += 1
  } else if (race === 2) {
    attributes.strength += 2
    attributes.constitution += 3
    attributes.wisdom += 1
  }

  if (classType === 0) {
    attributes.strength += 3
    attributes.constitution += 2
    attributes.dexterity += 1
  } else if (classType === 1) {
    attributes.intelligence += 3
    attributes.wisdom += 2
    attributes.charisma += 1
  } else if (classType === 2) {
    attributes.dexterity += 3
    attributes.charisma += 2
    attributes.intelligence += 1
  }

  return attributes
}
