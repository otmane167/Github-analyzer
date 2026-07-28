import { RepoResponse } from '../services/githubApi'
import { colorFor } from '../services/languageColors'

interface Props {
  repos: RepoResponse[]
  username: string
}

export default function RepoList({ repos, username }: Props) {
  const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6)

  return (
    <div className="animate-rise rounded-xl border border-border bg-surface p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-textFaint">
          top repositories
        </h3>
        <span className="font-mono text-xs text-textFaint">{repos.length} total</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((repo) => (
          <a
            key={repo.name}
            href={`https://github.com/${username}/${repo.name}`}
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-border bg-surfaceRaised p-4 transition-colors hover:border-accentDim"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-link group-hover:underline">
                {repo.name}
              </span>
              <span className="shrink-0 font-mono text-xs text-textMuted">
                ★ {repo.stargazers_count.toLocaleString()}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-textMuted">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: colorFor(repo.language) }}
                  />
                  {repo.language}
                </span>
              )}
              <span>⑂ {repo.forks_count.toLocaleString()}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
