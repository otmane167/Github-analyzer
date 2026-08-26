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
      <div className="flex items-center h-14 gap-3 px-5 transition-shadow border rounded-xl glass focus-within:shadow-glow sm:h-16">
        <span className="font-mono text-sm select-none text-link">@</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="torvalds"
          spellCheck={false}
          autoFocus
          disabled={loading}
          className="flex-1 font-mono text-base bg-transparent outline-none text-text placeholder:text-textFaint disabled:opacity-50"
        />
        {!value && <span className="w-2 h-4 bg-accent animate-blink" />}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-4 py-2 text-xs font-semibold tracking-wide text-white transition-shadow rounded-lg bg-gradient-to-r from-accent to-accentDim hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'scanning…' : 'scan ↗'}
        </button>
      </div>
    </form>
  )
}
