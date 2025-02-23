import React, { useContext } from 'react'; // Add useContext
import { DvdContext } from '../DvdContext'; // Import DvdContext
import { QueueContext } from '../QueueContext'; // For addToQueue
import '../styles/newreleases.css';
import Navbar from '../components/Navbar';

function NewReleases() {
  const { newReleases } = useContext(DvdContext); // Use newReleases from context
  const { addToQueue } = useContext(QueueContext);

  const handleAddToQueue = (movie) => {
    addToQueue(movie);
  };

  return (
    <div className="NewReleases">
      <Navbar />
      <section className="new-releases-section">
        <h1>New Releases</h1>
        <p>Check out the latest DVDs added to our collection.</p>
        <div className="new-releases-grid">
          {newReleases.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={movie.img} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.synopsis}</p>
                <p>{movie.year} • {movie.rating}</p>
                <button className="add-button" onClick={() => handleAddToQueue(movie)}>Add to Queue</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="NewReleases-footer">
        <div className="footer-links">
          <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
        </div>
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default NewReleases;