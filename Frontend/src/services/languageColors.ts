export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Vue: '#41b883',
  Dart: '#00B4AB',
  OpenSCAD: '#e6913a',
  Jupyter: '#DA5B0B',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  Scala: '#c22d40',
  Haskell: '#5e5086',
  Lua: '#000080',
}

export function colorFor(language: string): string {
  if (LANGUAGE_COLORS[language]) return LANGUAGE_COLORS[language]
  // deterministic fallback hue from string hash, keeps unseen languages stable across renders
  let hash = 0
  for (let i = 0; i < language.length; i++) hash = language.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 55%, 55%)`
}
