import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { 
  AlertCircle, 
  Package, 
  BookOpen,
  UserCheck, 
  PlusCircle, 
  Send, 
  List,
  Truck,
  RotateCcw,
  Star
} from 'lucide-react';
import '../styles/admin.css';

// View Component: AddBookForm (unchanged except for adding featured field)
const AddBookForm = ({ onAddBook }) => {
  const [newBook, setNewBook] = useState({
    title: '',
    img: 'https://placehold.co/400x600?text=New+Book',
    img2: '',
    img3: '',
    img4: '',
    synopsis: '',
    pages: '',
    genre: '',
    author: '',
    year: '',
    cast: '',
    status: 'Available',
    format: 'Hardcover',
    newRelease: false,
    featured: false, // Added featured field
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookToAdd = {
      ...newBook,
      cast: newBook.cast ? newBook.cast.split(',').map(name => name.trim()) : [],
      images: [newBook.img, newBook.img2, newBook.img3, newBook.img4].filter(img => img),
      createdAt: new Date().toISOString(),
    };
    await onAddBook(bookToAdd);
    setNewBook({
      title: '',
      img: 'https://placehold.co/400x600?text=New+Book',
      img2: '',
      img3: '',
      img4: '',
      synopsis: '',
      pages: '',
      genre: '',
      author: '',
      year: '',
      cast: '',
      status: 'Available',
      format: 'Hardcover',
      newRelease: false,
      featured: false,
    });
  };

  return (
    <div className="admin-card">
      <div className="card-header">
        <PlusCircle className="card-icon" />
        <h2>Add New Book</h2>
      </div>
      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            id="title"
            type="text" 
            placeholder="Enter title" 
            value={newBook.title} 
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Cover Image URL</label>
          <input 
            id="image"
            type="text" 
            placeholder="400x600 recommended" 
            value={newBook.img} 
            onChange={(e) => setNewBook({ ...newBook, img: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image2">Additional Image 1 URL</label>
          <input 
            id="image2"
            type="text" 
            placeholder="Optional additional image" 
            value={newBook.img2} 
            onChange={(e) => setNewBook({ ...newBook, img2: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image3">Additional Image 2 URL</label>
          <input 
            id="image3"
            type="text" 
            placeholder="Optional additional image" 
            value={newBook.img3} 
            onChange={(e) => setNewBook({ ...newBook, img3: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image4">Additional Image 3 URL</label>
          <input 
            id="image4"
            type="text" 
            placeholder="Optional additional image" 
            value={newBook.img4} 
            onChange={(e) => setNewBook({ ...newBook, img4: e.target.value })} 
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="synopsis">Synopsis</label>
          <textarea 
            id="synopsis"
            placeholder="Book description"
            value={newBook.synopsis} 
            onChange={(e) => setNewBook({ ...newBook, synopsis: e.target.value })} 
            required 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pages">Pages</label>
            <input 
              id="pages"
              type="number"
              placeholder="Number of pages"
              value={newBook.pages} 
              onChange={(e) => setNewBook({ ...newBook, pages: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input 
              id="genre"
              type="text" 
              placeholder="Novels, Manga"
              value={newBook.genre} 
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })} 
              required 
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input 
              id="author"
              type="text" 
              placeholder="Author name"
              value={newBook.author} 
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input 
              id="year"
              type="text" 
              placeholder="Publication year"
              value={newBook.year} 
              onChange={(e) => setNewBook({ ...newBook, year: e.target.value })} 
              required 
            />
          </div>
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="cast">Co-authors/Illustrators</label>
          <input 
            id="cast"
            type="text" 
            placeholder="Comma-separated names (optional)"
            value={newBook.cast} 
            onChange={(e) => setNewBook({ ...newBook, cast: e.target.value })} 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Availability</label>
            <select 
              id="status"
              value={newBook.status} 
              onChange={(e) => setNewBook({ ...newBook, status: e.target.value })}
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
              value={newBook.format} 
              onChange={(e) => setNewBook({ ...newBook, format: e.target.value })}
            >
              <option value="Hardcover">Hardcover</option>
              <option value="Paperback">Paperback</option>
              <option value="Manga">Manga</option>
            </select>
          </div>
        </div>
        
        <div className="form-group new-release-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newBook.newRelease}
              onChange={(e) => setNewBook({ ...newBook, newRelease: e.target.checked })}
            />
            <span>New Release</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newBook.featured}
              onChange={(e) => setNewBook({ ...newBook, featured: e.target.checked })}
            />
            <span>Set as Featured</span>
          </label>
        </div>
        
        <button type="submit" className="admin-button">
          <PlusCircle size={18} />
          <span>Add Book</span>
        </button>
      </form>
    </div>
  );
};

// Updated View Component: BookList
const BookList = ({ books, onUpdateStatus, onSetFeatured }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-card">
      <div className="card-header">
        <BookOpen className="card-icon" />
        <h2>Manage Books</h2>
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
            <option value="Preparing">Preparing</option>
            <option value="Delivered">Delivered</option>
            <option value="Return Requested">Return Requested</option>
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <table className="book-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Format</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td className="id-column">{book.id.substring(0, 6)}...</td>
                  <td className="title-column">{book.title}</td>
                  <td>{book.format}</td>
                  <td>
                    <span className={`status-badge ${book.status.toLowerCase().replace(' ', '-')}`}>
                      {book.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`featured-toggle ${book.featured ? 'active' : ''}`}
                      onClick={() => onSetFeatured(book.id, !book.featured)}
                    >
                      <Star size={16} />
                      {book.featured ? 'Featured' : 'Set Featured'}
                    </button>
                  </td>
                  <td>
                    <select 
                      className="status-select"
                      value={book.status} 
                      onChange={(e) => onUpdateStatus(book.id, e.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Short Wait">Short Wait</option>
                      <option value="Long Wait">Long Wait</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Return Requested">Return Requested</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">No books match your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="table-pagination">
        <span className="showing-text">Showing {filteredBooks.length} of {books.length} books</span>
      </div>
    </div>
  );
};

// View Component: PreparingList (unchanged)
const PreparingList = ({ userQueues, userDetails, onDeliver }) => {
  const preparingItems = [];
  Object.entries(userQueues).forEach(([uid, queues]) => {
    const user = userDetails[uid] || { 
      firstName: 'Unknown', 
      lastName: 'User', 
      phoneNumber: 'N/A',
      shippingAddress: { line1: 'N/A', city: 'N/A', state: 'N/A', zip: 'N/A' } 
    };
    const fullName = `${user.firstName} ${user.lastName}`;
    (queues.preparing || []).forEach(book => {
      preparingItems.push({ uid, book, user: { fullName, ...user } });
    });
  });

  return (
    <div className="admin-card">
      <div className="card-header">
        <Package className="card-icon" />
        <h2>Items in Preparing ({preparingItems.length})</h2>
      </div>
      
      {preparingItems.length > 0 ? (
        <div className="user-queue-container">
          {preparingItems.map(({ uid, book, user }) => (
            <div key={`${uid}-${book.id}`} className="user-card">
              <div className="user-card-content">
                <div className="user-details">
                  <p><strong>Name:</strong> {user.fullName}</p>
                  <p><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>
                  <p><strong>Location:</strong> {user.shippingAddress.line1}, {user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zip}</p>
                </div>
                <div className="queue-list">
                  <h4>Item</h4>
                  <ul className="queue-items-list">
                    <li className="queue-item">
                      <div className="queue-item-info">
                        <span className="book-title">{book.title}</span>
                        <span className={`status-indicator ${book.status.toLowerCase().replace(' ', '-')}`}>
                          {book.status}
                        </span>
                      </div>
                      <button 
                        className="deliver-button" 
                        onClick={() => onDeliver(uid, book)}
                      >
                        <Truck size={16} />
                        <span>Deliver</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-users-message">
          <p>No items currently in Preparing</p>
        </div>
      )}
    </div>
  );
};

// View Component: ReturnRequestsList (unchanged)
const ReturnRequestsList = ({ userQueues, userDetails }) => {
  const returnItems = [];
  Object.entries(userQueues).forEach(([uid, queues]) => {
    const user = userDetails[uid] || { 
      firstName: 'Unknown', 
      lastName: 'User', 
      phoneNumber: 'N/A',
      shippingAddress: { line1: 'N/A', city: 'N/A', state: 'N/A', zip: 'N/A' } 
    };
    const fullName = `${user.firstName} ${user.lastName}`;
    (queues.returnRequests || []).forEach(book => {
      returnItems.push({ uid, book, user: { fullName, ...user } });
    });
  });

  return (
    <div className="admin-card">
      <div className="card-header">
        <RotateCcw className="card-icon" />
        <h2>Return Requests ({returnItems.length})</h2>
      </div>
      
      {returnItems.length > 0 ? (
        <div className="user-queue-container">
          {returnItems.map(({ uid, book, user }) => (
            <div key={`${uid}-${book.id}`} className="user-card">
              <div className="user-card-content">
                <div className="user-details">
                  <p><strong>Name:</strong> {user.fullName}</p>
                  <p><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>
                  <p><strong>Location:</strong> {user.shippingAddress.line1}, {user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zip}</p>
                </div>
                <div className="queue-list">
                  <h4>Item</h4>
                  <ul className="queue-items-list">
                    <li className="queue-item">
                      <div className="queue-item-info">
                        <span className="book-title">{book.title}</span>
                        <span className={`status-indicator ${book.status.toLowerCase().replace(' ', '-')}`}>
                          {book.status}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-users-message">
          <p>No return requests currently</p>
        </div>
      )}
    </div>
  );
};

// View Component: UserQueueList (unchanged)
const UserQueueList = ({ userQueues, books, userDetails, onShip }) => {
  const [expandedUsers, setExpandedUsers] = useState({});
  const [queueNotifications, setQueueNotifications] = useState({});
  const [prevQueues, setPrevQueues] = useState(userQueues);

  useEffect(() => {
    console.log('User Queues:', userQueues);
    const newNotifications = { ...queueNotifications };
    Object.entries(userQueues).forEach(([uid, currentQueue]) => {
      const prevQueue = prevQueues[uid]?.queue || [];
      const addedItems = currentQueue.queue.length - prevQueue.length;
      if (addedItems > 0) {
        newNotifications[uid] = (newNotifications[uid] || 0) + addedItems;
        setTimeout(() => {
          setQueueNotifications(prev => ({ ...prev, [uid]: 0 }));
        }, 5000);
      }
    });
    setQueueNotifications(newNotifications);
    setPrevQueues(userQueues);
  }, [userQueues]);

  const toggleUserExpand = (uid) => {
    setExpandedUsers(prev => ({
      ...prev,
      [uid]: !prev[uid]
    }));
  };

  const totalAddedItems = Object.values(queueNotifications).reduce((sum, count) => sum + count, 0);

  return (
    <div className="admin-card">
      <div className="card-header">
        <UserCheck className="card-icon" />
        <h2>
          User Queues
          {totalAddedItems > 0 && (
            <span className="notification-badge">{totalAddedItems}</span>
          )}
        </h2>
      </div>
      
      {Object.keys(userQueues).length > 0 ? (
        <div className="user-queue-container">
          {Object.entries(userQueues).map(([uid, queueData]) => {
            const user = userDetails[uid] || { 
              firstName: 'Unknown', 
              lastName: 'User', 
              phoneNumber: 'N/A',
              shippingAddress: { line1: 'N/A', city: 'N/A', state: 'N/A', zip: 'N/A' } 
            };
            const fullName = `${user.firstName} ${user.lastName}`;
            const isExpanded = expandedUsers[uid] || false;
            const notificationCount = queueNotifications[uid] || 0;
            const queueItems = queueData.queue || [];

            return (
              <div key={uid} className={`user-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="user-card-header" onClick={() => toggleUserExpand(uid)}>
                  <div className="user-info-summary">
                    <h3>
                      {fullName}
                      {notificationCount > 0 && (
                        <span className="user-notification-badge">{notificationCount}</span>
                      )}
                    </h3>
                    <span className="queue-count">{queueItems.length} items</span>
                  </div>
                  <div className="expand-icon">
                    {isExpanded ? '−' : '+'}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="user-card-content">
                    <div className="user-details">
                      <p><strong>Name:</strong> {fullName}</p>
                      <p><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>
                      <p><strong>Location:</strong> {user.shippingAddress.line1}, {user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zip}</p>
                    </div>
                    
                    <div className="queue-list">
                      <h4>Queue Items</h4>
                      {queueItems.length > 0 ? (
                        <ul className="queue-items-list">
                          {queueItems.map((book, index) => {
                            const bookData = books.find((b) => b.id === book.id) || { status: 'Unknown' };
                            const statusClass = bookData.status.toLowerCase().replace(' ', '-');
                            
                            return (
                              <li key={`${book.id}-${index}`} className="queue-item">
                                <div className="queue-item-info">
                                  <span className="queue-position">{index + 1}.</span>
                                  <span className="book-title">{book.title}</span>
                                  <span className={`status-indicator ${statusClass}`}>
                                    {bookData.status}
                                  </span>
                                </div>
                                
                                {bookData.status === 'Available' && (
                                  <button 
                                    className="ship-button" 
                                    onClick={() => onShip(uid, book)}
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

// Loading Component (unchanged)
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Error Component (unchanged)
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

function Admin() {
  const [activeSection, setActiveSection] = useState('add-book');
  const [books, setBooks] = useState([]);
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
          const bookSnapshot = await getDocs(collection(db, 'books'));
          const bookList = bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBooks(bookList);

          const queueSnapshot = await getDocs(collection(db, 'userQueues'));
          const queues = {};
          queueSnapshot.forEach(doc => {
            queues[doc.id] = {
              queue: doc.data().queue || [],
              preparing: doc.data().preparing || [],
              home: doc.data().home || [],
              returnRequests: doc.data().returnRequests || []
            };
          });
          console.log('Fetched User Queues:', queues);
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

  const handleAddBook = async (book) => {
    try {
      const docRef = await addDoc(collection(db, 'books'), book);
      setBooks(prev => [...prev, { ...book, id: docRef.id }]);
      return true;
    } catch (err) {
      setError('Error adding book: ' + err.message);
      return false;
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const bookRef = doc(db, 'books', id);
      await updateDoc(bookRef, { status });
      setBooks(prev => prev.map(book => book.id === id ? { ...book, status } : book));
    } catch (err) {
      setError('Error updating status: ' + err.message);
    }
  };

  const handleSetFeatured = async (id, featured) => {
    try {
      // If setting a book as featured, ensure only one book is featured
      if (featured) {
        // Unset all other books as featured
        const updates = books.map(book => {
          if (book.id !== id && book.featured) {
            return updateDoc(doc(db, 'books', book.id), { featured: false });
          }
          return Promise.resolve();
        });
        await Promise.all(updates);
      }

      const bookRef = doc(db, 'books', id);
      await updateDoc(bookRef, { featured });
      setBooks(prev => prev.map(book => book.id === id ? { ...book, featured } : { ...book, featured: book.id === id ? featured : false }));
    } catch (err) {
      setError('Error setting featured status: ' + err.message);
    }
  };

  const handleShip = async (uid, book) => {
    try {
      const bookRef = doc(db, 'books', book.id);
      await updateDoc(bookRef, { status: 'Preparing' });
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, status: 'Preparing' } : b));

      const queueDocRef = doc(db, 'userQueues', uid);
      const queueDocSnapshot = await getDoc(queueDocRef);
      const currentData = queueDocSnapshot.exists() ? queueDocSnapshot.data() : { queue: [], preparing: [], home: [], returnRequests: [] };
      
      const updatedQueue = currentData.queue.filter(item => item.id !== book.id);
      const updatedPreparing = [...(currentData.preparing || []), { ...book, status: 'Preparing' }];

      await updateDoc(queueDocRef, {
        queue: updatedQueue,
        preparing: updatedPreparing,
        home: currentData.home || [],
        returnRequests: currentData.returnRequests || []
      });

      setUserQueues(prev => ({
        ...prev,
        [uid]: {
          queue: updatedQueue,
          preparing: updatedPreparing,
          home: prev[uid]?.home || [],
          returnRequests: prev[uid]?.returnRequests || []
        }
      }));
    } catch (err) {
      setError('Failed to ship item: ' + err.message);
      console.error('Error shipping item:', err);
    }
  };

  const handleDeliver = async (uid, book) => {
    try {
      const bookRef = doc(db, 'books', book.id);
      await updateDoc(bookRef, { status: 'Delivered' });
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, status: 'Delivered' } : b));

      const queueDocRef = doc(db, 'userQueues', uid);
      const queueDocSnapshot = await getDoc(queueDocRef);
      const currentData = queueDocSnapshot.exists() ? queueDocSnapshot.data() : { queue: [], preparing: [], home: [], returnRequests: [] };
      
      const updatedPreparing = currentData.preparing.filter(item => item.id !== book.id);
      const updatedHome = [...(currentData.home || []), { ...book, status: 'Delivered' }];

      await updateDoc(queueDocRef, {
        queue: currentData.queue || [],
        preparing: updatedPreparing,
        home: updatedHome,
        returnRequests: currentData.returnRequests || []
      });

      setUserQueues(prev => ({
        ...prev,
        [uid]: {
          queue: prev[uid]?.queue || [],
          preparing: updatedPreparing,
          home: updatedHome,
          returnRequests: prev[uid]?.returnRequests || []
        }
      }));
    } catch (err) {
      setError('Failed to deliver item: ' + err.message);
      console.error('Error delivering item:', err);
    }
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
            <li className={activeSection === 'add-book' ? 'active' : ''} onClick={() => { setActiveSection('add-book'); setSidebarOpen(false); }}>
              <PlusCircle size={18} />
              <span>Add New Book</span>
            </li>
            <li className={activeSection === 'manage-books' ? 'active' : ''} onClick={() => { setActiveSection('manage-books'); setSidebarOpen(false); }}>
              <BookOpen size={18} />
              <span>Manage Books</span>
            </li>
            <li className={activeSection === 'user-queues' ? 'active' : ''} onClick={() => { setActiveSection('user-queues'); setSidebarOpen(false); }}>
              <UserCheck size={18} />
              <span>User Queues</span>
            </li>
            <li className={activeSection === 'preparing' ? 'active' : ''} onClick={() => { setActiveSection('preparing'); setSidebarOpen(false); }}>
              <Package size={18} />
              <span>Preparing</span>
            </li>
            <li className={activeSection === 'return-requests' ? 'active' : ''} onClick={() => { setActiveSection('return-requests'); setSidebarOpen(false); }}>
              <RotateCcw size={18} />
              <span>Return Requests</span>
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
              {activeSection === 'add-book' && 'Add New Book'}
              {activeSection === 'manage-books' && 'Manage Book Inventory'}
              {activeSection === 'user-queues' && 'User Queue Management'}
              {activeSection === 'preparing' && 'Preparing Items Management'}
              {activeSection === 'return-requests' && 'Return Requests Management'}
            </h1>
          </div>
          
          <div className="content-body">
            {activeSection === 'add-book' && <AddBookForm onAddBook={handleAddBook} />}
            {activeSection === 'manage-books' && (
              <BookList books={books} onUpdateStatus={handleUpdateStatus} onSetFeatured={handleSetFeatured} />
            )}
            {activeSection === 'user-queues' && (
              <UserQueueList userQueues={userQueues} books={books} userDetails={userDetails} onShip={handleShip} />
            )}
            {activeSection === 'preparing' && (
              <PreparingList userQueues={userQueues} userDetails={userDetails} onDeliver={handleDeliver} />
            )}
            {activeSection === 'return-requests' && (
              <ReturnRequestsList userQueues={userQueues} userDetails={userDetails} />
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