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
    <div className="min-h-screen bg-canvas">
      <div className="relative flex flex-col max-w-4xl min-h-screen px-6 mx-auto py-14">
        {/* Hero */}
        <header className="flex flex-col items-center gap-2 mb-10 text-center">
          <div className="absolute right-6 top-6">
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            developer analyzer
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Point it at a <span className="text-link">GitHub</span> profile.
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
        <div className="flex-1 mt-10">
          {error && (
            <div className="px-4 py-3 font-mono text-sm border rounded-lg animate-rise border-danger/30 bg-danger/10 text-danger">
              error: {error}
            </div>
          )}

          {!error && !data && !loading && searched === false && (
            <div className="flex flex-col items-center gap-3 py-20 text-center border border-dashed rounded-xl border-border">
              <p className="font-mono text-sm text-textFaint">
                waiting for input<span className="animate-blink">_</span>
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="w-8 h-8 border-2 rounded-full animate-spin border-border border-t-accent" />
              <p className="font-mono text-xs text-textFaint">fetching from github…</p>
            </div>
          )}

          {data && !loading && (
            <div className="flex flex-col gap-6">
              <ProfileCard data={data} />

              <div className="p-6 border animate-rise rounded-xl border-border bg-surface shadow-card md:p-8">
                <h3 className="mb-4 font-mono text-xs tracking-widest uppercase text-textFaint">
                  languages
                </h3>
                <LanguageBar languages={data.languages} />
              </div>

              {repos.length > 0 && <RepoList repos={repos} username={data.username} />}

              <AiRecommendations username={data.username} />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}