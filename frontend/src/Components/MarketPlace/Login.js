import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../Styles/MLogin.css"; // Import the CSS file

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Clear general message
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Save authentication data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      if (form.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/web_home"), 1000);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Social Login Handlers
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_BASE}/auth/facebook`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to Gem Marketplace</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className={`form-input ${errors.email ? "error" : ""}`}
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="error-message">
                <span>⚠️</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-input ${errors.password ? "error" : ""}`}
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="error-message">
                <span>⚠️</span> {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Social Login */}
        <div className="social-login">
          <div className="or-separator">
            <span>OR</span>
          </div>
          <div className="social-buttons">
            <button
              type="button"
              className="social-btn google"
              onClick={handleGoogleLogin}
            >
              <svg viewBox="0 0 24 24" className="social-icon">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.7C16.9 3 14.7 2 12 2 6.9 2 2.7 6.2 2.7 11.3S6.9 20.7 12 20.7c6.3 0 8.8-4.4 8.8-6.7 0-.5-.1-.9-.2-1.3H12z"
                />
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              className="social-btn facebook"
              onClick={handleFacebookLogin}
            >
              <svg viewBox="0 0 24 24" className="social-icon">
                <path
                  fill="#1877F2"
                  d="M22 12a10 10 0 10-11.6 9.9v-7h-2.3V12h2.3V9.7c0-2.3 1.4-3.6 3.5-3.6.9 0 1.8.1 2 .1v2.3h-1.1c-1.1 0-1.5.7-1.5 1.5V12h2.6l-.4 2.9h-2.2v7A10 10 0 0022 12z"
                />
              </svg>
              Continue with Facebook
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`alert-message ${
              message.includes("successful") ? "alert-success" : "alert-error"
            }`}
          >
            {message}
          </div>
        )}

        {/* Register Link */}
        <div className="register-section">
          <p className="register-text">
            Don't have an account?{" "}
            <a href="/register" className="register-link">
              Create Account
            </a>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="demo-box">
          <p className="demo-title">Demo Credentials:</p>
          <p className="demo-credentials">
            Email: demo@gemmarketplace.com
            <br />
            Password: demo123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
