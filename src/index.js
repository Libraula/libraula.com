import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DvdProvider } from './DvdContext'; // New import
import { QueueProvider } from './QueueContext';
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
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DvdProvider> {/* Add DvdProvider */}
      <QueueProvider>
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
          </Routes>
        </Router>
      </QueueProvider>
    </DvdProvider>
  </React.StrictMode>
);

reportWebVitals();