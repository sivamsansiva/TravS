import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { logout } from '../api/authApi'

export default function Navbar() {
  const { user, accessToken, logout: clearStore } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout({ refresh: '' }) // refresh token sent via cookie
    } catch {
      // proceed with local logout even if server call fails
    }
    clearStore()
    navigate('/login')
  }

  return (
    <nav className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide text-white hover:text-brand-coral transition-colors">
        TravS
      </Link>

      <div className="flex items-center gap-4 text-sm font-medium">
        {user ? (
          <>
            <Link to="/create" className="bg-brand-cobalt hover:bg-brand-coral px-4 py-2 rounded-lg transition-colors">
              + Create
            </Link>
            <Link to="/profile" className="hover:text-brand-coral transition-colors">
              Profile
            </Link>
            <button onClick={handleLogout} className="hover:text-brand-coral transition-colors">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-brand-coral transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-brand-cobalt hover:bg-brand-coral px-4 py-2 rounded-lg transition-colors">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
