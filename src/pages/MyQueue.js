import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { ChevronUp, ChevronDown, Search, RotateCcw } from 'lucide-react';
import '../styles/myqueue.css';

function MyQueue() {
  const [activeTab, setActiveTab] = useState('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideLongWaits, setHideLongWaits] = useState(false);
  const [userQueues, setUserQueues] = useState({ queue: [], preparing: [], home: [], returnRequests: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/');
        setLoading(false);
        return;
      }

      const userId = user.uid;
      const queueDocRef = doc(db, 'userQueues', userId);

      const unsubscribeSnapshot = onSnapshot(queueDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log('Firestore data:', data);
          const updatedQueues = {
            queue: Array.isArray(data.queue) ? data.queue : [],
            preparing: Array.isArray(data.preparing) ? data.preparing : [],
            home: Array.isArray(data.home) ? data.home : [],
            returnRequests: Array.isArray(data.returnRequests) ? data.returnRequests : []
          };
          setUserQueues(updatedQueues);
          console.log('Updated userQueues:', updatedQueues);
        } else {
          console.log('No document exists, setting empty queues');
          setUserQueues({ queue: [], preparing: [], home: [], returnRequests: [] });
        }
        setLoading(false);
      }, (err) => {
        setError('Failed to load queue: ' + err.message);
        console.error('Error fetching user queues:', err);
        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const moveQueueItem = async (index, direction) => {
    if (!auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    const queue = [...userQueues.queue];
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= queue.length) return;
    
    const temp = queue[index];
    queue[index] = queue[newIndex];
    queue[newIndex] = temp;
    
    setUserQueues(prev => ({ ...prev, queue }));
    
    try {
      const queueDocRef = doc(db, 'userQueues', userId);
      await updateDoc(queueDocRef, { queue });
    } catch (err) {
      setError('Failed to update queue order: ' + err.message);
      console.error('Error updating queue:', err);
    }
  };

  const requestReturn = async (index) => {
    if (!auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    const home = [...userQueues.home];
    const itemToReturn = home[index];
    
    home.splice(index, 1); // Remove from home
    const updatedReturnRequests = [...userQueues.returnRequests, { ...itemToReturn, status: 'Return Requested' }];
    
    setUserQueues(prev => ({ ...prev, home, returnRequests: updatedReturnRequests }));
    
    try {
      const queueDocRef = doc(db, 'userQueues', userId);
      await updateDoc(queueDocRef, { 
        home,
        returnRequests: updatedReturnRequests 
      });
    } catch (err) {
      setError('Failed to request return: ' + err.message);
      console.error('Error requesting return:', err);
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
    preparing: userQueues.preparing,
    home: userQueues.home,
    queue: userQueues.queue,
    history: [],
  };

  console.log('queueData:', queueData);

  const filteredQueue = queueData[activeTab].filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWaitFilter = !hideLongWaits || item.status !== 'Long Wait';
    return matchesSearch && matchesWaitFilter;
  });

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
              
              {filteredQueue.map((item, index) => {
                // Check if item in queue is in preparing, adjust status for display
                const isInPreparing = activeTab === 'queue' && userQueues.preparing.some(prep => prep.id === item.id);
                const displayStatus = isInPreparing ? 'Long Wait' : item.status;

                return (
                  <div key={item.id} className="table-row">
                    <div className="table-cell order-cell">{index + 1}</div>
                    <div className="table-cell title-cell">
                      <span className="movie-title">{item.title}</span>
                      <span className="movie-details">({item.year} {item.rating})</span>
                    </div>
                    <div className="table-cell genre-cell">{item.genre}</div>
                    <div className="table-cell format-cell">{item.format || 'DVD'}</div>
                    <div className="table-cell status-cell">
                      <span className={`status-badge ${displayStatus.toLowerCase().replace(' ', '-')}`}>
                        {displayStatus}
                      </span>
                    </div>
                    <div className="table-cell actions-cell">
                      {activeTab === 'queue' ? (
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
                      ) : activeTab === 'home' && item.status === 'Delivered' ? (
                        <button 
                          className="return-button" 
                          onClick={() => requestReturn(index)}
                        >
                          <RotateCcw size={18} />
                          <span>Request Return</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
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