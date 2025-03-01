import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useSubscription } from '../hooks/useSubscription';
import Navbar from '../components/Navbar';
import { FiPlus, FiFilter, FiStar, FiSearch } from 'react-icons/fi';
import { BiBookOpen } from 'react-icons/bi';
import { MdBook } from 'react-icons/md';
import BookCard from '../components/BookCard';
import { AnimatePresence, motion } from 'framer-motion';
import '../styles/home.css';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [books, setBooks] = useState([]);
  const [featuredBook, setFeaturedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/');
      } else {
        fetchBooks();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      const bookSnapshot = await getDocs(collection(db, 'books'));
      const bookList = bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(bookList);

      // Find the book marked as featured
      const featured = bookList.find(book => book.featured === true) || bookList[0]; // Fallback to first book if none featured
      setFeaturedBook(featured);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedGenre === 'All' || (book.genre && book.genre.split(',').includes(selectedGenre)))
  );

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

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

  const FeaturedBook = ({ book }) => (
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
          <FiStar /> Featured Book {book.newRelease && '(New Release)'}
        </motion.div>
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {book.title}
        </motion.h1>
        <motion.p 
          className="hero-synopsis"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {book.synopsis || 'No synopsis available.'}
        </motion.p>
        <motion.div 
          className="hero-meta"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <span>{book.author || 'Unknown Author'}</span> | <span>{book.pages || 'N/A'} pages</span> | <span>{book.format || 'N/A'}</span>
        </motion.div>
        <motion.div 
          className="hero-actions"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="secondary-button" onClick={() => handleBookClick(book)}>
            <BiBookOpen /> View Details
          </button>
          <motion.button 
            className="plus-button" 
            onClick={() => handleAddToQueue(book)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiPlus />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );

  if (loading || subscriptionLoading) {
    return (
      <div className="modern-home">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your book collection...</p>
        </div>
      </div>
    );
  }

  const genres = ['All', 'Novels', 'Non-Fiction', 'Manga', 'Comics', 'Graphic Novels'];

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
      
      {featuredBook && <FeaturedBook book={featuredBook} />}

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
                  placeholder="Search books..."
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
          className="modern-book-grid"
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
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 }
              }}
            >
              <BookCard
                book={book}
                handleBookClick={handleBookClick}
                handleAddToQueue={handleAddToQueue}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {filteredBooks.length === 0 && (
          <motion.div 
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MdBook className="no-results-icon" />
            <h3>No books found</h3>
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