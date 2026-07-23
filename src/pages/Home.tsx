import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMovieStore } from '../stores/movieStore'
import { useUIStore } from '../stores/uiStore'
import { useUserStore } from '../stores/userStore'
import { tmdbService } from '../services/tmdbService'
import { HeroCarousel } from '../components/features/hero/HeroCarousel'
import { MovieCarousel } from '../components/features/movies/MovieCarousel'
import type { Movie } from '../types'

export function Home() {
  const navigate = useNavigate()
  const {
    trendingMovies,
    allMovies,
    recommendedMovies,
    setRecommendedMovies,
    setIsLoading,
    setError,
  } = useMovieStore() as any

  const { setCurrentPage } = useUIStore() as any
  const { getContinueWatchingMovies } = useUserStore() as any
  const [continueWatchingMovies, setContinueWatchingMovies] = useState<Movie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])

  useEffect(() => {
    setCurrentPage('home')
  }, [setCurrentPage])

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        setIsLoading(true)

        const [topRated, recommended] = await Promise.all([
          tmdbService.getTopRatedMovies(),
          trendingMovies.length > 0
            ? tmdbService.getRecommendations(trendingMovies[0].id)
            : Promise.resolve({ results: [] }),
        ])

        setTopRatedMovies(topRated.results)
        setRecommendedMovies(recommended.results)

        // Get continue watching from user store
        const sessions = getContinueWatchingMovies() || []
        if (sessions.length > 0) {
          // In a real app, fetch movie details for these sessions
          setContinueWatchingMovies(sessions.slice(0, 5))
        }
      } catch (err) {
        setError('Failed to load additional content')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdditionalData()
  }, [trendingMovies])

  const handlePlayMovie = (movie: Movie) => {
    navigate(`/watch/${movie.id}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      {trendingMovies.length > 0 && <HeroCarousel movies={trendingMovies} />}

      {/* Main Content */}
      <div className="space-y-12 py-8 md:py-16">
        {/* Continue Watching */}
        {continueWatchingMovies.length > 0 && (
          <MovieCarousel
            title="Continue Watching"
            subtitle="Pick up where you left off"
            movies={continueWatchingMovies}
            onPlayMovie={handlePlayMovie}
          />
        )}

        {/* Trending Now */}
        <MovieCarousel
          title="Trending Now"
          subtitle="What everyone is watching this week"
          movies={trendingMovies.slice(0, 10)}
          onPlayMovie={handlePlayMovie}
        />

        {/* Top Rated */}
        <MovieCarousel
          title="Top Rated"
          subtitle="Fan favorites with the highest ratings"
          movies={topRatedMovies.slice(0, 10)}
          onPlayMovie={handlePlayMovie}
        />

        {/* Recommended for You */}
        {recommendedMovies.length > 0 && (
          <MovieCarousel
            title="Recommended for You"
            subtitle="Based on movies you love"
            movies={recommendedMovies.slice(0, 10)}
            onPlayMovie={handlePlayMovie}
          />
        )}

        {/* Popular */}
        <MovieCarousel
          title="Popular"
          subtitle="Most popular movies right now"
          movies={allMovies.slice(0, 10)}
          onPlayMovie={handlePlayMovie}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-brand-gold/20 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-brand-gold font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-brand-cream/60 text-sm">
                <li><a href="#" className="hover:text-brand-gold transition-colors">About</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Jobs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-brand-gold font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-brand-cream/60 text-sm">
                <li><a href="#" className="hover:text-brand-gold transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-brand-gold font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-brand-cream/60 text-sm">
                <li><a href="#" className="hover:text-brand-gold transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-brand-gold font-bold mb-4">Follow</h3>
              <ul className="space-y-2 text-brand-cream/60 text-sm">
                <li><a href="#" className="hover:text-brand-gold transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-brand-gold/20 pt-8 text-center text-brand-cream/40 text-sm">
            <p>&copy; 2025 FILMHUB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
