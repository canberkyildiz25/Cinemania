import axios from 'axios'
import type { Movie } from '../types'

const ARCHIVE_BASE_URL = 'https://archive.org/advancedsearch.php'

interface ArchiveItem {
  identifier: string
  title: string
  description: string
  year?: number
  creator?: string
  mediatype: string
  format: string[]
}

interface ArchiveResponse {
  response: {
    docs: ArchiveItem[]
    numFound: number
  }
}

export const archiveService = {
  async searchFreeMovies(query: string, page = 1): Promise<Movie[]> {
    try {
      const params = {
        q: `(${query}) AND (mediatype:movies OR mediatype:collection) AND format:(MP4 OR WebM OR Ogg Video)`,
        output: 'json',
        rows: 20,
        page: page,
        fl: 'identifier,title,description,year,creator',
      }

      const response = await axios.get<ArchiveResponse>(ARCHIVE_BASE_URL, { params })
      const docs = response.data.response.docs

      return docs
        .filter(doc => doc.format?.some(f => ['MP4', 'WebM', 'Ogg Video'].includes(f)))
        .map((doc, index) => ({
          id: parseInt(`${page}${index}`, 10),
          title: doc.title || 'Untitled',
          overview: doc.description || 'No description available',
          posterPath: `https://archive.org/services/img/${doc.identifier}`,
          backdropPath: `https://archive.org/services/img/${doc.identifier}`,
          releaseDate: doc.year ? new Date(`${doc.year}-01-01`).toISOString() : new Date().toISOString(),
          voteAverage: Math.random() * 10,
          voteCount: Math.floor(Math.random() * 1000),
          runtime: 120,
          streamUrl: this.getStreamUrl(doc.identifier),
          archiveId: doc.identifier,
        }))
    } catch (error) {
      console.error('Archive.org search error:', error)
      return []
    }
  },

  async getTrendingFreeMovies(): Promise<Movie[]> {
    try {
      const queries = ['film', 'movie', 'classic cinema']
      const allMovies: Movie[] = []

      for (const query of queries) {
        const movies = await this.searchFreeMovies(query)
        allMovies.push(...movies.slice(0, 5))
      }

      return allMovies.slice(0, 20)
    } catch (error) {
      console.error('Error fetching trending movies:', error)
      return []
    }
  },

  async getMovieDetails(archiveId: string): Promise<any> {
    try {
      const params = {
        q: `identifier:${archiveId}`,
        output: 'json',
      }

      const response = await axios.get<ArchiveResponse>(ARCHIVE_BASE_URL, { params })
      return response.data.response.docs[0]
    } catch (error) {
      console.error('Error fetching movie details:', error)
      return null
    }
  },

  getStreamUrl(identifier: string): string {
    // Archive.org direct download URL for MP4
    return `https://archive.org/download/${identifier}/${identifier}.mp4`
  },

  getThumbnailUrl(identifier: string): string {
    return `https://archive.org/services/img/${identifier}`
  },
}
