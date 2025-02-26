import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { FiPlusCircle, FiStar, FiClock, FiChevronLeft } from 'react-icons/fi';
import '../styles/details.css';

function Details() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [isLoading, setIsLoading] = useState(!movie);
  const [popup, setPopup] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movie && id) {
        try {
          setIsLoading(true);
          // Placeholder for actual movie fetching logic
          // Example: const movieDoc = await getDoc(doc(db, 'dvds', id));
          // if (movieDoc.exists()) setMovie({ id, ...movieDoc.data() });
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching movie:', error);
          setIsLoading(false);
        }
      }
    };
    
    fetchMovie();
  }, [id, movie]);

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
      const userQueue = queueDocSnapshot.exists() && queueDocSnapshot.data().queue 
        ? queueDocSnapshot.data().queue 
        : [];

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

  if (isLoading) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="error-container">
          <h2>Movie not found!</h2>
          <p>The movie you're looking for may have been removed or doesn't exist.</p>
          <button className="contact-btn" onClick={() => navigate('/home')}>
            <FiChevronLeft /> Return Home
          </button>
        </div>
      </div>
    );
  }

  const images = movie.images && movie.images.length ? movie.images : [
    movie.img || "https://placehold.co/400x600",
    "https://placehold.co/400x600",
    "https://placehold.co/400x600",
    "https://placehold.co/400x600"
  ];

  return (
    <div className="details-page">
      <Navbar />
      {popup && (
        <div className="modern-popup" role="alert">
          <FiStar className="popup-icon" />
          {popup}
        </div>
      )}

      <div className="details-profile">
        <div className="image-gallery">
          <img 
            src={images[selectedImage]} 
            alt={`${movie.title} poster`}
            className="main-image"
          />
          <div className="thumbnail-strip">
            {images.map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="details-info">
          <h1>{movie.title}</h1>
          <div className="basic-info">
            <p>Year: {movie.year || 'N/A'}</p>
            <p>Rating: <FiStar /> {movie.rating || '8.5'}</p>
            <p>Duration: <FiClock /> {movie.duration || '2h 30m'}</p>
          </div>

          <div className="description">
            <h2>Synopsis</h2>
            <p>{movie.synopsis || 'No synopsis available for this movie.'}</p>
          </div>

          <div className="hobbies">
            <h2>Genre</h2>
            <ul>
              {(movie.genre || 'Drama,Action').split(',').map((genre, index) => (
                <li key={index}>{genre.trim()}</li>
              ))}
            </ul>
          </div>

          <div className="services">
            <h2>Cast</h2>
            <ul>
              {(movie.cast || ['Actor One', 'Actor Two']).map((actor, index) => (
                <li key={index}>{actor}</li>
              ))}
            </ul>
          </div>

          {/* Removed the "Details" section with Director, Format, Status */}
          
          <button className="contact-btn" onClick={handleAddToQueue}>
            <FiPlusCircle /> Add to Queue
          </button>
        </div>
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