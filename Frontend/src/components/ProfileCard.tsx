import { AnalysisResponse } from "../services/githubApi";
import ScoreRing from "./ScoreRing";

interface Props {
  data: AnalysisResponse;
}

export default function ProfileCard({ data }: Props) {
  return (
    <div className="p-6 border animate-rise rounded-xl border-border bg-surface shadow-card md:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <img
            src={data.avatarUrl}
            alt={data.username}
            className="object-cover w-20 h-20 border rounded-full border-border"
          />

          <div>
            <h2 className="text-2xl font-bold text-text">
              {data.name || data.username}
            </h2>

            <a
              href={`https://github.com/${data.username}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm text-link hover:underline"
            >
              @{data.username}
            </a>

            <div className="flex gap-5 mt-3 font-mono text-sm text-textMuted">
              <span>
                <span className="font-semibold text-text">
                  {data.followers.toLocaleString()}
                </span>{" "}
                followers
              </span>

              <span>
                <span className="font-semibold text-text">
                  {data.publicRepos}
                </span>{" "}
                repos
              </span>
            </div>
          </div>
        </div>

        <ScoreRing score={data.score} level={data.level} />
      </div>
    </div>
  );
}