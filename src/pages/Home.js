import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { FiPlus, FiFilter, FiStar } from 'react-icons/fi';
import { BiMoviePlay } from 'react-icons/bi';
import { MdLocalMovies } from 'react-icons/md';
import MovieCard from '../components/MovieCard';
import '../styles/home.css';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [dvds, setDvds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/');
      } else {
        const fetchDvds = async () => {
          try {
            const dvdSnapshot = await getDocs(collection(db, 'dvds'));
            const dvdList = dvdSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDvds(dvdList);
          } catch (err) {
            console.error('Error fetching DVDs:', err);
          } finally {
            setLoading(false);
          }
        };
        fetchDvds();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const filteredMovies = dvds.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedGenre === 'All' || movie.genre === selectedGenre)
  );

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const handleAddToQueue = async (movie) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const queueRef = doc(db, 'userQueues', userId);

      await setDoc(queueRef, { test: 'Permission test' }, { merge: true });

      const queueDocSnapshot = await getDoc(queueRef);
      const userQueue = queueDocSnapshot.exists() && queueDocSnapshot.data().queue ? queueDocSnapshot.data().queue : [];

      if (!userQueue.some(item => item.id === movie.id)) {
        const updatedQueue = [...userQueue, movie];
        await setDoc(queueRef, { queue: updatedQueue }, { merge: true });
        setPopup(`${movie.title} added to your queue!`);
        setTimeout(() => setPopup(null), 2000);
      } else {
        setPopup(`${movie.title} is already in your queue`);
        setTimeout(() => setPopup(null), 2000);
      }
    } catch (err) {
      console.error('Error adding to queue:', err);
      setPopup(`Failed to add ${movie.title} to queue: ${err.message}`);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="modern-home">
        <Navbar />
        <div className="loading-container">
          <MdLocalMovies className="loading-icon" />
          <p>Loading your movie collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-home">
      <Navbar />
      {popup && (
        <div className="modern-popup">
          <FiStar className="popup-icon" />
          {popup}
        </div>
      )}
      
      {dvds.length > 0 && (
        <section className="modern-hero-section">
          <div className="modern-hero-content">
            <div className="hero-badge">
              <FiStar /> Featured Film
            </div>
            <h1>{dvds[0].title}</h1>
            <p className="hero-synopsis">{dvds[0].synopsis}</p>
            <div className="hero-actions">
              <button className="secondary-button" onClick={() => handleMovieClick(dvds[0])}>
                <BiMoviePlay /> View Details
              </button>
              <button className="plus-button" onClick={() => handleAddToQueue(dvds[0])}>
                <FiPlus />
              </button>
            </div>
          </div>
          <div className="hero-overlay"></div>
          <img src={dvds[0].img} alt={dvds[0].title} className="hero-background" />
        </section>
      )}

      <section className="modern-catalog">
        <div className="catalog-controls">
          <h2>Browse Our Collection</h2>
          <div className="filter-search-container">
            <div className="modern-genre-filter">
              <FiFilter className="filter-icon" />
              <div className="genre-buttons">
                {['All', 'Action', 'Drama', 'Sci-Fi'].map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`genre-button ${selectedGenre === genre ? 'active' : ''}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="modern-search"
              />
            </div>
          </div>
        </div>

        <div className="modern-movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              handleMovieClick={handleMovieClick}
              handleAddToQueue={handleAddToQueue}
            />
          ))}
        </div>
      </section>

      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/help">Help Center</a>
            <a href="/terms">Terms of Use</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/contact">Contact Us</a>
          </div>
          <p className="copyright">© 2025 Libraula. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;