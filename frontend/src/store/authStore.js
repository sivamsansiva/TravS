import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user:        null,
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser:        (user)  => set({ user }),
  logout:         ()      => set({ user: null, accessToken: null }),
}))

export default useAuthStore
