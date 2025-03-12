import * as React from 'react'
import {
  type BaseError,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { abi } from '../lib/abi'
import {
  CHARACTER_CONTRACT_ADDRESS,
  BASE_ATTRIBUTE_VALUE,
} from '../lib/constants'

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

  const { data: mintPrice, refetch: refetchMintPrice } = useReadContract({
    address: CHARACTER_CONTRACT_ADDRESS,
    abi,
    functionName: 'calculateMintPrice',
  })

  const createCharacter = async (
    characterName: string,
    classIndex: number,
    raceIndex: number,
    attributeDistribution: Attributes,
  ) => {
    const { data: price } = await refetchMintPrice()
    console.log('mintPrice', price)

    const reducedAttributeDistribution = Object.fromEntries(
      Object.entries(attributeDistribution).map(([key, value]) => [
        key,
        value - BASE_ATTRIBUTE_VALUE,
      ]),
    ) as Attributes

    writeContract({
      address: CHARACTER_CONTRACT_ADDRESS,
      abi,
      functionName: 'createCharacter',
      args: [
        characterName,
        classIndex,
        raceIndex,
        reducedAttributeDistribution,
      ],
      value: price,
    })
  }

  return { createCharacter, error, isPending, isSuccess, mintPrice }
}
