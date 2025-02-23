import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/details.css';

function Details() {
  const { id } = useParams();
  const location = useLocation();
  const movie = location.state?.movie;
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null); // Popup state

  if (!movie) {
    return <div>Movie not found!</div>;
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

      // Test write to verify permissions
      await setDoc(queueRef, { test: 'Permission test' }, { merge: true });
      console.log('Test write successful for UID:', userId);

      const queueSnapshot = await getDocs(collection(db, 'userQueues'));
      const userDoc = queueSnapshot.docs.find(doc => doc.id === userId);
      const userQueue = userDoc ? userDoc.data().queue || [] : [];
      console.log('Current queue:', userQueue);

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
        <div className="popup">
          {popup}
        </div>
      )}
      <section className="movie-details">
        <div className="movie-poster">
          <img src={movie.img} alt={movie.title} />
        </div>
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="year-rating">{movie.year} • {movie.rating}</p>
          <p className="genre"><strong>Genre:</strong> {movie.genre}</p>
          <p className="synopsis">{movie.synopsis}</p>
          <p className="director"><strong>Director:</strong> {movie.director}</p>
          <p className="cast"><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          <button className="add-button" onClick={handleAddToQueue}>Add to Queue</button>
        </div>
      </section>
      <footer className="Details-footer">
        <div className="footer-links">
          <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
        </div>
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Details;