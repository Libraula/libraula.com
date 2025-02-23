import React from 'react';
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

  if (!movie) {
    return <div>Movie not found!</div>;
  }

  const handleAddToQueue = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    try {
      const userEmail = auth.currentUser.email;
      const queueRef = doc(db, 'userQueues', userEmail);
      const queueSnapshot = await getDocs(collection(db, 'userQueues'));
      const userQueue = queueSnapshot.docs.find(doc => doc.id === userEmail)?.data()?.queue || [];
      if (!userQueue.some(item => item.id === movie.id)) {
        const updatedQueue = [...userQueue, movie];
        await setDoc(queueRef, { queue: updatedQueue }, { merge: true });
        console.log(`Added ${movie.title} to ${userEmail}'s queue`);
      }
    } catch (err) {
      console.error('Error adding to queue:', err);
    }
  };

  return (
    <div className="Details">
      <Navbar />
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