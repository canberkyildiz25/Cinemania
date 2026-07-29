import { useRef, useState, useEffect } from 'react'
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
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [movies])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollTo({
      left: el.scrollLeft + (direction === 'left' ? -amount : amount),
      behavior: 'smooth',
    })
  }

  if (isLoading) {
    return (
      <section className="py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-brand-cream mb-6 rule-gold">{title}</h2>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-40 md:w-48 lg:w-52 h-60 md:h-72 lg:h-80 rounded-lg bg-surface-secondary animate-pulse"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (movies.length === 0) return null

  return (
    <section className="py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div className="rule-gold">
            <h2 className="font-display text-2xl md:text-3xl text-brand-cream">{title}</h2>
            {subtitle && <p className="text-brand-cream/55 text-sm mt-1.5">{subtitle}</p>}
          </div>

          {/* okları başlık hizasında tut */}
          <div className="hidden md:flex gap-2 shrink-0">
            <CarouselArrow direction="left" disabled={!canScrollLeft} onClick={() => scroll('left')} />
            <CarouselArrow direction="right" disabled={!canScrollRight} onClick={() => scroll('right')} />
          </div>
        </div>

        <div className="relative">
          {/* kenarlarda içeriğin eridiği maske */}
          {canScrollLeft && (
            <div className="absolute left-0 inset-y-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-surface-primary to-transparent" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 inset-y-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-surface-primary to-transparent" />
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-1 px-1"
          >
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 w-40 md:w-48 lg:w-52"
              >
                <MovieCard movie={movie} onPlay={onPlayMovie} onAddWatchlist={onAddWatchlist} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CarouselArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'left' | 'right'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Geri kaydır' : 'İleri kaydır'}
      className={`p-2 rounded-full border transition-all duration-300 ${
        disabled
          ? 'border-brand-gold/10 text-brand-gold/20'
          : 'border-brand-gold/30 text-brand-gold hover:bg-brand-gold/15 hover:border-brand-gold/70'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  )
}
