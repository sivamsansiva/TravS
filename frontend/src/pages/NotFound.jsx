import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-8xl font-extrabold text-brand-cobalt mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-brand-navy mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-brand-cobalt text-white rounded-xl font-semibold hover:bg-brand-royal transition-colors"
      >
        Back to Feed
      </Link>
    </div>
  )
}
