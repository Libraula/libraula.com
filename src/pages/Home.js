import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { DvdContext } from '../DvdContext'; // New import
import { QueueContext } from '../QueueContext';
import '../styles/home.css';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const navigate = useNavigate();
  const { dvds } = useContext(DvdContext); // Use admin-added DVDs
  const { addToQueue } = useContext(QueueContext);

  const filteredMovies = dvds.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedGenre === 'All' || movie.genre === selectedGenre)
  );

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const handleAddToQueue = (movie) => {
    addToQueue(movie);
  };

  return (
    <div className="Home">
      <Navbar />
      {dvds.length > 0 && (
        <section className="hero-section">
          <div className="hero-content">
            <h1>Featured: {dvds[0].title}</h1>
            <p>{dvds[0].synopsis}</p>
            <button className="hero-button" onClick={() => handleAddToQueue(dvds[0])}>Add to Queue</button>
          </div>
        </section>
      )}
      <section className="catalog">
        <h2>Browse Our Collection</h2>
        <div className="genre-filter">
          <button onClick={() => setSelectedGenre('All')} className={selectedGenre === 'All' ? 'active' : ''}>All</button>
          <button onClick={() => setSelectedGenre('Action')} className={selectedGenre === 'Action' ? 'active' : ''}>Action</button>
          <button onClick={() => setSelectedGenre('Drama')} className={selectedGenre === 'Drama' ? 'active' : ''}>Drama</button>
          <button onClick={() => setSelectedGenre('Sci-Fi')} className={selectedGenre === 'Sci-Fi' ? 'active' : ''}>Sci-Fi</button>
        </div>
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie)}>
              <img src={movie.img} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.synopsis}</p>
                <p>Rating: {movie.rating}</p>
                <button className="add-button" onClick={(e) => {
                  e.stopPropagation();
                  handleAddToQueue(movie);
                }}>Add to Queue</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="Home-footer">
        <div className="footer-links">
          <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
        </div>
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;