import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { FiPlusCircle, FiStar, FiChevronLeft } from 'react-icons/fi';
import '../styles/details.css';

function Details() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useState(location.state?.book || null);
  const [isLoading, setIsLoading] = useState(!book);
  const [popup, setPopup] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      if (!book && id) {
        try {
          setIsLoading(true);
          const bookDocRef = doc(db, 'books', id);
          const bookDocSnapshot = await getDoc(bookDocRef);
          if (bookDocSnapshot.exists()) {
            setBook({ id, ...bookDocSnapshot.data() });
          } else {
            setBook(null);
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching book:', error);
          setBook(null);
          setIsLoading(false);
        }
      }
    };
    
    fetchBook();
  }, [id, book]);

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

      if (!userQueue.some(item => item.id === book.id)) {
        const updatedQueue = [...userQueue, book];
        await setDoc(queueRef, { queue: updatedQueue }, { merge: true });
        setPopup(`${book.title} added to your queue!`);
      } else {
        setPopup(`${book.title} is already in your queue`);
      }
      setTimeout(() => setPopup(null), 2000);
    } catch (err) {
      console.error('Error adding to queue:', err);
      setPopup(`Failed to add ${book.title} to queue: ${err.message}`);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="error-container">
          <h2>Book not found!</h2>
          <p>The book you're looking for may have been removed or doesn't exist.</p>
          <button className="contact-btn" onClick={() => navigate('/home')}>
            <FiChevronLeft /> Return Home
          </button>
        </div>
      </div>
    );
  }

  const images = book.images && book.images.length ? book.images : [
    book.img || "https://placehold.co/400x600",
    book.img2 || "https://placehold.co/400x600",
    book.img3 || "https://placehold.co/400x600",
    book.img4 || "https://placehold.co/400x600"
  ].filter(img => img); // Filter out empty strings

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
            alt={`${book.title} cover ${selectedImage + 1}`}
            className="main-image"
          />
          <div className="thumbnail-strip">
            {images.map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`${book.title} thumbnail ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="details-info">
          <h1>{book.title}</h1>
          <div className="basic-info">
            <p><span className="label">Publication Year:</span> {book.year || 'N/A'}</p>
            <p><span className="label">Pages:</span> <FiStar /> {book.pages || 'N/A'}</p>
            <p><span className="label">Format:</span> {book.format || 'N/A'}</p>
            <p><span className="label">Status:</span> {book.status || 'N/A'}</p>
            {book.newRelease && <p><span className="label">New Release:</span> Yes</p>}
          </div>

          <div className="description">
            <h2>Synopsis</h2>
            <p>{book.synopsis || 'No synopsis available for this book.'}</p>
          </div>

          <div className="genres">
            <h2>Genre</h2>
            <ul>
              {(book.genre || 'Unknown').split(',').map((genre, index) => (
                <li key={index}>{genre.trim()}</li>
              ))}
            </ul>
          </div>

          <div className="authors">
            <h2>Author(s)</h2>
            <ul>
              {(typeof book.author === 'string' ? [book.author] : book.author || ['Unknown']).map((author, index) => (
                <li key={index}>{author}</li>
              ))}
            </ul>
          </div>

          {book.cast && book.cast.length > 0 && (
            <div className="contributors">
              <h2>Contributors (Co-authors/Illustrators)</h2>
              <ul>
                {book.cast.map((contributor, index) => (
                  <li key={index}>{contributor}</li>
                ))}
              </ul>
            </div>
          )}

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