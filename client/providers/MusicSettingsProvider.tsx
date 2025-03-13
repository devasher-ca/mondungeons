'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface MusicSettingsContextType {
  isMusicSettingsOpen: boolean
  toggleMusicSettings: () => void
}

const MusicSettingsContext = createContext<
  MusicSettingsContextType | undefined
>(undefined)

export function MusicSettingsProvider({ children }: { children: ReactNode }) {
  const [isMusicSettingsOpen, setIsMusicSettingsOpen] = useState(false)

  const toggleMusicSettings = () => {
    setIsMusicSettingsOpen((prev) => !prev)
  }

  return (
    <MusicSettingsContext.Provider
      value={{ isMusicSettingsOpen, toggleMusicSettings }}
    >
      {children}
    </MusicSettingsContext.Provider>
  )
}

export function useMusicSettings() {
  const context = useContext(MusicSettingsContext)
  if (context === undefined) {
    throw new Error(
      'useMusicSettings must be used within a MusicSettingsProvider',
    )
  }
  return context
}
