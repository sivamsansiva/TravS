import { useState, useEffect } from 'react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <input
      type="text"
      placeholder="Search experiences, locations..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cobalt bg-white"
    />
  )
}
