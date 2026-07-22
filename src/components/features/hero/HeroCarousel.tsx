import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Movie } from '../../../types'
import { useUIStore } from '../../../stores/uiStore'

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const { openPlayerModal } = useUIStore() as any

  const currentMovie = movies[currentIndex] || movies[0]

  useEffect(() => {
    if (!autoPlay || movies.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [autoPlay, movies.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setAutoPlay(false)
  }

  const handlePlayClick = () => {
    openPlayerModal()
  }

  if (!currentMovie) {
    return (
      <div className="w-full h-96 bg-surface-secondary animate-pulse rounded-lg" />
    )
  }

  return (
    <div className="relative w-full h-screen md:h-[600px] overflow-hidden bg-surface-primary">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Backdrop Image */}
          <div className="absolute inset-0">
            <img
              src={currentMovie.backdropPath}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-surface-primary via-surface-primary/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-primary to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-end md:items-center pb-12 md:pb-0">
            <div className="max-w-2xl px-6 md:px-12 py-8">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="eyebrow mb-4"
              >
                NOW FEATURED
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-display font-bold text-brand-cream mb-4 leading-tight"
              >
                {currentMovie.title}
              </motion.h1>

              {/* Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 mb-6 text-sm md:text-base"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-brand-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-brand-gold">{currentMovie.voteAverage.toFixed(1)}</span>
                </div>

                {currentMovie.releaseDate && (
                  <div>{new Date(currentMovie.releaseDate).getFullYear()}</div>
                )}

                {currentMovie.runtime && (
                  <div>{Math.floor(currentMovie.runtime / 60)}h {currentMovie.runtime % 60}m</div>
                )}
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-brand-cream/80 line-clamp-3 mb-8 max-w-xl"
              >
                {currentMovie.overview}
              </motion.p>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={handlePlayClick}
                  className="btn-primary flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <polygon points="6,2 18,11 6,20" />
                  </svg>
                  Watch Now
                </button>

                <button className="btn-secondary flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  Add to Watchlist
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {movies.slice(0, 5).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-brand-gold w-8'
                : 'bg-brand-gold/40 w-2 hover:bg-brand-gold/60'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentIndex - 1 + movies.length) % movies.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full glass hover:bg-brand-gold/20 transition-colors"
      >
        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => goToSlide((currentIndex + 1) % movies.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full glass hover:bg-brand-gold/20 transition-colors"
      >
        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
