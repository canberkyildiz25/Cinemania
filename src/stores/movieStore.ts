import { create } from 'zustand'
import type { Movie, SearchFilters } from '../types'

interface MovieState {
  // Data
  allMovies: Movie[]
  filteredMovies: Movie[]
  trendingMovies: Movie[]
  recommendedMovies: Movie[]
  currentMovie: Movie | null

  // UI State
  isLoading: boolean
  error: string | null

  // Filters
  filters: SearchFilters
  selectedGenres: number[]
  searchQuery: string

  // Actions
  setAllMovies: (movies: Movie[]) => void
  setFilteredMovies: (movies: Movie[]) => void
  setTrendingMovies: (movies: Movie[]) => void
  setRecommendedMovies: (movies: Movie[]) => void
  setCurrentMovie: (movie: Movie | null) => void

  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  setFilters: (filters: Partial<SearchFilters>) => void
  setSelectedGenres: (genres: number[]) => void
  setSearchQuery: (query: string) => void

  resetFilters: () => void
}

const defaultFilters: SearchFilters = {
  genres: [],
  sortBy: 'popularity',
  sortOrder: 'desc',
}

export const useMovieStore = create<MovieState>((set) => ({
  // Initial state
  allMovies: [],
  filteredMovies: [],
  trendingMovies: [],
  recommendedMovies: [],
  currentMovie: null,
  isLoading: false,
  error: null,
  filters: defaultFilters,
  selectedGenres: [],
  searchQuery: '',

  // Actions
  setAllMovies: (movies) => set({ allMovies: movies }),
  setFilteredMovies: (movies) => set({ filteredMovies: movies }),
  setTrendingMovies: (movies) => set({ trendingMovies: movies }),
  setRecommendedMovies: (movies) => set({ recommendedMovies: movies }),
  setCurrentMovie: (movie) => set({ currentMovie: movie }),

  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  setFilters: (partialFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...partialFilters },
    })),

  setSelectedGenres: (genres) =>
    set((state) => ({
      selectedGenres: genres,
      filters: { ...state.filters, genres },
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  resetFilters: () =>
    set({
      filters: defaultFilters,
      selectedGenres: [],
      searchQuery: '',
    }),
}))
