"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const messages = [
  { text: "Hey!", duration: 1200 },
  { text: "I'm ", appendHandle: true, duration: 1200, animation: "jiggle" },
  { text: "You're #", appendPosition: true, duration: 1200, animation: "bounce" },
  { text: "Thanks for claiming me", duration: 1200, animation: "twirl" },
  { text: "I can't wait to meet you", duration: 1200 },
  { text: "We'll work together soon", duration: 1200, animation: "bounce" },
  { text: "See you at launch", duration: 1200, animation: "wiggle" },
  { text: "Claim the welcome gift?", duration: Number.POSITIVE_INFINITY, animation: "jiggle", isTwitterHover: true }
]

export function MouseSpeechBubble({ 
  handle, 
  position,
  initialPosition 
}: { 
  handle: string
  position: number
  initialPosition: { x: number; y: number }
}) {
  const [mousePosition, setMousePosition] = useState(initialPosition)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [displayedText, setDisplayedText] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  const [isTwitterHovered, setIsTwitterHovered] = useState(false)
  const lastKnownPosition = useRef({ x: initialPosition.x, y: initialPosition.y })
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const charIndexRef = useRef(0)
  const currentTextRef = useRef("")
  const rafRef = useRef<number>()
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // 640px is the sm breakpoint in Tailwind
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Optimize mouse tracking with RAF
  useEffect(() => {
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent
      lastKnownPosition.current = { 
        x: mouseEvent.clientX + window.scrollX, 
        y: mouseEvent.clientY + window.scrollY 
      }
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setMousePosition(lastKnownPosition.current)
          rafRef.current = undefined
        })
      }
    }

    // Only track mouse movement on non-mobile devices
    if (!isMobile) {
      document.addEventListener('mousemove', handleMouseMove as EventListener, { passive: true })
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      document.removeEventListener('mousemove', handleMouseMove as EventListener)
    }
  }, [isMobile])

  // Separate Twitter button effect
  useEffect(() => {
    const twitterButton = document.querySelector('a[href*="twitter.com/intent/tweet"]')
    if (!twitterButton) return

    const handleMouseEnter = (e: Event) => {
      const mouseEvent = e as MouseEvent
      setIsTwitterHovered(true)
      const x = mouseEvent.clientX
      const y = mouseEvent.clientY
      lastKnownPosition.current = { x, y }
      setMousePosition({ 
        x: x + window.scrollX,
        y: y + window.scrollY
      })
    }
    const handleMouseLeave = () => setIsTwitterHovered(false)
    
    twitterButton.addEventListener('mouseenter', handleMouseEnter as EventListener)
    twitterButton.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      twitterButton.removeEventListener('mouseenter', handleMouseEnter as EventListener)
      twitterButton.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Typing animation effect
  useEffect(() => {
    const currentMessage = messages[currentMessageIndex]
    if (!currentMessage) return

    let text = currentMessage.text
    if (currentMessage.appendHandle) {
      text += handle
    }
    if (currentMessage.appendPosition) {
      text += position
    }

    currentTextRef.current = text
    charIndexRef.current = 0
    setIsTyping(true)
    setDisplayedText("")

    const typeNextChar = () => {
      if (charIndexRef.current <= currentTextRef.current.length) {
        setDisplayedText(currentTextRef.current.slice(0, charIndexRef.current))
        charIndexRef.current++
        typingTimeoutRef.current = setTimeout(typeNextChar, 30)
      } else {
        setIsTyping(false)
        if (!currentMessage.isTwitterHover) {
          typingTimeoutRef.current = setTimeout(() => {
            if (currentMessageIndex < messages.length - 2) {
              setCurrentMessageIndex(prev => prev + 1)
            } else if (currentMessageIndex === messages.length - 2) {
              setTimeout(() => setIsVisible(false), currentMessage.duration)
            }
          }, currentMessage.duration)
        }
      }
    }

    typeNextChar()

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [currentMessageIndex, handle, position])

  // Handle Twitter hover state
  useEffect(() => {
    if (isTwitterHovered && !isVisible) {
      setCurrentMessageIndex(messages.length - 1)
      setIsVisible(true)
    } else if (!isTwitterHovered && currentMessageIndex === messages.length - 1) {
      setIsVisible(false)
    }
  }, [isTwitterHovered, currentMessageIndex, isVisible])

  const getAnimation = () => {
    const currentMessage = messages[currentMessageIndex]
    if (!currentMessage?.animation) return {}

    // Special case for Twitter hover message - minimal animation
    if (currentMessage.isTwitterHover) {
      return {
        animate: {
          scale: [1, 1.02, 1],
          transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
        }
      }
    }

    switch (currentMessage.animation) {
      case "jiggle":
        return {
          animate: {
            rotate: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.8, repeat: 2 }
          }
        }
      case "twirl":
        return {
          animate: {
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            transition: { duration: 1.2, ease: "easeInOut" }
          }
        }
      case "bounce":
        return {
          animate: {
            x: [0, -20, 20, -20, 20, 0],
            y: [0, -5, 0, -5, 0],
            transition: { duration: 1.5, repeat: 1 }
          }
        }
      case "wiggle":
        return {
          animate: {
            scale: [1, 1.2, 1, 1.2, 1],
            rotate: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.8, repeat: 2 }
          }
        }
      default:
        return {}
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            ...(isMobile ? {
              left: '50%',
              top: '20%',
              transform: 'translateX(-50%)',
            } : {
              left: mousePosition.x + 24,
              top: mousePosition.y - 24,
              transform: 'translate3d(0,0,0)',
            }),
            pointerEvents: 'none',
            zIndex: 50,
            backfaceVisibility: 'hidden',
            perspective: 1000,
            willChange: 'transform'
          }}
          transition={{ type: "spring", stiffness: 500, damping: 20, duration: 0.2 }}
        >
          <motion.div 
            className="relative will-change-transform" 
            {...getAnimation()}
          >
            <div className={`
              bg-gradient-to-b from-white to-neutral-50 
              text-neutral-800 
              px-5 py-3 
              rounded-2xl 
              text-sm 
              [font-family:var(--font-proto-mono-regular)] 
              whitespace-nowrap 
              shadow-[2px_2px_0_0_rgba(0,0,0,1),0_4px_20px_-2px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
              border border-white/40
              backdrop-blur-[2px]
              relative
              will-change-transform
              ${isMobile ? 'text-center' : ''}
            `}>
              {displayedText}
              {isTyping && (
                <span className="inline-block w-1 h-4 ml-0.5 align-middle bg-black animate-blink" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 