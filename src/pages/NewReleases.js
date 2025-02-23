import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import '../styles/newreleases.css';

function NewReleases() {
  const [newReleases, setNewReleases] = useState([]);
  const [popup, setPopup] = useState(null); // Popup state
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
    <div className="NewReleases">
      <Navbar />
      {popup && (
        <div className="popup">
          {popup}
        </div>
      )}
      <section className="new-releases-section">
        <h1>New Releases</h1>
        <p>Check out the latest DVDs added to our collection.</p>
        <div className="new-releases-grid">
          {newReleases.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={movie.img} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.synopsis}</p>
                <p>{movie.year} • {movie.rating}</p>
                <button className="add-button" onClick={() => handleAddToQueue(movie)}>
                  Add to Queue
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="NewReleases-footer">
        <div className="footer-links">
          <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
        </div>
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default NewReleases;