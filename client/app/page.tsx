'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import TopNavigation from './components/TopNavigation'
import CharacterCreation from './components/CharacterCreation'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { useCharacter } from '@/providers/CharacterProvider'

export default function Home() {
  const [showCharacterCreation, setShowCharacterCreation] = useState(true)
  const { isConnected } = useAccount()
  const { character } = useCharacter()

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <TopNavigation />

        {/* Main Content */}
        <main className="container mx-auto py-8 px-4">
          {isConnected ? (
            showCharacterCreation && <CharacterCreation />
          ) : (
            <div className="text-center py-10">
              <h2 className="text-amber-400 text-xl mb-4">
                Connect your wallet to continue
              </h2>
            </div>
          )}
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
        </div>
      </div>
    </div>
  )
}
