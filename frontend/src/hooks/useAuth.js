import { useEffect } from 'react'
import { getMe } from '../api/authApi'
import useAuthStore from '../store/authStore'

/**
 * Called once in App.jsx on mount.
 * Attempts a silent GET /auth/me/ — if the httpOnly refresh cookie is
 * still valid, the interceptor will fetch a new access token automatically
 * and restore the user session without requiring a re-login.
 */
export function useAuthInit() {
  const { setUser } = useAuthStore()

  useEffect(() => {
    getMe()
      .then(({ data }) => setUser(data))
      .catch(() => {}) // no valid session — remain logged out
  }, [])
}
