import { useState } from 'react'
import { fetchRecommendations, AiRecommendation, GithubApiError } from '../services/githubApi'

interface Props {
  username: string
}

type Status = 'idle' | 'loading' | 'error' | 'done'

const SECTIONS: { key: keyof AiRecommendation; label: string; color: string; icon: string }[] = [
  { key: 'strengths', label: 'strengths', color: '#1a7f37', icon: '+' },
  { key: 'weaknesses', label: 'weaknesses', color: '#9a6700', icon: '!' },
  { key: 'suggestions', label: 'suggestions', color: '#0969da', icon: '→' },
]

export default function AiRecommendations({ username }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<AiRecommendation | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setStatus('loading')
    setError(null)
    try {
      const result = await fetchRecommendations(username)
      setData(result)
      setStatus('done')
    } catch (err) {
      setError(err instanceof GithubApiError ? err.message : 'Unexpected error')
      setStatus('error')
    }
  }

  return (
    <div className="p-6 border animate-rise rounded-xl border-border bg-surface shadow-card md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs tracking-widest uppercase text-textFaint">
          ai recommendations
        </h3>
        {status === 'idle' && (
          <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-textFaint">
            local model
          </span>
        )}
      </div>

      {status === 'idle' && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="max-w-xs text-sm text-textMuted">
            Run a locally-hosted model over {username}'s repos to get a quick strengths / weaknesses read.
          </p>
          <button
            onClick={handleGenerate}
            className="px-4 py-2 font-mono text-xs font-semibold transition-colors border rounded-md border-accentDim bg-accentDim/10 text-accent hover:bg-accentDim/20"
          >
            $ generate
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="w-6 h-6 border-2 rounded-full animate-spin border-border border-t-accent" />
          <p className="font-mono text-xs text-textFaint">running local model — this can take a moment…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="font-mono text-sm text-danger">error: {error}</p>
          <button
            onClick={handleGenerate}
            className="rounded-md border border-border px-3 py-1.5 font-mono text-xs text-textMuted transition-colors hover:border-accentDim hover:text-accent"
          >
            retry
          </button>
        </div>
      )}

      {status === 'done' && data && (
        <div className="grid gap-5 sm:grid-cols-3">
          {SECTIONS.map(({ key, label, color, icon }) => (
            <div key={key}>
              <div className="mb-2 flex items-center gap-1.5">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ color, backgroundColor: `${color}22` }}
                >
                  {icon}
                </span>
                <span className="font-mono text-xs tracking-wider uppercase text-textMuted">
                  {label}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {(data[key] ?? []).map((item, i) => (
                  <li key={i} className="text-sm leading-snug text-text/90">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}