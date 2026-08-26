interface Props {
  score: number
  level: string
}

const LEVEL_STYLES: Record<string, { from: string; to: string; text: string; bg: string }> = {
  Beginner: { from: '#8B7EB5', to: '#5B4E82', text: '#5B4E82', bg: 'rgba(139,126,181,0.14)' },
  Intermediate: { from: '#0EA5A0', to: '#0C7A76', text: '#0EA5A0', bg: 'rgba(14,165,160,0.12)' },
  Advanced: { from: '#C64FFF', to: '#9A3ED9', text: '#9A3ED9', bg: 'rgba(198,79,255,0.12)' },
  Expert: { from: '#C64FFF', to: '#3FE8D8', text: '#8A2BE2', bg: 'rgba(198,79,255,0.14)' },
}

export default function ScoreRing({ score, level }: Props) {
  const style = LEVEL_STYLES[level] ?? LEVEL_STYLES.Beginner
  const pct = Math.min(100, (score / 500) * 100)
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  const gradId = `ring-${level}`

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        {/* Outer dashed radar ring, slowly rotating */}
        <div className="absolute rounded-full inset-1 border border-dashed border-accent/40 radar-ring" />

        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={style.from} />
              <stop offset="100%" stopColor={style.to} />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-borderMuted" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${style.from}88)` }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold tabular-nums text-text">
            {Math.round(score)}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-textFaint">/ 500</span>
        </div>
      </div>
      <span
        className="px-3 py-1 font-mono text-xs font-semibold tracking-wider uppercase rounded-full"
        style={{ color: style.text, backgroundColor: style.bg, border: `1px solid ${style.from}55` }}
      >
        {level}
      </span>
    </div>
  )
}
