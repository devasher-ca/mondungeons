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
import { useState, useEffect } from 'react'
import { decodeEventLog } from 'viem'

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

  const { data: receipt, isSuccess: isReceiptSuccess } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [tokenId, setTokenId] = useState<string | null>(null)

  // Extract tokenId from transaction receipt
  useEffect(() => {
    if (receipt && isReceiptSuccess) {
      // Find the CharacterCreated event in the logs
      const characterCreatedEvent = receipt.logs
        .map((log) => {
          try {
            // Try to parse the log as a CharacterCreated event
            return {
              ...log,
              args: decodeEventLog({
                abi,
                data: log.data,
                topics: log.topics,
              }).args,
              name: decodeEventLog({
                abi,
                data: log.data,
                topics: log.topics,
              }).eventName,
            }
          } catch {
            return null
          }
        })
        .find((log) => log?.name === 'CharacterCreated')

      // Type narrowing to ensure tokenId exists
      if (
        characterCreatedEvent?.args &&
        'tokenId' in characterCreatedEvent.args
      ) {
        setTokenId(characterCreatedEvent.args.tokenId.toString())
      }
    }
  }, [receipt, isReceiptSuccess])

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

  return {
    createCharacter,
    error,
    isPending,
    isSuccess,
    mintPrice,
    tokenId,
    isReceiptSuccess,
  }
}
