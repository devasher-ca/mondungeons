'use client'

import { useEffect, useRef, useState } from 'react'
import '../styles/mouse.css'

export default function BackgroundMouse() {
  const mouseRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isReverse, setIsReverse] = useState(false)

  useEffect(() => {
    const mouse = mouseRef.current
    const container = containerRef.current
    if (!mouse || !container) return

    const containerWidth = container.clientWidth
    const mouseWidth = 128

    let currentIsReverse = isReverse

    const setRandomPosition = () => {
      const newPosition = Math.random() > 0.5 ? -mouseWidth : containerWidth

      currentIsReverse = newPosition > 0
      const targetPosition = currentIsReverse ? -mouseWidth : containerWidth
      setIsReverse(currentIsReverse)

      mouse.style.left = `${newPosition}px`

      const newDuration = 3 + Math.random() * 7
      mouse.style.transition = `left ${newDuration}s linear`
    }
    // setRandomPosition()

    const animationCheckInterval = setInterval(() => {
      try {
        if (
          !mouse.style.transition ||
          getComputedStyle(mouse).left === mouse.style.left
        ) {
          console.log('Animation seems stuck, restarting...')
          setIsRunning(true)
          setRandomPosition()

          const targetPosition = currentIsReverse ? -mouseWidth : containerWidth
          mouse.style.left = `${targetPosition}px`
        }
      } catch (error) {
        console.error('Error in animation check:', error)
      }
    }, 3000)

    return () => {
      clearInterval(animationCheckInterval)
    }
  }, [])

  const mouseClasses = [
    'mouse',
    isRunning ? 'mouse-running' : 'mouse-idle',
    isReverse ? 'mouse-reverse' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={containerRef} className="mouse-container">
      <div ref={mouseRef} className={mouseClasses}></div>
    </div>
  )
}
