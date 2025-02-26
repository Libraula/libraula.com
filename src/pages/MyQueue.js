import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import '../styles/myqueue.css';

function MyQueue() {
  const [activeTab, setActiveTab] = useState('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideLongWaits, setHideLongWaits] = useState(false);
  const [userQueues, setUserQueues] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/');
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
            setUserQueues({ [userId]: [] });
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
  }, [navigate]);

  const moveQueueItem = async (index, direction) => {
    if (!auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    const queue = [...userQueues[userId]];
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= queue.length) return;
    
    const temp = queue[index];
    queue[index] = queue[newIndex];
    queue[newIndex] = temp;
    
    setUserQueues({ ...userQueues, [userId]: queue });
    
    try {
      const queueDocRef = doc(db, 'userQueues', userId);
      await updateDoc(queueDocRef, { queue });
    } catch (err) {
      setError('Failed to update queue order: ' + err.message);
      console.error('Error updating queue:', err);
    }
  };

  if (loading) {
    return (
      <div className="MyQueue">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your queue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="MyQueue">
        <Navbar />
        <section className="queue-section">
          <h1>My Queue</h1>
          <div className="error-message">{error}</div>
        </section>
      </div>
    );
  }

  const queueData = {
    preparing: [],
    home: [],
    queue: auth.currentUser ? userQueues[auth.currentUser.uid] || [] : [],
    history: [],
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
        
        <div className="search-container">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search your queue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
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
          <label className="control-checkbox">
            <input
              type="checkbox"
              checked={hideLongWaits}
              onChange={() => setHideLongWaits(!hideLongWaits)}
            />
            <span className="checkbox-label">Hide long waits</span>
          </label>
          {activeTab === 'queue' && queueData.queue.length < 12 && (
            <p className="suggestion">For a better experience, we suggest having at least a dozen movies in your queue.</p>
          )}
        </div>

        <div className="queue-list">
          {filteredQueue.length === 0 ? (
            <div className="empty-state">
              <p>Your list is empty.</p>
              {activeTab === 'queue' && <button className="add-button">Browse Catalog</button>}
            </div>
          ) : (
            <div className="responsive-table">
              <div className="table-header">
                <div className="table-cell order-cell">#</div>
                <div className="table-cell title-cell">Title</div>
                <div className="table-cell genre-cell">Genre</div>
                <div className="table-cell format-cell">Format</div>
                <div className="table-cell status-cell">Status</div>
                <div className="table-cell actions-cell">Actions</div>
              </div>
              
              {filteredQueue.map((item, index) => (
                <div key={item.id} className="table-row">
                  <div className="table-cell order-cell">{index + 1}</div>
                  <div className="table-cell title-cell">
                    <span className="movie-title">{item.title}</span>
                    <span className="movie-details">({item.year} {item.rating})</span>
                  </div>
                  <div className="table-cell genre-cell">{item.genre}</div>
                  <div className="table-cell format-cell">{item.format || 'DVD'}</div>
                  <div className="table-cell status-cell">
                    <span className={`status-badge ${item.status || 'available'}`}>
                      {item.status || 'Available'}
                    </span>
                  </div>
                  <div className="table-cell actions-cell">
                    <div className="reorder-controls">
                      <button 
                        className="reorder-btn" 
                        onClick={() => moveQueueItem(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button 
                        className="reorder-btn" 
                        onClick={() => moveQueueItem(index, 'down')}
                        disabled={index === filteredQueue.length - 1}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="MyQueue-footer">
        <div className="footer-content">
          <p>Customer Support: <a href="mailto:support@libraula.com">support@libraula.com</a> | <a href="#">Chat</a></p>
          <div className="footer-links">
            <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
          </div>
          <p>© 2025 Libraula. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MyQueue;