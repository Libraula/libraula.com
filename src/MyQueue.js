import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './myqueue.css';

// Sample queue data based on Cafe DVD
const queueData = {
  preparing: [],
  home: [],
  queue: [
    { id: 1, title: 'George Washington', year: 2000, rating: 'NR', duration: '1h 30m', genres: ['Drama', 'Classics'], format: 'DVD', status: '' },
    { id: 2, title: 'Barbie (Blu-Ray)', year: 2023, rating: 'PG-13', duration: '1h 54m', genres: ['Adventure', 'Comedy', 'Fantasy'], format: 'Blu-ray', status: 'short wait' },
    { id: 3, title: 'Dune', year: 2021, rating: 'PG-13', duration: '2h 35m', genres: ['Sci-Fi & Fantasy', 'Action'], format: 'DVD', status: '' },
    { id: 4, title: 'The Little Mermaid', year: 2023, rating: 'PG', duration: '2h 15m', genres: ['Family', 'Musical', 'Fantasy'], format: 'DVD', status: 'wait' },
    { id: 5, title: 'Game Of Thrones: Season 1 (Disc 1)', year: 2011, rating: 'TV-MA', duration: '10h 0m', genres: ['Action', 'Adventure', 'Television'], format: 'DVD', status: '' },
    { id: 6, title: 'The Shawshank Redemption', year: 1994, rating: 'R', duration: '2h 22m', genres: ['Drama'], format: 'DVD', status: '' },
    { id: 7, title: 'Pumpkin', year: 2002, rating: 'R', duration: '1h 57m', genres: ['Comedy', 'Romantic Comedy', 'Independent'], format: 'DVD', status: '' },
    { id: 8, title: 'Fast X', year: 2023, rating: 'PG-13', duration: '2h 21m', genres: ['Action', 'Adventure'], format: 'DVD', status: '' },
  ],
  history: [],
};

function MyQueue() {
  const [activeTab, setActiveTab] = useState('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideLongWaits, setHideLongWaits] = useState(false);

  const filteredQueue = queueData[activeTab].filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!hideLongWaits || item.status !== 'wait')
  );

  return (
    <div className="MyQueue">
      <header className="MyQueue-header">
        <div className="logo">Libraula</div>
        <input
          type="text"
          placeholder="Search Movies, TV Shows, actors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <nav className="nav-bar">
          <Link to="/home">Browse</Link>
          <Link to="/new-releases">New Releases</Link>
          <Link to="/queue">My Queue</Link>
          <Link to="/account">Account</Link>
          <Link to="/login">Sign Out</Link>
        </nav>
      </header>

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