"use client"

interface ArcTextProps {
  text: string;
  className?: string;
  degreePerChar?: number;
  startDegree?: number;
  animate?: boolean;
}

export function ArcText({ 
  text, 
  className = "", 
  degreePerChar = 5, 
  startDegree = -15,
  animate = false 
}: ArcTextProps) {
  return (
    <div className={`arc-text ${className}`}>
      <style jsx>{`
        .arc-text > span {
          display: inline-block;
          transform-origin: 50% 100px;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--rotation)); }
          50% { transform: translateY(-5px) rotate(var(--rotation)); }
        }
        .floating > span {
          animation: float 3s ease-in-out infinite;
          animation-delay: calc(var(--char-index) * 0.1s);
        }
      `}</style>
      {text.split('').map((char, i) => (
        <span 
          key={`${char}-${i}`}
          style={{
            '--rotation': `${startDegree + (i * degreePerChar)}deg`,
            '--char-index': i,
            transform: `rotate(${startDegree + (i * degreePerChar)}deg)`
          } as any}
          className={`inline-block ${animate ? 'animate-float' : ''}`}
        >
          {char}
        </span>
      ))}
    </div>
  )
} 