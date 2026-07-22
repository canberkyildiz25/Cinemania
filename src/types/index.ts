// Movie types
export interface Movie {
  id: number
  title: string
  overview: string
  posterPath: string
  backdropPath: string
  releaseDate: string
  voteAverage: number
  voteCount: number
  genreIds: number[]
  popularity: number
  runtime?: number
  budget?: number
  revenue?: number
  status?: string
  tagline?: string
  productionCompanies?: Array<{ id: number; name: string; logo_path: string | null }>
  credits?: {
    cast: Cast[]
    crew: Crew[]
  }
}

export interface Cast {
  id: number
  name: string
  character: string
  profilePath: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profilePath: string | null
}

// Watch provider types
export interface WatchProvider {
  providerId: number
  providerName: string
  logo: string
  displayPriority: number
}

export interface WatchProviderData {
  link?: string
  flatrate?: WatchProvider[]
  buy?: WatchProvider[]
  rent?: WatchProvider[]
}

// Genre types
export interface Genre {
  id: number
  name: string
}

// User types
export interface User {
  id: string
  email: string
  username: string
  profileImage?: string
  createdAt: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  favoriteGenres: number[]
  watchedMovies: number[]
  watchlist: number[]
  ratings: Record<number, number>
  theme: 'dark' | 'light'
}

// Watch history types
export interface WatchingSession {
  id: string
  userId: string
  movieId: number
  currentTime: number
  duration: number
  quality: string
  subtitles: string
  startedAt: Date
  lastWatchedAt: Date
  completed: boolean
}

// Video player types
export interface VideoPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  quality: '360p' | '480p' | '720p' | '1080p' | '4K'
  subtitle: string
  isFullscreen: boolean
  playbackRate: 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  results: T[]
  page: number
  totalPages: number
  totalResults: number
}

// Search types
export interface SearchFilters {
  genres: number[]
  yearFrom?: number
  yearTo?: number
  rating?: number
  sortBy: 'popularity' | 'rating' | 'release_date'
  sortOrder: 'asc' | 'desc'
}
