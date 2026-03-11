import { useState } from 'react'
import { Link } from 'react-router-dom'
import { timeAgo, truncate } from '../utils/timeAgo'
import useAuthStore from '../store/authStore'
import { likeListing, saveListing } from '../api/listingsApi'

export default function ListingCard({ listing }) {
  const { user } = useAuthStore()
  const [likesCount, setLikesCount] = useState(listing.likes_count)
  const [liked, setLiked] = useState(listing.is_liked ?? false)
  const [saved, setSaved] = useState(false)
  const [liking, setLiking] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleLike = async (e) => {
    e.preventDefault()
    if (liking) return
    // Optimistic update
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount((c) => newLiked ? c + 1 : c - 1)
    setLiking(true)
    try {
      const { data } = await likeListing(listing.id)
      // Sync with server truth
      setLiked(data.liked)
      setLikesCount(data.likes_count)
    } catch {
      // Revert on error
      setLiked(!newLiked)
      setLikesCount((c) => newLiked ? c - 1 : c + 1)
    } finally {
      setLiking(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      const { data } = await saveListing(listing.id)
      setSaved(data.saved)
    } catch {
      // silently ignore
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      <img
        src={listing.image_url}
        alt={listing.title}
        loading="lazy"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-brand-navy text-lg leading-tight">{listing.title}</h3>
          {listing.price ? (
            <span className="text-brand-coral font-bold text-sm whitespace-nowrap">${listing.price}</span>
          ) : (
            <span className="text-green-600 font-bold text-sm">Free</span>
          )}
        </div>

        <p className="text-brand-royal text-sm mb-2 flex items-center gap-1">
          📍 {listing.location}
        </p>

        <p className="text-gray-500 text-sm mb-3 leading-relaxed">
          {truncate(listing.description)}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>By <span className="font-medium text-gray-600">{listing.user?.username}</span></span>
          <span>{timeAgo(listing.created_at)}</span>
        </div>

        {user && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-sm">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${
                liked ? 'text-brand-coral' : 'text-gray-400 hover:text-brand-coral'
              }`}
              title={liked ? 'Unlike' : 'Like'}
            >
              {liked ? '♥' : '♡'} {likesCount}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${
                saved ? 'text-brand-cobalt' : 'text-gray-400 hover:text-brand-cobalt'
              }`}
            >
              🔖 {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        )}

        <Link
          to={`/listings/${listing.id}`}
          className="mt-3 block text-center text-sm font-medium text-brand-cobalt hover:text-brand-coral transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
