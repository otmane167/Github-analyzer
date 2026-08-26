import { colorFor } from '../services/languageColors'

interface Props {
  languages: Record<string, number>
}

export default function LanguageBar({ languages }: Props) {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1])

  if (entries.length === 0) {
    return (
      <div className="font-mono text-sm text-textFaint">no language data detected</div>
    )
  }

  return (
    <div className="w-full animate-rise">
      <div className="flex w-full h-2.5 overflow-hidden rounded-full bg-borderMuted shadow-glow">
        {entries.map(([lang, pct], i) => (
          <div
            key={lang}
            style={{
              width: `${pct}%`,
              backgroundColor: colorFor(lang),
              animationDelay: `${i * 60}ms`,
              boxShadow: `0 0 8px ${colorFor(lang)}66`,
            }}
            className="h-full transition-all duration-700 ease-out first:rounded-l-full last:rounded-r-full"
            title={`${lang} — ${pct.toFixed(1)}%`}
          />
        ))}
      </div>

      <div className="flex flex-wrap mt-4 gap-x-5 gap-y-2">
        {entries.map(([lang, pct]) => (
          <div key={lang} className="flex items-center gap-1.5 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: colorFor(lang), boxShadow: `0 0 6px ${colorFor(lang)}88` }}
            />
            <span className="font-medium text-text">{lang}</span>
            <span className="font-mono text-xs text-textFaint">{pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
