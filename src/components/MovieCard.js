import React from 'react';
import { FiPlus, FiStar, FiClock } from 'react-icons/fi';
import '../styles/movieCard.css'; // Updated import

const MovieCard = ({ movie, handleMovieClick, handleAddToQueue }) => {
  return (
    <div className="modern-movie-card" onClick={() => handleMovieClick(movie)}>
      <div className="card-image-container">
        <img src={movie.img} alt={movie.title} loading="lazy" />
        <div className="card-overlay">
          <button
            className="plus-button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToQueue(movie);
            }}
          >
            <FiPlus />
          </button>
        </div>
        <div className="card-text-overlay">
          <h3>{movie.title}</h3>
          <div className="movie-meta">
            <span className="rating"><FiStar /> {movie.rating}</span>
            <span className="duration"><FiClock /> {movie.duration || '2h 30m'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;