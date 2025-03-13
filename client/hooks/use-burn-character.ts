import { useWriteContract } from 'wagmi'
import { abi } from '../lib/abi'
import { CHARACTER_CONTRACT_ADDRESS } from '../lib/constants'

export const useBurnCharacter = () => {
  const {
    data: hash,
    error,
    isPending,
    writeContract,
    isSuccess,
  } = useWriteContract()

  const burnCharacter = async (tokenId: number) => {
    writeContract({
      address: CHARACTER_CONTRACT_ADDRESS,
      abi,
      functionName: 'burn',
      args: [BigInt(tokenId)],
    })
  }

  return { burnCharacter, error, isPending, isSuccess }
}
