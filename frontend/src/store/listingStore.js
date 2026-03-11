import { create } from 'zustand'

const useListingStore = create((set) => ({
  listings:    [],
  currentPage: 1,
  totalPages:  1,
  setListings: (listings) => set({ listings }),
  setPage:     (page)     => set({ currentPage: page }),
  setTotal:    (total)    => set({ totalPages: total }),
}))

export default useListingStore
