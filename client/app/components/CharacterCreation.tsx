'use client'

import { useState } from 'react'
import '../styles/character-creation.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'

// Character races and classes
const RACES = ['Human', 'Elf', 'Dwarf']
const CLASSES = ['Warrior', 'Mage', 'Rogue']

// Attributes with descriptions
const ATTRIBUTES = [
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

export default function CharacterCreation() {
  // Character state
  const [character, setCharacter] = useState({
    name: '',
    race: RACES[0],
    class: CLASSES[0],
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
  })

  // Points allocation
  const [pointsRemaining, setPointsRemaining] = useState(10)
  const [initialPoints, setInitialPoints] = useState({
    ...character.attributes,
  })

  // Race and class selection indexes
  const [raceIndex, setRaceIndex] = useState(0)
  const [classIndex, setClassIndex] = useState(0)

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
                </div>
              </div>
            </div>

            <div className="trait-card class-bonus">
              <div className="trait-card-row">
                <div className="card-title">Class Bonus:</div>
                <div className="card-content">
                  {character.class === 'Warrior' && (
                    <span>+2 Strength, +1 Constitution</span>
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
