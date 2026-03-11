import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getListings, getSavedListings } from '../api/listingsApi'
import useAuthStore from '../store/authStore'
import ListingCard from '../components/ListingCard'

const TABS = ['My Listings', 'Saved']

export default function Profile() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState(0)
  const [myListings, setMyListings] = useState([])
  const [savedListings, setSavedListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getListings({ user: user.id }),
      getSavedListings(),
    ]).then(([mine, saved]) => {
      setMyListings(mine.data.results || mine.data)
      setSavedListings(saved.data.results || saved.data)
    }).finally(() => setLoading(false))
  }, [user])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-cobalt" />
    </div>
  )

  const tabs = [myListings, savedListings]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* User info */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-cobalt flex items-center justify-center text-white text-2xl font-bold">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">{user?.username}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2 text-sm font-medium transition-colors rounded-t-lg ${
              activeTab === i
                ? 'text-brand-cobalt border-b-2 border-brand-cobalt'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab} ({tabs[i].length})
          </button>
        ))}
      </div>

      {/* Content */}
      {tabs[activeTab].length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {activeTab === 0 ? (
            <>
              <p className="mb-4">No listings yet.</p>
              <Link to="/create" className="text-brand-cobalt hover:text-brand-royal font-medium">
                Create your first listing →
              </Link>
            </>
          ) : (
            <p>No saved listings yet.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tabs[activeTab].map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
