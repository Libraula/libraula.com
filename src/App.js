import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiBookOpen, FiDownload, FiHome, FiUsers } from 'react-icons/fi';
import logo from './logo.png';
import './App.css';

function App() {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const trendingBooks = [
    { title: "The Great Gatsby", rank: 1, image: "https://m.media-amazon.com/images/I/81K1jbUMmFL._SL1500_.jpg" },
    { title: "To Kill a Mockingbird", rank: 2, image: "https://m.media-amazon.com/images/I/81c6aew79KL._SL1500_.jpg" },
    { title: "One Piece Vol. 1", rank: 3, image: "https://m.media-amazon.com/images/I/71y+XnBXm4L._SL1000_.jpg" },
    { title: "Sapiens: A Brief History of Humankind", rank: 4, image: "https://m.media-amazon.com/images/I/713jIoMO3UL._SL1500_.jpg" },
    { title: "Watchmen", rank: 5, image: "https://m.media-amazon.com/images/I/81ChVC6dpOL._SL1500_.jpg" },
    { title: "Red Rising", rank: 6, image: "https://m.media-amazon.com/images/I/81NIgmAqy+L._SL1500_.jpg" }, // Replaced Pride and Prejudice
    { title: "The Hobbit", rank: 7, image: "https://m.media-amazon.com/images/I/81uEDUfKBZL._SL1500_.jpg" },
    { title: "Maus", rank: 8, image: "https://m.media-amazon.com/images/I/71nXxfnNEcL._SL1375_.jpg" },
    { title: "Educated", rank: 9, image: "https://m.media-amazon.com/images/I/71N2HZwRo3L._SL1500_.jpg" },
    { title: "Chainsaw Man Vol. 1", rank: 10, image: "https://m.media-amazon.com/images/I/81EyGIrto3L._SL1500_.jpg" },
  ];

  const faqItems = [
    {
      question: "What is Libraula?",
      answer: "Libraula is a book rental service offering a wide variety of novels, non-fiction, manga, comics, and graphic novels delivered to your door. Enjoy unlimited rentals with no late fees and free shipping both ways."
    },
    {
      question: "How much does Libraula cost?",
      answer: "Plans start at UGX 7,900 per month. Choose your book limit and enjoy flexible, affordable access to thousands of titles."
    },
    {
      question: "Where can I read?",
      answer: "Read your rented books anywhere—at home, on the go, or wherever you like. No device required, just a love for reading!"
    },
    {
      question: "How do I cancel?",
      answer: "Cancel anytime through your account settings—no hidden fees or penalties."
    },
    {
      question: "What can I read on Libraula?",
      answer: "Explore over 100,000 titles, including novels, non-fiction, manga, comics, graphic novels, and rare finds not available in many libraries or bookstores."
    },
    {
      question: "Is Libraula good for kids?",
      answer: "Yes! Create profiles for kids to enjoy family-friendly books included with your membership."
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
          <h1>Unlimited books, from novels to manga, and more</h1>
          <p className="hero-subtitle">Starts at UGX 7,900. Cancel anytime.</p>
          <p className="hero-text">Ready to read? Enter your email to create or restart your membership.</p>
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
        <div className="modern-book-grid">
          {trendingBooks.map((book, index) => (
            <div key={index} className="modern-book-card">
              <div className="card-image-container">
                <img src={book.image} alt={`${book.title} cover`} className="book-image" />
                <div className="card-rank">{book.rank}</div>
              </div>
              <div className="modern-book-info">
                <h3>{book.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2>More Reasons to Join</h2>
        <div className="features-grid">
          <div className="feature-item">
            <FiBookOpen className="feature-icon" />
            <h3>Read your favorites</h3>
            <p>Enjoy novels, manga, comics, and more delivered straight to your doorstep.</p>
          </div>
          <div className="feature-item">
            <FiDownload className="feature-icon" />
            <h3>Rent books to enjoy offline</h3>
            <p>Order your favorites easily and always have something to read, no Wi-Fi needed.</p>
          </div>
          <div className="feature-item">
            <FiHome className="feature-icon" />
            <h3>Read anywhere</h3>
            <p>Take your books home, to the park, or on vacation—read wherever you are.</p>
          </div>
          <div className="feature-item">
            <FiUsers className="feature-icon" />
            <h3>Create profiles for kids</h3>
            <p>Let kids dive into age-appropriate books—free with your membership.</p>
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
          <p>Ready to read? Enter your email to create or restart your membership.</p>
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
            <a href="#">Ways to Read</a>
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