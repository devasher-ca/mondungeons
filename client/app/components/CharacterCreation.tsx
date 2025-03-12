'use client'

import { useEffect, useState } from 'react'
import '../styles/character-creation.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import { useCreateCharacter } from '@/hooks/use-create-character'
import {
  RACES,
  CLASSES,
  ATTRIBUTES,
  BASE_ATTRIBUTE_VALUE,
} from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { useAssignAttributes } from '@/hooks/use-assign-attributes'
import { useCharacter } from '@/providers/CharacterProvider'
import { INIT_POINTS } from '@/lib/constants'
import { calculateBonusAttributes } from '@/lib/utils'
import { CharacterAttributes } from '@/lib/interfaces'

export default function CharacterCreation() {
  const { character, setCharacter } = useCharacter()

  const {
    createCharacter,
    error: createError,
    isPending: createPending,
    isSuccess: createSuccess,
  } = useCreateCharacter()

  const {
    assignAttributes,
    error: assignError,
    isPending: assignPending,
    isSuccess: assignSuccess,
  } = useAssignAttributes()

  const { toast } = useToast()

  const [bonusAttributes, setBonusAttributes] =
    useState<CharacterAttributes | null>(null)

  const [minimumAttribute, setMinimumAttribute] =
    useState<CharacterAttributes | null>(null)

  // Add this state near your other state declarations
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(false)

  // Apply race and class bonuses to attributes
  useEffect(() => {
    const attributes = calculateBonusAttributes(
      character.race,
      character.classType,
    )

    setBonusAttributes(attributes)

    if (!minimumAttribute) {
      setMinimumAttribute({
        ...character.attributes,
      })
    }
  }, [character.race, character.classType, character.attributes])

  useEffect(() => {
    if (createError) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: createError.message || 'Something went wrong',
      })
    }

    if (createSuccess) {
      setMinimumAttribute({
        ...character.attributes,
      })

      toast({
        title: 'Success',
        description: 'Character created successfully!',
      })
    }
  }, [createError, createSuccess])

  const handleCreateCharacter = () => {
    setIsConfirmButtonDisabled(true)

    createCharacter(
      character.name,
      character.classType,
      character.race,
      character.attributes,
    ).finally(() => {
      setIsConfirmButtonDisabled(false)
    })
  }

  const handleAssignAttributes = () => {
    if (!minimumAttribute) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Minimum attribute not found',
      })
      return
    }

    assignAttributes(
      parseInt(character.tokenId),
      minimumAttribute,
      character.attributes,
    )
  }

  useEffect(() => {
    if (assignError) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: assignError.message || 'Something went wrong',
      })
    }

    if (assignSuccess) {
      setMinimumAttribute({
        ...character.attributes,
      })

      toast({
        title: 'Success',
        description: 'Attributes assigned successfully!',
      })
    }
  }, [assignError, assignSuccess, toast])

  // Update race with arrow navigation
  const changeRace = (direction: number) => {
    const newIndex = (character.race + direction + RACES.length) % RACES.length
    setCharacter({ ...character, race: newIndex })
  }

  // Update class with arrow navigation
  const changeClass = (direction: number) => {
    const newIndex =
      (character.classType + direction + CLASSES.length) % CLASSES.length
    setCharacter({ ...character, classType: newIndex })
  }

  // Update attribute with plus/minus buttons
  const updateAttribute = (attr: string, change: number) => {
    // Prevent updates when assignPending
    if (assignPending) return

    const currentBaseValue =
      character.attributes[attr as keyof typeof character.attributes]
    const newBaseValue = currentBaseValue + change

    // Check if within valid range (8-)
    if (newBaseValue < 8) return

    // Check if we have enough points for an increase
    if (change > 0 && character.unassignedPoints < change) return

    setCharacter({
      ...character,
      attributes: {
        ...character.attributes,
        [attr]: newBaseValue,
      },
      unassignedPoints: character.unassignedPoints - change,
    })
  }

  // Reset attributes to initial values
  const resetAttributes = () => {
    setCharacter({
      ...character,
      attributes: {
        strength: BASE_ATTRIBUTE_VALUE,
        dexterity: BASE_ATTRIBUTE_VALUE,
        constitution: BASE_ATTRIBUTE_VALUE,
        intelligence: BASE_ATTRIBUTE_VALUE,
        wisdom: BASE_ATTRIBUTE_VALUE,
        charisma: BASE_ATTRIBUTE_VALUE,
      },
    })
    character.unassignedPoints = INIT_POINTS
  }

  return (
    <div className="character-creation-content">
      {/* Left Column - Character Preview */}
      <div className="character-column left-column">
        <div className="character-preview-container">
          <div className="character-frame">
            <div className="character-image-container">
              <img
                src={`/characters/${RACES[
                  character.race
                ].toLowerCase()}-${CLASSES[
                  character.classType
                ].toLowerCase()}.png`}
                alt={`${RACES[character.race]} ${CLASSES[character.classType]}`}
                className="character-image"
              />
            </div>
          </div>

          <div className="character-name-edit">
            <Input
              className="character-name-input font-pixel"
              value={character.name}
              onChange={(e) =>
                setCharacter({ ...character, name: e.target.value })
              }
              placeholder="Enter hero name..."
              maxLength={20}
              disabled={createPending || createSuccess}
            />
            {!createSuccess && character.id === '' && (
              <Button
                className="name-confirm-btn font-pixel ml-2"
                variant="secondary"
                onClick={handleCreateCharacter}
                disabled={
                  createPending ||
                  isConfirmButtonDisabled ||
                  character.name.trim() === ''
                }
              >
                {createPending || isConfirmButtonDisabled
                  ? 'Creating...'
                  : 'Confirm'}
              </Button>
            )}
          </div>

          <div className="character-details">
            {!createSuccess && character.id === '' && (
              <div className="character-race">
                <button
                  className="selector-btn left-btn"
                  onClick={() => changeRace(-1)}
                  disabled={createPending || isConfirmButtonDisabled}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-pixel text-amber-200">
                  {RACES[character.race]}
                </span>
                <button
                  className="selector-btn right-btn"
                  onClick={() => changeRace(1)}
                  disabled={createPending || isConfirmButtonDisabled}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {(createSuccess || character.id !== '') && (
              <div className="character-race-static">
                <span className="font-pixel text-amber-200">
                  {RACES[character.race]}
                </span>
              </div>
            )}

            {!createSuccess && character.id === '' && (
              <div className="character-class">
                <button
                  className="selector-btn left-btn"
                  onClick={() => changeClass(-1)}
                  disabled={createPending || isConfirmButtonDisabled}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-pixel text-amber-200">
                  {CLASSES[character.classType]}
                </span>
                <button
                  className="selector-btn right-btn"
                  onClick={() => changeClass(1)}
                  disabled={createPending || isConfirmButtonDisabled}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {(createSuccess || character.id !== '') && (
              <div className="character-class-static">
                <span className="font-pixel text-amber-200">
                  {CLASSES[character.classType]}
                </span>
              </div>
            )}
          </div>

          <div className="trait-cards font-pixel">
            <div className="trait-card race-trait">
              <div className="trait-card-row">
                <div className="card-title">Race Trait:</div>
                <div className="card-content">
                  {character.race === 0 && (
                    <span>Versatile: +1 to all attributes</span>
                  )}
                  {character.race === 1 && (
                    <span>Agile: +2 Dex, +2 Int, +1 Wis, +1 Cha</span>
                  )}
                  {character.race === 2 && (
                    <span>Sturdy: +2 Str, +3 Con, +1 Wis</span>
                  )}
                </div>
              </div>
            </div>

            <div className="trait-card class-bonus">
              <div className="trait-card-row">
                <div className="card-title">Class Bonus:</div>
                <div className="card-content">
                  {character.classType === 0 && (
                    <span>+3 Str, +2 Con, +1 Dex</span>
                  )}
                  {character.classType === 1 && (
                    <span>+3 Int, +2 Wis, +1 Cha</span>
                  )}
                  {character.classType === 2 && (
                    <span>+3 Dex, +2 Cha, +1 Int</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Character Attributes */}
      <div className="character-column right-column">
        {/* Attributes */}
        <div className="character-section">
          <div className="attributes-header">
            <h2 className="font-pixel text-amber-300">ATTRIBUTES</h2>
            <div className="points-remaining">
              <span className="font-pixel text-amber-400">
                Points: {character.unassignedPoints}
              </span>
              {!createSuccess && character.id === '' && (
                <Button
                  variant="outline"
                  className="reset-btn font-pixel"
                  onClick={resetAttributes}
                  disabled={createPending || isConfirmButtonDisabled}
                >
                  Reset
                </Button>
              )}

              {(createSuccess || character.id !== '') && (
                <Button
                  variant="outline"
                  className="reset-btn font-pixel"
                  onClick={handleAssignAttributes}
                  disabled={assignPending}
                >
                  Set
                </Button>
              )}
            </div>
          </div>

          <div className="attributes-grid">
            {ATTRIBUTES.map((attr) => {
              const attrKey = attr.name.toLowerCase()
              const baseValue =
                character.attributes[
                  attrKey as keyof typeof character.attributes
                ]
              const bonus =
                bonusAttributes?.[attrKey as keyof typeof bonusAttributes]

              return (
                <div key={attr.name} className="attribute-item">
                  <div className="attribute-header">
                    <div className="attribute-info" data-desc={attr.desc}>
                      <span className="attribute-name font-pixel">
                        {attr.abbr}
                      </span>
                    </div>
                    <div className="attribute-controls">
                      <button
                        className="attribute-btn minus-btn"
                        onClick={() => updateAttribute(attrKey, -1)}
                        disabled={
                          createPending ||
                          isConfirmButtonDisabled ||
                          assignPending ||
                          (minimumAttribute !== null &&
                            baseValue <=
                              minimumAttribute[
                                attrKey as keyof typeof minimumAttribute
                              ])
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="attribute-value font-pixel">
                        {baseValue}
                        {bonus !== undefined && bonus > 0 && (
                          <span className="attribute-bonus">+{bonus}</span>
                        )}
                      </span>
                      <button
                        className="attribute-btn plus-btn"
                        onClick={() => updateAttribute(attrKey, 1)}
                        disabled={
                          createPending ||
                          isConfirmButtonDisabled ||
                          assignPending ||
                          character.unassignedPoints <= 0
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
