import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { tmdbService } from '../services/tmdbService'
import { useUserStore } from '../stores/userStore'
import { buildProviderLink, providerDisplayName } from '../utils/watchProviders'
import { TrailerModal } from '../components/features/movies/TrailerModal'
import { Footer } from '../components/layout/Footer'
import type { Movie, WatchProvider, WatchProviderData } from '../types'

export function Watch() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [watchLink, setWatchLink] = useState<string | null>(null)
  const [providers, setProviders] = useState<WatchProviderData | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<any>(null)

  const { addToWatchlist, removeFromWatchlist, isInWatchlist, rateMovie, getMovieRating } = useUserStore()
  const inWatchlist = movie ? isInWatchlist(movie.id) : false
  const rating = movie ? getMovieRating(movie.id) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return
      try {
        setIsLoading(true)
        setTrailerKey(null)
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

        const trailer =
          videosData.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
          videosData.find((v) => v.type === 'Teaser' && v.site === 'YouTube')
        if (trailer) setTrailerKey(trailer.key)

        setWatchLink(watchLinkData)
        setProviders(providersData)
      } catch (err) {
        console.error('Failed to fetch movie:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-reel-spin mx-auto mb-5" />
          <p className="eyebrow">YÜKLENIYOR</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-brand-cream mb-6">Film bulunamadı</h1>
          <button onClick={() => navigate('/')} className="btn-primary">
            Ana sayfaya dön
          </button>
        </div>
      </div>
    )
  }

  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null
  const directors = movie.credits?.crew?.filter((p: any) => p.job === 'Director') ?? []

  // flatrate = abonelikle dahil, rent/buy = kirala/satın al
  const streamOn = providers?.flatrate ?? []
  const rentOn = providers?.rent ?? []
  const buyOn = providers?.buy ?? []

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <TrailerModal trailerKey={trailerKey} title={movie.title} onClose={() => setShowTrailer(false)} />
        )}
      </AnimatePresence>

      {/* Kişi kartı */}
      <AnimatePresence>
        {selectedPerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPerson(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="card max-w-sm w-full glow-gold"
            >
              {selectedPerson.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w400${selectedPerson.profile_path}`}
                  alt={selectedPerson.name}
                  className="w-full h-80 object-cover object-top"
                />
              ) : (
                <div className="w-full h-40 bg-surface-tertiary flex items-center justify-center">
                  <span className="font-display text-5xl text-brand-gold/30">
                    {selectedPerson.name?.[0]}
                  </span>
                </div>
              )}
              <div className="p-6">
                <p className="eyebrow mb-3">{selectedPerson.character ? 'OYUNCU' : 'EKIP'}</p>
                <h2 className="font-display text-3xl text-brand-cream mb-2 leading-tight">
                  {selectedPerson.name}
                </h2>
                <p className="text-brand-gold text-sm mb-6">
                  {selectedPerson.character || selectedPerson.job}
                </p>
                <button onClick={() => setSelectedPerson(null)} className="btn-secondary w-full justify-center">
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop şeridi */}
      {movie.backdropPath && (
        <div className="relative h-[38vh] md:h-[46vh] overflow-hidden vignette">
          <motion.img
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            src={movie.backdropPath}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-surface-primary/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-primary/85 via-transparent to-surface-primary/60" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-28 md:-mt-36 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
          {/* Sol: künye */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-brand-cream mb-5">{movie.title}</h1>

            {/* Metadata şeridi */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-7 font-mono text-xs tracking-wider text-brand-cream/60">
              <span className="inline-flex items-center gap-1.5 text-brand-gold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.voteAverage.toFixed(1)}
              </span>
              {year && <span>{year}</span>}
              {movie.runtime ? (
                <span>{Math.floor(movie.runtime / 60)}s {movie.runtime % 60}dk</span>
              ) : null}
              <span>{movie.voteCount.toLocaleString('tr-TR')} OY</span>
              {directors.length > 0 && (
                <span className="text-brand-cream/45">
                  YÖN. {directors.map((d: any) => d.name).join(', ')}
                </span>
              )}
            </div>

            {/* Türler */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-brand-gold/30 bg-brand-gold/[0.07] text-brand-gold/90 transition-colors hover:border-brand-gold/60 hover:bg-brand-gold/15"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.tagline && (
              <p className="font-display italic text-xl md:text-2xl text-brand-gold/90 mb-7 rule-gold">
                “{movie.tagline}”
              </p>
            )}

            <p className="text-brand-cream/80 text-base md:text-lg leading-relaxed mb-12 max-w-2xl">
              {movie.overview}
            </p>

            {/* Oyuncular */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <section className="mb-12">
                <h2 className="font-display text-2xl text-brand-cream mb-5 rule-gold">Oyuncular</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {movie.credits.cast.slice(0, 8).map((actor: any) => (
                    <button
                      key={`${actor.id}-${actor.character}`}
                      onClick={() => setSelectedPerson(actor)}
                      className="group text-left px-4 py-3.5 rounded-lg border border-brand-gold/12 bg-surface-secondary/70 transition-all duration-300 hover:border-brand-gold/45 hover:bg-surface-tertiary hover:-translate-y-0.5"
                    >
                      <p className="text-brand-cream font-semibold text-sm leading-snug group-hover:text-brand-gold transition-colors">
                        {actor.name}
                      </p>
                      <p className="text-brand-cream/50 text-xs mt-0.5 line-clamp-1">{actor.character}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Ekip */}
            {movie.credits?.crew && movie.credits.crew.length > 0 && (
              <section className="mb-12">
                <h2 className="font-display text-2xl text-brand-cream mb-5 rule-gold">Ekip</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {movie.credits.crew
                    .filter((p: any) =>
                      ['Director', 'Producer', 'Screenplay', 'Writer', 'Director of Photography', 'Original Music Composer'].includes(p.job),
                    )
                    .slice(0, 6)
                    .map((person: any) => (
                      <button
                        key={`${person.id}-${person.job}`}
                        onClick={() => setSelectedPerson(person)}
                        className="group text-left px-4 py-3.5 rounded-lg border border-brand-gold/12 bg-surface-secondary/70 transition-all duration-300 hover:border-brand-gold/45 hover:bg-surface-tertiary hover:-translate-y-0.5"
                      >
                        <p className="text-brand-cream font-semibold text-sm group-hover:text-brand-gold transition-colors">
                          {person.name}
                        </p>
                        <p className="text-brand-cream/50 text-xs mt-0.5 font-mono tracking-wide">
                          {person.job}
                        </p>
                      </button>
                    ))}
                </div>
              </section>
            )}

            {/* Yapım */}
            {movie.productionCompanies && movie.productionCompanies.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-brand-cream mb-5 rule-gold">Yapım</h2>
                <div className="flex flex-wrap gap-2.5">
                  {movie.productionCompanies.slice(0, 4).map((company) => (
                    <span
                      key={company.id}
                      className="px-4 py-2 rounded-lg bg-surface-secondary/70 border border-brand-gold/12 text-brand-cream/70 text-sm"
                    >
                      {company.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </motion.div>

          {/* Sağ: poster + aksiyonlar */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24 lg:self-start space-y-4"
          >
            <div className="poster-frame glow-burgundy">
              <img src={movie.posterPath} alt={movie.title} className="w-full h-auto" />
            </div>

            {trailerKey && (
              <button onClick={() => setShowTrailer(true)} className="btn-primary w-full justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <polygon points="6,2 18,11 6,20" />
                </svg>
                Fragmanı izle
              </button>
            )}

            <button
              onClick={() => (inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie.id))}
              className="btn-secondary w-full justify-center"
            >
              {inWatchlist ? '✓ Listemde' : '+ Listeme ekle'}
            </button>

            {/* Nerede izlenir */}
            {(streamOn.length > 0 || rentOn.length > 0 || buyOn.length > 0) && (
              <div className="card p-5 space-y-5">
                <ProviderGroup
                  label="ABONELIKLE"
                  providers={streamOn}
                  movieTitle={movie.title}
                  fallback={watchLink}
                />
                <ProviderGroup
                  label="KIRALA"
                  providers={rentOn}
                  movieTitle={movie.title}
                  fallback={watchLink}
                />
                <ProviderGroup
                  label="SATIN AL"
                  providers={buyOn}
                  movieTitle={movie.title}
                  fallback={watchLink}
                />
                <p className="text-brand-cream/35 text-[0.7rem] font-mono pt-1">TÜRKIYE • TMDB</p>
              </div>
            )}

            {/* Puanla */}
            <div className="card p-5">
              <p className="eyebrow mb-4">PUANIN</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => rateMovie(movie.id, star)}
                    aria-label={`${star} yıldız`}
                    className={`text-3xl leading-none transition-all duration-200 hover:scale-125 ${
                      rating && rating >= star
                        ? 'text-brand-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                        : 'text-brand-gold/25 hover:text-brand-gold/60'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Benzer filmler */}
        {recommendations.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl text-brand-cream mb-7 rule-gold">Benzer filmler</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recommendations.map((rec, idx) => (
                <motion.button
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.5 }}
                  onClick={() => navigate(`/watch/${rec.id}`)}
                  className="poster-frame group"
                >
                  <img
                    src={rec.posterPath}
                    alt={rec.title}
                    className="w-full h-56 md:h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-3 z-10">
                    <p className="text-xs font-semibold text-brand-cream line-clamp-2 leading-snug">
                      {rec.title}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  )
}

function ProviderGroup({
  label,
  providers,
  movieTitle,
  fallback,
}: {
  label: string
  providers: WatchProvider[]
  movieTitle: string
  fallback: string | null
}) {
  if (providers.length === 0) return null

  return (
    <div>
      <p className="eyebrow mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => {
          const name = providerDisplayName(p.providerId, p.providerName)
          return (
            <a
              key={`${label}-${p.providerId}`}
              href={buildProviderLink(p.providerId, p.providerName, movieTitle, fallback)}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-chip"
            >
              {p.logo && <img src={p.logo} alt="" className="w-6 h-6 rounded object-contain" />}
              {name}
            </a>
          )
        })}
      </div>
    </div>
  )
}
