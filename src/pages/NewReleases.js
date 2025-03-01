import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useSubscription } from '../hooks/useSubscription'; // Import the new hook
import Navbar from '../components/Navbar';
import { FiPlusCircle, FiStar } from 'react-icons/fi';
import '../styles/newreleases.css';

function NewReleases() {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const bookSnapshot = await getDocs(collection(db, 'books'));
        const bookList = bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredNewReleases = bookList.filter(book => book.newRelease);
        setNewReleases(filteredNewReleases);
      } catch (err) {
        console.error('Error fetching new releases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewReleases();
  }, []);

  const handleAddToQueue = async (book) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (subscriptionLoading) {
      setPopup('Checking subscription status...');
      setTimeout(() => setPopup(null), 2000);
      return;
    }

    if (!isSubscribed) {
      setPopup('Please subscribe to add books to your queue.');
      setTimeout(() => {
        setPopup(null);
        navigate('/pricing');
      }, 2000);
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const queueRef = doc(db, 'userQueues', userId);
      await setDoc(queueRef, { test: 'Permission test' }, { merge: true });

      const queueDocSnapshot = await getDoc(queueRef);
      const userQueue = queueDocSnapshot.exists() && queueDocSnapshot.data().queue ? queueDocSnapshot.data().queue : [];

      if (!userQueue.some(item => item.id === book.id)) {
        const updatedQueue = [...userQueue, book];
        await setDoc(queueRef, { queue: updatedQueue }, { merge: true });
        setPopup(`${book.title} added to your queue!`);
        setTimeout(() => setPopup(null), 2000);
      } else {
        setPopup(`${book.title} is already in your queue`);
        setTimeout(() => setPopup(null), 2000);
      }
    } catch (err) {
      console.error('Error adding to queue:', err);
      setPopup(`Failed to add ${book.title} to queue: ${err.message}`);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="modern-newreleases">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading latest book releases...</p>
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
          <h2>New Book Releases</h2>
          <p>Check out the latest books added to our collection.</p>
        </div>

        <div className="modern-book-grid">
          {newReleases.map((book) => (
            <div key={book.id} className="modern-book-card" onClick={() => handleBookClick(book)}>
              <div className="card-image-container">
                <img src={book.img} alt={book.title} loading="lazy" />
                <div className="card-overlay">
                  <button
                    className="card-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToQueue(book);
                    }}
                  >
                    <FiPlusCircle /> Add to Queue
                  </button>
                </div>
              </div>
              <div className="modern-book-info">
                <h3>{book.title}</h3>
                <div className="book-meta">
                  <span className="pages"><FiStar /> {book.pages || 'N/A'} pages</span>
                </div>
                <p className="book-synopsis">{book.synopsis}</p>
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