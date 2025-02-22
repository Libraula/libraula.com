import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">Libraula</div>
        <div className="header-content">
          <h1>Unlimited DVDs & Blu-rays, Delivered</h1>
          <p>Over 100,000 titles. No late fees. Free shipping both ways. Try it free for 30 days.</p>
          <input type="email" placeholder="Email address" className="email-input" />
          <Link to="/signup">
            <button className="App-button">Get Started</button>
          </Link>
        </div>
      </header>
      <section className="promo-banner">
        <h2>Watch What You Want, When You Want</h2>
        <p>Plans starting at $7.99/month. Cancel anytime.</p>
      </section>
      <section className="how-it-works">
        <h2>How Libraula Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Create Account</h3>
            <p>Sign up with your details.</p>
          </div>
          <div className="step">
            <h3>2. Choose Plan</h3>
            <p>Select your disc limit.</p>
          </div>
          <div className="step">
            <h3>3. Get Delivered</h3>
            <p>Receive DVDs by mail.</p>
          </div>
        </div>
      </section>
      <section className="App-features">
        <div className="feature">
          <h2>Huge Selection</h2>
          <p>Thousands of titles, including rare finds not on streaming.</p>
        </div>
        <div className="feature">
          <h2>No Late Fees</h2>
          <p>Keep discs as long as you like—no rush, no penalties.</p>
        </div>
        <div className="feature">
          <h2>Free Shipping</h2>
          <p>Delivered and returned with prepaid envelopes.</p>
        </div>
        <div className="feature">
          <h2>Blu-ray Included</h2>
          <p>High-def rentals at no extra cost.</p>
        </div>
      </section>
      <section className="testimonials">
        <h2>What Members Say</h2>
        <div className="quotes">
          <p>"Perfect for movie buffs like me—tons of classics!" - Jane D.</p>
          <p>"No late fees is a game-changer. Love it." - Mark S.</p>
        </div>
      </section>
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How long can I keep a disc?</h3>
          <p>As long as you want—no due dates!</p>
        </div>
        <div className="faq-item">
          <h3>Is shipping really free?</h3>
          <p>Yes, both ways, with prepaid envelopes.</p>
        </div>
      </section>
      <footer className="App-footer">
        <div className="footer-links">
          <a href="#">FAQ</a> | <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy</a>
        </div>
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;