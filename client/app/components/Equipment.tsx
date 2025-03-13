'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCharacter } from '@/providers/CharacterProvider'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'

// Define equipment item interface
interface EquipmentItem {
  id: string
  name: string
  image: string
  type: 'weapon' | 'armor' | 'accessory' | 'consumable'
  stats: {
    attack?: number
    defense?: number
    magic?: number
    health?: number
  }
  description: string
  equipped: boolean
}

export default function Equipment() {
  const { character } = useCharacter()
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null)

  // Mock equipment data - this would come from a database or blockchain in a real app
  const equipmentItems: EquipmentItem[] = [
    {
      id: '1',
      name: 'Rusty Sword',
      image: '/equipments/rusty-sword.png',
      type: 'weapon',
      stats: {
        attack: 5,
      },
      description: 'A basic sword with some rust. Better than nothing!',
      equipped: false,
    },
    {
      id: '2',
      name: 'Leather Armor',
      image: '/equipments/leather-armor.png',
      type: 'armor',
      stats: {
        defense: 3,
      },
      description: 'Simple leather armor that provides basic protection.',
      equipped: false,
    },
    {
      id: '3',
      name: 'Twin Daggers',
      image: '/equipments/twin-daggers.png',
      type: 'weapon',
      stats: {
        attack: 3,
        defense: 1,
      },
      description: 'A pair of quick daggers. Good for swift attacks.',
      equipped: false,
    },
    {
      id: '4',
      name: 'Warrior Ring',
      image: '/equipments/warrior-ring.png',
      type: 'accessory',
      stats: {
        attack: 1,
        health: 5,
      },
      description: 'A ring that slightly boosts attack power and health.',
      equipped: false,
    },
  ]

  const handleItemClick = (item: EquipmentItem) => {
    setSelectedItem(item)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Inventory */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-blue-900/50 rounded-lg p-4">
          <h2 className="font-pixel text-xl text-amber-400 mb-4">Inventory</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {equipmentItems.map((item) => (
              <div
                key={item.id}
                className={`relative bg-slate-700/70 border-2 ${
                  selectedItem?.id === item.id
                    ? 'border-amber-500'
                    : 'border-slate-600'
                } rounded-lg p-3 cursor-pointer hover:border-amber-400 transition-all`}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex justify-center mb-2">
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="font-pixel text-center text-sm text-white">
                  {item.name}
                </h3>
                {item.equipped && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-xs font-pixel text-black px-2 py-1 rounded-full">
                    Equipped
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Details */}
        <div className="bg-slate-800/50 border border-blue-900/50 rounded-lg p-4">
          <h2 className="font-pixel text-xl text-amber-400 mb-4">Details</h2>

          {selectedItem ? (
            <div>
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <h3 className="font-pixel text-xl text-center text-white mb-2">
                {selectedItem.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4 italic">
                {selectedItem.description}
              </p>

              <div className="bg-slate-700/70 rounded p-3 mb-4">
                <h4 className="font-pixel text-amber-400 mb-2">Stats</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedItem.stats.attack && (
                    <div className="text-sm">
                      <span className="text-red-400">Attack:</span> +
                      {selectedItem.stats.attack}
                    </div>
                  )}
                  {selectedItem.stats.defense && (
                    <div className="text-sm">
                      <span className="text-blue-400">Defense:</span> +
                      {selectedItem.stats.defense}
                    </div>
                  )}
                  {selectedItem.stats.magic && (
                    <div className="text-sm">
                      <span className="text-purple-400">Magic:</span> +
                      {selectedItem.stats.magic}
                    </div>
                  )}
                  {selectedItem.stats.health && (
                    <div className="text-sm">
                      <span className="text-green-400">Health:</span> +
                      {selectedItem.stats.health}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Button className="font-pixel bg-amber-600 hover:bg-amber-500 text-white">
                  {selectedItem.equipped ? 'Unequip' : 'Equip'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Info className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-center">Select an item to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
