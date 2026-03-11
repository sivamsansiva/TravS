import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getListing, likeListing, saveListing, deleteListing } from '../api/listingsApi'
import useAuthStore from '../store/authStore'
import { timeAgo } from '../utils/timeAgo'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getListing(id)
      .then(({ data }) => setListing(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return
    await deleteListing(id)
    navigate('/')
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-cobalt" />
    </div>
  )

  if (!listing) return null

  const isOwner = user?.id === listing.user?.id

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-cobalt transition-colors">Feed</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">{listing.title}</span>
      </nav>

      {/* Image */}
      <img
        src={listing.image_url} alt={listing.title}
        className="w-full rounded-2xl max-h-96 object-cover mb-6"
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-brand-navy">{listing.title}</h1>
        <span className={`text-xl font-bold ${listing.price ? 'text-brand-coral' : 'text-green-600'}`}>
          {listing.price ? `$${listing.price}` : 'Free'}
        </span>
      </div>

      <p className="text-brand-royal font-medium mb-4">📍 {listing.location}</p>
      <p className="text-gray-700 leading-relaxed mb-6">{listing.description}</p>

      {/* Creator info */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-brand-cobalt flex items-center justify-center text-white font-bold">
          {listing.user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{listing.user?.username}</p>
          <p className="text-xs text-gray-400">{timeAgo(listing.created_at)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <button
              onClick={() => likeListing(id).then(({ data }) => setListing({ ...listing, likes_count: data.likes_count }))}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-brand-coral hover:text-brand-coral transition-colors"
            >
              ♥ {listing.likes_count}
            </button>
            <button
              onClick={() => saveListing(id)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:border-brand-cobalt hover:text-brand-cobalt transition-colors"
            >
              🔖 Save
            </button>
          </>
        )}

        {isOwner && (
          <>
            <Link
              to={`/listings/${id}/edit`}
              className="px-4 py-2 bg-brand-cobalt text-white rounded-lg hover:bg-brand-royal transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}
