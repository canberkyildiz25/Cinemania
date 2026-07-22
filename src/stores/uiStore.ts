import { create } from 'zustand'

interface UIState {
  // Theme
  theme: 'dark' | 'light'

  // Modals
  isDetailModalOpen: boolean
  isPlayerModalOpen: boolean
  isSearchModalOpen: boolean

  // Navigation
  currentPage: 'home' | 'watch' | 'search' | 'library' | 'profile'

  // Notifications
  notifications: Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'info'
    duration?: number
  }>

  // Player
  isFullscreen: boolean
  isPlayerLoading: boolean

  // Actions
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void

  openDetailModal: () => void
  closeDetailModal: () => void

  openPlayerModal: () => void
  closePlayerModal: () => void

  openSearchModal: () => void
  closeSearchModal: () => void

  setCurrentPage: (page: UIState['currentPage']) => void

  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info',
    duration?: number
  ) => void
  removeNotification: (id: string) => void

  setIsFullscreen: (fullscreen: boolean) => void
  setIsPlayerLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  theme: 'dark',
  isDetailModalOpen: false,
  isPlayerModalOpen: false,
  isSearchModalOpen: false,
  currentPage: 'home',
  notifications: [],
  isFullscreen: false,
  isPlayerLoading: false,

  // Actions
  setTheme: (theme) => set({ theme }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

  openDetailModal: () => set({ isDetailModalOpen: true }),
  closeDetailModal: () => set({ isDetailModalOpen: false }),

  openPlayerModal: () => set({ isPlayerModalOpen: true }),
  closePlayerModal: () => set({ isPlayerModalOpen: false }),

  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addNotification: (message, type, duration = 3000) =>
    set((state) => {
      const id = `${Date.now()}`
      const notification = { id, message, type, duration } as const
      return {
        notifications: [...state.notifications, notification],
      }
    }),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setIsPlayerLoading: (loading) => set({ isPlayerLoading: loading }),
}))
