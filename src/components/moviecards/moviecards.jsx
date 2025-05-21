import { useState, useEffect } from 'react';
import { Star, Calendar, X } from 'lucide-react';
import axios from 'axios';

export default function MovieCard({ movie }) {
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'Release date unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/api/placeholder/500/750';

  const fetchDetails = async () => {
    setLoadingDetails(true);
    setErrorDetails(null);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_READ_TOKEN}`,
          },
        }
      );
      setDetails(res.data);
      setShowDetails(true);
    } catch (error) {
      setErrorDetails('Failed to load movie details.');
      setShowDetails(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetailsClick = () => {
    if (!showDetails) {
      fetchDetails();
    } else {
      setShowDetails(false);
    }
  };

  // Close modal if user clicks outside modal content
  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      setShowDetails(false);
    }
  };

  return (
    <>
      <div className="movie-card border rounded p-4 bg-gray-900 text-white shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300">
        {!imageError ? (
          <img
            src={posterUrl}
            alt={movie.title}
            onError={handleImageError}
            className="w-full h-auto rounded-md"
          />
        ) : (
          <div className="placeholder w-full h-64 bg-gray-700 flex items-center justify-center rounded-md text-xl font-semibold">
            {movie.title}
          </div>
        )}

        <div className="flex items-center mt-2 space-x-3">
          {movie.vote_average > 0 && (
            <div className="flex items-center text-yellow-400 font-semibold">
              <Star size={18} />
              <span className="ml-1 text-lg">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar size={16} />
            <span className="ml-1">{formatDate(movie.release_date)}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-3">{movie.title}</h3>

        {movie.overview && !showDetails && (
          <p className="text-gray-300 mt-2 line-clamp-3">{movie.overview}</p>
        )}

        <button
          onClick={handleViewDetailsClick}
          className="mt-4 px-5 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition"
        >
          View Details
        </button>
      </div>

      {/* Modal Popup */}
      {showDetails && (
        <div
          id="modal-backdrop"
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-lg w-full relative p-6 overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 transition"
              aria-label="Close details modal"
            >
              <X size={28} />
            </button>

            {loadingDetails ? (
              <p className="text-yellow-400 text-center text-lg">Loading details...</p>
            ) : errorDetails ? (
              <p className="text-red-500 text-center">{errorDetails}</p>
            ) : (
              details && (
                <>
                  <h2 className="text-2xl font-bold mb-4">{details.title}</h2>
                  <div className="flex space-x-4 mb-4">
                    <img
                      src={
                        details.poster_path
                          ? `https://image.tmdb.org/t/p/w300${details.poster_path}`
                          : '/api/placeholder/300/450'
                      }
                      alt={details.title}
                      className="w-24 rounded-md shadow-md"
                    />
                    <div className="flex flex-col justify-between">
                      <p className="text-yellow-400 font-semibold text-lg mb-1">
                        {details.tagline || 'No tagline'}
                      </p>
                      <p>
                        <strong>Runtime:</strong> {details.runtime ? `${details.runtime} min` : 'N/A'}
                      </p>
                      <p>
                        <strong>Genres:</strong>{' '}
                        {details.genres?.map((g) => g.name).join(', ') || 'N/A'}
                      </p>
                      <p>
                        <strong>Release Date:</strong> {formatDate(details.release_date)}
                      </p>
                      <p>
                        <strong>Rating:</strong>{' '}
                        <span className="flex items-center text-yellow-400 font-semibold">
                          <Star size={16} />
                          <span className="ml-1">{details.vote_average.toFixed(1)}</span>
                        </span>
                      </p>
                      <p>
                        <strong>Vote Count:</strong> {details.vote_count}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 whitespace-pre-line">{details.overview}</p>
                </>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
