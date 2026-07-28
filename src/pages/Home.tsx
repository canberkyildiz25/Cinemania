import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMovieStore } from '../stores/movieStore'
import { useUIStore } from '../stores/uiStore'
import { archiveService } from '../services/archiveService'
import { HeroCarousel } from '../components/features/hero/HeroCarousel'
import { MovieCarousel } from '../components/features/movies/MovieCarousel'
import type { Movie } from '../types'

export function Home() {
  const navigate = useNavigate()
  const {
    setIsLoading,
    setError,
  } = useMovieStore() as any

  const { setCurrentPage } = useUIStore() as any
  const [freeMovies, setFreeMovies] = useState<Movie[]>([])
  const [classicFilms, setClassicFilms] = useState<Movie[]>([])

  useEffect(() => {
    setCurrentPage('home')
  }, [setCurrentPage])

  useEffect(() => {
    const fetchFreeMovies = async () => {
      try {
        setIsLoading(true)

        const [archiveMovies, classicMovies] = await Promise.all([
          archiveService.searchFreeMovies('film'),
          archiveService.searchFreeMovies('classic'),
        ])

        setFreeMovies(archiveMovies)
        setClassicFilms(classicMovies)
      } catch (err) {
        setError('Failed to load free movies')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFreeMovies()
  }, [])

  const handlePlayMovie = (movie: Movie) => {
    navigate(`/watch/${movie.id}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      {freeMovies.length > 0 && <HeroCarousel movies={freeMovies} />}

      {/* Main Content */}
      <div className="space-y-12 py-8 md:py-16">
        {/* Free Movies */}
        {freeMovies.length > 0 && (
          <MovieCarousel
            title="Watch Free"
            subtitle="Completely free movies - no subscription needed"
            movies={freeMovies.slice(0, 10)}
            onPlayMovie={handlePlayMovie}
          />
        )}

        {/* Classic Films */}
        {classicFilms.length > 0 && (
          <MovieCarousel
            title="Classic Cinema"
            subtitle="Timeless masterpieces from cinema history"
            movies={classicFilms.slice(0, 10)}
            onPlayMovie={handlePlayMovie}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-brand-gold/30 py-16 mt-20 bg-gradient-to-b from-surface-primary to-surface-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Footer Top */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-brand-gold font-display font-bold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-brand-cream/70 text-sm">
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">About</a></li>
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Jobs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-brand-gold font-display font-bold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-brand-cream/70 text-sm">
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Contact</a></li>
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-brand-gold font-display font-bold mb-6 text-lg">Legal</h3>
              <ul className="space-y-3 text-brand-cream/70 text-sm">
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Privacy</a></li>
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Terms</a></li>
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-brand-gold font-display font-bold mb-6 text-lg">Follow</h3>
              <ul className="space-y-3 text-brand-cream/70 text-sm">
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Twitter</a></li>
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Instagram</a></li>
                <li><a href="#" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">Discord</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-brand-gold/20 my-8"></div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div>
              <p className="text-brand-gold font-display font-bold text-sm mb-2">FILMHUB</p>
              <p className="text-brand-cream/50 text-xs">Premium streaming platform for movie lovers</p>
            </div>
            <div className="text-brand-cream/40 text-xs mt-6 md:mt-0">
              <p>&copy; 2026 FILMHUB. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
