import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiMonitor, FiDownload, FiSmartphone, FiUsers } from 'react-icons/fi';
import logo from './logo.png'; // Import logo from same folder as App.js
import './App.css';

function App() {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const trendingMovies = [
    { title: "Young, Famous & African", rank: 1 },
    { title: "The Night Agent", rank: 2 },
    { title: "Squid Game", rank: 3 },
    { title: "Back in Action", rank: 4 },
    { title: "Zero Day", rank: 5 },
    { title: "Prison Break", rank: 6 },
    { title: "The 31st Annual Screen Actors Guild Awards", rank: 7 },
    { title: "Kinda Pregnant", rank: 8 },
    { title: "The Recruit", rank: 9 },
    { title: "Sex/Life", rank: 10 },
  ];

  const faqItems = [
    {
      question: "What is Libraula?",
      answer: "Libraula is a DVD and Blu-ray rental service that offers a wide variety of movies and TV shows delivered to your door. Enjoy unlimited rentals with no late fees and free shipping both ways."
    },
    {
      question: "How much does Libraula cost?",
      answer: "Plans start at UGX 7,900 per month. Choose your disc limit and enjoy flexible, affordable access to thousands of titles."
    },
    {
      question: "Where can I watch?",
      answer: "Watch your rented DVDs on any compatible DVD or Blu-ray player at home."
    },
    {
      question: "How do I cancel?",
      answer: "Cancel anytime through your account settings—no hidden fees or penalties."
    },
    {
      question: "What can I watch on Libraula?",
      answer: "Explore over 100,000 titles, including movies, TV shows, and rare finds not available on streaming platforms."
    },
    {
      question: "Is Libraula good for kids?",
      answer: "Yes! Create profiles for kids to enjoy family-friendly content included with your membership."
    }
  ];

  return (
    <div className="modern-app">
      <header className="modern-header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Libraula Logo" className="logo" />
          </Link>
          <Link to="/login" className="signin-button">Sign In</Link>
        </div>
        <div className="hero-overlay"></div>
        <div className="modern-hero-content">
          <h1>Unlimited movies, TV shows, and more</h1>
          <p className="hero-subtitle">Starts at UGX 7,900. Cancel anytime.</p>
          <p className="hero-text">Ready to watch? Enter your email to create or restart your membership.</p>
          <div className="hero-actions">
            <input type="email" placeholder="Email address" className="email-input" />
            <Link to="/signup">
              <button className="primary-button">Get Started</button>
            </Link>
          </div>
        </div>
      </header>

      <section className="trending-section">
        <h2>Trending Now</h2>
        <div className="modern-movie-grid">
          {trendingMovies.map((movie, index) => (
            <div key={index} className="modern-movie-card">
              <div className="card-rank">{movie.rank}</div>
              <div className="modern-movie-info">
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2>More Reasons to Join</h2>
        <div className="features-grid">
          <div className="feature-item">
            <FiMonitor className="feature-icon" />
            <h3>Enjoy on your TV</h3>
            <p>Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
          </div>
          <div className="feature-item">
            <FiDownload className="feature-icon" />
            <h3>Rent your DVDs to watch offline</h3>
            <p>Order your favorites easily and always have something to watch.</p>
          </div>
          <div className="feature-item">
            <FiSmartphone className="feature-icon" />
            <h3>Watch everywhere</h3>
            <p>Enjoy unlimited DVDs on any compatible player at home.</p>
          </div>
          <div className="feature-item">
            <FiUsers className="feature-icon" />
            <h3>Create profiles for kids</h3>
            <p>Send kids on adventures with their favorite characters—free with your membership.</p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <h3>{item.question}</h3>
                {faqOpen === index ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {faqOpen === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="cta-container">
          <p>Ready to watch? Enter your email to create or restart your membership.</p>
          <div className="hero-actions">
            <input type="email" placeholder="Email address" className="email-input" />
            <Link to="/signup">
              <button className="primary-button">Get Started</button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#">FAQ</a>
            <a href="#">Help Center</a>
            <a href="#">Account</a>
            <a href="#">Media Center</a>
            <a href="#">Investor Relations</a>
            <a href="#">Jobs</a>
            <a href="#">Ways to Watch</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy</a>
            <a href="#">Cookie Preferences</a>
            <a href="#">Corporate Information</a>
            <a href="#">Contact Us</a>
            <a href="#">Speed Test</a>
            <a href="#">Legal Notices</a>
            <a href="#">Only on Libraula</a>
          </div>
          <p className="copyright">Libraula Uganda • © 2025 Libraula. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;