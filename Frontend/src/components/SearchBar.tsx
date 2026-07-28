import { FormEvent, useState } from 'react'

interface Props {
  onSearch: (username: string) => void
  loading: boolean
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
    if (trimmed) onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex h-16 items-center gap-3 rounded-xl border border-border bg-surface px-6 font-mono text-base transition-colors focus-within:border-accentDim focus-within:shadow-glow md:h-20 md:px-8">
        <span className="select-none text-accent">$</span>
        <span className="select-none text-textFaint">analyze</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="torvalds"
          spellCheck={false}
          autoFocus
          disabled={loading}
          className="flex-1 bg-transparent text-text placeholder:text-textFaint outline-none disabled:opacity-50"
        />
        {!value && <span className="h-4 w-2 animate-blink bg-accent" />}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="rounded-md bg-accentDim px-4 py-2 text-xs font-semibold text-canvas transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'running…' : 'run'}
        </button>
      </div>
    </form>
  )
}