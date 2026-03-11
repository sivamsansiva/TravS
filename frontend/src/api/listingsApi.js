import api from './axiosInstance'

export const getListings    = (params)      => api.get('/listings/', { params })
export const getListing     = (id)          => api.get(`/listings/${id}/`)
export const createListing  = (data)        => api.post('/listings/', data)
export const updateListing  = (id, data)    => api.put(`/listings/${id}/`, data)
export const patchListing   = (id, data)    => api.patch(`/listings/${id}/`, data)
export const deleteListing  = (id)          => api.delete(`/listings/${id}/`)
export const likeListing    = (id)          => api.post(`/listings/${id}/like/`)
export const saveListing    = (id)          => api.post(`/listings/${id}/save/`)
export const getSavedListings = ()          => api.get('/listings/saved/')
