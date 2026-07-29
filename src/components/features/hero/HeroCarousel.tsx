import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { tmdbService } from '../../../services/tmdbService'
import { useUserStore } from '../../../stores/userStore'
import { TrailerModal } from '../movies/TrailerModal'
import type { Movie } from '../../../types'

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const navigate = useNavigate()
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useUserStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [trailerKeys, setTrailerKeys] = useState<Record<number, string>>({})
  const [showTrailer, setShowTrailer] = useState(false)

  const currentMovie = movies[currentIndex] ?? movies[0]

  useEffect(() => {
    let cancelled = false

    const fetchTrailers = async () => {
      const entries = await Promise.all(
        movies.map(async (movie) => {
          const videos = await tmdbService.getMovieVideos(movie.id)
          const trailer =
            videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
            videos.find((v) => v.type === 'Teaser' && v.site === 'YouTube')
          return trailer ? ([movie.id, trailer.key] as const) : null
        }),
      )

      if (!cancelled) {
        setTrailerKeys(Object.fromEntries(entries.filter(Boolean) as Array<readonly [number, string]>))
      }
    }

    if (movies.length > 0) fetchTrailers()
    return () => {
      cancelled = true
    }
  }, [movies])

  useEffect(() => {
    if (!autoPlay || movies.length < 2 || showTrailer) return
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % movies.length), 7000)
    return () => clearInterval(timer)
  }, [autoPlay, movies.length, showTrailer])

  const goToSlide = (index: number) => {
    setCurrentIndex((index + movies.length) % movies.length)
    setAutoPlay(false)
  }

  if (!currentMovie) {
    return <div className="w-full h-[70vh] bg-surface-secondary animate-pulse" />
  }

  const year = currentMovie.releaseDate ? new Date(currentMovie.releaseDate).getFullYear() : null
  const trailerKey = trailerKeys[currentMovie.id]
  const inWatchlist = isInWatchlist(currentMovie.id)
  const openMovie = () => navigate(`/watch/${currentMovie.id}`)

  return (
    <>
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <TrailerModal
            trailerKey={trailerKey}
            title={currentMovie.title}
            onClose={() => setShowTrailer(false)}
          />
        )}
      </AnimatePresence>

      <section className="relative w-full h-[85vh] md:h-[78vh] overflow-hidden">
        {/* Arka plan — tüm alan tıklanabilir, üstteki kontroller kendi tıklamalarını yutar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <img
              src={currentMovie.backdropPath}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Katmanlı karartma */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface-primary via-surface-primary/75 to-surface-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-transparent to-surface-primary/50" />

        {/* Tıklama katmanı — görselin herhangi bir yerine basınca film sayfası açılır */}
        <button
          onClick={openMovie}
          aria-label={`${currentMovie.title} sayfasını aç`}
          className="absolute inset-0 z-10 w-full h-full"
        />

        {/* İçerik — tıklama katmanının üstünde */}
        <div className="relative z-20 h-full flex items-end md:items-center pointer-events-none">
          <div className="max-w-2xl px-6 md:px-14 pb-20 md:pb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMovie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="eyebrow mb-5">VITRINDE</p>

                <h1
                  onClick={openMovie}
                  className="font-display text-brand-cream mb-5 pointer-events-auto cursor-pointer transition-colors duration-300 hover:text-brand-gold"
                >
                  {currentMovie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 font-mono text-xs tracking-wider text-brand-cream/65">
                  <span className="inline-flex items-center gap-1.5 text-brand-gold">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {currentMovie.voteAverage.toFixed(1)}
                  </span>
                  {year && <span>{year}</span>}
                  <span>{currentMovie.voteCount.toLocaleString('tr-TR')} OY</span>
                </div>

                <p className="text-brand-cream/75 line-clamp-3 mb-9 max-w-xl leading-relaxed">
                  {currentMovie.overview}
                </p>

                <div className="flex flex-wrap gap-3 pointer-events-auto">
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="btn-primary"
                    disabled={!trailerKey}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <polygon points="6,2 18,11 6,20" />
                    </svg>
                    Fragmanı izle
                  </button>

                  <button onClick={openMovie} className="btn-secondary">
                    Detaylar
                  </button>

                  <button
                    onClick={() =>
                      inWatchlist ? removeFromWatchlist(currentMovie.id) : addToWatchlist(currentMovie.id)
                    }
                    className="btn-secondary"
                    aria-label={inWatchlist ? 'Listemden çıkar' : 'Listeme ekle'}
                  >
                    {inWatchlist ? '✓' : '+'}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slayt göstergeleri */}
        <div className="absolute bottom-8 left-6 md:left-14 z-30 flex items-center gap-3">
          {movies.map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => goToSlide(index)}
              aria-label={`${index + 1}. filme geç`}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? 'w-10 bg-brand-gold shadow-[0_0_12px_rgba(212,175,55,0.8)]'
                  : 'w-5 bg-brand-cream/30 hover:bg-brand-cream/60'
              }`}
            />
          ))}
          <span className="ml-2 font-mono text-[0.7rem] text-brand-cream/40 tracking-widest">
            {String(currentIndex + 1).padStart(2, '0')} / {String(movies.length).padStart(2, '0')}
          </span>
        </div>

        {/* Yön okları */}
        <button
          onClick={() => goToSlide(currentIndex - 1)}
          aria-label="Önceki film"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full glass text-brand-gold transition-all duration-300 hover:bg-brand-gold/20 hover:-translate-x-0.5 hidden md:block"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => goToSlide(currentIndex + 1)}
          aria-label="Sonraki film"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full glass text-brand-gold transition-all duration-300 hover:bg-brand-gold/20 hover:translate-x-0.5 hidden md:block"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>
    </>
  )
}
