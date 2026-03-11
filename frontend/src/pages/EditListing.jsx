import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListing, updateListing } from '../api/listingsApi'
import useAuthStore from '../store/authStore'

export default function EditListing() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', location: '', image_url: '', description: '', price: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    getListing(id).then(({ data }) => {
      if (data.user?.id !== user?.id) {
        setForbidden(true)
      } else {
        setForm({
          title: data.title || '',
          location: data.location || '',
          image_url: data.image_url || '',
          description: data.description || '',
          price: data.price || '',
        })
      }
    }).catch(() => navigate('/')).finally(() => setLoading(false))
  }, [id, user])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters'
    if (form.price && isNaN(parseFloat(form.price))) e.price = 'Price must be a number'
    return e
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setSubmitting(true)
    try {
      await updateListing(id, { ...form, price: form.price || null })
      navigate(`/listings/${id}`)
    } catch (err) {
      setErrors({ api: err.response?.data?.detail || 'Failed to update listing' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-cobalt" />
    </div>
  )

  if (forbidden) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-3">Access Denied</h2>
      <p className="text-gray-600">You are not authorized to edit this listing.</p>
    </div>
  )

  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'image_url', label: 'Image URL', type: 'url' },
    { name: 'price', label: 'Price (optional)', type: 'number' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Edit Listing</h1>

      {errors.api && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map(({ name, label, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              name={name} type={type} value={form[name]}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-cobalt"
            />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description" value={form.description}
            onChange={handleChange} rows={5}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-cobalt resize-none"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="submit" disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-brand-cobalt text-white font-semibold hover:bg-brand-royal transition-colors disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button" onClick={() => navigate(`/listings/${id}`)}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
