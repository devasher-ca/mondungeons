'use client'

import { useState, useEffect, useRef } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'

export default function BackgroundMusic() {
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Listen for toggle event
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => !prev)
    }

    window.addEventListener('toggleMusicSettings', handleToggle)

    return () => {
      window.removeEventListener('toggleMusicSettings', handleToggle)
    }
  }, [])

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

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
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

  if (!isOpen) return null

  return (
    <div className="fixed bottom-16 left-4 bg-stone-800 border-2 border-amber-700 p-4 rounded-md shadow-lg z-50 w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-pixel text-amber-400 text-sm">Music Settings</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="h-8 w-8 p-0"
            disabled={!audioLoaded}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-amber-400" />
            ) : (
              <Play className="h-4 w-4 text-amber-400" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-8 w-8 p-0"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-amber-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-amber-400" />
            )}
          </Button>
        </div>
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
      {!isPlaying && (
        <div className="mt-3 text-xs text-amber-200">
          Click the play button to start music
        </div>
      )}
    </div>
  )
}
