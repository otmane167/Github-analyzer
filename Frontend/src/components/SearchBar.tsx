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
      <div className="flex items-center h-16 gap-3 px-6 font-mono text-base transition-colors border rounded-xl border-border bg-surface shadow-card focus-within:border-link focus-within:shadow-glow md:h-20 md:px-8">
        <span className="select-none text-accent">$</span>
        <span className="select-none text-textFaint">analyze</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="torvalds"
          spellCheck={false}
          autoFocus
          disabled={loading}
          className="flex-1 bg-transparent outline-none text-text placeholder:text-textFaint disabled:opacity-50"
        />
        {!value && <span className="w-2 h-4 animate-blink bg-accent" />}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-4 py-2 text-xs font-semibold transition-colors rounded-md bg-accentDim text-canvas hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'running…' : 'run'}
        </button>
      </div>
    </form>
  )
}