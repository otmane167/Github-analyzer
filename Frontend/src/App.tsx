import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ProfileCard from './components/ProfileCard'
import LanguageBar from './components/LanguageBar'
import RepoList from './components/RepoList'
import AiRecommendations from './components/AiRecommendations'
import ThemeToggle from './components/ThemeToggle'
import { analyzeUser, fetchRepos, AnalysisResponse, RepoResponse, GithubApiError } from './services/githubApi'

export default function App() {
  const [data, setData] = useState<AnalysisResponse | null>(null)
  const [repos, setRepos] = useState<RepoResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleSearch(username: string) {
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const [analysis, repoList] = await Promise.all([
        analyzeUser(username),
        fetchRepos(username),
      ])
      setData(analysis)
      setRepos(repoList)
    } catch (err) {
      setData(null)
      setRepos([])
      setError(err instanceof GithubApiError ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-canvas">
      <div className="aurora" />
      <div className="dot-grid" />

      <div className="relative z-10 flex flex-col min-h-screen max-w-3xl px-6 mx-auto py-10 sm:py-14">

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mb-2 font-mono text-[10px] tracking-[0.2em] uppercase bg-gradient-to-r from-accent to-link bg-clip-text text-transparent">
                neural scan // active
              </div>
              <h1 className="text-2xl font-bold tracking-wide font-display text-text sm:text-3xl">
                GitHub Signature Scan
              </h1>
              <p className="max-w-md mt-2 text-sm text-textMuted">
                Point it at a public profile to read repositories, language
                signature, and a scored developer readout.
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 shrink-0">
              <ThemeToggle />
              <span className="relative flex items-center justify-center w-6 h-6">
                <span className="absolute inset-0 border rounded-full border-accent/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-link status-dot" />
              </span>
            </div>
          </div>
          <div className="mt-6 scan-divider" />
        </header>

        {/* Search */}
        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* States */}
        <div className="flex-1 mt-10">
          {error && (
            <div className="px-4 py-3 font-mono text-sm border rounded-xl animate-rise border-danger/40 bg-danger/10 text-danger">
              error: {error}
            </div>
          )}

          {!error && !data && !loading && searched === false && (
            <div className="flex flex-col items-center gap-3 py-24 text-center border rounded-2xl glass">
              <span className="relative flex items-center justify-center w-10 h-10">
                <span className="absolute inset-0 border rounded-full border-accent/50 radar-ring" />
                <span className="w-2 h-2 rounded-full bg-link" />
              </span>
              <p className="font-mono text-xs text-textFaint">
                awaiting target<span className="animate-blink">_</span>
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <span className="relative flex items-center justify-center w-12 h-12">
                <span className="absolute inset-0 border-2 rounded-full border-accent/30 border-t-accent radar-ring" style={{ animationDuration: '1.1s' }} />
              </span>
              <p className="font-mono text-xs text-textFaint">scanning repository data…</p>
            </div>
          )}

          {data && !loading && (
            <div className="flex flex-col gap-5">
              <ProfileCard data={data} />

              <div className="p-6 border animate-rise rounded-2xl glass glass-cyan shadow-card md:p-8">
                <div className="mb-5 font-mono text-[10px] tracking-[0.16em] uppercase text-textFaint">
                  language signature
                </div>
                <LanguageBar languages={data.languages} />
              </div>

              {repos.length > 0 && <RepoList repos={repos} username={data.username} />}

              <AiRecommendations username={data.username} />
            </div>
          )}
        </div>

        <footer className="pt-6 mt-14 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-textFaint">
            <span>dev.scan</span>
            <span>source — github rest api</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
