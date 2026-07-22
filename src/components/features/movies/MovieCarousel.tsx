import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Movie } from '../../../types'
import { MovieCard } from './MovieCard'

interface MovieCarouselProps {
  title: string
  subtitle?: string
  movies: Movie[]
  onPlayMovie?: (movie: Movie) => void
  onAddWatchlist?: (movie: Movie) => void
  isLoading?: boolean
}

export function MovieCarousel({
  title,
  subtitle,
  movies,
  onPlayMovie,
  onAddWatchlist,
  isLoading = false,
}: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      const newScrollLeft =
        scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      })

      setTimeout(() => checkScroll(), 300)
    }
  }

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 50)
    }
  }

  if (isLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-cream mb-6">
            {title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-72 md:h-96 bg-surface-secondary animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-cream">
              {title}
            </h2>
            {subtitle && (
              <p className="text-brand-cream/60 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <button className="text-brand-gold hover:text-brand-cream transition-colors text-sm hidden md:block">
            View All →
          </button>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-40 md:w-48 lg:w-56"
              >
                <MovieCard
                  movie={movie}
                  onPlay={onPlayMovie}
                  onAddWatchlist={onAddWatchlist}
                />
              </motion.div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full glass hover:bg-brand-gold/20 transition-colors"
            >
              <svg
                className="w-6 h-6 text-brand-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
          )}

          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full glass hover:bg-brand-gold/20 transition-colors"
            >
              <svg
                className="w-6 h-6 text-brand-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  )
}
