import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ProfileCard from './components/ProfileCard'
import LanguageBar from './components/LanguageBar'
import RepoList from './components/RepoList'
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
    <div className="min-h-screen bg-canvas bg-grid">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-14">
        {/* Hero */}
        <header className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            developer analyzer
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Point it at a <span className="text-accent text-glow">GitHub</span> profile.
          </h1>
          <p className="max-w-lg text-sm text-textMuted">
            Pulls public repos, breaks down languages, and scores the profile —
            straight from the GitHub REST API.
          </p>
        </header>

        {/* Search */}
        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* States */}
        <div className="mt-10 flex-1">
          {error && (
            <div className="animate-rise rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 font-mono text-sm text-danger">
              error: {error}
            </div>
          )}

          {!error && !data && !loading && searched === false && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
              <p className="font-mono text-sm text-textFaint">
                waiting for input<span className="animate-blink">_</span>
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
              <p className="font-mono text-xs text-textFaint">fetching from github…</p>
            </div>
          )}

          {data && !loading && (
            <div className="flex flex-col gap-6">
              <ProfileCard data={data} />

              <div className="animate-rise rounded-xl border border-border bg-surface p-6 md:p-8">
                <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-textFaint">
                  languages
                </h3>
                <LanguageBar languages={data.languages} />
              </div>

              {repos.length > 0 && <RepoList repos={repos} username={data.username} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}