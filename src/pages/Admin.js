import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { DvdContext } from '../DvdContext';
import Navbar from '../components/Navbar';
import '../styles/admin.css';

// View Component: AddDvdForm
const AddDvdForm = ({ onAddDvd }) => {
  const [newDvd, setNewDvd] = useState({
    title: '',
    img: 'https://placehold.co/400x600?text=New+DVD',
    synopsis: '',
    rating: '',
    genre: '',
    director: '',
    year: '',
    cast: [],
    status: 'Available',
    format: 'DVD',
    newRelease: false, // New field
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddDvd({
      ...newDvd,
      cast: newDvd.cast.length > 0 ? newDvd.cast.split(',').map(name => name.trim()) : [],
    });
    setNewDvd({
      title: '',
      img: 'https://placehold.co/400x600?text=New+DVD',
      synopsis: '',
      rating: '',
      genre: '',
      director: '',
      year: '',
      cast: [],
      status: 'Available',
      format: 'DVD',
      newRelease: false,
    });
  };

  return (
    <div className="admin-card">
      <h2>Add New DVD</h2>
      <form onSubmit={handleSubmit} className="add-dvd-form">
        <input type="text" placeholder="Title" value={newDvd.title} onChange={(e) => setNewDvd({ ...newDvd, title: e.target.value })} required />
        <input type="text" placeholder="Image URL (400x600)" value={newDvd.img} onChange={(e) => setNewDvd({ ...newDvd, img: e.target.value })} />
        <textarea placeholder="Synopsis" value={newDvd.synopsis} onChange={(e) => setNewDvd({ ...newDvd, synopsis: e.target.value })} required />
        <input type="text" placeholder="Rating (e.g., PG-13)" value={newDvd.rating} onChange={(e) => setNewDvd({ ...newDvd, rating: e.target.value })} required />
        <input type="text" placeholder="Genre" value={newDvd.genre} onChange={(e) => setNewDvd({ ...newDvd, genre: e.target.value })} required />
        <input type="text" placeholder="Director" value={newDvd.director} onChange={(e) => setNewDvd({ ...newDvd, director: e.target.value })} required />
        <input type="text" placeholder="Year" value={newDvd.year} onChange={(e) => setNewDvd({ ...newDvd, year: e.target.value })} required />
        <input type="text" placeholder="Cast (comma-separated)" value={newDvd.cast} onChange={(e) => setNewDvd({ ...newDvd, cast: e.target.value })} />
        <select value={newDvd.status} onChange={(e) => setNewDvd({ ...newDvd, status: e.target.value })}>
          <option value="Available">Available</option>
          <option value="Short Wait">Short Wait</option>
          <option value="Long Wait">Long Wait</option>
        </select>
        <select value={newDvd.format} onChange={(e) => setNewDvd({ ...newDvd, format: e.target.value })}>
          <option value="DVD">DVD</option>
          <option value="Blu-ray">Blu-ray</option>
        </select>
        <label className="new-release-label">
          <input
            type="checkbox"
            checked={newDvd.newRelease}
            onChange={(e) => setNewDvd({ ...newDvd, newRelease: e.target.checked })}
          />
          Mark as New Release
        </label>
        <button type="submit" className="admin-button">Add DVD</button>
      </form>
    </div>
  );
};

// View Component: DvdList
const DvdList = ({ dvds, onUpdateStatus }) => (
  <div className="admin-card">
    <h2>Manage DVDs</h2>
    <table className="dvd-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Format</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {dvds.map((dvd) => (
          <tr key={dvd.id}>
            <td>{dvd.id}</td>
            <td>{dvd.title}</td>
            <td>{dvd.format}</td>
            <td>{dvd.status}</td>
            <td>
              <select value={dvd.status} onChange={(e) => onUpdateStatus(dvd.id, e.target.value)}>
                <option value="Available">Available</option>
                <option value="Short Wait">Short Wait</option>
                <option value="Long Wait">Long Wait</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// View Component: UserQueueList
const UserQueueList = ({ userQueues, dvds, onShip }) => (
  <div className="admin-card">
    <h2>User Queues</h2>
    {Object.entries(userQueues).map(([email, queue]) => (
      <div key={email} className="user-info">
        <h3>{email}</h3>
        <p><strong>Queue:</strong></p>
        <ul>
          {queue.map((movie) => {
            const dvd = dvds.find((d) => d.id === movie.id);
            return (
              <li key={movie.id}>
                {movie.title} ({dvd ? dvd.status : 'Unknown'})
                {dvd && dvd.status === 'Available' && (
                  <button className="ship-button" onClick={() => onShip(email, movie)}>Ship Now</button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </div>
);

function Admin() {
  const { dvds, addDvd, updateDvdStatus, userQueues, addToUserQueue } = useContext(DvdContext);
  const isAdmin = true;
  const [activeSection, setActiveSection] = useState('add-dvd');

  if (!isAdmin) {
    return <Navigate to="/home" />;
  }

  const handleAddDvd = (dvd) => {
    addDvd(dvd);
  };

  const handleUpdateStatus = (id, status) => {
    updateDvdStatus(id, status);
  };

  const handleShip = (email, movie) => {
    console.log(`Shipping ${movie.title} to ${email}`);
  };

  return (
    <div className="Admin">
      <Navbar />
      <div className="admin-container">
        <aside className="admin-sidebar">
          <h3>Admin Panel</h3>
          <ul className="sidebar-nav">
            <li className={activeSection === 'add-dvd' ? 'active' : ''} onClick={() => setActiveSection('add-dvd')}>
              Add New DVD
            </li>
            <li className={activeSection === 'manage-dvds' ? 'active' : ''} onClick={() => setActiveSection('manage-dvds')}>
              Manage DVDs
            </li>
            <li className={activeSection === 'user-queues' ? 'active' : ''} onClick={() => setActiveSection('user-queues')}>
              User Queues
            </li>
          </ul>
        </aside>
        <main className="admin-content">
          {activeSection === 'add-dvd' && <AddDvdForm onAddDvd={handleAddDvd} />}
          {activeSection === 'manage-dvds' && <DvdList dvds={dvds} onUpdateStatus={handleUpdateStatus} />}
          {activeSection === 'user-queues' && (
            <UserQueueList userQueues={userQueues} dvds={dvds} onShip={handleShip} />
          )}
        </main>
      </div>
      <footer className="Admin-footer">
        <p>Admin Portal - © 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Admin;