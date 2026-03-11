import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthInit } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Feed from './pages/Feed'
import Login from './pages/Login'
import Register from './pages/Register'
import ListingDetail from './pages/ListingDetail'
import CreateListing from './pages/CreateListing'
import EditListing from './pages/EditListing'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  useAuthInit() // attempt silent re-auth on every page load

  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/"                  element={<Feed />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/listings/:id"      element={<ListingDetail />} />
          <Route path="/create"            element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
          <Route path="/listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
          <Route path="/profile"           element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*"                  element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
