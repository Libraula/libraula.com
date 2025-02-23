import React, { useState, useContext } from 'react'; // Add useContext
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { QueueContext } from '../QueueContext'; // Import QueueContext
import '../styles/myqueue.css';

function MyQueue() {
  const [activeTab, setActiveTab] = useState('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideLongWaits, setHideLongWaits] = useState(false);
  const { queue } = useContext(QueueContext); // Access dynamic queue

  // Sample static data for other tabs (replace with real data later)
  const queueData = {
    preparing: [],
    home: [],
    queue: queue.map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      duration: 'N/A', // Add duration to movie data if needed
      genres: [movie.genre],
      format: 'DVD', // Default, extend movie data for Blu-ray
      status: 'Available' // Default, extend for wait status
    })),
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
        <div className="tabs">
          <button onClick={() => setActiveTab('preparing')} className={activeTab === 'preparing' ? 'active' : ''}>
            Preparing ({queueData.preparing.length})
          </button>
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>
            Home ({queueData.home.length})
          </button>
          <button onClick={() => setActiveTab('queue')} className={activeTab === 'queue' ? 'active' : ''}>
            Queue ({queueData.queue.length})
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
                    <td>{item.title} ({item.year} {item.rating} {item.duration})</td>
                    <td>{item.genres.join(', ')}</td>
                    <td>{item.format}</td>
                    <td>{item.status || '-'}</td>
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