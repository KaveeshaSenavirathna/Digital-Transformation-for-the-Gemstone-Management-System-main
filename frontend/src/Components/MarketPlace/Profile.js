import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Header from "../MarketPlace/Header";
import Footer from "../MarketPlace/Footer";
import "../Styles/Profile.css";

function Profile() {
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login_web");
      return;
    }
    setIsLoggedIn(true);
    fetchProfile();
    fetchNotifications();
    updateCartCount();
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/users/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((total, item) => total + (item.quantity || 1), 0));
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        alert("Your session has expired. Please log in again.");
        navigate("/login_web");
      } else {
        setMessage("Error loading profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setMessage("");
      const res = await api.put("/users/me", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      setMessage("Profile updated successfully!");
      setProfile(res.data);
      setEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      setMessage("Error updating profile. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    )
      return;

    try {
      await api.delete("/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("cart");

      alert("Profile deleted successfully.");
      navigate("/login_web");
    } catch (err) {
      console.error("Error deleting profile:", err.response?.data || err.message);
      setMessage("Error deleting profile. Please try again.");
    }
  };

  const goToCart = () => navigate("/cart");
  const goToProfile = () => navigate("/profile");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setCartCount(0);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Header 
          isLoggedIn={isLoggedIn} 
          cartCount={cartCount} 
          notifications={notifications}
          onLogout={handleLogout}
          onGoToCart={goToCart}
          onGoToProfile={goToProfile}
          onNavigate={navigate}
        />
        
        <main className="profile-main">
          <div className="profile-loading">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Loading your profile...</p>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Header 
        isLoggedIn={isLoggedIn} 
        cartCount={cartCount} 
        notifications={notifications}
        onLogout={handleLogout}
        onGoToCart={goToCart}
        onGoToProfile={goToProfile}
        onNavigate={navigate}
      />

      <main className="profile-main">
        <div className="profile-wrapper">
          <div className="breadcrumb-nav">
            <button className="breadcrumb-item" onClick={() => navigate("/web_home")}>
              <svg className="breadcrumb-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              Home
            </button>
            <svg className="breadcrumb-separator" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <span className="breadcrumb-current">My Profile</span>
          </div>

          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <svg className="avatar-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div className="profile-header-content">
                <h1 className="profile-title">Account Settings</h1>
                <p className="profile-subtitle">Manage your personal information and account preferences</p>
              </div>
            </div>

            {message && (
              <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>
                <div className="alert-content">
                  <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                    {message.includes("Error") ? (
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    )}
                  </svg>
                  <span className="alert-text">{message}</span>
                </div>
              </div>
            )}

            {!editing ? (
              <div className="profile-view">
                <div className="profile-info-grid">
                  <div className="info-card">
                    <div className="info-header">
                      <svg className="info-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                      <div>
                        <h3 className="info-label">Full Name</h3>
                        <p className="info-value">{profile.name || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-header">
                      <svg className="info-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      <div>
                        <h3 className="info-label">Email Address</h3>
                        <p className="info-value">{profile.email || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-header">
                      <svg className="info-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                      <div>
                        <h3 className="info-label">Member Since</h3>
                        <p className="info-value">
                          {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quick-actions">
                  <h3 className="quick-actions-title">Quick Actions</h3>
                  <div className="action-buttons-grid">
                    <button className="action-button primary" onClick={() => navigate("/request_history")}>
                      <svg className="action-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                      </svg>
                      <div className="action-content">
                        <span className="action-title">Order History</span>
                        <span className="action-desc">View your purchase history</span>
                      </div>
                    </button>

                    <button className="action-button secondary" onClick={() => navigate("/cart")}>
                      <svg className="action-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                      </svg>
                      <div className="action-content">
                        <span className="action-title">Shopping Cart</span>
                        <span className="action-desc">{cartCount} items in cart</span>
                      </div>
                    </button>

                    <button className="action-button secondary" onClick={() => navigate("/explore")}>
                      <svg className="action-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                      </svg>
                      <div className="action-content">
                        <span className="action-title">Browse Collection</span>
                        <span className="action-desc">Explore our jewelry</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="profile-actions">
                  <button className="btn btn-primary" onClick={() => setEditing(true)}>
                    <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                    Edit Profile
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Delete Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-edit">
                <div className="edit-header">
                  <h2 className="edit-title">Edit Profile Information</h2>
                  <p className="edit-subtitle">Update your personal details below</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <svg className="label-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <svg className="label-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleUpdate}>
                    <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Save Changes
                  </button>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                    <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;