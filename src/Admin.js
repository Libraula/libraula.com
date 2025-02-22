import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './admin.css';

// Sample data (replace with backend API in production)
const initialDvds = [
  { id: 1, title: 'The Matrix', status: 'Available', format: 'DVD' },
  { id: 2, title: 'Barbie', status: 'Short Wait', format: 'Blu-ray' },
  { id: 3, title: 'Dune', status: 'Available', format: 'DVD' },
];

const initialUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    shippingAddress: { line1: '123 Movie Lane', city: 'Filmville', state: 'CA', zip: '90210' },
    queue: ['The Matrix', 'Dune'],
    plan: 'Standard (2 discs)',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    shippingAddress: { line1: '456 Cinema St', city: 'Movieland', state: 'NY', zip: '10001' },
    queue: ['Barbie'],
    plan: 'Basic (1 disc)',
  },
];

function Admin() {
  // Simulate admin role (replace with real auth check)
  const isAdmin = true; // Hardcoded for demo; use proper auth in production

  const [dvds, setDvds] = useState(initialDvds);
  const [users] = useState(initialUsers);
  const [newDvd, setNewDvd] = useState({ title: '', status: 'Available', format: 'DVD' });

  if (!isAdmin) {
    return <Navigate to="/home" />; // Redirect non-admins
  }

  const handleAddDvd = (e) => {
    e.preventDefault();
    const dvd = { ...newDvd, id: dvds.length + 1 };
    setDvds([...dvds, dvd]);
    setNewDvd({ title: '', status: 'Available', format: 'DVD' });
    console.log('Added DVD:', dvd);
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updatedDvds = dvds.map((dvd) =>
      dvd.id === id ? { ...dvd, status: newStatus } : dvd
    );
    setDvds(updatedDvds);
    console.log('Updated DVD status:', { id, newStatus });
  };

  return (
    <div className="Admin">
      <header className="Admin-header">
        <div className="logo">Libraula Admin</div>
        <nav className="nav-bar">
          <Link to="/home">User View</Link>
          <Link to="/login">Sign Out</Link>
        </nav>
      </header>

      <section className="admin-section">
        <h1>Admin Dashboard</h1>
        <p>Manage DVDs and user shipping.</p>

        {/* Add DVD */}
        <div className="admin-card">
          <h2>Add New DVD</h2>
          <form onSubmit={handleAddDvd} className="add-dvd-form">
            <input
              type="text"
              placeholder="DVD Title"
              value={newDvd.title}
              onChange={(e) => setNewDvd({ ...newDvd, title: e.target.value })}
              required
            />
            <select
              value={newDvd.status}
              onChange={(e) => setNewDvd({ ...newDvd, status: e.target.value })}
            >
              <option value="Available">Available</option>
              <option value="Short Wait">Short Wait</option>
              <option value="Long Wait">Long Wait</option>
            </select>
            <select
              value={newDvd.format}
              onChange={(e) => setNewDvd({ ...newDvd, format: e.target.value })}
            >
              <option value="DVD">DVD</option>
              <option value="Blu-ray">Blu-ray</option>
            </select>
            <button type="submit" className="admin-button">Add DVD</button>
          </form>
        </div>

        {/* Manage DVDs */}
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
                    <select
                      value={dvd.status}
                      onChange={(e) => handleStatusUpdate(dvd.id, e.target.value)}
                    >
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

        {/* User Shipping and Queue */}
        <div className="admin-card">
          <h2>User Shipping & Queue</h2>
          {users.map((user) => (
            <div key={user.id} className="user-info">
              <h3>{user.name} ({user.email})</h3>
              <p><strong>Plan:</strong> {user.plan}</p>
              <p><strong>Shipping Address:</strong></p>
              <p>{user.shippingAddress.line1}</p>
              <p>{user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zip}</p>
              <p><strong>Queue:</strong></p>
              <ul>
                {user.queue.map((title, index) => {
                  const dvd = dvds.find((d) => d.title === title);
                  return (
                    <li key={index}>
                      {title} ({dvd ? dvd.status : 'Unknown'}) 
                      {dvd && dvd.status === 'Available' && (
                        <button className="ship-button">Ship Now</button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="Admin-footer">
        <p>Admin Portal - © 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Admin;