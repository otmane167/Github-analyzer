import { useState } from 'react'
import { fetchRecommendations, AiRecommendation, GithubApiError } from '../services/githubApi'

interface Props {
  username: string
}

type Status = 'idle' | 'loading' | 'error' | 'done'

const SECTIONS: { key: keyof AiRecommendation; label: string; icon: string; glow: string }[] = [
  { key: 'strengths', label: 'strengths', icon: '+', glow: 'text-link' },
  { key: 'weaknesses', label: 'weaknesses', icon: '!', glow: 'text-warn' },
  { key: 'suggestions', label: 'suggestions', icon: '→', glow: 'text-accent' },
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
    <div className="p-6 border animate-rise rounded-2xl glass shadow-card md:p-8">
      <div className="flex items-center justify-between mb-5">
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-textFaint">
          ai readout
        </div>
        {status === 'idle' && (
          <span className="rounded-full border border-link/40 px-2 py-0.5 font-mono text-[10px] text-link">
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
            className="px-4 py-2 font-mono text-xs font-semibold text-white transition-shadow rounded-lg bg-gradient-to-r from-accent to-accentDim hover:shadow-glow"
          >
            run scan
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="relative flex items-center justify-center w-8 h-8">
            <span className="absolute inset-0 border-2 rounded-full border-accent/30 border-t-accent radar-ring" style={{ animationDuration: '1.1s' }} />
          </span>
          <p className="font-mono text-xs text-textFaint">running local model — this can take a moment…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="font-mono text-sm text-danger">error: {error}</p>
          <button
            onClick={handleGenerate}
            className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-textMuted transition-colors hover:border-accent/50 hover:text-accent"
          >
            retry
          </button>
        </div>
      )}

      {status === 'done' && data && (
        <div className="grid gap-5 sm:grid-cols-3">
          {SECTIONS.map(({ key, label, icon, glow }) => (
            <div key={key} className="relative pl-4">
              <span className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-accent/60 to-link/10" />
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`flex h-4 w-4 items-center justify-center rounded-full bg-current/10 font-mono text-[10px] font-bold ${glow}`}>
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
