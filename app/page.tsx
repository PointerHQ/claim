"use client"

import Image from "next/image";
import { CursorMountain } from "./components/cursor-mountain";
import { ClaimHandleForm } from "./components/claim-handle-form";
import { MouseSpeechBubble } from "./components/mouse-speech-bubble";
import { FloatingSuccess } from "./components/floating-success";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [showCompletion, setShowCompletion] = useState(false);
  const [handle, setHandle] = useState("");
  const [showInitialText, setShowInitialText] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [position, setPosition] = useState(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setMousePosition(mousePosRef.current);
          rafRef.current = undefined;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleFormStateChange = useCallback((state: { showExtendedForm: boolean }) => {
    setShowInitialText(!state.showExtendedForm);
    if (state.showExtendedForm) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    }
  }, []);

  const handleFormComplete = useCallback((submittedHandle: string, submissionPosition: number) => {
    setShowSuccess(true);
    setHandle(submittedHandle);
    setPosition(submissionPosition);
    setTimeout(() => {
      setShowSuccess(false);
      setShowCompletion(true);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden will-change-transform">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fcfcfc] via-[#fafafa] to-[#f7f7f7] opacity-90" />
      
      {/* Accent gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.03),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_70%)] blur-2xl" />
      </div>
      
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.15]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          transform: 'translate3d(0, 0, 0)'
        }} 
      />

      {/* Radial gradients */}
      <div className="absolute inset-0">
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)] animate-slow-spin" />
      </div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-[20%] w-[60%] h-[100%] bg-[radial-gradient(circle_at_50%_0%,rgba(250,249,246,0.4),transparent_60%)]" />
      </div>

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,245,230,0.1),transparent_50%)] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(250,249,246,0.08),transparent_50%)] mix-blend-overlay" />
      
      {showCompletion && <MouseSpeechBubble handle={handle} position={position} initialPosition={mousePosition} />}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10 min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="max-w-4xl mx-auto text-center relative will-change-transform pt-16 sm:pt-[15vh] lg:pt-[18vh]">
          <Link 
            href="/" 
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <span className="sr-only">Go to Pointer home page</span>
            <h1 className="text-[2.75rem] leading-[1.1] sm:text-6xl lg:text-7xl font-bold tracking-tight [text-wrap:balance] text-black fill-white [font-family:var(--font-proto-mono-semibold-shadow)] [text-shadow:0_0_1px_rgba(255,255,255,0.5)] will-change-transform px-3 sm:px-4">
              Pointer
            </h1>
          </Link>
          <p className="mt-4 sm:mt-6 lg:mt-8 text-lg sm:text-2xl lg:text-3xl text-neutral-800 mx-auto leading-[1.3] [font-family:var(--font-proto-mono-light)] max-w-[85%] sm:max-w-[80%] lg:max-w-[75%]">
            The Generalist Browser Agent<br className="block sm:hidden" /> for Everyone
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col mt-12 sm:mt-[8vh] lg:mt-[10vh]">
          <div className="relative mx-auto flex max-w-3xl flex-col items-center w-full min-h-[calc(100dvh-20rem)] sm:min-h-[calc(100vh-28rem)] lg:min-h-[calc(100vh-36rem)] justify-between">
            {/* Claim Handle Form */}
            <div className="w-full flex flex-col items-center mt-0">
              <AnimatePresence>
                {showInitialText && (
                  <motion.p 
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-base sm:text-lg lg:text-xl text-neutral-600 mb-6 sm:mb-8 lg:mb-10 text-center [font-family:var(--font-proto-mono-light)] will-change-transform px-3 sm:px-4"
                  >
                    Claim your personal operator
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="w-full max-w-md z-10 relative mb-8 sm:mb-12 lg:mb-16 px-3 sm:px-0">
                <ClaimHandleForm 
                  onComplete={handleFormComplete}
                  onStateChange={handleFormStateChange}
                />
              </div>
            </div>

            {/* Container for Cursor Mountain */}
            <div className="relative w-full aspect-[2/1] sm:aspect-[5/2] lg:aspect-[3/1] will-change-transform mt-auto overflow-hidden">
              <div className="absolute inset-0 transition-opacity duration-500 flex items-end justify-center">
                <div className="w-full max-w-3xl mx-auto h-full relative translate-y-[15%] sm:translate-y-[20%] lg:translate-y-[25%]">
                  <CursorMountain />
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <footer className="w-full mt-2 sm:mt-4 lg:mt-6 flex flex-col items-center space-y-3 sm:space-y-4 lg:space-y-6 px-3 sm:px-4 pb-4 sm:pb-6 lg:pb-8">
              {/* Research Badge */}
              <motion.div 
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-black/95 rounded-full cursor-default shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 0, 0, 0.9)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-[11px] sm:text-sm md:text-base [font-family:var(--font-proto-mono-light)] text-white whitespace-nowrap">
                  Designed with HCI * AI research
                </span>
              </motion.div>

              {/* Domain and Year */}
              <div className="text-center space-y-1.5 sm:space-y-2.5">
                <a
                  href="https://trypointer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit trypointer.com (opens in new tab)"
                  className="text-sm sm:text-lg md:text-xl [font-family:var(--font-proto-mono-semibold-shadow)] text-neutral-900 hover:text-black transition-colors inline-flex items-center gap-1.5 sm:gap-2 group"
                >
                  trypointer.com
                  <svg 
                    viewBox="0 0 15 15" 
                    className="w-2.5 h-2.5 sm:w-4 sm:h-4 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all duration-200"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path 
                      d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.7761 3 12 3.22386 12 3.5L12 9C12 9.27614 11.7761 9.5 11.5 9.5C11.2239 9.5 11 9.27614 11 9L11 4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" 
                      fill="currentColor" 
                      fillRule="evenodd" 
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <p className="text-[11px] sm:text-sm md:text-base [font-family:var(--font-proto-mono-light)] text-neutral-500">
                  2025
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 mb-2 sm:mb-0">
                <a 
                  href="https://x.com/pointerinc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2.5 rounded-full hover:bg-neutral-100 transition-colors group"
                  aria-label="Follow @pointerinc on X (formerly Twitter)"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    aria-hidden="true" 
                    className="h-3.5 w-3.5 sm:h-5 sm:w-5 fill-neutral-600 group-hover:fill-neutral-900 transition-colors"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
