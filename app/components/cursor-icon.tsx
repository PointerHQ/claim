export function CursorIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow path */}
      <path 
        d="M7 2L18 13L13 14.5L16.5 21L14 22L10.5 15.5L7 18L7 2Z" 
        fill="rgba(0, 0, 0, 0.4)"
        stroke="rgba(0, 0, 0, 0.3)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        transform="translate(2, 2)"
      />
      {/* Main cursor path */}
      <path 
        d="M7 2L18 13L13 14.5L16.5 21L14 22L10.5 15.5L7 18L7 2Z" 
        fill="white" 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

