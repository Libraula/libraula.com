import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import '../styles/details.css';
import Navbar from '../components/Navbar';

function Details() {
  const { id } = useParams(); // Get movie ID from URL
  const location = useLocation(); // Get movie data from state
  const movie = location.state?.movie; // Access movie object

  if (!movie) {
    return <div>Movie not found!</div>; // Fallback if no movie data
  }

  const handleAddToQueue = () => {
    console.log(`Added ${movie.title} to queue`);
    // Add real queue logic here
  };

  return (
    <div className="Details">
      <Navbar />

      <section className="movie-details">
        <div className="movie-poster">
          <img src={movie.img} alt={movie.title} />
        </div>
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="year-rating">{movie.year} • {movie.rating}</p>
          <p className="genre"><strong>Genre:</strong> {movie.genre}</p>
          <p className="synopsis">{movie.synopsis}</p>
          <p className="director"><strong>Director:</strong> {movie.director}</p>
          <p className="cast"><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          <button className="add-button" onClick={handleAddToQueue}>Add to Queue</button>
        </div>
      </section>

      <footer className="Details-footer">
        <div className="footer-links">
          <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
        </div>
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Details;