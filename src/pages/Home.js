import React, { useState, useContext } from 'react'; // Add useContext
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { QueueContext } from '../QueueContext'; // Import QueueContext
import '../styles/home.css';

const movies = [
  { id: 1, title: 'The Matrix', img: 'https://placehold.co/400x600?text=The+Matrix', synopsis: 'A sci-fi classic about virtual reality.', rating: 'R', genre: 'Sci-Fi', director: 'Lana and Lilly Wachowski', year: '1999', cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'] },
  { id: 2, title: 'Inception', img: 'https://placehold.co/400x600?text=Inception', synopsis: 'A mind-bending thriller about dreams.', rating: 'PG-13', genre: 'Sci-Fi', director: 'Christopher Nolan', year: '2010', cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'] },
  { id: 3, title: 'Pulp Fiction', img: 'https://placehold.co/400x600?text=Pulp+Fiction', synopsis: 'A nonlinear crime masterpiece.', rating: 'R', genre: 'Drama', director: 'Quentin Tarantino', year: '1994', cast: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman'] },
  { id: 4, title: 'The Dark Knight', img: 'https://placehold.co/400x600?text=The+Dark+Knight', synopsis: 'Batman faces the Joker.', rating: 'PG-13', genre: 'Action', director: 'Christopher Nolan', year: '2008', cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'] },
  { id: 5, title: 'Forrest Gump', img: 'https://placehold.co/400x600?text=Forrest+Gump', synopsis: 'A journey through American history.', rating: 'PG-13', genre: 'Drama', director: 'Robert Zemeckis', year: '1994', cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'] },
  { id: 6, title: 'Titanic', img: 'https://placehold.co/400x600?text=Titanic', synopsis: 'A tragic love story at sea.', rating: 'PG-13', genre: 'Drama', director: 'James Cameron', year: '1997', cast: ['Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane'] },
  { id: 7, title: 'Avatar', img: 'https://placehold.co/400x600?text=Avatar', synopsis: 'A visually stunning sci-fi epic.', rating: 'PG-13', genre: 'Sci-Fi', director: 'James Cameron', year: '2009', cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'] },
  { id: 8, title: 'The Shawshank Redemption', img: 'https://placehold.co/400x600?text=Shawshank', synopsis: 'A tale of hope and friendship.', rating: 'R', genre: 'Drama', director: 'Frank Darabont', year: '1994', cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'] },
];

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const navigate = useNavigate();
  const { addToQueue } = useContext(QueueContext); // Access addToQueue from context

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedGenre === 'All' || movie.genre === selectedGenre)
  );

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const handleAddToQueue = (movie) => {
    addToQueue(movie); // Use context function
  };

  return (
    <div className="Home">
      <Navbar />
      <section className="hero-section">
        <div className="hero-content">
          <h1>Featured: The Matrix</h1>
          <p>A groundbreaking sci-fi action film that redefined the genre.</p>
          <button className="hero-button" onClick={() => handleAddToQueue(movies[0])}>Add to Queue</button>
        </div>
      </section>
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
                  e.stopPropagation(); // Prevent movie card click
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