import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../stores/userStore'
import { tmdbService } from '../services/tmdbService'
import { MovieCard } from '../components/features/movies/MovieCard'
import { Footer } from '../components/layout/Footer'
import type { Movie } from '../types'

type LibraryView = 'watchlist' | 'ratings'

export function Library() {
  const navigate = useNavigate()
  const { watchlist, ratings } = useUserStore()
  const [view, setView] = useState<LibraryView>('watchlist')
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const movieIds = view === 'watchlist' ? watchlist : Object.keys(ratings).map(Number)

    if (movieIds.length === 0) {
      setMovies([])
      return
    }

    let cancelled = false

    const fetchMovies = async () => {
      try {
        setIsLoading(true)
        const details = await Promise.all(
          movieIds.slice(0, 30).map((id) => tmdbService.getMovieDetails(id).catch(() => null)),
        )
        if (!cancelled) setMovies(details.filter(Boolean) as Movie[])
      } catch (err) {
        console.error('Failed to fetch library movies:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchMovies()
    return () => {
      cancelled = true
    }
  }, [view, watchlist, ratings])

  const tabs = [
    { id: 'watchlist' as const, label: 'Listem', count: watchlist.length },
    { id: 'ratings' as const, label: 'Puanladıklarım', count: Object.keys(ratings).length },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="eyebrow mb-4">KOLEKSIYON</p>
          <h1 className="font-display text-brand-cream mb-2">Kitaplığım</h1>
          <p className="text-brand-cream/55">Kaydettiğin ve puanladığın filmler</p>
        </motion.div>

        <div className="flex gap-8 mb-10 border-b border-brand-gold/15">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`relative pb-4 text-sm font-medium transition-colors duration-300 ${
                view === tab.id ? 'text-brand-gold' : 'text-brand-cream/55 hover:text-brand-cream'
              }`}
            >
              {tab.label}
              <span className="ml-2 font-mono text-xs text-brand-cream/35">{tab.count}</span>
              {view === tab.id && (
                <motion.span
                  layoutId="library-underline"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold to-brand-gold/30"
                />
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-reel-spin" />
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {movies.map((movie, idx) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: Math.min(idx * 0.04, 0.35), duration: 0.45 }}
                className="relative"
              >
                <MovieCard movie={movie} onPlay={(m) => navigate(`/watch/${m.id}`)} />
                {view === 'ratings' && ratings[movie.id] && (
                  <span className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 px-2 py-1 rounded-md bg-brand-gold text-surface-primary text-[0.7rem] font-mono font-bold">
                    ★ {ratings[movie.id]}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg
              className="w-14 h-14 text-brand-gold/25 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 4a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V4z" />
            </svg>
            <p className="text-brand-cream/50 mb-7">
              {view === 'watchlist'
                ? 'Henüz listene film eklemedin'
                : 'Henüz hiçbir filme puan vermedin'}
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Filmlere göz at
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
