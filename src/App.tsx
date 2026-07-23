import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useMovieStore } from './stores/movieStore'
import { tmdbService } from './services/tmdbService'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { Watch } from './pages/Watch'
import { Search } from './pages/Search'
import { Library } from './pages/Library'
import { Profile } from './pages/Profile'
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
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
