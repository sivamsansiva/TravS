import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListing, patchListing } from '../api/listingsApi'
import useAuthStore from '../store/authStore'

export default function EditListing() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', location: '', description: '', price: '' })
  const [existingImageUrl, setExistingImageUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    getListing(id).then(({ data }) => {
      if (data.user?.id !== user?.id) {
        setForbidden(true)
      } else {
        setForm({
          title: data.title || '',
          location: data.location || '',
          description: data.description || '',
          price: data.price || '',
        })
        setExistingImageUrl(data.image_url || null)
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

  const applyFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleFileInput = (e) => applyFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    applyFile(e.dataTransfer.files[0])
  }

  const removeNewImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('location', form.location)
      fd.append('description', form.description)
      if (form.price) fd.append('price', form.price)
      if (imageFile) fd.append('image', imageFile)
      await patchListing(id, fd)
      navigate(`/listings/${id}`)
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object' && !data.detail) {
        const fieldErrors = {}
        Object.entries(data).forEach(([key, msgs]) => {
          fieldErrors[key] = Array.isArray(msgs) ? msgs[0] : msgs
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ api: data?.detail || 'Something went wrong. Please try again.' })
      }
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

  const textFields = [
    { name: 'title',    label: 'Title',           type: 'text'   },
    { name: 'location', label: 'Location',         type: 'text'   },
    { name: 'price',    label: 'Price (optional)', type: 'number' },
  ]

  const displayedImage = imagePreview || existingImageUrl

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Edit Listing</h1>

      {errors.api && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>

          {displayedImage ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={displayedImage} alt="Preview" className="w-full h-56 object-cover" />
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeNewImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white text-lg leading-none transition-colors"
                  aria-label="Remove new image"
                >
                  ×
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 text-xs bg-black/60 hover:bg-black/80 text-white px-3 py-1 rounded-full transition-colors"
              >
                Change photo
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl h-40 cursor-pointer transition-colors ${
                dragOver ? 'border-brand-cobalt bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-brand-cobalt hover:bg-blue-50'
              }`}
            >
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400">JPG, PNG, WEBP up to 10 MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {textFields.map(({ name, label, type }) => (
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
