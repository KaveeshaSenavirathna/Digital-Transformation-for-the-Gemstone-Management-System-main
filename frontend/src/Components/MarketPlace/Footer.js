// components/Footer.js
import React from "react";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section">
              <div className="footer-brand">
                <div className="footer-logo">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="brand-text">
                  <h3>Gem Marketplace</h3>
                  <span className="tagline">Luxury Since 1888</span>
                </div>
              </div>
              <p className="company-description">
                Crafting exceptional jewelry since 1888. We specialize in diamonds, 
                emeralds, rubies, and other precious stones, creating timeless pieces 
                for life's most precious moments.
              </p>
              <div className="footer-social">
                <a href="https://www.facebook.com/login/?locale=en_GB" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/accounts/login/?hl=en" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.439-.645 1.439-1.44-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/login" className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/"><span className="material-icons">home</span>Home</a></li>
                <li><a href="/explore"><span className="material-icons">store</span>Shop</a></li>
                <li><a href="/collections"><span className="material-icons">collections</span>Collections</a></li>
                <li><a href="/about"><span className="material-icons">info</span>About Us</a></li>
                <li><a href="/contact"><span className="material-icons">mail</span>Contact</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-section">
              <h4 className="footer-heading">Categories</h4>
              <ul className="footer-links">
                <li><a href="/diamonds"><span className="material-icons">diamond</span>Diamonds</a></li>
                <li><a href="/rings"><span className="material-icons">loyalty</span>Rings</a></li>
                <li><a href="/necklaces"><span className="material-icons">favorite</span>Necklaces</a></li>
                <li><a href="/earrings"><span className="material-icons">style</span>Earrings</a></li>
                <li><a href="/bracelets"><span className="material-icons">watch</span>Bracelets</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="/shipping"><span className="material-icons">local_shipping</span>Shipping Info</a></li>
                <li><a href="/returns"><span className="material-icons">assignment_return</span>Returns</a></li>
                <li><a href="/size-guide"><span className="material-icons">straighten</span>Size Guide</a></li>
                <li><a href="/care-guide"><span className="material-icons">cleaning_services</span>Care Instructions</a></li>
                <li><a href="/warranty"><span className="material-icons">verified</span>Warranty</a></li>
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div className="footer-section newsletter-section">
              <h4 className="footer-heading">Stay Connected</h4>
              <p className="newsletter-description">Subscribe for exclusive offers and updates</p>
              <div className="newsletter">
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="newsletter-input"
                  />
                  <button className="newsletter-btn">
                    <span className="material-icons">send</span>
                  </button>
                </div>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="material-icons">phone</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <span className="material-icons">email</span>
                  <span>info@gemmarketplace.com</span>
                </div>
                <div className="contact-item">
                  <span className="material-icons">location_on</span>
                  <span>123 Jewelry Street, New York, NY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">&copy; 2025 Gem Marketplace. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;