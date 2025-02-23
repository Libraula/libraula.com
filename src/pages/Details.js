import React, { useContext } from 'react'; // Add useContext
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { QueueContext } from '../QueueContext'; // Import QueueContext
import '../styles/details.css';

function Details() {
  const { id } = useParams();
  const location = useLocation();
  const movie = location.state?.movie;
  const { addToQueue } = useContext(QueueContext); // Access addToQueue

  if (!movie) {
    return <div>Movie not found!</div>;
  }

  const handleAddToQueue = () => {
    addToQueue(movie); // Use context function
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