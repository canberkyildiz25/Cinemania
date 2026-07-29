import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tmdbService } from '../services/tmdbService'
import { MovieCard } from '../components/features/movies/MovieCard'
import { Footer } from '../components/layout/Footer'
import type { Movie, Genre } from '../types'

const SORT_OPTIONS = [
  { value: 'popularity' as const, label: 'Popülerlik' },
  { value: 'rating' as const, label: 'Puan' },
  { value: 'release_date' as const, label: 'Çıkış tarihi' },
]

export function Search() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'release_date'>('popularity')
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    tmdbService
      .getGenres()
      .then(setGenres)
      .catch((err) => console.error('Failed to fetch genres:', err))
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim() === '' && selectedGenres.length === 0) {
        setMovies([])
        setTotalResults(0)
        return
      }

      try {
        setIsLoading(true)
        const result = searchQuery.trim()
          ? await tmdbService.searchMovies(searchQuery, currentPage)
          : await tmdbService.discoverMovies({
              genres: selectedGenres,
              sortBy,
              sortOrder: 'desc',
              page: currentPage,
            })

        setMovies(result.results)
        setTotalResults(result.totalResults)
        setTotalPages(Math.min(result.totalPages || 1, 500))
      } catch (err) {
        console.error('Search failed:', err)
      } finally {
        setIsLoading(false)
      }
    }, 450)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedGenres, sortBy, currentPage])

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId],
    )
    setCurrentPage(1)
  }

  const hasQuery = searchQuery.trim() !== '' || selectedGenres.length > 0

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="eyebrow mb-4">ARŞIV</p>
          <h1 className="font-display text-brand-cream mb-2">Film keşfet</h1>
          <p className="text-brand-cream/55">Bir sonraki favorini bul</p>
        </motion.div>

        {/* Arama kutusu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-10"
        >
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold/60 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Film adı yaz…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-14 pr-6 py-4 rounded-lg bg-surface-secondary/80 border border-brand-gold/25 text-brand-cream placeholder-brand-cream/35 transition-all duration-300 focus:border-brand-gold/70 focus:bg-surface-secondary focus:outline-none focus:shadow-[0_0_30px_-8px_rgba(212,175,55,0.4)]"
          />
        </motion.div>

        {/* Filtreler */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="mb-12 space-y-8"
        >
          <div>
            <p className="eyebrow mb-4">TÜRLER</p>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const active = selectedGenres.includes(genre.id)
                return (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
                      active
                        ? 'bg-brand-gold text-surface-primary border-brand-gold font-semibold shadow-[0_0_20px_-6px_rgba(212,175,55,0.7)]'
                        : 'bg-surface-secondary/60 border-brand-gold/20 text-brand-cream/80 hover:border-brand-gold/60 hover:text-brand-cream hover:-translate-y-0.5'
                    }`}
                  >
                    {genre.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">SIRALA</p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => {
                const active = sortBy === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setCurrentPage(1)
                    }}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
                      active
                        ? 'bg-brand-burgundy text-brand-cream border-brand-burgundy-lit font-semibold'
                        : 'bg-surface-secondary/60 border-brand-gold/20 text-brand-cream/80 hover:border-brand-gold/60 hover:-translate-y-0.5'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Sonuçlar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="font-display text-xl md:text-2xl text-brand-cream">
            {movies.length > 0
              ? `${totalResults.toLocaleString('tr-TR')} sonuç`
              : hasQuery && !isLoading
                ? 'Sonuç yok'
                : ''}
          </h2>
          {isLoading && (
            <span className="flex items-center gap-2.5 shrink-0">
              <span className="w-4 h-4 border-2 border-brand-gold/25 border-t-brand-gold rounded-full animate-reel-spin" />
              <span className="eyebrow">ARANIYOR</span>
            </span>
          )}
        </div>

        {movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-14">
              {movies.map((movie, idx) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: Math.min(idx * 0.04, 0.35), duration: 0.45 }}
                >
                  <MovieCard movie={movie} onPlay={(m) => navigate(`/watch/${m.id}`)} />
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary !py-2 !px-4 !text-xs disabled:opacity-35"
              >
                ← Önceki
              </button>

              <span className="font-mono text-xs text-brand-cream/60 tracking-wider">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="btn-secondary !py-2 !px-4 !text-xs disabled:opacity-35"
              >
                Sonraki →
              </button>
            </div>
          </>
        ) : (
          !isLoading && (
            <div className="text-center py-20">
              <p className="text-brand-cream/45">
                {hasQuery ? 'Filtreleri değiştirmeyi dene' : 'Aramaya başlamak için bir film adı yaz'}
              </p>
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  )
}
