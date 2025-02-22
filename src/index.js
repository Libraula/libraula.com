import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './login';
import Signup from './Signup';
import Pricing from './Pricing';
import Home from './Home';
import NewReleases from './NewReleases';
import MyQueue from './MyQueue';
import Account from './Account';
import Admin from './Admin'; // New import
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
        <Route path="/admin" element={<Admin />} /> {/* Admin route */}
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();