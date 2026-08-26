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
    <div className="p-6 border animate-rise rounded-2xl glass shadow-card md:p-8">
      <div className="flex items-center justify-between mb-5">
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-textFaint">
          top repositories
        </div>
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
            className="p-4 transition-all border rounded-xl group border-border/60 bg-surfaceRaised/60 hover:border-link/50 hover:shadow-glowCyan"
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
                      boxShadow: `0 0 6px ${colorFor(repo.language)}88`,
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
