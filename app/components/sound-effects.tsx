"use client"

import { useEffect, useRef } from 'react'

type SoundType = 'step1' | 'step2' | 'completion' | 'click'

export function useSoundEffects() {
  const audioRefs = useRef<{ [key in SoundType]?: HTMLAudioElement }>({})
  const audioContextRef = useRef<AudioContext>()
  const isInitialized = useRef(false)

  useEffect(() => {
    // Initialize audio elements
    audioRefs.current = {
      click: new Audio('/sounds/twitter-click.mp3')
    }

    // Set volume for each sound
    for (const audio of Object.values(audioRefs.current)) {
      if (audio) {
        audio.volume = 0.4 // Default volume
      }
    }

    // Initialize AudioContext only after first user interaction
    const initializeAudioContext = () => {
      if (!isInitialized.current) {
        audioContextRef.current = new AudioContext()
        isInitialized.current = true
        // Remove the event listeners once initialized
        document.removeEventListener('click', initializeAudioContext)
        document.removeEventListener('keydown', initializeAudioContext)
      }
    }

    document.addEventListener('click', initializeAudioContext)
    document.addEventListener('keydown', initializeAudioContext)

    // Cleanup
    return () => {
      for (const audio of Object.values(audioRefs.current)) {
        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      document.removeEventListener('click', initializeAudioContext)
      document.removeEventListener('keydown', initializeAudioContext)
    }
  }, [])

  const playSound = async (type: SoundType) => {
    const ctx = audioContextRef.current
    if (!ctx) return

    if (type === 'step1' || type === 'step2') {
      // Create a more sophisticated sound design for each step
      if (type === 'step1') {
        // Step 1: Peaceful, ethereal sound
        const baseFreq = 329.63; // E4 - gentle, inviting
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        // Main oscillator
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

        // Harmonic oscillator
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);

        // Filter setup
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, ctx.currentTime);
        filter.Q.setValueAtTime(2, ctx.currentTime);

        // Envelope
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        // Connections
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Playback
        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 0.3);
      } else {
        // Step 2: Rising, anticipatory sound
        const baseFreq = 440.00; // A4 - higher tension
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        // Main oscillator with frequency rise
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc1.frequency.linearRampToValueAtTime(baseFreq * 1.1, ctx.currentTime + 0.2);

        // Supporting oscillator
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);

        // Filter with movement
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 0.2);
        filter.Q.setValueAtTime(4, ctx.currentTime);

        // Dynamic envelope
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        // Connections
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Playback
        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 0.3);
      }
      return;
    }

    if (type === 'completion') {
      // Create a calming completion sound
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const osc3 = ctx.createOscillator()
      const gainNode1 = ctx.createGain()
      const gainNode2 = ctx.createGain()
      const gainNode3 = ctx.createGain()
      const masterGain = ctx.createGain()

      // Use softer frequencies (G major chord - more peaceful)
      osc1.frequency.setValueAtTime(392.00, ctx.currentTime) // G4
      osc2.frequency.setValueAtTime(493.88, ctx.currentTime) // B4
      osc3.frequency.setValueAtTime(587.33, ctx.currentTime) // D5

      // Set oscillator types for softer sound
      osc1.type = 'sine'
      osc2.type = 'sine'
      osc3.type = 'sine'

      // Gentle fade in and long fade out for each note
      const fadeIn = 0.1
      const hold = 0.2
      const fadeOut = 0.8
      const totalDuration = fadeIn + hold + fadeOut

      gainNode1.gain.setValueAtTime(0, ctx.currentTime)
      gainNode1.gain.linearRampToValueAtTime(0.15, ctx.currentTime + fadeIn)
      gainNode1.gain.setValueAtTime(0.15, ctx.currentTime + fadeIn + hold)
      gainNode1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + totalDuration)

      gainNode2.gain.setValueAtTime(0, ctx.currentTime)
      gainNode2.gain.linearRampToValueAtTime(0.12, ctx.currentTime + fadeIn)
      gainNode2.gain.setValueAtTime(0.12, ctx.currentTime + fadeIn + hold)
      gainNode2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + totalDuration)

      gainNode3.gain.setValueAtTime(0, ctx.currentTime)
      gainNode3.gain.linearRampToValueAtTime(0.1, ctx.currentTime + fadeIn)
      gainNode3.gain.setValueAtTime(0.1, ctx.currentTime + fadeIn + hold)
      gainNode3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + totalDuration)

      // Master volume for overall control
      masterGain.gain.setValueAtTime(0.4, ctx.currentTime)

      // Connect everything
      osc1.connect(gainNode1)
      osc2.connect(gainNode2)
      osc3.connect(gainNode3)
      gainNode1.connect(masterGain)
      gainNode2.connect(masterGain)
      gainNode3.connect(masterGain)
      masterGain.connect(ctx.destination)

      // Start and stop
      osc1.start(ctx.currentTime)
      osc2.start(ctx.currentTime)
      osc3.start(ctx.currentTime)
      osc1.stop(ctx.currentTime + totalDuration)
      osc2.stop(ctx.currentTime + totalDuration)
      osc3.stop(ctx.currentTime + totalDuration)
      return
    }

    const audio = audioRefs.current[type]
    if (!audio) return

    try {
      audio.currentTime = 0
      await audio.play()
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  return { playSound }
} 