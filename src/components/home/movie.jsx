'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '@/components/moviecards/moviecards';
import { Search } from 'lucide-react';

export default function Movie() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('batman');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_READ_TOKEN}`,
          },
        }
      );
      setMovies(res.data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-40 py-6 px-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
            🎬 Movie Explorer
          </h1>
        </div>
      </header>

      {/* Search Section */}
      <div className="container mx-auto px-4 pt-8 pb-12">
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Search movies..."
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-yellow-400 hover:text-yellow-300 focus:outline-none"
              disabled={loading}
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-400 text-center mt-4">
            {error}
          </div>
        )}
      </div>

      {/* Movies Grid */}
      <div className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No movies found. Try a different search.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-40 py-4 px-4">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>Data provided by The Movie Database (TMDB)</p>
        </div>
      </footer>
    </div>
  );
}