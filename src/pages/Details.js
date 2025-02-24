import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/details.css';

function Details() {
  const { id } = useParams();
  const location = useLocation();
  const movie = location.state?.movie;
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);

  if (!movie) {
    return (
      <div className="error-container">
        <h2>Movie not found!</h2>
        <button onClick={() => navigate('/home')}>Return Home</button>
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
      console.log('Adding to queue for UID:', userId);
      const queueRef = doc(db, 'userQueues', userId);

      await setDoc(queueRef, { test: 'Permission test' }, { merge: true });
      console.log('Test write successful for UID:', userId);

      const queueDocSnapshot = await getDoc(queueRef);
      const userQueue = queueDocSnapshot.exists() && queueDocSnapshot.data().queue ? queueDocSnapshot.data().queue : [];
      console.log('Current queue from Firestore:', userQueue);

      if (!userQueue.some(item => item.id === movie.id)) {
        const updatedQueue = [...userQueue, movie];
        console.log('New queue to save:', updatedQueue);
        await setDoc(queueRef, { queue: updatedQueue }, { merge: true });
        console.log(`Successfully added ${movie.title} to ${userId}'s queue in Firestore`);
        setPopup(`${movie.title} added to your queue!`);
        setTimeout(() => setPopup(null), 2000);
      } else {
        console.log(`${movie.title} is already in the queue`);
        setPopup(`${movie.title} is already in your queue`);
        setTimeout(() => setPopup(null), 2000);
      }
    } catch (err) {
      console.error('Detailed error adding to queue:', err.message, err.code, err.stack);
      setPopup(`Failed to add ${movie.title} to queue: ${err.message}`);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <div className="Details">
      <Navbar />
      {popup && (
        <div className="popup-notification">
          {popup}
        </div>
      )}
      
      <div className="content-wrapper">
        <section className="movie-details-container">
          <div className="movie-poster-container">
            <img 
              src={movie.img} 
              alt={movie.title}
              className="movie-poster-image"
              loading="lazy"
            />
            <button 
              className="add-to-queue-button" 
              onClick={handleAddToQueue}
              aria-label="Add to Queue"
            >
              Add to Queue
            </button>
          </div>

          <div className="movie-info-container">
            <div className="movie-header">
              <h1 className="movie-title">{movie.title}</h1>
              <div className="movie-meta">
                <span className="year">{movie.year}</span>
                <span className="rating-badge">{movie.rating}</span>
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
        </section>
      </div>

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