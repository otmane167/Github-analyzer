import { RepoResponse } from "../services/githubApi";
import { colorFor } from "../services/languageColors";

interface Props {
  repos: RepoResponse[];
  username: string;
}

export default function RepoList({ repos, username }: Props) {
  const sorted = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  return (
    <div className="p-6 border animate-rise rounded-xl border-border bg-surface shadow-card md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs tracking-widest uppercase text-textFaint">
          Top Repositories
        </h3>

        <span className="font-mono text-xs text-textFaint">
          {repos.length} total
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((repo) => (
          <a
            key={repo.name}
            href={`https://github.com/${username}/${repo.name}`}
            target="_blank"
            rel="noreferrer"
            className="p-4 transition-colors border rounded-lg group border-border bg-surfaceRaised hover:border-accentDim"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium truncate text-link group-hover:underline">
                {repo.name}
              </span>

              <span className="font-mono text-xs shrink-0 text-textMuted">
                ★ {repo.stargazers_count.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3 text-xs text-textMuted">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: colorFor(repo.language),
                    }}
                  />
                  {repo.language}
                </span>
              )}

              <span>
                ⑂ {repo.forks_count.toLocaleString()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}