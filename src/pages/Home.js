import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/home.css';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [dvds, setDvds] = useState([]);
  const [loading, setLoading] = useState(true); // Track auth loading state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/'); // Redirect to landing page if not logged in
      } else {
        // User is logged in, fetch DVDs
        const fetchDvds = async () => {
          try {
            const dvdSnapshot = await getDocs(collection(db, 'dvds'));
            const dvdList = dvdSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDvds(dvdList);
          } catch (err) {
            console.error('Error fetching DVDs:', err);
          } finally {
            setLoading(false); // Done loading auth and data
          }
        };
        fetchDvds();
      }
    });

    return () => unsubscribe(); // Cleanup subscription
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
      const queueSnapshot = await getDocs(collection(db, 'userQueues'));
      const userQueue = queueSnapshot.docs.find(doc => doc.id === userId)?.data()?.queue || [];

      if (!userQueue.some(item => item.id === movie.id)) {
        const updatedQueue = [...userQueue, movie];
        await setDoc(queueRef, { queue: updatedQueue }, { merge: true });
        console.log(`Added ${movie.title} to ${userId}'s queue`);
      } else {
        console.log(`${movie.title} is already in the queue`);
      }
    } catch (err) {
      console.error('Error adding to queue:', err);
    }
  };

  if (loading) {
    return (
      <div className="Home">
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="Home">
      <Navbar />
      {dvds.length > 0 && (
        <section className="hero-section">
          <div className="hero-content">
            <h1>Featured: {dvds[0].title}</h1>
            <p>{dvds[0].synopsis}</p>
            <button className="hero-button" onClick={() => handleAddToQueue(dvds[0])}>
              Add to Queue
            </button>
          </div>
        </section>
      )}
      <section className="catalog">
        <h2>Browse Our Collection</h2>
        <div className="genre-filter">
          <button onClick={() => setSelectedGenre('All')} className={selectedGenre === 'All' ? 'active' : ''}>
            All
          </button>
          <button onClick={() => setSelectedGenre('Action')} className={selectedGenre === 'Action' ? 'active' : ''}>
            Action
          </button>
          <button onClick={() => setSelectedGenre('Drama')} className={selectedGenre === 'Drama' ? 'active' : ''}>
            Drama
          </button>
          <button onClick={() => setSelectedGenre('Sci-Fi')} className={selectedGenre === 'Sci-Fi' ? 'active' : ''}>
            Sci-Fi
          </button>
        </div>
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie)}>
              <img src={movie.img} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.synopsis}</p>
                <p>Rating: {movie.rating}</p>
                <button
                  className="add-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToQueue(movie);
                  }}
                >
                  Add to Queue
                </button>
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