'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import TopNavigation from './components/TopNavigation'
import CharacterCreation from './components/CharacterCreation'
import { ConnectKitButton } from 'connectkit'

export default function Home() {
  const [showCharacterCreation, setShowCharacterCreation] = useState(true)

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <TopNavigation />

        {/* Main Content */}
        <main className="container mx-auto py-8 px-4">
          {showCharacterCreation && <CharacterCreation />}
        </main>

        {/* Bottom Buttons */}
        <div className="fixed bottom-4 left-4">
          <Button
            variant="outline"
            className="font-pixel bg-stone-800 border-2 border-amber-700 text-amber-400 hover:bg-stone-700 hover:border-amber-500 shadow-md transition-all duration-200 px-4 py-2 text-xs"
          >
            <Settings className="w-4 h-4 mr-2 text-amber-400" />
            SETTINGS
          </Button>
        </div>

        <div className="fixed bottom-4 right-4 flex space-x-2">
          <ConnectKitButton />
          <Button
            variant="outline"
            className="font-pixel bg-red-900 border-2 border-red-700 text-amber-300 hover:bg-red-800 hover:border-red-600 shadow-md transition-all duration-200 px-4 py-2 text-xs"
          >
            LOG IN
          </Button>
          <Button className="font-pixel bg-red-900 border-2 border-red-700 text-amber-300 hover:bg-red-800 hover:border-red-600 shadow-md transition-all duration-200 px-4 py-2 text-xs">
            SIGN UP
          </Button>
        </div>
      </div>
    </div>
  )
}
