import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './pages/Home';
import Login from './pages/login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import UserDetails from './pages/UserDetails';
import Subscription from './pages/Subscription';
import NewReleases from './pages/NewReleases';
import MyQueue from './pages/MyQueue';
import Details from './pages/Details';
import Admin from './pages/Admin';
import Account from './pages/Account'; // Add this import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/user-details" element={<UserDetails />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/new-releases" element={<NewReleases />} />
        <Route path="/queue" element={<MyQueue />} />
        <Route path="/movie/:id" element={<Details />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/account" element={<Account />} /> {/* Add this route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);