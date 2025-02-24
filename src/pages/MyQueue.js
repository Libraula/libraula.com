import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/myqueue.css';

function MyQueue() {
  const [activeTab, setActiveTab] = useState('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideLongWaits, setHideLongWaits] = useState(false);
  const [userQueues, setUserQueues] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Define navigate here, before useEffect

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/'); // Now accessible
        setLoading(false);
        return;
      }

      const fetchUserQueues = async () => {
        try {
          const userId = user.uid;
          const queueDocRef = doc(db, 'userQueues', userId);
          const queueDocSnapshot = await getDoc(queueDocRef);
          
          if (queueDocSnapshot.exists()) {
            setUserQueues({ [userId]: queueDocSnapshot.data().queue || [] });
          } else {
            setUserQueues({ [userId]: [] }); // Empty queue if no document
          }
        } catch (err) {
          setError('Failed to load queue: ' + err.message);
          console.error('Error fetching user queues:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchUserQueues();
    });

    return () => unsubscribe();
  }, [navigate]); // Include navigate in dependencies

  if (loading) {
    return (
      <div className="MyQueue">
        <Navbar />
        <p>Loading queue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="MyQueue">
        <Navbar />
        <section className="queue-section">
          <h1>My Queue</h1>
          <p className="error">{error}</p>
        </section>
      </div>
    );
  }

  const queueData = {
    preparing: [], // Extend with real data if needed
    home: [],      // Extend with real data if needed
    queue: auth.currentUser ? userQueues[auth.currentUser.uid] || [] : [],
    history: [],   // Extend with real data if needed
  };

  const filteredQueue = queueData[activeTab].filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!hideLongWaits || item.status !== 'wait')
  );

  return (
    <div className="MyQueue">
      <Navbar />
      <section className="queue-section">
        <h1>My Queue</h1>
        <div className="tabs">
                    <button onClick={() => setActiveTab('queue')} className={activeTab === 'queue' ? 'active' : ''}>
            Queue ({queueData.queue.length})
          </button>
          <button onClick={() => setActiveTab('preparing')} className={activeTab === 'preparing' ? 'active' : ''}>
            Preparing ({queueData.preparing.length})
          </button>
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>
            Home ({queueData.home.length})
          </button>

          <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>
            History ({queueData.history.length})
          </button>
        </div>

        <div className="queue-controls">
          <label>
            <input
              type="checkbox"
              checked={hideLongWaits}
              onChange={() => setHideLongWaits(!hideLongWaits)}
            />
            Hide long waits
          </label>
          {activeTab === 'queue' && queueData.queue.length < 12 && (
            <p className="suggestion">For a better experience, we suggest having at least a dozen movies in your queue.</p>
          )}
        </div>

        <div className="queue-list">
          {filteredQueue.length === 0 ? (
            <p>List Is Empty.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Format</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.title} ({item.year} {item.rating})</td>
                    <td>{item.genre}</td>
                    <td>{item.format || 'DVD'}</td>
                    <td>{item.status || 'Available'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
      <footer className="MyQueue-footer">
        <p>Customer Support: <a href="mailto:support@libraula.com">support@libraula.com</a> | <a href="#">Chat</a></p>
        <div className="footer-links">
          <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
        </div>
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MyQueue;