interface Props {
  score: number
  level: string
}

const LEVEL_STYLES: Record<string, { ring: string; text: string; bg: string }> = {
  Beginner: { ring: '#8c959f', text: '#57606a', bg: 'rgba(140,149,159,0.12)' },
  Intermediate: { ring: '#0969da', text: '#0969da', bg: 'rgba(9,105,218,0.10)' },
  Advanced: { ring: '#9a6700', text: '#9a6700', bg: 'rgba(154,103,0,0.10)' },
  Expert: { ring: '#1a7f37', text: '#1a7f37', bg: 'rgba(26,127,55,0.10)' },
}

export default function ScoreRing({ score, level }: Props) {
  const style = LEVEL_STYLES[level] ?? LEVEL_STYLES.Beginner
  const pct = Math.min(100, (score / 500) * 100)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e8ebee" strokeWidth="8" />
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
        className="px-3 py-1 font-mono text-xs font-semibold tracking-wider uppercase rounded-full"
        style={{ color: style.text, backgroundColor: style.bg, border: `1px solid ${style.ring}44` }}
      >
        {level}
      </span>
    </div>
  )
}