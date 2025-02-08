import Image from "next/image";
import { CursorMountain } from "./components/cursor-mountain";
import { ClaimHandleForm } from "./components/claim-handle-form";
import { NoiseBackground } from "./components/noise-background";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f6] selection:bg-black selection:text-white overflow-hidden">
      <NoiseBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-24 lg:px-8">
        {/* Header */}
        <header className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl [text-wrap:balance] text-black [font-family:var(--font-proto-mono-semibold-shadow)]">
            Pointer
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-neutral-600 mx-auto leading-relaxed [font-family:var(--font-proto-mono-light)]">
            The Generalist Browser Agent for Everyone
          </p>
        </header>

        {/* Main Content */}
        <main className="mt-12 sm:mt-24">
          <div className="relative mx-auto flex max-w-3xl flex-col items-center">
            {/* Claim Handle Form */}
            <p className="text-sm sm:text-base text-neutral-500 mb-4 sm:mb-6 text-center [font-family:var(--font-proto-mono-light)]">
              Claim your personal operator
            </p>
            <div className="w-full max-w-md z-10 relative mb-12 sm:mb-24">
              <ClaimHandleForm />
            </div>

            {/* Container for Cursor Mountain and Static Image */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9]">
              {/* Interactive Cursor Mountain (Desktop) */}
              <div className="absolute inset-0 transition-opacity duration-500 z-0">
                <CursorMountain />
              </div>

              {/* Static Image (Mobile) */}
              <div className="absolute inset-0 md:hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BWA6Xjdzzt6yDOVmhnU6fsj4LRDj9y.png"
                  alt="Multiple cursor icons forming a mountain shape"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Footer Section */}
            <footer className="w-full mt-16 sm:mt-24 flex flex-col items-center space-y-8 sm:space-y-12 px-4">
              {/* Research Badge */}
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-50 rounded-full">
                <span className="text-xs sm:text-sm [font-family:var(--font-proto-mono-light)] text-neutral-600">
                  Designed from HCI * AI research
                </span>
              </div>

              {/* Domain and Year */}
              <div className="text-center space-y-2">
                <a
                  href="https://trypointer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit trypointer.com (opens in new tab)"
                  className="text-lg sm:text-xl [font-family:var(--font-proto-mono-semibold-shadow)] text-neutral-900 hover:text-black transition-colors inline-flex items-center gap-1.5 group"
                >
                  trypointer.com
                  <svg 
                    viewBox="0 0 15 15" 
                    className="w-4 h-4 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all duration-200"
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
                <p className="text-xs sm:text-sm [font-family:var(--font-proto-mono-light)] text-neutral-500">
                  2025
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4">
                <a 
                  href="https://x.com/pointerinc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full hover:bg-neutral-100 transition-colors group"
                  aria-label="Follow @pointerinc on X (formerly Twitter)"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    aria-hidden="true" 
                    className="h-5 w-5 fill-neutral-600 group-hover:fill-neutral-900 transition-colors"
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
