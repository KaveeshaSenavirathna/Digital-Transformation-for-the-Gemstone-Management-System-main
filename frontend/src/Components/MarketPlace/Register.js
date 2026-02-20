import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../Styles/MRegister.css"; // Import the CSS file

function Register() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 1) return "weak";
    if (strength <= 2) return "medium";
    return "strong";
  };

  // Check password requirements
  const checkRequirement = (requirement) => {
    const password = form.password;
    switch(requirement) {
      case "length":
        return password.length >= 8;
      case "uppercase":
        return /[A-Z]/.test(password);
      case "lowercase":
        return /[a-z]/.test(password);
      case "number":
        return /\d/.test(password);
      case "special":
        return /[^a-zA-Z0-9]/.test(password);
      default:
        return false;
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(form.name)) {
      newErrors.name = "Name should only contain letters";
    }
    
    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength === "weak") {
      newErrors.password = "Password is too weak. Please use a stronger password";
    }
    
    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Terms validation
    if (!form.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setForm({ ...form, [name]: newValue });
    
    // Calculate password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
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
      await api.post("/auth/Register", {
        name: form.name,
        email: form.email,
        password: form.password
      });
      
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login_web"), 1500);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="register-logo">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join Gem Marketplace today</p>
        </div>

        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className={`form-input ${errors.name ? 'error' : form.name && !errors.name ? 'success' : ''}`}
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="error-message">
                <span>⚠️</span> {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className={`form-input ${errors.email ? 'error' : form.email && !errors.email ? 'success' : ''}`}
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
              className={`form-input ${errors.password ? 'error' : ''}`}
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="error-message">
                <span>⚠️</span> {errors.password}
              </p>
            )}
            
            {/* Password Strength Indicator */}
            {form.password && (
              <>
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill strength-${passwordStrength}`}></div>
                  </div>
                  <p className={`strength-text ${passwordStrength}`}>
                    Password strength: <strong>{passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}</strong>
                  </p>
                </div>
                
                {/* Password Requirements */}
                <div className="password-requirements">
                  <div className={`requirement ${checkRequirement('length') ? 'met' : ''}`}>
                    <span className="icon">{checkRequirement('length') ? '✓' : '○'}</span>
                    At least 8 characters
                  </div>
                  <div className={`requirement ${checkRequirement('uppercase') ? 'met' : ''}`}>
                    <span className="icon">{checkRequirement('uppercase') ? '✓' : '○'}</span>
                    One uppercase letter
                  </div>
                  <div className={`requirement ${checkRequirement('lowercase') ? 'met' : ''}`}>
                    <span className="icon">{checkRequirement('lowercase') ? '✓' : '○'}</span>
                    One lowercase letter
                  </div>
                  <div className={`requirement ${checkRequirement('number') ? 'met' : ''}`}>
                    <span className="icon">{checkRequirement('number') ? '✓' : '○'}</span>
                    One number
                  </div>
                  <div className={`requirement ${checkRequirement('special') ? 'met' : ''}`}>
                    <span className="icon">{checkRequirement('special') ? '✓' : '○'}</span>
                    One special character
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className={`form-input ${errors.confirmPassword ? 'error' : form.confirmPassword && !errors.confirmPassword ? 'success' : ''}`}
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="error-message">
                <span>⚠️</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="terms-group">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={form.agreeToTerms}
                onChange={handleChange}
              />
              <span>
                I agree to the{" "}
                <a href="/terms" className="terms-link" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="terms-link" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="error-message">
                <span>⚠️</span> {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`alert-message ${message.includes("successful") ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        {/* Login Link */}
        <div className="login-section">
          <p className="login-text">
            Already have an account?{" "}
            <a href="/login_web" className="login-link">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;