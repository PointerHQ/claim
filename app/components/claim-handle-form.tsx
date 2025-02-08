"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

export function ClaimHandleForm() {
  const [handle, setHandle] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showExtendedForm, setShowExtendedForm] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isValid = handle.length >= 3
  const isExtendedFormValid = fullName.length > 0 && email.includes('@')

  const getTweetText = () => {
    return encodeURIComponent(`Just reserved my personal operator handle "${handle}" on @pointerinc! Can't wait to explore the future of browsing. 🚀\n\ntrypointer.com`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showExtendedForm && isValid) {
      setShowSuccess(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      setShowExtendedForm(true)
      setShowSuccess(false)
    } else if (showExtendedForm && isExtendedFormValid) {
      setIsSubmitting(true)
      try {
        console.log(`Claiming handle: ${handle}, Name: ${fullName}, Email: ${email}`)
        setShowSuccess(true)
        await new Promise(resolve => setTimeout(resolve, 800))
        setShowCompletion(true)
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if ((showExtendedForm && isExtendedFormValid) || (!showExtendedForm && isValid)) {
        e.preventDefault()
        handleSubmit(e as React.FormEvent)
      }
    }
  }

  if (showCompletion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6">
            <svg 
              viewBox="0 0 24 24" 
              className="w-10 h-10 text-emerald-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-3 [font-family:var(--font-proto-mono-regular)]">
            Thank you, {handle}!
          </h3>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto [font-family:var(--font-proto-mono-light)]">
            Your operator handle has been reserved. Want to secure your spot? Share about Pointer on Twitter and we'll make sure you're included!
          </p>
          <a
            href={`https://twitter.com/intent/tweet?text=${getTweetText()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1a8cd8] transition-colors [font-family:var(--font-proto-mono-regular)]"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5"
              fill="currentColor"
              aria-hidden="true"
              role="img"
              aria-label="Twitter logo"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on Twitter
          </a>
        </div>
        <div className="px-6 py-4 bg-neutral-50 rounded-2xl inline-block">
          <p className="text-sm text-neutral-600 [font-family:var(--font-proto-mono-light)]">
            We'll email you at {email} with next steps
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <style jsx global>{`
        @keyframes border-pulse {
          0%, 100% { border-color: rgba(229, 229, 229, 0.8); }
          50% { border-color: rgba(23, 23, 23, 0.8); }
        }
        .animate-border-pulse {
          animation: border-pulse 4s ease-in-out infinite;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {!showExtendedForm ? (
          <motion.div
            key="initial-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <Input
              type="text"
              placeholder="Claim your name (min. 3 char)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="h-20 w-full pl-10 pr-48 text-3xl tracking-wide font-bold bg-white border-2 border-neutral-200 rounded-full transition-colors duration-200 placeholder:text-neutral-400 placeholder:font-normal placeholder:tracking-normal hover:border-neutral-300 focus:border-black focus:ring-0 animate-border-pulse focus:animate-none [font-family:var(--font-proto-mono-regular)] transform-gpu"
              minLength={3}
              autoFocus
              autoComplete="off"
              onKeyDown={handleKeyDown}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <div className="h-10 w-[1px] bg-neutral-200 mr-4" />
              <Button 
                type="submit" 
                className="mr-6 px-5 bg-transparent hover:bg-transparent text-neutral-600 hover:text-black rounded-full transition-all duration-300 text-lg group-hover:translate-x-1 disabled:opacity-50 flex items-center gap-2 [font-family:var(--font-proto-mono-regular)] transform-gpu"
                variant="ghost"
                disabled={!isValid || isSubmitting}
              >
                <span className="relative transition-colors">Claim</span>
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 15 15" 
                  fill="none" 
                  className="relative transition-transform duration-200 group-hover:translate-x-0.5 transform-gpu"
                  aria-hidden="true"
                >
                  <path 
                    d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" 
                    fill="currentColor" 
                    fillRule="evenodd" 
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="extended-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2.5 px-6 py-3 bg-white rounded-2xl border border-neutral-200 shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
                <svg 
                  width="15" 
                  height="15" 
                  viewBox="0 0 15 15" 
                  className="w-4 h-4 text-neutral-600"
                  fill="none"
                  aria-hidden="true"
                  role="presentation"
                >
                  <path
                    d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.0749 12.975 13.8623 12.975 13.5999C12.975 11.72 12.4778 10.2794 11.4959 9.31167C10.7244 8.55135 9.70025 8.12901 8.50625 7.98352C10.0187 7.54739 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-lg font-medium text-neutral-900 [font-family:var(--font-proto-mono-regular)]">
                  {handle}
                </p>
              </div>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-14 w-full pl-6 text-lg bg-white border-2 border-neutral-200 rounded-full transition-colors duration-200 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-black focus:ring-0 [font-family:var(--font-proto-mono-regular)] transform-gpu"
                autoComplete="name"
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            <div className="relative">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full pl-6 pr-32 text-lg bg-white border-2 border-neutral-200 rounded-full transition-colors duration-200 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-black focus:ring-0 [font-family:var(--font-proto-mono-regular)] transform-gpu"
                autoComplete="email"
                onKeyDown={handleKeyDown}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button 
                  type="submit" 
                  className="mr-3 px-5 transition-all duration-300 text-lg disabled:opacity-50 flex items-center gap-2 [font-family:var(--font-proto-mono-regular)] transform-gpu rounded-full bg-black hover:bg-neutral-800 text-white"
                  disabled={!isExtendedFormValid || isSubmitting}
                >
                  <span className="relative">
                    {isSubmitting ? 'Submitting...' : 'Complete'}
                  </span>
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 15 15" 
                    fill="none" 
                    className="relative transition-transform duration-200 group-hover:translate-x-0.5 transform-gpu"
                    aria-hidden="true"
                  >
                    <path 
                      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" 
                      fill="currentColor" 
                      fillRule="evenodd" 
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center transform-gpu"
          >
            <div className="relative">
              <motion.div 
                className="absolute inset-0 bg-emerald-500 rounded-full"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
              <motion.div 
                className="absolute inset-0 bg-emerald-500 rounded-full"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
              <svg 
                viewBox="0 0 24 24" 
                className="w-8 h-8 text-white relative transform-gpu"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                aria-label="Success checkmark"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-2 text-xs text-neutral-500 text-right font-medium [font-family:var(--font-proto-mono-light)]">
        Only 500 spots available
      </p>
    </form>
  )
}

