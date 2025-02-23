import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
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
    cast: '',
    status: 'Available',
    format: 'DVD',
    newRelease: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dvdToAdd = {
      ...newDvd,
      cast: newDvd.cast ? newDvd.cast.split(',').map(name => name.trim()) : [],
      createdAt: new Date().toISOString(),
    };
    await onAddDvd(dvdToAdd);
    setNewDvd({
      title: '',
      img: 'https://placehold.co/400x600?text=New+DVD',
      synopsis: '',
      rating: '',
      genre: '',
      director: '',
      year: '',
      cast: '',
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
        <input type="text" placeholder="Rating" value={newDvd.rating} onChange={(e) => setNewDvd({ ...newDvd, rating: e.target.value })} required />
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
const UserQueueList = ({ userQueues, dvds, userDetails, onShip }) => (
  <div className="admin-card">
    <h2>User Queues</h2>
    {Object.entries(userQueues).map(([uid, queue]) => {
      const user = userDetails[uid] || { name: 'Unknown', shippingAddress: { line1: 'N/A', city: 'N/A', state: 'N/A', zip: 'N/A' } };
      return (
        <div key={uid} className="user-info">
          <h3>{user.name}</h3>
          <p><strong>Shipping Address:</strong> {user.shippingAddress.line1}, {user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zip}</p>
          <p><strong>Queue:</strong></p>
          <ul>
            {queue.map((movie) => {
              const dvd = dvds.find((d) => d.id === movie.id);
              return (
                <li key={movie.id}>
                  {movie.title} ({dvd ? dvd.status : 'Unknown'})
                  {dvd && dvd.status === 'Available' && (
                    <button className="ship-button" onClick={() => onShip(uid, movie)}>Ship Now</button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      );
    })}
  </div>
);

function Admin() {
  const [activeSection, setActiveSection] = useState('add-dvd');
  const [dvds, setDvds] = useState([]);
  const [userQueues, setUserQueues] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log('No user authenticated, redirecting to home');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      console.log('Checking admin status for UID:', user.uid);
      try {
        const userId = user.uid;
        const adminDocRef = doc(db, 'admins', userId);
        const adminDocSnapshot = await getDoc(adminDocRef);
        const adminStatus = adminDocSnapshot.exists();
        console.log('Admin document exists:', adminStatus, 'Data:', adminDocSnapshot.data());
        setIsAdmin(adminStatus);

        if (adminStatus) {
          const dvdSnapshot = await getDocs(collection(db, 'dvds'));
          const dvdList = dvdSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched DVDs:', dvdList.length);
          setDvds(dvdList);

          const queueSnapshot = await getDocs(collection(db, 'userQueues'));
          const queues = {};
          queueSnapshot.forEach(doc => {
            queues[doc.id] = doc.data().queue || [];
          });
          console.log('Fetched user queues:', Object.keys(queues).length);
          setUserQueues(queues);

          const userSnapshot = await getDocs(collection(db, 'users'));
          const details = {};
          userSnapshot.forEach(doc => {
            details[doc.id] = doc.data();
          });
          console.log('Fetched user details:', Object.keys(details).length);
          setUserDetails(details);
        }
      } catch (err) {
        console.error('Error in admin setup:', err.message, err.code, err.stack);
        setError(`Failed to load admin data: ${err.message}`);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="Admin">
        <Navbar />
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('Not an admin, redirecting to /home');
    return <Navigate to="/home" />;
  }

  if (error) {
    return (
      <div className="Admin">
        <Navbar />
        <section className="admin-section">
          <h1>Admin Dashboard</h1>
          <p className="error">{error}</p>
        </section>
      </div>
    );
  }

  const handleAddDvd = async (dvd) => {
    try {
      const docRef = await addDoc(collection(db, 'dvds'), dvd);
      setDvds(prev => [...prev, { ...dvd, id: docRef.id }]);
    } catch (err) {
      setError('Error adding DVD: ' + err.message);
      console.error('Error adding DVD:', err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const dvdRef = doc(db, 'dvds', id);
      await updateDoc(dvdRef, { status });
      setDvds(prev => prev.map(dvd => dvd.id === id ? { ...dvd, status } : dvd));
    } catch (err) {
      setError('Error updating status: ' + err.message);
      console.error('Error updating status:', err);
    }
  };

  const handleShip = async (uid, movie) => {
    console.log(`Shipping ${movie.title} to UID: ${uid}`);
    // Placeholder for shipping logic
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
            <UserQueueList userQueues={userQueues} dvds={dvds} userDetails={userDetails} onShip={handleShip} />
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