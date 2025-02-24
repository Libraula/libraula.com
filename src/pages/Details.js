import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { FiPlusCircle, FiStar, FiClock } from 'react-icons/fi';
import '../styles/details.css';

function Details() {
  const { id } = useParams();
  const location = useLocation();
  const movie = location.state?.movie;
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);

  if (!movie) {
    return (
      <div className="modern-details">
        <Navbar />
        <div className="error-container">
          <h2>Movie not found!</h2>
          <button className="primary-button" onClick={() => navigate('/home')}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToQueue = async () => {
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

  return (
    <div className="modern-details">
      <Navbar />
      {popup && (
        <div className="modern-popup">
          <FiStar className="popup-icon" />
          {popup}
        </div>
      )}

      <section className="modern-details-section">
        <div className="details-content">
          <div className="movie-poster-container">
            <img 
              src={movie.img} 
              alt={movie.title}
              className="movie-poster-image"
              loading="lazy"
            />
            <button 
              className="primary-button"
              onClick={handleAddToQueue}
              aria-label="Add to Queue"
            >
              <FiPlusCircle /> Add to Queue
            </button>
          </div>

          <div className="movie-info-container">
            <div className="movie-header">
              <h1 className="movie-title">{movie.title}</h1>
              <div className="movie-meta">
                <span className="year">{movie.year}</span>
                <span className="rating"><FiStar /> {movie.rating}</span>
                <span className="duration"><FiClock /> {movie.duration || '2h 30m'}</span>
              </div>
            </div>

            <div className="movie-genre">
              {movie.genre.split(',').map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre.trim()}
                </span>
              ))}
            </div>

            <div className="movie-synopsis">
              <h2>Synopsis</h2>
              <p>{movie.synopsis}</p>
            </div>

            <div className="movie-credits">
              <div className="credit-item">
                <h3>Director</h3>
                <p>{movie.director}</p>
              </div>
              <div className="credit-item">
                <h3>Cast</h3>
                <div className="cast-list">
                  {movie.cast.map((actor, index) => (
                    <span key={index} className="cast-member">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
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

export default Details;