'use client'

import { useState, useEffect, useRef } from 'react'
import { Slider } from '@/components/ui/slider'
import { useMusicSettings } from '@/providers/MusicSettingsProvider'

export default function BackgroundMusic() {
  const [volume, setVolume] = useState(0.3)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { isMusicSettingsOpen, toggleMusicSettings } = useMusicSettings()

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/music/background-music.mp3')
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    // Set up event listeners
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true)
    })

    return () => {
      // Cleanup when component unmounts
      audio.pause()
      audio.src = ''
    }
  }, [])

  useEffect(() => {
    // Update volume when it changes
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Handle clicks outside the panel to close it
  useEffect(() => {
    if (!isMusicSettingsOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        toggleMusicSettings()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMusicSettingsOpen, toggleMusicSettings])

  // Handle user interaction with the document
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current && audioLoaded && !isPlaying) {
        // Try to play audio after user interaction
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.log('Audio play failed:', error)
          })
      }
    }

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
    }
  }, [audioLoaded, isPlaying])

  if (!isMusicSettingsOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed bottom-16 left-4 bg-stone-800 border-2 border-amber-700 p-4 rounded-md shadow-lg z-50 w-64"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-pixel text-amber-400 text-sm">Music Settings</h3>
      </div>
      <div className="mb-2 text-xs text-amber-300 font-pixel">Volume</div>
      <Slider
        value={[volume * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={(value) => setVolume(value[0] / 100)}
        className="my-2"
      />
    </div>
  )
}
