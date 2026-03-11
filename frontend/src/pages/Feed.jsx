import { useState, useEffect } from 'react'
import { getListings } from '../api/listingsApi'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'

export default function Feed() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    getListings({ page, search })
      .then(({ data }) => {
        setListings(data.results)
        setTotalPages(Math.ceil(data.count / 12))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, search])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-navy mb-2">Discover Experiences</h1>
        <p className="text-gray-500 mb-4">Find unique travel experiences around the world</p>
        <SearchBar onSearch={(q) => { setSearch(q); setPage(1) }} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-cobalt" />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl font-semibold">No experiences found</p>
          <p className="mt-2 text-sm">Try a different search or be the first to post one.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-cobalt transition-colors"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-cobalt transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
