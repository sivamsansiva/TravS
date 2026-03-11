import { create } from 'zustand'

const useListingStore = create((set) => ({
  listings:      [],
  currentPage:   1,
  totalPages:    1,
  isCreateOpen:  false,
  setListings:   (listings) => set({ listings }),
  setPage:       (page)     => set({ currentPage: page }),
  setTotal:      (total)    => set({ totalPages: total }),
  openCreate:    ()         => set({ isCreateOpen: true }),
  closeCreate:   ()         => set({ isCreateOpen: false }),
}))

export default useListingStore
