import { motion } from 'framer-motion'
import type { Movie } from '../../../types'
import { useUserStore } from '../../../stores/userStore'

interface MovieCardProps {
  movie: Movie
  onPlay?: (movie: Movie) => void
  onAddWatchlist?: (movie: Movie) => void
  variant?: 'compact' | 'detailed'
}

export function MovieCard({
  movie,
  onPlay,
  onAddWatchlist,
  variant = 'compact',
}: MovieCardProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useUserStore()
  const inWatchlist = isInWatchlist(movie.id)

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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group cursor-pointer relative rounded-lg overflow-hidden"
    >
      <div className="relative h-72 md:h-96 w-full bg-surface-secondary">
        {/* Image */}
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-surface-primary/80 backdrop-blur px-2 py-1 rounded flex items-center gap-1">
          <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-bold text-brand-gold">
            {movie.voteAverage.toFixed(1)}
          </span>
        </div>

        {/* Hover Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4"
        >
          {/* Play Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onPlay?.(movie)
            }}
            className="w-16 h-16 rounded-full bg-brand-gold text-surface-primary flex items-center justify-center shadow-2xl hover:shadow-gold/50"
          >
            <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 20 20">
              <polygon points="6,2 18,11 6,20" />
            </svg>
          </motion.button>

          {/* Watchlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWatchlistToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded backdrop-blur ${
              inWatchlist
                ? 'bg-brand-gold text-surface-primary'
                : 'bg-surface-primary/50 text-brand-gold hover:bg-surface-primary/70'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            {inWatchlist ? 'Saved' : 'Save'}
          </motion.button>
        </motion.div>
      </div>

      {/* Info Section */}
      <div className="p-3 bg-surface-secondary">
        <h3 className="font-bold text-sm text-brand-cream truncate">
          {movie.title}
        </h3>
        {variant === 'detailed' && (
          <>
            <p className="text-xs text-brand-cream/60 mt-1">
              {new Date(movie.releaseDate).getFullYear()}
            </p>
            <p className="text-xs text-brand-cream/70 line-clamp-1 mt-1">
              {movie.overview}
            </p>
          </>
        )}
      </div>
    </motion.div>
  )
}
