import { useWriteContract } from 'wagmi'
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

export const useAssignAttributes = () => {
  const {
    data: hash,
    error,
    isPending,
    writeContract,
    isSuccess,
  } = useWriteContract()

  const assignAttributes = async (
    tokenId: number,
    minimumAttribute: Attributes,
    targetAttribute: Attributes,
  ) => {
    const reducedAttributeDistribution = Object.fromEntries(
      Object.entries(targetAttribute).map(([key, value]) => [
        key,
        value - minimumAttribute[key as keyof typeof minimumAttribute],
      ]),
    ) as Attributes

    writeContract({
      address: CHARACTER_CONTRACT_ADDRESS,
      abi,
      functionName: 'assignAttributePoints',
      args: [
        BigInt(tokenId),
        reducedAttributeDistribution.strength,
        reducedAttributeDistribution.dexterity,
        reducedAttributeDistribution.constitution,
        reducedAttributeDistribution.intelligence,
        reducedAttributeDistribution.wisdom,
        reducedAttributeDistribution.charisma,
      ],
    })
  }

  return { assignAttributes, error, isPending, isSuccess }
}
