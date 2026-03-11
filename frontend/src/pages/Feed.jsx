import { useState, useEffect } from 'react'
import { getListings } from '../api/listingsApi'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import CreateListing from './CreateListing'
import useListingStore from '../store/listingStore'

export default function Feed() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const { isCreateOpen, closeCreate } = useListingStore()

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

  const handleCreateSuccess = () => {
    closeCreate()
    setPage(1)
    setSearch('')
  }

  return (
    <>
      {/* Single-column LinkedIn-style feed */}
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header + Search */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Discover Experiences</h1>
          <p className="text-gray-400 text-sm mb-4">Find unique travel experiences around the world</p>
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
            <div className="flex flex-col gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-cobalt transition-colors text-sm"
                >
                  ← Prev
                </button>
                <span className="px-4 py-2 text-sm text-gray-500">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-cobalt transition-colors text-sm"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isCreateOpen && (
        <CreateListing onClose={closeCreate} onSuccess={handleCreateSuccess} />
      )}
    </>
  )
}
