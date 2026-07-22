import { create } from 'zustand'
import type { User, UserPreferences, WatchingSession } from '../types'

interface UserState {
  // User
  currentUser: User | null
  isAuthenticated: boolean

  // Preferences
  preferences: UserPreferences

  // Watch history
  watchHistory: WatchingSession[]
  continueWatching: WatchingSession[]

  // Watchlist
  watchlist: number[]
  ratings: Record<number, number>
  favoriteGenres: number[]

  // Actions
  setCurrentUser: (user: User | null) => void
  setIsAuthenticated: (authenticated: boolean) => void

  setPreferences: (preferences: Partial<UserPreferences>) => void
  setFavoriteGenres: (genres: number[]) => void
  setTheme: (theme: 'dark' | 'light') => void

  addToWatchlist: (movieId: number) => void
  removeFromWatchlist: (movieId: number) => void
  isInWatchlist: (movieId: number) => boolean

  rateMovie: (movieId: number, rating: number) => void
  getMovieRating: (movieId: number) => number | undefined

  addWatchingSession: (session: WatchingSession) => void
  updateWatchingSession: (id: string, session: Partial<WatchingSession>) => void
  getContinueWatchingMovies: () => WatchingSession[]

  logout: () => void
}

const defaultPreferences: UserPreferences = {
  favoriteGenres: [],
  watchedMovies: [],
  watchlist: [],
  ratings: {},
  theme: 'dark',
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  currentUser: null,
  isAuthenticated: false,
  preferences: defaultPreferences,
  watchHistory: [],
  continueWatching: [],
  watchlist: [],
  ratings: {},
  favoriteGenres: [],

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),

  setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

  setPreferences: (partialPreferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...partialPreferences },
    })),

  setFavoriteGenres: (genres) =>
    set((state) => ({
      favoriteGenres: genres,
      preferences: { ...state.preferences, favoriteGenres: genres },
    })),

  setTheme: (theme) =>
    set((state) => ({
      preferences: { ...state.preferences, theme },
    })),

  addToWatchlist: (movieId) =>
    set((state) => {
      if (state.watchlist.includes(movieId)) return state
      return {
        watchlist: [...state.watchlist, movieId],
        preferences: {
          ...state.preferences,
          watchlist: [...state.preferences.watchlist, movieId],
        },
      }
    }),

  removeFromWatchlist: (movieId) =>
    set((state) => ({
      watchlist: state.watchlist.filter((id) => id !== movieId),
      preferences: {
        ...state.preferences,
        watchlist: state.preferences.watchlist.filter((id) => id !== movieId),
      },
    })),

  isInWatchlist: (movieId) => {
    const { watchlist } = get()
    return watchlist.includes(movieId)
  },

  rateMovie: (movieId, rating) =>
    set((state) => ({
      ratings: { ...state.ratings, [movieId]: rating },
      preferences: {
        ...state.preferences,
        ratings: { ...state.preferences.ratings, [movieId]: rating },
      },
    })),

  getMovieRating: (movieId) => {
    const { ratings } = get()
    return ratings[movieId]
  },

  addWatchingSession: (session) =>
    set((state) => ({
      watchHistory: [session, ...state.watchHistory],
      continueWatching: [session, ...state.continueWatching].slice(0, 20),
    })),

  updateWatchingSession: (id, partialSession) =>
    set((state) => ({
      watchHistory: state.watchHistory.map((session) =>
        session.id === id ? { ...session, ...partialSession } : session
      ),
      continueWatching: state.continueWatching.map((session) =>
        session.id === id ? { ...session, ...partialSession } : session
      ),
    })),

  getContinueWatchingMovies: () => {
    const { continueWatching } = get()
    return continueWatching.filter((s) => !s.completed).slice(0, 10)
  },

  logout: () =>
    set({
      currentUser: null,
      isAuthenticated: false,
      preferences: defaultPreferences,
      watchHistory: [],
      continueWatching: [],
      watchlist: [],
      ratings: {},
      favoriteGenres: [],
    }),
}))
