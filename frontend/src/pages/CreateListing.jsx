import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createListing } from '../api/listingsApi'
import useAuthStore from '../store/authStore'

const INITIAL = { title: '', location: '', description: '', price: '' }

export default function CreateListing({ onClose, onSuccess }) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [form, setForm] = useState(INITIAL)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose ? onClose() : navigate(-1) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!imageFile) e.image = 'Please select an image'
    if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters'
    if (form.price && isNaN(parseFloat(form.price))) e.price = 'Price must be a number'
    return e
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const applyFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, image: undefined }))
  }

  const handleFileInput = (e) => applyFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    applyFile(e.dataTransfer.files[0])
  }

  const removeImage = () => {
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
      fd.append('image', imageFile)
      await createListing(fd)
      onSuccess ? onSuccess() : navigate('/')
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

  const textFields = [
    { name: 'title',    label: 'Title',           type: 'text',   placeholder: 'Amazing Beach Hike Trail' },
    { name: 'location', label: 'Location',         type: 'text',   placeholder: 'Bali, Indonesia' },
    { name: 'price',    label: 'Price (optional)', type: 'number', placeholder: 'Leave blank if free' },
  ]

  const close = () => onClose ? onClose() : navigate(-1)

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-4"
      onClick={close}
    >
      {/* Modal card — wide two-column layout */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header (full width) ── */}
        <div className="relative flex items-center justify-center border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Share an Experience</h2>
          <button
            onClick={close}
            className="absolute right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ── Body: left form | right image ── */}
        <div className="flex flex-1 min-h-0">

          {/* LEFT — form fields (scrollable) */}
          <div className="flex flex-col flex-1 overflow-y-auto px-6 py-5 border-r border-gray-100">
            {/* User identity */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-brand-cobalt flex items-center justify-center text-white font-bold text-base select-none">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{user?.username}</p>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5 mt-0.5">
                  🌍 Public
                </span>
              </div>
            </div>

            {errors.api && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
                {errors.api}
              </div>
            )}

            <form id="create-form" onSubmit={handleSubmit} className="space-y-4 flex-1">
              {textFields.map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {label}
                  </label>
                  <input
                    name={name} type={type} value={form[name]}
                    onChange={handleChange} placeholder={placeholder}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-colors ${
                      errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Description
                </label>
                <textarea
                  name="description" value={form.description}
                  onChange={handleChange} rows={5}
                  placeholder="Describe the experience… (min. 20 characters)"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-colors ${
                    errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </form>
          </div>

          {/* RIGHT — image upload panel */}
          <div className="flex flex-col w-[46%] flex-shrink-0 px-5 py-5 bg-gray-50 rounded-br-2xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Photo</p>

            {/* Zone fills remaining height */}
            <div className="flex-1 min-h-0">
              {imagePreview ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white text-lg leading-none transition-colors"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 text-xs bg-black/60 hover:bg-black/80 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl w-full h-full cursor-pointer transition-colors ${
                    dragOver
                      ? 'border-brand-cobalt bg-blue-50'
                      : errors.image
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-brand-cobalt hover:bg-blue-50'
                  }`}
                >
                  <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-brand-cobalt">Click to upload</p>
                    <p className="text-xs text-gray-400 mt-0.5">or drag & drop here</p>
                  </div>
                  <p className="text-xs text-gray-400">JPG, PNG, WEBP · max 10 MB</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
            {errors.image && <p className="text-red-500 text-xs mt-2">{errors.image}</p>}
          </div>
        </div>

        {/* ── Footer (full width) ── */}
        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <button
            type="submit"
            form="create-form"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-brand-cobalt text-white font-semibold text-sm hover:bg-brand-royal transition-colors disabled:opacity-60"
          >
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  )
}
