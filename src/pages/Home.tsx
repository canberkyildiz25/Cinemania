import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../stores/uiStore'
import { tmdbService } from '../services/tmdbService'
import { HeroCarousel } from '../components/features/hero/HeroCarousel'
import { MovieCarousel } from '../components/features/movies/MovieCarousel'
import { Footer } from '../components/layout/Footer'
import type { Movie } from '../types'

export function Home() {
  const navigate = useNavigate()
  const { setCurrentPage } = useUIStore() as any

  const [trending, setTrending] = useState<Movie[]>([])
  const [topRated, setTopRated] = useState<Movie[]>([])
  const [popular, setPopular] = useState<Movie[]>([])
  const [upcoming, setUpcoming] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setCurrentPage('home')
  }, [setCurrentPage])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true)
        const [trendingData, topRatedData, popularData, upcomingData] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getTopRatedMovies(),
          tmdbService.getPopularMovies(),
          tmdbService.getUpcomingMovies(),
        ])

        setTrending(trendingData.results)
        setTopRated(topRatedData.results)
        setPopular(popularData.results)
        setUpcoming(upcomingData.results)
      } catch (err) {
        console.error('Failed to load movies:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const handlePlayMovie = (movie: Movie) => {
    navigate(`/watch/${movie.id}`)
  }

  return (
    <div className="min-h-screen">
      {trending.length > 0 && <HeroCarousel movies={trending.slice(0, 5)} />}

      <div className="space-y-4 py-10 md:py-16">
        <MovieCarousel
          title="Trending Now"
          subtitle="Bu hafta herkesin izlediği filmler"
          movies={trending.slice(0, 14)}
          onPlayMovie={handlePlayMovie}
          isLoading={isLoading}
        />

        <MovieCarousel
          title="Top Rated"
          subtitle="Sinema tarihinin en yüksek puanlıları"
          movies={topRated.slice(0, 14)}
          onPlayMovie={handlePlayMovie}
          isLoading={isLoading}
        />

        <MovieCarousel
          title="Popular"
          subtitle="Şu anda en çok konuşulanlar"
          movies={popular.slice(0, 14)}
          onPlayMovie={handlePlayMovie}
          isLoading={isLoading}
        />

        <MovieCarousel
          title="Coming Soon"
          subtitle="Yakında vizyonda"
          movies={upcoming.slice(0, 14)}
          onPlayMovie={handlePlayMovie}
          isLoading={isLoading}
        />
      </div>

      <Footer />
    </div>
  )
}
