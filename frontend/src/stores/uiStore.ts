import { create } from 'zustand'

interface UiState {
  selectedBidId: string | null
  sidebarCollapsed: boolean
  setSelectedBidId: (id: string | null) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  selectedBidId: null,
  sidebarCollapsed: false,
  setSelectedBidId: (id) => set({ selectedBidId: id }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))
