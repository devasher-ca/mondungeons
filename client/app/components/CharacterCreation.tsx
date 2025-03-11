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

export default function CharacterCreation() {
  // Character state
  const [character, setCharacter] = useState({
    name: '',
    race: RACES[0],
    class: CLASSES[0],
    attributes: {
      strength: BASE_ATTRIBUTE_VALUE,
      dexterity: BASE_ATTRIBUTE_VALUE,
      constitution: BASE_ATTRIBUTE_VALUE,
      intelligence: BASE_ATTRIBUTE_VALUE,
      wisdom: BASE_ATTRIBUTE_VALUE,
      charisma: BASE_ATTRIBUTE_VALUE,
    },
  })

  // Points allocation
  const [pointsRemaining, setPointsRemaining] = useState(27)
  const [initialPoints, setInitialPoints] = useState({
    ...character.attributes,
  })

  // Race and class selection indexes
  const [raceIndex, setRaceIndex] = useState(0)
  const [classIndex, setClassIndex] = useState(0)

  const { createCharacter, error, isPending, isSuccess } = useCreateCharacter()
  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Something went wrong',
      })
    }
  }, [error, toast])

  const handleCreateCharacter = () => {
    createCharacter(character.name, classIndex, raceIndex, character.attributes)
  }

  // Update race with arrow navigation
  const changeRace = (direction: number) => {
    const newIndex = (raceIndex + direction + RACES.length) % RACES.length
    setRaceIndex(newIndex)
    setCharacter({ ...character, race: RACES[newIndex] })
  }

  // Update class with arrow navigation
  const changeClass = (direction: number) => {
    const newIndex = (classIndex + direction + CLASSES.length) % CLASSES.length
    setClassIndex(newIndex)
    setCharacter({ ...character, class: CLASSES[newIndex] })
  }

  // Update attribute with plus/minus buttons
  const updateAttribute = (attr: string, change: number) => {
    const currentValue =
      character.attributes[attr as keyof typeof character.attributes]
    const newValue = currentValue + change

    // Check if within valid range (8-18)
    if (newValue < 8 || newValue > 18) return

    // Check if we have enough points for an increase
    if (change > 0 && pointsRemaining < change) return

    setCharacter({
      ...character,
      attributes: {
        ...character.attributes,
        [attr]: newValue,
      },
    })

    setPointsRemaining((prev) => prev - change)
  }

  // Reset attributes to initial values
  const resetAttributes = () => {
    setCharacter({
      ...character,
      attributes: { ...initialPoints },
    })
    setPointsRemaining(10)
  }

  return (
    <div className="character-creation-content">
      {/* Left Column - Character Preview */}
      <div className="character-column left-column">
        <div className="character-preview-container">
          <div className="character-frame">
            <div className="character-image-container">
              <img
                src={`/characters/${character.race.toLowerCase()}-${character.class.toLowerCase()}.png`}
                alt={`${character.race} ${character.class}`}
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
            />
            <Button
              className="name-confirm-btn font-pixel ml-2"
              variant="secondary"
              onClick={handleCreateCharacter}
            >
              Confirm
            </Button>
          </div>

          <div className="character-details">
            <div className="character-race">
              <button
                className="selector-btn left-btn"
                onClick={() => changeRace(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-pixel text-amber-200">
                {character.race}
              </span>
              <button
                className="selector-btn right-btn"
                onClick={() => changeRace(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="character-class">
              <button
                className="selector-btn left-btn"
                onClick={() => changeClass(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-pixel text-amber-200">
                {character.class}
              </span>
              <button
                className="selector-btn right-btn"
                onClick={() => changeClass(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="trait-cards font-pixel">
            <div className="trait-card race-trait">
              <div className="trait-card-row">
                <div className="card-title">Race Trait:</div>
                <div className="card-content">
                  {character.race === 'Human' && (
                    <span>Versatile: +1 to all attributes</span>
                  )}
                  {character.race === 'Elf' && (
                    <span>Agile: +2 Dex, +2 Int, +1 Wis, +1 Cha</span>
                  )}
                  {character.race === 'Dwarf' && (
                    <span>Sturdy: +2 Str, +3 Con, +1 Wis</span>
                  )}
                </div>
              </div>
            </div>

            <div className="trait-card class-bonus">
              <div className="trait-card-row">
                <div className="card-title">Class Bonus:</div>
                <div className="card-content">
                  {character.class === 'Warrior' && (
                    <span>+3 Str, +2 Con, +1 Dex</span>
                  )}
                  {character.class === 'Mage' && (
                    <span>+3 Int, +2 Wis, +1 Cha</span>
                  )}
                  {character.class === 'Rogue' && (
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
                Points: {pointsRemaining}
              </span>
              <Button
                variant="outline"
                className="reset-btn font-pixel"
                onClick={resetAttributes}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="attributes-grid">
            {ATTRIBUTES.map((attr) => {
              const attrKey = attr.name.toLowerCase()
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
                          character.attributes[
                            attrKey as keyof typeof character.attributes
                          ] <= 8
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="attribute-value font-pixel">
                        {
                          character.attributes[
                            attrKey as keyof typeof character.attributes
                          ]
                        }
                      </span>
                      <button
                        className="attribute-btn plus-btn"
                        onClick={() => updateAttribute(attrKey, 1)}
                        disabled={
                          character.attributes[
                            attrKey as keyof typeof character.attributes
                          ] >= 18 || pointsRemaining <= 0
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
