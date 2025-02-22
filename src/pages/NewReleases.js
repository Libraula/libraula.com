import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/newreleases.css';
import Navbar from '../components/Navbar';

// Sample new releases data (replace with API later)
const newReleases = [
  { id: 1, title: 'Barbie (Blu-Ray)', img: 'https://placehold.co/400x600?text=Barbie', synopsis: 'A comedic fantasy adventure.', rating: 'PG-13', genre: 'Comedy', year: 2023 },
  { id: 2, title: 'Dune', img: 'https://placehold.co/400x600?text=Dune', synopsis: 'Epic sci-fi adventure.', rating: 'PG-13', genre: 'Sci-Fi', year: 2021 },
  { id: 3, title: 'The Little Mermaid', img: 'https://placehold.co/400x600?text=The+Little+Mermaid', synopsis: 'A musical fantasy remake.', rating: 'PG', genre: 'Family', year: 2023 },
  { id: 4, title: 'Fast X', img: 'https://placehold.co/400x600?text=Fast+X', synopsis: 'High-octane action.', rating: 'PG-13', genre: 'Action', year: 2023 },
];

function NewReleases() {
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
                <button className="add-button">Add to Queue</button>
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