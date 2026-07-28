interface Props {
  score: number
  level: string
}

const LEVEL_STYLES: Record<string, { ring: string; text: string; bg: string }> = {
  Beginner: { ring: '#8892a0', text: '#c9d1d9', bg: 'rgba(136,146,160,0.12)' },
  Intermediate: { ring: '#58a6ff', text: '#79c0ff', bg: 'rgba(88,166,255,0.12)' },
  Advanced: { ring: '#d29922', text: '#e3b341', bg: 'rgba(210,153,34,0.12)' },
  Expert: { ring: '#3fb950', text: '#56d364', bg: 'rgba(63,185,80,0.14)' },
}

export default function ScoreRing({ score, level }: Props) {
  const style = LEVEL_STYLES[level] ?? LEVEL_STYLES.Beginner
  // visual fill is normalized against a soft ceiling so the ring reads meaningfully
  // even though the underlying score is intentionally uncapped
  const pct = Math.min(100, (score / 500) * 100)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1b212a" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={style.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${style.ring}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold text-text tabular-nums">
            {Math.round(score)}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-textFaint">score</span>
        </div>
      </div>
      <span
        className="rounded-full px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider"
        style={{ color: style.text, backgroundColor: style.bg, border: `1px solid ${style.ring}44` }}
      >
        {level}
      </span>
    </div>
  )
}
