import * as React from 'react'
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { abi } from '../lib/abi'
import { CHARACTER_CONTRACT_ADDRESS } from '../lib/constants'

type Attributes = {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export const useCreateCharacter = () => {
  const {
    data: hash,
    error,
    isPending,
    writeContract,
    isSuccess,
  } = useWriteContract()

  const createCharacter = async (
    characterName: string,
    classIndex: number,
    raceIndex: number,
    attributeDistribution: Attributes,
  ) => {
    writeContract({
      address: CHARACTER_CONTRACT_ADDRESS,
      abi,
      functionName: 'createCharacter',
      args: [characterName, classIndex, raceIndex, attributeDistribution],
    })
  }

  return { createCharacter, error, isPending, isSuccess }
}
