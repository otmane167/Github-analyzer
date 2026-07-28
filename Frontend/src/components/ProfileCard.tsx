import { AnalysisResponse } from '../services/githubApi'
import ScoreRing from './ScoreRing'

interface Props {
  data: AnalysisResponse
}

export default function ProfileCard({ data }: Props) {
  return (
    <div className="animate-rise rounded-xl border border-border bg-surface p-6 md:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <img
            src={data.avatarUrl}
            alt={data.username}
            className="h-20 w-20 rounded-full border-2 border-border object-cover shadow-glow"
          />
          <div>
            <h2 className="text-2xl font-bold text-text">{data.name || data.username}</h2>
            <a
              href={`https://github.com/${data.username}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm text-link hover:underline"
            >
              @{data.username}
            </a>
            <div className="mt-3 flex gap-5 font-mono text-sm text-textMuted">
              <span>
                <span className="text-text font-semibold">{data.followers.toLocaleString()}</span> followers
              </span>
              <span>
                <span className="text-text font-semibold">{data.publicRepos}</span> repos
              </span>
            </div>
          </div>
        </div>

        <ScoreRing score={data.score} level={data.level} />
      </div>
    </div>
  )
}
