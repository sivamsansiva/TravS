import { useState } from 'react'
import { Link } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'
import useAuthStore from '../store/authStore'
import { likeListing, saveListing } from '../api/listingsApi'

export default function ListingCard({ listing }) {
  const { user } = useAuthStore()
  const [likesCount, setLikesCount] = useState(listing.likes_count)
  const [liked, setLiked] = useState(listing.is_liked ?? false)
  const [saved, setSaved] = useState(false)
  const [liking, setLiking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleLike = async (e) => {
    e.preventDefault()
    if (liking) return
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount((c) => newLiked ? c + 1 : c - 1)
    setLiking(true)
    try {
      const { data } = await likeListing(listing.id)
      setLiked(data.liked)
      setLikesCount(data.likes_count)
    } catch {
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

  const desc = listing.description || ''
  const isLong = desc.length > 160
  const displayDesc = expanded || !isLong ? desc : desc.slice(0, 160)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">

      {/* ── Post header ── */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-brand-cobalt flex items-center justify-center text-white font-bold text-base select-none flex-shrink-0">
          {listing.user?.username?.[0]?.toUpperCase()}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">{listing.user?.username}</span>
            {listing.price ? (
              <span className="text-xs font-semibold text-brand-coral bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5">
                ${listing.price}
              </span>
            ) : (
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                Free
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
            <span>📍 {listing.location}</span>
            <span>·</span>
            <span>{timeAgo(listing.created_at)}</span>
            <span>·</span>
            <span title="Public">🌍</span>
          </div>
        </div>
      </div>

      {/* ── Post body ── */}
      <div className="px-4 pb-3">
        <p className="font-semibold text-gray-900 text-base mb-1">{listing.title}</p>
        <p className="text-gray-600 text-sm leading-relaxed">
          {displayDesc}
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 text-brand-cobalt font-medium hover:underline text-sm"
            >
              {expanded ? 'less' : '...more'}
            </button>
          )}
        </p>
      </div>

      {/* ── Full-width image ── */}
      {listing.image_url && (
        <Link to={`/listings/${listing.id}`}>
          <img
            src={listing.image_url}
            alt={listing.title}
            loading="lazy"
            className="w-full object-cover max-h-[480px]"
          />
        </Link>
      )}

      {/* ── Stats row ── */}
      {(likesCount > 0 || saved) && (
        <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400 border-b border-gray-100">
          <div className="flex items-center gap-1">
            {likesCount > 0 && (
              <><span className="text-brand-coral">♥</span><span>{likesCount}</span></>
            )}
          </div>
          {saved && <span className="text-brand-cobalt">🔖 Saved</span>}
        </div>
      )}

      {/* ── Action bar ── */}
      <div className="flex items-center border-t border-gray-100">
        {user ? (
          <>
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50 ${
                liked ? 'text-brand-coral' : 'text-gray-500 hover:text-brand-coral'
              }`}
              title={liked ? 'Unlike' : 'Like'}
            >
              <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {liked ? 'Liked' : 'Like'}
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50 border-l border-gray-100 ${
                saved ? 'text-brand-cobalt' : 'text-gray-500 hover:text-brand-cobalt'
              }`}
            >
              <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {saved ? 'Saved' : 'Save'}
            </button>

            <Link
              to={`/listings/${listing.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-500 hover:text-brand-cobalt hover:bg-gray-50 transition-colors border-l border-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View
            </Link>
          </>
        ) : (
          <Link
            to={`/listings/${listing.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-500 hover:text-brand-cobalt hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Details
          </Link>
        )}
      </div>
    </div>
  )
}
