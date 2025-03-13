'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import TopNavigation from './components/TopNavigation'
import CharacterCreation from './components/CharacterCreation'
import Equipment from './components/Equipment'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { useCharacter } from '@/providers/CharacterProvider'
import { useMusicSettings } from '@/providers/MusicSettingsProvider'

export default function Home() {
  const [showCharacterCreation, setShowCharacterCreation] = useState(true)
  const [activeTab, setActiveTab] = useState('Character')
  const { isConnected } = useAccount()
  const { character } = useCharacter()
  const { toggleMusicSettings } = useMusicSettings()

  const handleSettingsClick = () => {
    toggleMusicSettings()
  }

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName)
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <TopNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Main Content */}
        <main className="container mx-auto py-8 px-4">
          {isConnected ? (
            <>
              {showCharacterCreation && activeTab === 'Character' && (
                <CharacterCreation />
              )}
              {activeTab === 'Equipment' && <Equipment />}
            </>
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
            onClick={handleSettingsClick}
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
