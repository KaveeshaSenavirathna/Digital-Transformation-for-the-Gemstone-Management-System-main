import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "../Styles/MForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setIsSuccess(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error sending reset link";
      setError(errorMsg);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        {/* Header Section */}
        <div className="forgot-header">
          <div className="forgot-logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <h1 className="forgot-title">Forgot Password?</h1>
          <p className="forgot-subtitle">
            Don't worry! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="success-state">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <h2 className="success-title">Check Your Email</h2>
            <p className="success-message">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="success-instructions">
              Please check your email and click the link to reset your password. 
              The link will expire in 1 hour for security reasons.
            </p>
            <div className="success-actions">
              <button 
                className="resend-btn"
                onClick={() => {
                  setIsSuccess(false);
                  setMessage("");
                }}
              >
                Send Another Email
              </button>
              <Link to="/login_web" className="back-to-login">
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          /* Form Section */
          <form className="forgot-form" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="alert-message alert-error">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && !isSuccess && (
              <div className="alert-message alert-success">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                {message}
              </div>
            )}

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${error ? 'error' : ''}`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`submit-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Help Text */}
            <div className="help-text">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              <span>
                Can't find the email? Check your spam folder or contact support.
              </span>
            </div>
          </form>
        )}

        {/* Footer Links */}
        <div className="forgot-footer">
          <Link to="/login_web" className="footer-link">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Login
          </Link>
          <span className="footer-divider">•</span>
          <Link to="/register" className="footer-link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
