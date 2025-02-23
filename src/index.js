import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './pages/login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Home from './pages/Home';
import NewReleases from './pages/NewReleases';
import MyQueue from './pages/MyQueue';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Details from './pages/Details';
import UserDetails from './pages/UserDetails';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/new-releases" element={<NewReleases />} />
        <Route path="/queue" element={<MyQueue />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/movie/:id" element={<Details />} />
        <Route path="/user-details" element={<UserDetails />} /> {/* New route */}
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();