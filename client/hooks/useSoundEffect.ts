import { useCallback, useEffect, useRef } from 'react'

export const useSoundEffect = (soundUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(soundUrl)
      audioRef.current.load()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [soundUrl])

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0

      audioRef.current.play().catch((error) => {
        console.error('Error playing sound:', error)
      })
    }
  }, [])

  return play
}

export default useSoundEffect
