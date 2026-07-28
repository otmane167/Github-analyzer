import { colorFor } from '../services/languageColors'

interface Props {
  languages: Record<string, number>
}

export default function LanguageBar({ languages }: Props) {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1])

  if (entries.length === 0) {
    return (
      <div className="text-textFaint text-sm font-mono">no language data detected</div>
    )
  }

  return (
    <div className="w-full animate-rise">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-borderMuted">
        {entries.map(([lang, pct], i) => (
          <div
            key={lang}
            style={{
              width: `${pct}%`,
              backgroundColor: colorFor(lang),
              animationDelay: `${i * 60}ms`,
            }}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-700 ease-out"
            title={`${lang} — ${pct.toFixed(1)}%`}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {entries.map(([lang, pct]) => (
          <div key={lang} className="flex items-center gap-1.5 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: colorFor(lang) }}
            />
            <span className="text-text font-medium">{lang}</span>
            <span className="text-textFaint font-mono text-xs">{pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
