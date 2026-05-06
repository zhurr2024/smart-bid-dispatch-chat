import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  selectedBidId: string | null
  sidebarCollapsed: boolean
  chatEnabled: boolean
  setSelectedBidId: (id: string | null) => void
  toggleSidebar: () => void
  setChatEnabled: (enabled: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedBidId: null,
      sidebarCollapsed: false,
      chatEnabled: false,
      setSelectedBidId: (id) => set({ selectedBidId: id }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setChatEnabled: (enabled) => set({ chatEnabled: enabled }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ chatEnabled: state.chatEnabled }),
    }
  )
)
