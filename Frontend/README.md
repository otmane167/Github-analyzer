# GitHub Developer Analyzer — Frontend

React + TypeScript + Tailwind, dark GitHub-inspired theme.

## Run it

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. Your Spring Boot backend must be running on
`http://localhost:8080` (see `src/services/githubApi.ts` if you need to change the URL).

## ⚠️ Required backend change: CORS

Your browser will block requests from `localhost:5173` to `localhost:8080` unless
the backend explicitly allows it. Add this to `GithubController.java`:

```java
@RestController
@RequestMapping("/api/github")
@CrossOrigin(origins = "http://localhost:5173")
public class GithubController {
    // ...
}
```

Without this you'll see a CORS error in the browser console even though the
backend itself is working fine.

## What's included

- `SearchBar` — terminal-style input (`$ analyze <username>`)
- `ProfileCard` — avatar, name, follower/repo counts, score ring
- `ScoreRing` — circular progress visualizing score + level badge
- `LanguageBar` — segmented bar styled after GitHub's own repo language bar,
  with a color-coded legend (colors approximate GitHub's linguist palette)
- `RepoList` — top 6 repos by stars, linked out to GitHub
- All API calls live in `src/services/githubApi.ts`
