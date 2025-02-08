"use client"

import { useEffect, useRef } from 'react'

export function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let animationFrameId: number
    let frame = 0

    // Create an off-screen canvas for better performance
    const offscreenCanvas = new OffscreenCanvas(256, 256)
    const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false })
    if (!offscreenCtx) return

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      canvas.width = width
      canvas.height = height
      
      // Disable image smoothing for better performance
      ctx.imageSmoothingEnabled = false
    }

    const createNoisePattern = () => {
      const imageData = offscreenCtx.createImageData(256, 256)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255 * 0.08
        data[i] = value
        data[i + 1] = value
        data[i + 2] = value
        data[i + 3] = 255
      }

      offscreenCtx.putImageData(imageData, 0, 0)
      return offscreenCanvas
    }

    const render = () => {
      frame = (frame + 1) % 8 // Slow down animation
      if (frame === 0) { // Only update every 8 frames
        const pattern = createNoisePattern()
        // Scale up the noise pattern
        ctx.setTransform(2, 0, 0, 2, frame % 2 * -2, frame % 2 * -2)
        ctx.drawImage(pattern, 0, 0, canvas.width / 2, canvas.height / 2)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }
      animationFrameId = requestAnimationFrame(render)
    }

    window.addEventListener('resize', resize)
    resize()
    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.06] mix-blend-soft-light"
      aria-hidden="true"
    />
  )
} 