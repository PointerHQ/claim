"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { useSoundEffects } from "./sound-effects"
import { config } from "../config"

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Cache API responses
const apiCache = new Map();
const CACHE_TTL = 30000; // 30 seconds

async function cachedApiCall(url: string, options: RequestInit) {
  const cacheKey = url + JSON.stringify(options);
  const cached = apiCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch(url, options);
  const data = await response.json();
  
  apiCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

// Add loading spinner component
function LoadingSpinner() {
  return (
    <motion.div 
      className="absolute right-20 top-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <svg 
        className="animate-spin h-5 w-5 text-neutral-600" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="presentation"
      >
        <title>Loading...</title>
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="3"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )
}

// Utility functions for API calls
async function checkEmailExists(email: string) {
  try {
    const encodedEmail = encodeURIComponent(email);
    const url = `https://app.nocodb.com/api/v2/tables/${config.nocodb.tableId}/records/count?where=(Email,eq,${encodedEmail})&viewId=vwmicimphmyd3pfy`;
    
    const data = await cachedApiCall(url, {
      method: 'GET',
      headers: {
        'xc-token': config.nocodb.apiKey || '',
      }
    });
    return data.count > 0;
  } catch (error) {
    console.error('Error checking email:', error);
    throw new Error('Unable to verify email. Please try again.');
  }
}

async function getTotalSubmissions() {
  try {
    const url = `https://app.nocodb.com/api/v2/tables/${config.nocodb.tableId}/records/count?viewId=vwmicimphmyd3pfy`;
    
    const data = await cachedApiCall(url, {
      method: 'GET',
      headers: {
        'xc-token': config.nocodb.apiKey || '',
      }
    });
    return data.count;
  } catch (error) {
    console.error('Error getting count:', error);
    throw new Error('Unable to get total submissions. Please try again.');
  }
}

export function ClaimHandleForm({ 
  onComplete,
  onStateChange 
}: { 
  onComplete?: (handle: string, position: number) => void
  onStateChange?: (state: { showExtendedForm: boolean }) => void 
}) {
  // Optimize validation function - removed from dependency array since it's stable
  const isValidHandle = useMemo(() => {
    const validFormat = /^[a-zA-Z0-9_-]+$/;
    return (handle: string) => validFormat.test(handle);
  }, []); // Empty dependency array since this never changes

  // Optimize API calls - added getTotalSubmissions to dependencies
  const checkHandleAvailability = useCallback(async (handle: string) => {
    try {
      const encodedHandle = encodeURIComponent(handle);
      const url = `https://app.nocodb.com/api/v2/tables/${config.nocodb.tableId}/records/count?where=(Handle,eq,${encodedHandle})&viewId=vwmicimphmyd3pfy`;
      
      const data = await cachedApiCall(url, {
        method: 'GET',
        headers: {
          'xc-token': config.nocodb.apiKey || '',
        }
      });
      
      return data.count === 0;
    } catch (error) {
      console.error('Error checking handle:', error);
      throw new Error('Unable to verify handle availability. Please try again.');
    }
  }, []); // Empty dependency array since this never changes

  const [handle, setHandle] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showExtendedForm, setShowExtendedForm] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [spotsLeft, setSpotsLeft] = useState(300)
  const updateSpotsRef = useRef<NodeJS.Timeout>()
  const lastCheckRef = useRef<{ handle: string; timestamp: number }>()
  const { playSound } = useSoundEffects()

  // Debounce handle changes
  const debouncedHandle = useDebounce(handle, 300);

  // Memoize form validation - removed isValidHandle from dependencies
  const isValid = useMemo(() => 
    debouncedHandle.length >= 3 && isValidHandle(debouncedHandle),
    [debouncedHandle] // Removed isValidHandle from dependencies since it's stable
  );

  const isExtendedFormValid = useMemo(() => 
    fullName.length > 0 && email.includes('@'),
    [fullName, email]
  );

  // Optimized spots update - added getTotalSubmissions to dependencies
  const updateSpots = useCallback(async () => {
    try {
      const count = await getTotalSubmissions();
      requestAnimationFrame(() => {
        setSpotsLeft(Math.max(0, 300 - count));
      });
    } catch (error) {
      console.error('Error updating spots:', error);
    }
  }, [getTotalSubmissions]);

  // Batch state updates
  const handleFormStateChange = useCallback((showExtended: boolean) => {
    requestAnimationFrame(() => {
      setShowExtendedForm(showExtended);
      setShowSuccess(false);
      onStateChange?.({ showExtendedForm: showExtended });
    });
  }, [onStateChange]);

  // Update spots remaining - added getTotalSubmissions and updateSpots to dependencies
  useEffect(() => {
    const updateSpotsInterval = async () => {
      try {
        const count = await getTotalSubmissions();
        setSpotsLeft(Math.max(0, 300 - count));
      } catch (error) {
        console.error('Error updating spots:', error);
      }
    };

    // Initial update
    updateSpotsInterval();

    // Set up periodic refresh every 30 seconds
    updateSpotsRef.current = setInterval(updateSpotsInterval, 30000);

    // Cleanup interval on unmount
    return () => {
      if (updateSpotsRef.current) {
        clearInterval(updateSpotsRef.current);
      }
    };
  }, [getTotalSubmissions]);

  // Update spots after successful submission
  const updateSpotsAfterSubmission = (currentCount: number) => {
    setSpotsLeft(Math.max(0, 300 - (currentCount + 1)));
  };

  const getTweetText = () => {
    const text = `Just reserved my personal operator "${handle}" from @pointerinc! Can't wait for the roll out.\n\nThere's only 300 handles available for the beta 👀 trypointer.com`;
    return encodeURIComponent(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!showExtendedForm && isValid) {
      if (!isValidHandle(handle)) {
        setError('Handle can only contain letters, numbers, underscores, and hyphens');
        return;
      }
      
      try {
        setIsSubmitting(true)
        const isAvailable = await checkHandleAvailability(handle);
        if (!isAvailable) {
          setError('This handle is already taken');
          setIsSubmitting(false)
          return;
        }
        
        playSound('step1')
        setShowSuccess(true)
        await new Promise(resolve => setTimeout(resolve, 800))
        setShowExtendedForm(true)
        onStateChange?.({ showExtendedForm: true })
        setShowSuccess(false)
      } catch (error) {
        console.error('Handle check error:', error);
        setError('Error checking handle availability');
      } finally {
        setIsSubmitting(false)
      }
    } else if (showExtendedForm && isExtendedFormValid) {
      setIsSubmitting(true)
      try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          setError('Only one handle per email allowed');
          setIsSubmitting(false);
          return;
        }

        playSound('step2')
        
        // Get current count before submitting
        const currentCount = await getTotalSubmissions();
        if (currentCount >= 300) {
          setError('Sorry, all spots have been taken');
          setIsSubmitting(false);
          return;
        }

        // Submit to NocoDB
        const response = await fetch(`https://app.nocodb.com/api/v2/tables/${config.nocodb.tableId}/records?viewId=vwmicimphmyd3pfy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': config.nocodb.apiKey || '',
          },
          body: JSON.stringify({
            "Full Name": fullName,
            "Handle": handle,
            "Email": email
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Submission response:', errorText);
          throw new Error(`Failed to submit to database: ${response.status}`);
        }

        setShowSuccess(true)
        await new Promise(resolve => setTimeout(resolve, 800))
        playSound('completion')
        setShowCompletion(true)
        onComplete?.(handle, currentCount + 1)
        
        // Update spots remaining using the helper function
        updateSpotsAfterSubmission(currentCount);
      } catch (error) {
        console.error('Form submission error:', error)
        setError('Error submitting form. Please try again.')
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md mx-auto min-h-[60vh] flex flex-col justify-center relative -mt-24"
      >
        {/* Status text that fades out */}
        <motion.p 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -20 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-sm sm:text-base text-neutral-500 mb-4 sm:mb-6 text-center [font-family:var(--font-proto-mono-light)]"
        >
          Personal operator claimed
        </motion.p>

        <div className="space-y-8">
          {/* Content with Staggered Animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 text-center"
          >
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold [font-family:var(--font-proto-mono-regular)]"
            >
              Thank you, {handle}!
            </motion.h3>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <p className="text-neutral-600 [font-family:var(--font-proto-mono-light)] leading-relaxed">
                Your operator handle has been reserved.
              </p>
              <p className="text-neutral-600 [font-family:var(--font-proto-mono-light)] leading-relaxed">
                Want to secure a welcome gift? Share about Pointer on Twitter and we'll make sure you're included!
              </p>
            </motion.div>
          </motion.div>

          {/* Twitter Button with Pop Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="flex justify-center"
          >
            <a
              href={`https://twitter.com/intent/tweet?text=${getTweetText()}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click')}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1a8cd8] transition-colors [font-family:var(--font-proto-mono-regular)] hover:scale-105 transform duration-200"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5"
                fill="currentColor"
                aria-hidden="true"
                role="presentation"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on Twitter
            </a>
          </motion.div>

          {/* Email Info with Fade Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center"
          >
            <div className="px-6 py-4 bg-neutral-50 rounded-2xl text-center">
              <p className="text-sm text-neutral-600 [font-family:var(--font-proto-mono-light)]">
                We'll email you at {email} upon roll out.
              </p>
            </div>
          </motion.div>
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
              className={`h-20 w-full pl-10 pr-48 text-3xl tracking-wide font-bold bg-white border-2 rounded-full transition-all duration-300 placeholder:text-neutral-400 placeholder:font-normal placeholder:tracking-normal hover:border-neutral-300 focus:border-black focus:ring-0 animate-border-pulse focus:animate-none [font-family:var(--font-proto-mono-regular)] transform-gpu ${showSuccess ? 'border-emerald-500 animate-none' : 'border-neutral-200'}`}
              minLength={3}
              autoFocus
              autoComplete="off"
              onKeyDown={handleKeyDown}
            />
            <AnimatePresence>
              {isSubmitting && <LoadingSpinner />}
            </AnimatePresence>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <div className="h-10 w-[1px] bg-neutral-200 mr-4" />
              <Button 
                type="submit" 
                className={`mr-6 px-5 rounded-full transition-all duration-300 text-lg group-hover:translate-x-1 disabled:opacity-50 flex items-center gap-2 [font-family:var(--font-proto-mono-regular)] transform-gpu ${showSuccess ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-transparent hover:bg-transparent text-neutral-600 hover:text-black'}`}
                variant="ghost"
                disabled={!isValid || isSubmitting}
              >
                <span className="relative transition-colors">
                  {showSuccess ? (
                    <span className="flex items-center gap-2">
                      <svg 
                        viewBox="0 0 15 15" 
                        className="w-5 h-5"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path 
                          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" 
                          fill="currentColor" 
                          fillRule="evenodd" 
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    'Claim'
                  )}
                </span>
                {!showSuccess && (
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
                )}
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
              <AnimatePresence>
                {isSubmitting && (
                  <motion.div className="absolute right-32 top-1/2 -translate-y-1/2">
                    <LoadingSpinner />
                  </motion.div>
                )}
              </AnimatePresence>
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

      {error && (
        <p className="mt-2 text-sm text-red-500 [font-family:var(--font-proto-mono-light)]">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-neutral-500 text-right font-medium [font-family:var(--font-proto-mono-light)]">
        Only {spotsLeft} spots available
      </p>
    </form>
  )
}

