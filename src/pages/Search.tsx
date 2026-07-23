import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { tmdbService } from '../services/tmdbService'
import { MovieCard } from '../components/features/movies/MovieCard'
import type { Movie, Genre } from '../types'

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'release_date'>('popularity')
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await tmdbService.getGenres()
        setGenres(genresData)
      } catch (err) {
        console.error('Failed to fetch genres:', err)
      }
    }
    fetchGenres()
  }, [])

  // Search movies
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedGenres, sortBy, currentPage])

  const handleSearch = async () => {
    if (searchQuery.trim() === '' && selectedGenres.length === 0) {
      setMovies([])
      return
    }

    try {
      setIsLoading(true)

      let result

      if (searchQuery.trim()) {
        result = await tmdbService.searchMovies(searchQuery, currentPage)
      } else {
        result = await tmdbService.discoverMovies({
          genres: selectedGenres,
          sortBy,
          sortOrder: 'desc',
          page: currentPage,
        })
      }

      setMovies(result.results)
      setTotalResults(result.totalResults)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    )
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-surface-primary pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-cream mb-2">
            Discover Movies
          </h1>
          <p className="text-brand-cream/60">Find your next favorite film</p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full px-6 py-4 bg-surface-secondary border-2 border-brand-gold/30 rounded text-brand-cream placeholder-brand-cream/40 focus:border-brand-gold focus:outline-none transition-colors"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          {/* Genre Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-display font-bold text-brand-cream mb-4">
              Genres
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                    selectedGenres.includes(genre.id)
                      ? 'bg-brand-gold text-surface-primary'
                      : 'bg-surface-secondary border-2 border-brand-gold/30 text-brand-cream hover:border-brand-gold'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-display font-bold text-brand-cream mb-4">
              Sort By
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'popularity' as const, label: 'Popularity' },
                { value: 'rating' as const, label: 'Rating' },
                { value: 'release_date' as const, label: 'Release Date' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded font-semibold transition-all ${
                    sortBy === option.value
                      ? 'bg-brand-gold text-surface-primary'
                      : 'bg-surface-secondary border-2 border-brand-gold/30 text-brand-cream hover:border-brand-gold'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-brand-cream">
              {movies.length > 0
                ? `Showing ${movies.length} of ${totalResults.toLocaleString()} results`
                : 'No movies found'}
            </h2>
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                <span className="text-brand-cream/60">Searching...</span>
              </div>
            )}
          </div>

          {movies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
                {movies.map((movie, idx) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-brand-gold/30 text-brand-gold rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-gold transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-brand-cream">Page</span>
                  <input
                    type="number"
                    min="1"
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 px-2 py-1 bg-surface-secondary border-2 border-brand-gold/30 text-brand-cream text-center rounded"
                  />
                  <span className="text-brand-cream/60">of ~{Math.ceil(totalResults / 20)}</span>
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 border-2 border-brand-gold/30 text-brand-gold rounded hover:border-brand-gold transition-colors"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            !isLoading && (
              <div className="text-center py-12">
                <p className="text-brand-cream/60 text-lg">
                  {searchQuery || selectedGenres.length > 0
                    ? 'Try adjusting your filters'
                    : 'Search for movies to get started'}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
