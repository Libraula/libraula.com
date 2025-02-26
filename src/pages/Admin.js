import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { 
  AlertCircle, 
  Package, 
  Film, 
  UserCheck, 
  PlusCircle, 
  Send, 
  List 
} from 'lucide-react';
import '../styles/admin.css';

// View Component: AddDvdForm (Unchanged)
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
      <div className="card-header">
        <PlusCircle className="card-icon" />
        <h2>Add New DVD</h2>
      </div>
      <form onSubmit={handleSubmit} className="add-dvd-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            id="title"
            type="text" 
            placeholder="Enter title" 
            value={newDvd.title} 
            onChange={(e) => setNewDvd({ ...newDvd, title: e.target.value })} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input 
            id="image"
            type="text" 
            placeholder="400x600 recommended" 
            value={newDvd.img} 
            onChange={(e) => setNewDvd({ ...newDvd, img: e.target.value })} 
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="synopsis">Synopsis</label>
          <textarea 
            id="synopsis"
            placeholder="Movie description" 
            value={newDvd.synopsis} 
            onChange={(e) => setNewDvd({ ...newDvd, synopsis: e.target.value })} 
            required 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <input 
              id="rating"
              type="text" 
              placeholder="PG, PG-13, R" 
              value={newDvd.rating} 
              onChange={(e) => setNewDvd({ ...newDvd, rating: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input 
              id="genre"
              type="text" 
              placeholder="Action, Comedy" 
              value={newDvd.genre} 
              onChange={(e) => setNewDvd({ ...newDvd, genre: e.target.value })} 
              required 
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="director">Director</label>
            <input 
              id="director"
              type="text" 
              placeholder="Director name" 
              value={newDvd.director} 
              onChange={(e) => setNewDvd({ ...newDvd, director: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input 
              id="year"
              type="text" 
              placeholder="Release year" 
              value={newDvd.year} 
              onChange={(e) => setNewDvd({ ...newDvd, year: e.target.value })} 
              required 
            />
          </div>
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="cast">Cast</label>
          <input 
            id="cast"
            type="text" 
            placeholder="Comma-separated names" 
            value={newDvd.cast} 
            onChange={(e) => setNewDvd({ ...newDvd, cast: e.target.value })} 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Availability</label>
            <select 
              id="status"
              value={newDvd.status} 
              onChange={(e) => setNewDvd({ ...newDvd, status: e.target.value })}
            >
              <option value="Available">Available</option>
              <option value="Short Wait">Short Wait</option>
              <option value="Long Wait">Long Wait</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="format">Format</label>
            <select 
              id="format"
              value={newDvd.format} 
              onChange={(e) => setNewDvd({ ...newDvd, format: e.target.value })}
            >
              <option value="DVD">DVD</option>
              <option value="Blu-ray">Blu-ray</option>
            </select>
          </div>
        </div>
        
        <div className="form-group new-release-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newDvd.newRelease}
              onChange={(e) => setNewDvd({ ...newDvd, newRelease: e.target.checked })}
            />
            <span>New Release</span>
          </label>
        </div>
        
        <button type="submit" className="admin-button">
          <PlusCircle size={18} />
          <span>Add DVD</span>
        </button>
      </form>
    </div>
  );
};

// View Component: DvdList (Unchanged)
const DvdList = ({ dvds, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredDvds = dvds.filter(dvd => {
    const matchesSearch = dvd.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || dvd.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-card">
      <div className="card-header">
        <Film className="card-icon" />
        <h2>Manage DVDs</h2>
      </div>
      
      <div className="filter-controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="status-filter">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Short Wait">Short Wait</option>
            <option value="Long Wait">Long Wait</option>
          </select>
        </div>
      </div>
      
      <div className="table-container">
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
            {filteredDvds.length > 0 ? (
              filteredDvds.map((dvd) => (
                <tr key={dvd.id}>
                  <td className="id-column">{dvd.id.substring(0, 6)}...</td>
                  <td className="title-column">{dvd.title}</td>
                  <td>{dvd.format}</td>
                  <td>
                    <span className={`status-badge ${dvd.status.toLowerCase().replace(' ', '-')}`}>
                      {dvd.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="status-select"
                      value={dvd.status} 
                      onChange={(e) => onUpdateStatus(dvd.id, e.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Short Wait">Short Wait</option>
                      <option value="Long Wait">Long Wait</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No DVDs match your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="table-pagination">
        <span className="showing-text">Showing {filteredDvds.length} of {dvds.length} DVDs</span>
      </div>
    </div>
  );
};

// Updated View Component: UserQueueList
const UserQueueList = ({ userQueues, dvds, userDetails, onShip }) => {
  const [expandedUsers, setExpandedUsers] = useState({});
  
  const toggleUserExpand = (uid) => {
    setExpandedUsers(prev => ({
      ...prev,
      [uid]: !prev[uid]
    }));
  };
  
  return (
    <div className="admin-card">
      <div className="card-header">
        <UserCheck className="card-icon" />
        <h2>User Queues</h2>
      </div>
      
      {Object.keys(userQueues).length > 0 ? (
        <div className="user-queue-container">
          {Object.entries(userQueues).map(([uid, queue]) => {
            const user = userDetails[uid] || { 
              name: 'Unknown User', 
              email: 'N/A',
              phoneNumber: 'N/A', // Added default phone number
              shippingAddress: { line1: 'N/A', city: 'N/A', state: 'N/A', zip: 'N/A' } 
            };
            const isExpanded = expandedUsers[uid] || false;
            
            return (
              <div key={uid} className={`user-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="user-card-header" onClick={() => toggleUserExpand(uid)}>
                  <div className="user-info-summary">
                    <h3>{user.name}</h3>
                    <span className="queue-count">{queue.length} items</span>
                  </div>
                  <div className="expand-icon">
                    {isExpanded ? '−' : '+'}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="user-card-content">
                    <div className="user-details">
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                      <p><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>
                      <p><strong>Location:</strong> {user.shippingAddress.line1}, {user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zip}</p>
                    </div>
                    
                    <div className="queue-list">
                      <h4>Queue Items</h4>
                      {queue.length > 0 ? (
                        <ul className="queue-items-list">
                          {queue.map((movie, index) => {
                            const dvd = dvds.find((d) => d.id === movie.id) || { status: 'Unknown' };
                            const statusClass = dvd.status.toLowerCase().replace(' ', '-');
                            
                            return (
                              <li key={`${movie.id}-${index}`} className="queue-item">
                                <div className="queue-item-info">
                                  <span className="queue-position">{index + 1}.</span>
                                  <span className="movie-title">{movie.title}</span>
                                  <span className={`status-indicator ${statusClass}`}>
                                    {dvd.status}
                                  </span>
                                </div>
                                
                                {dvd.status === 'Available' && (
                                  <button 
                                    className="ship-button" 
                                    onClick={() => onShip(uid, movie)}
                                  >
                                    <Send size={16} />
                                    <span>Ship</span>
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="empty-queue">No items in queue</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-users-message">
          <p>No user queues available</p>
        </div>
      )}
    </div>
  );
};

// Loading Component (Unchanged)
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Error Component (Unchanged)
const ErrorMessage = ({ message }) => (
  <div className="error-container">
    <AlertCircle size={40} />
    <h2>Error</h2>
    <p>{message}</p>
    <button className="retry-button" onClick={() => window.location.reload()}>
      Retry
    </button>
  </div>
);

// Main Admin Component (Unchanged)
function Admin() {
  const [activeSection, setActiveSection] = useState('add-dvd');
  const [dvds, setDvds] = useState([]);
  const [userQueues, setUserQueues] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const userId = user.uid;
        const adminDocRef = doc(db, 'admins', userId);
        const adminDocSnapshot = await getDoc(adminDocRef);
        const adminStatus = adminDocSnapshot.exists();
        setIsAdmin(adminStatus);

        if (adminStatus) {
          const dvdSnapshot = await getDocs(collection(db, 'dvds'));
          const dvdList = dvdSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDvds(dvdList);

          const queueSnapshot = await getDocs(collection(db, 'userQueues'));
          const queues = {};
          queueSnapshot.forEach(doc => {
            queues[doc.id] = doc.data().queue || [];
          });
          setUserQueues(queues);

          const userSnapshot = await getDocs(collection(db, 'users'));
          const details = {};
          userSnapshot.forEach(doc => {
            details[doc.id] = doc.data();
          });
          setUserDetails(details);
        }
      } catch (err) {
        setError(`Failed to load admin data: ${err.message}`);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="Admin"><Navbar /><LoadingSpinner /></div>;
  if (!isAdmin) return <Navigate to="/home" />;
  if (error) return <div className="Admin"><Navbar /><ErrorMessage message={error} /></div>;

  const handleAddDvd = async (dvd) => {
    try {
      const docRef = await addDoc(collection(db, 'dvds'), dvd);
      setDvds(prev => [...prev, { ...dvd, id: docRef.id }]);
      return true;
    } catch (err) {
      setError('Error adding DVD: ' + err.message);
      return false;
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const dvdRef = doc(db, 'dvds', id);
      await updateDoc(dvdRef, { status });
      setDvds(prev => prev.map(dvd => dvd.id === id ? { ...dvd, status } : dvd));
    } catch (err) {
      setError('Error updating status: ' + err.message);
    }
  };

  const handleShip = async (uid, movie) => {
    // Placeholder for shipping logic
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="Admin">
      <Navbar />
      <div className="mobile-nav-toggle" onClick={toggleSidebar}>
        <List size={24} />
        <span>Menu</span>
      </div>
      
      <div className="admin-container">
        <aside className={`admin-sidebar ${sidebarOpen ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h3>Admin Panel</h3>
            <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>×</button>
          </div>
          
          <ul className="sidebar-nav">
            <li className={activeSection === 'add-dvd' ? 'active' : ''} onClick={() => { setActiveSection('add-dvd'); setSidebarOpen(false); }}>
              <PlusCircle size={18} />
              <span>Add New DVD</span>
            </li>
            <li className={activeSection === 'manage-dvds' ? 'active' : ''} onClick={() => { setActiveSection('manage-dvds'); setSidebarOpen(false); }}>
              <Film size={18} />
              <span>Manage DVDs</span>
            </li>
            <li className={activeSection === 'user-queues' ? 'active' : ''} onClick={() => { setActiveSection('user-queues'); setSidebarOpen(false); }}>
              <UserCheck size={18} />
              <span>User Queues</span>
            </li>
          </ul>
          
          <div className="sidebar-footer">
            <p>Libraula Admin</p>
            <p className="version">v2.0.0</p>
          </div>
        </aside>
        
        <main className="admin-content">
          <div className="content-header">
            <h1>
              {activeSection === 'add-dvd' && 'Add New DVD'}
              {activeSection === 'manage-dvds' && 'Manage DVD Inventory'}
              {activeSection === 'user-queues' && 'User Queue Management'}
            </h1>
          </div>
          
          <div className="content-body">
            {activeSection === 'add-dvd' && <AddDvdForm onAddDvd={handleAddDvd} />}
            {activeSection === 'manage-dvds' && <DvdList dvds={dvds} onUpdateStatus={handleUpdateStatus} />}
            {activeSection === 'user-queues' && (
              <UserQueueList userQueues={userQueues} dvds={dvds} userDetails={userDetails} onShip={handleShip} />
            )}
          </div>
        </main>
      </div>
      
      <div className={`overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      <footer className="Admin-footer">
        <div className="footer-content">
          <p>© 2025 Libraula</p>
          <p>Admin Portal v2.0.0</p>
        </div>
      </footer>
    </div>
  );
}

export default Admin;