import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { FiPlusCircle, FiStar } from 'react-icons/fi'; // Removed FiClock since it's not critical
import '../styles/newreleases.css';

function NewReleases() {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const dvdSnapshot = await getDocs(collection(db, 'dvds'));
        const dvdList = dvdSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredNewReleases = dvdList.filter(dvd => dvd.newRelease);
        setNewReleases(filteredNewReleases);
      } catch (err) {
        console.error('Error fetching new releases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewReleases();
  }, []);

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

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  if (loading) {
    return (
      <div className="modern-newreleases">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading latest releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-newreleases">
      <Navbar />
      {popup && (
        <div className="modern-popup">
          <FiStar className="popup-icon" />
          {popup}
        </div>
      )}

      <section className="modern-catalog">
        <div className="catalog-controls">
          <h2>New Releases</h2>
          <p>Check out the latest DVDs added to our collection.</p>
        </div>

        <div className="modern-movie-grid">
          {newReleases.map((movie) => (
            <div key={movie.id} className="modern-movie-card" onClick={() => handleMovieClick(movie)}>
              <div className="card-image-container">
                <img src={movie.img} alt={movie.title} loading="lazy" />
                <div className="card-overlay">
                  <button
                    className="card-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToQueue(movie);
                    }}
                  >
                    <FiPlusCircle /> Add to Queue
                  </button>
                </div>
              </div>
              <div className="modern-movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-meta">
                  <span className="rating"><FiStar /> {movie.rating}</span>
                  {/* Duration is optional, kept as fallback */}
                  <span className="duration">{movie.duration || '2h 30m'}</span>
                </div>
                <p className="movie-synopsis">{movie.synopsis}</p>
              </div>
            </div>
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

export default NewReleases;