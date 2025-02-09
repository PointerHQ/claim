"use client"

import { useEffect, useRef, useState } from "react"
import { CursorIcon } from "./cursor-icon"

interface Cursor {
  x: number
  y: number
  delay: number
  id: string
  baseX: number
  baseY: number
}

export function CursorMountain() {
  const [cursors, setCursors] = useState<Cursor[]>([])
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef(mousePos)
  const rafRef = useRef<number>()

  // Handle mouse movement with RAF for smoother updates
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateMousePos)
      }
    }

    const updateMousePos = () => {
      setMousePos(mousePosRef.current)
      rafRef.current = undefined
    }

    const handleMouseLeave = () => {
      mousePosRef.current = null
      setMousePos(null)
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('mouseenter', handleMouseMove, { passive: true })

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('mouseenter', handleMouseMove)
    }
  }, [])

  // Initialize cursors
  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.offsetWidth
    const height = containerRef.current.offsetHeight
    const newCursors: Cursor[] = []

    const rows = 5 // Reduced rows for better mobile display
    const cursorSpacing = Math.min(24, Math.max(16, width / 20)) // Tighter spacing
    const topPadding = height * 0.1 // Less top padding
    const bottomPadding = height * 0.1 // Less bottom padding

    const mountainCenterX = Math.round(width / 2) // Ensure pixel-perfect center

    // Build the mountain from top to bottom with perfect mathematical progression
    for (let row = 0; row < rows; row++) {
      const cursorsInThisRow = 2 * row + 1
      const rowWidth = cursorsInThisRow * cursorSpacing
      const startX = Math.round(mountainCenterX - (rowWidth / 2)) // Round for pixel-perfect alignment
      const baseY = Math.round(topPadding + (row * (height - topPadding - bottomPadding) / (rows - 1)))

      for (let i = 0; i < cursorsInThisRow; i++) {
        const baseX = Math.round(startX + i * cursorSpacing) // Round for pixel-perfect alignment
        newCursors.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          delay: Math.random() * 0.4, // Faster animation
          id: `cursor-${row}-${i}`
        })
      }
    }

    setCursors(newCursors)
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  // Update cursor positions based on mouse
  useEffect(() => {
    if (!mousePos) {
      setCursors(prev => prev.map(cursor => ({
        ...cursor,
        x: cursor.baseX,
        y: cursor.baseY
      })))
      return
    }

    setCursors(prev => prev.map(cursor => {
      const dx = mousePos.x - cursor.baseX
      const dy = mousePos.y - cursor.baseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 150
      const repulsionStrength = 20 // Reduced for more subtle movement

      if (distance < maxDistance && distance > 0) {
        const factor = (1 - distance / maxDistance) * repulsionStrength
        // Add slight easing to the movement
        const easing = (1 - distance / maxDistance) ** 2
        return {
          ...cursor,
          x: cursor.baseX - (dx / distance) * factor * easing,
          y: cursor.baseY - (dy / distance) * factor * easing
        }
      }

      return {
        ...cursor,
        x: cursor.baseX,
        y: cursor.baseY
      }
    }))
  }, [mousePos])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden flex items-center justify-center will-change-transform"
    >
      <div className="relative w-full h-full will-change-transform flex items-center justify-center">
        {cursors.map((cursor) => (
          <div
            key={cursor.id}
            className={`
              absolute animate-cursor-bounce transition-all duration-700 ease-out will-change-transform
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{
              left: `${cursor.x}px`,
              top: `${cursor.y}px`,
              animationDelay: `${cursor.delay}s`,
              transitionDelay: `${cursor.delay * 100}ms`,
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
              perspective: 1000,
            }}
          >
            <CursorIcon 
              className="text-black transform-gpu hover:scale-110 transition-transform duration-200 will-change-transform" 
            />
          </div>
        ))}
      </div>
    </div>
  )
}

