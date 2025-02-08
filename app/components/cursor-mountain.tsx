"use client"

import { useEffect, useRef, useState } from "react"
import { CursorIcon } from "./cursor-icon"

interface Cursor {
  x: number
  y: number
  delay: number
}

export function CursorMountain() {
  const [cursors, setCursors] = useState<Cursor[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.offsetWidth
    const height = containerRef.current.offsetHeight
    const newCursors: Cursor[] = []

    // Create a triangle/mountain shape of cursors
    const rows = 20
    const maxCursorsInRow = 30

    for (let row = 0; row < rows; row++) {
      const cursorsInThisRow = Math.min(maxCursorsInRow, row + 1)
      const rowWidth = cursorsInThisRow * 24 // 24px is cursor width
      const startX = (width - rowWidth) / 2

      for (let i = 0; i < cursorsInThisRow; i++) {
        newCursors.push({
          x: startX + i * 24,
          y: height - row * 24 - 24, // Start from bottom
          delay: Math.random() * 2, // Random delay for animation
        })
      }
    }

    setCursors(newCursors)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 md:block overflow-hidden pointer-events-none">
      {cursors.map((cursor, index) => (
        <div
          key={index}
          className="absolute animate-cursor-bounce"
          style={{
            left: `${cursor.x}px`,
            bottom: `${cursor.y}px`,
            animationDelay: `${cursor.delay}s`,
          }}
        >
          <CursorIcon className="text-black transform-gpu" />
        </div>
      ))}
    </div>
  )
}

