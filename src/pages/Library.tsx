import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../stores/userStore'
import { tmdbService } from '../services/tmdbService'
import { MovieCard } from '../components/features/movies/MovieCard'
import type { Movie } from '../types'

type LibraryView = 'watchlist' | 'watched' | 'ratings'

export function Library() {
  const { watchlist, watchHistory, ratings, isAuthenticated } = useUserStore()
  const [view, setView] = useState<LibraryView>('watchlist')
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchMovies = async () => {
      try {
        setIsLoading(true)

        let movieIds: number[] = []

        if (view === 'watchlist') {
          movieIds = watchlist
        } else if (view === 'watched') {
          movieIds = watchHistory
            .filter((session) => session.completed)
            .map((session) => session.movieId)
            .slice(0, 20)
        } else if (view === 'ratings') {
          movieIds = Object.keys(ratings).map((id) => parseInt(id))
        }

        if (movieIds.length === 0) {
          setMovies([])
          setIsLoading(false)
          return
        }

        // Fetch movie details in batches
        const movieDetails = await Promise.all(
          movieIds.slice(0, 20).map((id) =>
            tmdbService.getMovieDetails(id).catch(() => null)
          )
        )

        setMovies(movieDetails.filter((m) => m !== null) as Movie[])
      } catch (err) {
        console.error('Failed to fetch library movies:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [view, watchlist, watchHistory, ratings, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-brand-cream mb-4">
            Sign in to view your library
          </h1>
          <button className="btn-primary">Sign In</button>
        </div>
      </div>
    )
  }

  const views = [
    { id: 'watchlist' as const, label: 'Watchlist', count: watchlist.length },
    {
      id: 'watched' as const,
      label: 'Watched',
      count: watchHistory.filter((s) => s.completed).length,
    },
    { id: 'ratings' as const, label: 'Your Ratings', count: Object.keys(ratings).length },
  ]

  return (
    <div className="min-h-screen bg-surface-primary pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-cream mb-2">
            My Library
          </h1>
          <p className="text-brand-cream/60">Your personal movie collection</p>
        </motion.div>

        {/* View Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-12 border-b border-brand-gold/20 pb-4"
        >
          {views.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`px-4 py-2 font-semibold transition-all relative ${
                view === tab.id
                  ? 'text-brand-gold'
                  : 'text-brand-cream/60 hover:text-brand-cream'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-sm text-brand-cream/40">({tab.count})</span>
              {view === tab.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {movies.map((movie, idx) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="relative">
                  <MovieCard movie={movie} />
                  {view === 'ratings' && ratings[movie.id] && (
                    <div className="absolute top-2 left-2 bg-brand-gold text-surface-primary px-2 py-1 rounded font-bold">
                      ★ {ratings[movie.id]}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-brand-gold/30 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-brand-cream/60 text-lg">
              {view === 'watchlist' && "You haven't added any movies yet"}
              {view === 'watched' && "You haven't watched any movies yet"}
              {view === 'ratings' && "You haven't rated any movies yet"}
            </p>
            <button className="btn-secondary mt-6">Browse Movies</button>
          </div>
        )}
      </div>
    </div>
  )
}
