import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

// Sample movie data with updated placeholders
const movies = [
  { id: 1, title: 'The Matrix', img: 'https://placehold.co/400x600?text=The+Matrix', synopsis: 'A sci-fi classic about virtual reality.', rating: 'R', genre: 'Sci-Fi' },
  { id: 2, title: 'Inception', img: 'https://placehold.co/400x600?text=Inception', synopsis: 'A mind-bending thriller about dreams.', rating: 'PG-13', genre: 'Sci-Fi' },
  { id: 3, title: 'Pulp Fiction', img: 'https://placehold.co/400x600?text=Pulp+Fiction', synopsis: 'A nonlinear crime masterpiece.', rating: 'R', genre: 'Drama' },
  { id: 4, title: 'The Dark Knight', img: 'https://placehold.co/400x600?text=The+Dark+Knight', synopsis: 'Batman faces the Joker.', rating: 'PG-13', genre: 'Action' },
  { id: 5, title: 'Forrest Gump', img: 'https://placehold.co/400x600?text=Forrest+Gump', synopsis: 'A journey through American history.', rating: 'PG-13', genre: 'Drama' },
  { id: 6, title: 'Titanic', img: 'https://placehold.co/400x600?text=Titanic', synopsis: 'A tragic love story at sea.', rating: 'PG-13', genre: 'Drama' },
  { id: 7, title: 'Avatar', img: 'https://placehold.co/400x600?text=Avatar', synopsis: 'A visually stunning sci-fi epic.', rating: 'PG-13', genre: 'Sci-Fi' },
  { id: 8, title: 'The Shawshank Redemption', img: 'https://placehold.co/400x600?text=Shawshank', synopsis: 'A tale of hope and friendship.', rating: 'R', genre: 'Drama' },
];

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Filter movies based on search query and genre
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedGenre === 'All' || movie.genre === selectedGenre)
  );

  return (
    <div className="Home">
      {/* Header */}
      <header className="Home-header">
        <div className="logo">Libraula</div>
        <input
          type="text"
          placeholder="Search DVDs by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <nav className="nav-bar">
          <Link to="/">Home</Link>
          <Link to="/new-releases">New Releases</Link>
          <Link to="/queue">My Queue</Link>
          <Link to="/account">Account</Link>
          <Link to="/login">Sign Out</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Featured: The Matrix</h1>
          <p>A groundbreaking sci-fi action film that redefined the genre.</p>
          <button className="hero-button">Add to Queue</button>
        </div>
      </section>

      {/* Catalog Section */}
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
            <div key={movie.id} className="movie-card">
              <img src={movie.img} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.synopsis}</p>
                <p>Rating: {movie.rating}</p>
                <button className="add-button">Add to Queue</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
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