import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useMovieStore } from './stores/movieStore'
import { tmdbService } from './services/tmdbService'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import './styles/globals.css'

function App() {
  const { setTrendingMovies, setFilteredMovies, setIsLoading, setError } = useMovieStore()

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true)
        const [trending, popular] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getPopularMovies(),
        ])
        setTrendingMovies(trending.results)
        setFilteredMovies(popular.results)
      } catch (err) {
        setError('Failed to load movies')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [setTrendingMovies, setFilteredMovies, setIsLoading, setError])

  return (
    <Router>
      <div className="min-h-screen bg-surface-primary">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Additional routes will be added later */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
