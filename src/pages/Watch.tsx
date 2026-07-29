import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tmdbService } from '../services/tmdbService'
import { useMovieStore } from '../stores/movieStore'
import { useUserStore } from '../stores/userStore'
import type { Movie } from '../types'

export function Watch() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { allMovies } = useMovieStore() as any
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [watchLink, setWatchLink] = useState<string | null>(null)
  const [providers, setProviders] = useState<any>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [selectedCastMember, setSelectedCastMember] = useState<any>(null)
  const { addToWatchlist, isInWatchlist, rateMovie, getMovieRating } = useUserStore()
  const inWatchlist = movie ? isInWatchlist(movie.id) : false
  const rating = movie ? getMovieRating(movie.id) : undefined

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return
      try {
        setIsLoading(true)

        // Check if it's an archive movie (free movies from Archive.org)
        const archiveMovie = allMovies?.find((m: Movie) => m.id.toString() === id && m.archiveId)
        if (archiveMovie) {
          setMovie(archiveMovie)
          return
        }

        const movieId = parseInt(id)
        const [movieData, recsData, videosData, watchLinkData, providersData] = await Promise.all([
          tmdbService.getMovieDetails(movieId),
          tmdbService.getRecommendations(movieId),
          tmdbService.getMovieVideos(movieId),
          tmdbService.getWatchProviderLink(movieId),
          tmdbService.getWatchProviders(movieId),
        ])
        setMovie(movieData)
        setRecommendations(recsData.results.slice(0, 6))

        const trailer = videosData.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        )
        if (trailer) {
          setTrailerKey(trailer.key)
        }

        setWatchLink(watchLinkData)
        setProviders(providersData)
      } catch (err) {
        console.error('Failed to fetch movie:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovie()
  }, [id, allMovies])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-cream">Loading movie...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-brand-cream mb-4">
            Movie not found
          </h1>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Info */}
          <div className="md:col-span-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-cream mb-4">
              {movie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm md:text-base text-brand-cream/70">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-brand-gold font-semibold">{movie.voteAverage.toFixed(1)}</span>
              </div>
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              {movie.runtime && <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>}
              <span className="text-brand-gold font-semibold">
                {movie.voteCount.toLocaleString()} votes
              </span>
            </div>

            {/* Genres */}
            {movie.genreIds && movie.genreIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genreIds.map((genreId) => (
                  <span
                    key={genreId}
                    className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-sm"
                  >
                    Genre {genreId}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-brand-cream/80 text-lg leading-relaxed mb-8">
              {movie.overview}
            </p>

            {/* Additional Info */}
            {movie.tagline && (
              <div className="mb-6 p-4 bg-surface-secondary border-l-4 border-brand-gold">
                <p className="text-brand-gold italic">"{movie.tagline}"</p>
              </div>
            )}

            {/* Cast Modal */}
            {selectedCastMember && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-surface-secondary rounded-lg max-w-sm w-full p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-display font-bold text-brand-cream">
                      {selectedCastMember.name}
                    </h2>
                    <button
                      onClick={() => setSelectedCastMember(null)}
                      className="text-brand-gold hover:text-brand-gold/80 cursor-pointer"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  {selectedCastMember.profile_path && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${selectedCastMember.profile_path}`}
                        alt={selectedCastMember.name}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  <p className="text-brand-cream/70 mb-2">
                    <span className="font-semibold text-brand-cream">Character:</span> {selectedCastMember.character}
                  </p>
                </div>
              </div>
            )}

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-display font-bold text-brand-cream mb-4">
                  Cast
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movie.credits.cast.slice(0, 8).map((actor: any) => (
                    <button
                      key={actor.id}
                      onClick={() => setSelectedCastMember(actor)}
                      className="text-left p-3 bg-surface-secondary rounded-lg hover:bg-surface-secondary/80 transition-colors cursor-pointer"
                    >
                      <p className="text-brand-cream font-semibold text-sm">{actor.name}</p>
                      <p className="text-brand-cream/60 text-xs">{actor.character}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Crew */}
            {movie.credits?.crew && movie.credits.crew.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-display font-bold text-brand-cream mb-4">
                  Crew
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {movie.credits.crew
                    .filter((person: any) => ['Director', 'Producer', 'Screenplay', 'Cinematography'].includes(person.job))
                    .slice(0, 6)
                    .map((person: any) => (
                      <button
                        key={person.id}
                        onClick={() => setSelectedCastMember(person)}
                        className="text-left p-3 bg-surface-secondary rounded-lg hover:bg-surface-secondary/80 transition-colors cursor-pointer text-sm"
                      >
                        <p className="text-brand-cream font-semibold">{person.name}</p>
                        <p className="text-brand-cream/60 text-xs">{person.job}</p>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Production */}
            {movie.productionCompanies && movie.productionCompanies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-display font-bold text-brand-cream mb-3">
                  Production
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.productionCompanies.slice(0, 3).map((company) => (
                    <div
                      key={company.id}
                      className="px-3 py-2 bg-surface-secondary text-brand-cream/70 rounded text-sm"
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Actions */}
          <div>
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg overflow-hidden border border-brand-gold/20"
            >
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="w-full h-auto"
              />
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Watch Trailer Button */}
              {trailerKey && (
                <>
                  {showTrailer && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                      <div className="w-full max-w-4xl">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                          <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-brand-gold/20 hover:bg-brand-gold/40 rounded-full transition-colors"
                          >
                            <svg className="w-6 h-6 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${trailerKey}`}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="w-full py-3 px-4 bg-brand-burgundy text-brand-cream rounded font-semibold hover:bg-brand-burgundy/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <polygon points="6,2 18,11 6,20" />
                    </svg>
                    Watch Trailer
                  </button>
                </>
              )}

              {/* Where to Watch Button */}
              {/* Platforms Section */}
              {providers && providers.flatrate && providers.flatrate.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold text-brand-cream mb-3">📺 Available on</p>
                  <div className="flex flex-wrap gap-2">
                    {providers.flatrate.map((p: any) => {
                      const providerNames: Record<number, string> = {
                        8: 'Netflix',
                        1: 'Prime Video',
                        337: 'Disney+',
                        120: 'HBO Max',
                        521: 'Turkcell TV +',
                      }

                      const displayName = providerNames[p.providerId] || p.providerName

                      const getProviderLink = (providerId: number, providerName: string, movieTitle: string | null): string => {
                        if (!movieTitle) return watchLink || '#'
                        const titleParam = encodeURIComponent(movieTitle)

                        if (providerId === 8 || providerName.toLowerCase().includes('netflix')) {
                          return `https://www.netflix.com/tr/search?q=${titleParam}`
                        } else if (providerId === 1 || providerName.toLowerCase().includes('prime')) {
                          return `https://www.primevideo.com/search?keyword=${titleParam}`
                        } else if (providerId === 337 || providerName.toLowerCase().includes('disney')) {
                          return `https://www.disneyplus.com/search?q=${titleParam}`
                        } else if (providerId === 120 || providerName.toLowerCase().includes('hbo')) {
                          return `https://www.hbomaxtr.com/search?q=${titleParam}`
                        } else if (providerId === 521 || providerName.toLowerCase().includes('turkcell')) {
                          return `https://www.tv.turkcell.com.tr/search?q=${titleParam}`
                        }
                        return watchLink || '#'
                      }

                      return (
                        <a
                          key={p.providerId}
                          href={getProviderLink(p.providerId, displayName, movie?.title || '')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 bg-brand-gold text-surface-primary rounded font-semibold hover:bg-brand-gold/90 transition-all text-sm flex items-center gap-2 cursor-pointer"
                        >
                          {p.logo && (
                            <img src={p.logo} alt={displayName} className="w-6 h-6 rounded" />
                          )}
                          {displayName}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              {/* Add to Watchlist Button */}
              <button
                onClick={() => addToWatchlist(movie.id)}
                className={`w-full py-3 px-4 rounded font-semibold transition-all cursor-pointer ${
                  inWatchlist
                    ? 'bg-brand-gold text-surface-primary'
                    : 'border-2 border-brand-gold text-brand-gold hover:bg-brand-gold/10'
                }`}
              >
                {inWatchlist ? '✓ Saved to Watchlist' : '+ Add to Watchlist'}
              </button>

              <div className="p-4 bg-surface-secondary rounded">
                <p className="text-sm text-brand-cream/60 mb-3">Your Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => rateMovie(movie.id, star)}
                      className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                        rating && rating >= star
                          ? 'text-brand-gold'
                          : 'text-brand-gold/30'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-cream mb-6">
              Similar Movies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recommendations.map((rec, idx) => (
                <motion.button
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/watch/${rec.id}`)}
                  className="group relative rounded-lg overflow-hidden h-64 md:h-80"
                >
                  <img
                    src={rec.posterPath}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-12 h-12 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="6,2 18,11 6,20" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black">
                    <p className="text-xs font-semibold text-brand-cream line-clamp-2">
                      {rec.title}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
