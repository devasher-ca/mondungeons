'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { fetchCharacterData } from '@/lib/graphql'
import { Character, CharacterAttributes } from '@/lib/interfaces'
import { EMPTY_CHARACTER } from '@/lib/constants'
import { calculateBonusAttributes } from '@/lib/utils'

interface CharacterContextType {
  character: Character
  setCharacter: (character: Character) => void
  isLoading: boolean
  error: Error | null
  refetchCharacter: () => Promise<void>
}

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined,
)

export function CharacterProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount()
  const [character, setCharacter] = useState<Character>(EMPTY_CHARACTER)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['character', address],
    queryFn: () => (address ? fetchCharacterData(address.toLowerCase()) : null),
    enabled: !!address,
  })

  useEffect(() => {
    if (data?.characterCreateds && data.characterCreateds.length > 0) {
      const latestCharacter = data.characterCreateds[0]

      const bonusAttributes = calculateBonusAttributes(
        latestCharacter.race,
        latestCharacter.classType,
      )

      // Create the base attributes by subtracting bonus attributes
      const attributes: CharacterAttributes = {
        strength:
          latestCharacter.attributes.strength - bonusAttributes.strength,
        dexterity:
          latestCharacter.attributes.dexterity - bonusAttributes.dexterity,
        constitution:
          latestCharacter.attributes.constitution -
          bonusAttributes.constitution,
        intelligence:
          latestCharacter.attributes.intelligence -
          bonusAttributes.intelligence,
        wisdom: latestCharacter.attributes.wisdom - bonusAttributes.wisdom,
        charisma:
          latestCharacter.attributes.charisma - bonusAttributes.charisma,
      }

      setCharacter({
        ...latestCharacter,
        attributes,
      })
    }
  }, [data])

  const refetchCharacter = async () => {
    await refetch()
  }

  return (
    <CharacterContext.Provider
      value={{
        character,
        setCharacter,
        isLoading,
        error: error as Error | null,
        refetchCharacter,
      }}
    >
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacter() {
  const context = useContext(CharacterContext)
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider')
  }
  return context
}
