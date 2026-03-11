import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createListing } from '../api/listingsApi'

const INITIAL = { title: '', location: '', image_url: '', description: '', price: '' }

export default function CreateListing() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.image_url.trim()) e.image_url = 'Image URL is required'
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
      const payload = { ...form, price: form.price || null }
      await createListing(payload)
      navigate('/')
    } catch (err) {
      setErrors({ api: err.response?.data?.detail || 'Failed to create listing' })
    } finally {
      setSubmitting(false)
    }
  }

  const fields = [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Amazing Beach Hike Trail' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'Bali, Indonesia' },
    { name: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
    { name: 'price', label: 'Price (optional)', type: 'number', placeholder: 'Leave blank if free' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Share a Travel Experience</h1>

      {errors.api && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map(({ name, label, type, placeholder }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              name={name} type={type} value={form[name]}
              onChange={handleChange} placeholder={placeholder}
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
            placeholder="Describe the experience in detail (min. 20 characters)"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-cobalt resize-none"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <button
          type="submit" disabled={submitting}
          className="w-full py-3 rounded-xl bg-brand-cobalt text-white font-semibold hover:bg-brand-royal transition-colors disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  )
}
