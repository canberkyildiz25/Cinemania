import { motion } from 'framer-motion'
import type { Movie } from '../../../types'
import { useUserStore } from '../../../stores/userStore'

interface MovieCardProps {
  movie: Movie
  onPlay?: (movie: Movie) => void
  onAddWatchlist?: (movie: Movie) => void
  variant?: 'compact' | 'detailed'
}

export function MovieCard({ movie, onPlay, onAddWatchlist, variant = 'compact' }: MovieCardProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useUserStore()
  const inWatchlist = isInWatchlist(movie.id)
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inWatchlist) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie.id)
    }
    onAddWatchlist?.(movie)
  }

  return (
    <motion.div
      onClick={() => onPlay?.(movie)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer"
    >
      <div className="poster-frame relative h-60 md:h-72 lg:h-80">
        <img
          src={movie.posterPath}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
        />

        {/* Puan rozeti */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2 py-1 rounded-md bg-surface-primary/85 backdrop-blur-sm border border-brand-gold/25">
          <svg className="w-3 h-3 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[0.7rem] font-mono font-semibold text-brand-gold">
            {movie.voteAverage.toFixed(1)}
          </span>
        </div>

        {/* Hover katmanı */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-surface-primary/55 backdrop-blur-[2px]" />

          <span className="relative w-14 h-14 rounded-full bg-brand-gold text-surface-primary flex items-center justify-center shadow-[0_0_28px_rgba(212,175,55,0.6)] transition-transform duration-300 group-hover:scale-110">
            <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 20 20">
              <polygon points="6,2 18,11 6,20" />
            </svg>
          </span>

          <button
            onClick={handleWatchlistToggle}
            className={`relative text-[0.7rem] font-mono tracking-wider px-3.5 py-1.5 rounded-md border transition-all duration-300 ${
              inWatchlist
                ? 'bg-brand-gold text-surface-primary border-brand-gold'
                : 'border-brand-cream/40 text-brand-cream hover:border-brand-gold hover:text-brand-gold'
            }`}
          >
            {inWatchlist ? '✓ LISTEMDE' : '+ LISTEME'}
          </button>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="font-semibold text-sm text-brand-cream line-clamp-1 transition-colors group-hover:text-brand-gold">
          {movie.title}
        </h3>
        {year && (
          <p className="text-[0.7rem] font-mono text-brand-cream/45 mt-1 tracking-wider">{year}</p>
        )}
        {variant === 'detailed' && (
          <p className="text-xs text-brand-cream/60 line-clamp-2 mt-1.5 leading-snug">{movie.overview}</p>
        )}
      </div>
    </motion.div>
  )
}
