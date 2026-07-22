import axios from 'axios'
import type { Movie, Genre, WatchProviderData, PaginatedResponse } from '../types'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '13e488e09e43d37a90b14f57bf1e2d8a'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  runtime?: number
  budget?: number
  revenue?: number
  status?: string
  tagline?: string
  production_companies?: Array<{ id: number; name: string; logo_path: string | null }>
  credits?: {
    cast: any[]
    crew: any[]
  }
}

const apiClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
})

const transformMovie = (tmdbMovie: TMDBMovie): Movie => ({
  id: tmdbMovie.id,
  title: tmdbMovie.title,
  overview: tmdbMovie.overview,
  posterPath: tmdbMovie.poster_path
    ? `${IMAGE_BASE_URL}/w342${tmdbMovie.poster_path}`
    : '/placeholder.jpg',
  backdropPath: tmdbMovie.backdrop_path
    ? `${IMAGE_BASE_URL}/w1280${tmdbMovie.backdrop_path}`
    : '/placeholder.jpg',
  releaseDate: tmdbMovie.release_date || '',
  voteAverage: tmdbMovie.vote_average,
  voteCount: tmdbMovie.vote_count,
  genreIds: tmdbMovie.genre_ids || [],
  popularity: tmdbMovie.popularity,
  runtime: tmdbMovie.runtime,
  budget: tmdbMovie.budget,
  revenue: tmdbMovie.revenue,
  status: tmdbMovie.status,
  tagline: tmdbMovie.tagline,
  productionCompanies: tmdbMovie.production_companies,
  credits: tmdbMovie.credits,
})

export const tmdbService = {
  // Trending
  async getTrendingMovies(page = 1): Promise<PaginatedResponse<Movie>> {
    const response = await apiClient.get<PaginatedResponse<TMDBMovie>>(
      '/trending/movie/week',
      {
        params: { page },
      }
    )
    return {
      ...response.data,
      results: response.data.results.map(transformMovie),
    }
  },

  // Popular
  async getPopularMovies(page = 1): Promise<PaginatedResponse<Movie>> {
    const response = await apiClient.get<PaginatedResponse<TMDBMovie>>(
      '/movie/popular',
      {
        params: { page },
      }
    )
    return {
      ...response.data,
      results: response.data.results.map(transformMovie),
    }
  },

  // Top Rated
  async getTopRatedMovies(page = 1): Promise<PaginatedResponse<Movie>> {
    const response = await apiClient.get<PaginatedResponse<TMDBMovie>>(
      '/movie/top_rated',
      {
        params: { page },
      }
    )
    return {
      ...response.data,
      results: response.data.results.map(transformMovie),
    }
  },

  // Upcoming
  async getUpcomingMovies(page = 1): Promise<PaginatedResponse<Movie>> {
    const response = await apiClient.get<PaginatedResponse<TMDBMovie>>(
      '/movie/upcoming',
      {
        params: { page },
      }
    )
    return {
      ...response.data,
      results: response.data.results.map(transformMovie),
    }
  },

  // Search
  async searchMovies(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
    const response = await apiClient.get<PaginatedResponse<TMDBMovie>>(
      '/search/movie',
      {
        params: { query, page },
      }
    )
    return {
      ...response.data,
      results: response.data.results.map(transformMovie),
    }
  },

  // Get Movie Details
  async getMovieDetails(movieId: number): Promise<Movie> {
    const response = await apiClient.get<TMDBMovie>(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits',
      },
    })
    return transformMovie(response.data)
  },

  // Get Genres
  async getGenres(): Promise<Genre[]> {
    const response = await apiClient.get<{ genres: Genre[] }>('/genre/movie/list')
    return response.data.genres
  },

  // Get Watch Providers
  async getWatchProviders(movieId: number): Promise<WatchProviderData | null> {
    try {
      const response = await apiClient.get(
        `/movie/${movieId}/watch/providers`,
        {
          params: {
            region: 'US',
          },
        }
      )

      if (response.data.results?.US) {
        const usProviders = response.data.results.US
        return {
          link: usProviders.link,
          flatrate: usProviders.flatrate?.map(
            (p: any) => ({
              providerId: p.provider_id,
              providerName: p.provider_name,
              logo: `${IMAGE_BASE_URL}/original${p.logo_path}`,
              displayPriority: p.display_priority,
            })
          ) || [],
          buy: usProviders.buy?.map(
            (p: any) => ({
              providerId: p.provider_id,
              providerName: p.provider_name,
              logo: `${IMAGE_BASE_URL}/original${p.logo_path}`,
              displayPriority: p.display_priority,
            })
          ) || [],
          rent: usProviders.rent?.map(
            (p: any) => ({
              providerId: p.provider_id,
              providerName: p.provider_name,
              logo: `${IMAGE_BASE_URL}/original${p.logo_path}`,
              displayPriority: p.display_priority,
            })
          ) || [],
        }
      }

      return null
    } catch (error) {
      console.error('Error fetching watch providers:', error)
      return null
    }
  },

  // Get Recommendations
  async getRecommendations(movieId: number, page = 1): Promise<PaginatedResponse<Movie>> {
    const response = await apiClient.get<PaginatedResponse<TMDBMovie>>(
      `/movie/${movieId}/recommendations`,
      {
        params: { page },
      }
    )
    return {
      ...response.data,
      results: response.data.results.map(transformMovie),
    }
  },

  // Discover with Filters
  async discoverMovies(filters: {
    genres?: number[]
    yearFrom?: number
    yearTo?: number
    rating?: number
    sortBy?: 'popularity' | 'rating' | 'release_date'
    sortOrder?: 'asc' | 'desc'
    page?: number
  }): Promise<PaginatedResponse<Movie>> {
    const params: any = {
      page: filters.page || 1,
    }

    if (filters.genres && filters.genres.length > 0) {
      params.with_genres = filters.genres.join(',')
    }

    if (filters.yearFrom) {
      params['release_date.gte'] = `${filters.yearFrom}-01-01`
    }

    if (filters.yearTo) {
      params['release_date.lte'] = `${filters.yearTo}-12-31`
    }

    if (filters.rating) {
      params['vote_average.gte'] = filters.rating
    }

    if (filters.sortBy) {
      const sortMap: Record<string, string> = {
        popularity: 'popularity',
        rating: 'vote_average',
        release_date: 'release_date',
      }
      params.sort_by = `${sortMap[filters.sortBy]}.${filters.sortOrder || 'desc'}`
    }

    const response = await apiClient.get<PaginatedResponse<TMDBMovie>>(
      '/discover/movie',
      { params }
    )

    return {
      ...response.data,
      results: response.data.results.map(transformMovie),
    }
  },
}
