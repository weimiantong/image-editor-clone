export function BananaIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C8.5 2 5.5 4.5 4 8C2.5 11.5 3 15.5 5.5 18.5C8 21.5 12 22 15 20.5C18 19 20 15.5 20 12C20 8.5 18 5 15 3.5C14 3 13 2.5 12 2Z"
        fill="currentColor"
        className="text-[oklch(0.88_0.18_95)]"
      />
      <path
        d="M10 4C7.5 5 5.5 7.5 5 10.5C4.5 13.5 5.5 16.5 7.5 18.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-[oklch(0.75_0.15_85)]"
      />
    </svg>
  )
}

export function BananaDecoration({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M60 10C35 10 15 35 10 60C5 85 20 105 50 110C80 115 105 95 115 65C125 35 100 10 60 10Z"
          fill="oklch(0.88 0.18 95 / 0.15)"
        />
        <path
          d="M45 20C25 30 15 50 15 70C15 90 30 100 50 100"
          stroke="oklch(0.88 0.18 95 / 0.3)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
