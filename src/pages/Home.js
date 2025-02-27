import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { FiPlus, FiFilter, FiStar, FiSearch } from 'react-icons/fi';
import { BiMoviePlay } from 'react-icons/bi';
import { MdLocalMovies } from 'react-icons/md'; // Added missing import
import MovieCard from '../components/MovieCard';
import { AnimatePresence, motion } from 'framer-motion';
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
        fetchDvds();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
      } else {
        setPopup(`${movie.title} is already in your queue`);
      }
      
      setTimeout(() => setPopup(null), 2000);
    } catch (err) {
      console.error('Error adding to queue:', err);
      setPopup(`Failed to add ${movie.title} to queue: ${err.message}`);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  const FeaturedMovie = ({ movie }) => (
    <motion.section 
      className="modern-hero-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="modern-hero-content">
        <motion.div 
          className="hero-badge"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiStar /> Featured Film
        </motion.div>
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {movie.title}
        </motion.h1>
        <motion.p 
          className="hero-synopsis"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {movie.synopsis}
        </motion.p>
        <motion.div 
          className="hero-actions"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="secondary-button" onClick={() => handleMovieClick(movie)}>
            <BiMoviePlay /> View Details
          </button>
          <motion.button 
            className="plus-button" 
            onClick={() => handleAddToQueue(movie)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiPlus />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );

  if (loading) {
    return (
      <div className="modern-home">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your movie collection...</p>
        </div>
      </div>
    );
  }

  const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Horror', 'Romance'];

  return (
    <div className="modern-home">
      <Navbar />
      
      <AnimatePresence>
        {popup && (
          <motion.div 
            className="modern-popup"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <FiStar className="popup-icon" />
            {popup}
          </motion.div>
        )}
      </AnimatePresence>
      
      {dvds.length > 0 && <FeaturedMovie movie={dvds[0]} />}

      <motion.section 
        className="modern-catalog"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="catalog-controls">
          <h2>Browse Our Collection</h2>
          
          <div className="filter-search-container">
            <div className="search-wrapper">
              <div className="search-input-container">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="modern-search"
                />
              </div>
            </div>
            
            <div className="modern-genre-filter">
              <FiFilter className="filter-icon" />
              <div className="genre-buttons">
                {genres.map(genre => (
                  <motion.button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`genre-button ${selectedGenre === genre ? 'active' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {genre}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          className="modern-movie-grid"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {filteredMovies.map((movie) => (
            <motion.div
              key={movie.id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 }
              }}
            >
              <MovieCard
                movie={movie}
                handleMovieClick={handleMovieClick}
                handleAddToQueue={handleAddToQueue}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {filteredMovies.length === 0 && (
          <motion.div 
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MdLocalMovies className="no-results-icon" />
            <h3>No movies found</h3>
            <p>Try adjusting your search or filter</p>
          </motion.div>
        )}
      </motion.section>

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