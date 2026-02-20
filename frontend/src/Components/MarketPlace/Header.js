import React, { useState } from "react";
import "../Styles/Header.css";

const Header = ({
  isLoggedIn,
  cartCount,
  notifications,
  onLogout,
  onGoToCart,
  onGoToProfile,
  onNavigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
    if (onLogout) onLogout();
    else window.location.href = "/";
  };

  const goToCart = () => {
    if (!isLoggedIn) {
      alert("Please log in to view your cart");
      if (onNavigate) onNavigate("/login_web");
      else window.location.href = "/login_web";
      return;
    }
    if (onGoToCart) onGoToCart();
    else window.location.href = "/cart";
  };

  const goToProfile = () => {
    if (!isLoggedIn) {
      alert("Please log in to view your profile");
      if (onNavigate) onNavigate("/login_web");
      else window.location.href = "/login_web";
      return;
    }
    if (onGoToProfile) onGoToProfile();
    else window.location.href = "/profile";
  };

  const goToLogin = () => {
    if (onNavigate) onNavigate("/login_web");
    else window.location.href = "/login_web";
  };

  const goToRegister = () => {
    if (onNavigate) onNavigate("/register");
    else window.location.href = "/register";
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const markNotificationAsRead = (index) => {
    console.log("Mark notification as read:", index);
  };

  const unreadCount = notifications
    ? notifications.filter((n) => !n.read).length
    : 0;

  return (
    <header className="header">
      <div className="header-main">
        <div className="header-container">
          <div className="header-content">
            {/* Logo Section - Left Side */}
            <div className="header-left">
              <div
                className="logo"
                onClick={() =>
                  onNavigate
                    ? onNavigate("/web_home")
                    : (window.location.href = "/web_home")
                }
                style={{ cursor: "pointer" }}
              >
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="logo-text">
                  <h1>GemMarketplace</h1>
                  <span className="tagline">Luxury Since 1888</span>
                </div>
              </div>
            </div>

            {/* Navigation Section - Center */}
            <nav className="header-center">
              <a href="/web_home" className="nav-item" onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate("/web_home");
                else window.location.href = "/web_home";
              }}>
                <span className="material-icons" title="Home">home</span>
                <span className="nav-text">Home</span>
              </a>
              <a href="/explore" className="nav-item" onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate("/explore");
                else window.location.href = "/explore";
              }}>
                <span className="material-icons" title="Shop">store</span>
                <span className="nav-text">Shop</span>
              </a>
              <a href="/about" className="nav-item" onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate("/about");
                else window.location.href = "/about";
              }}>
                <span className="material-icons" title="About">info</span>
                <span className="nav-text">About</span>
              </a>
              <a href="/contact" className="nav-item" onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate("/contact");
                else window.location.href = "/contact";
              }}>
                <span className="material-icons" title="Contact">mail</span>
                <span className="nav-text">Contact</span>
              </a>
            </nav>

            {/* Actions Section - Right Side */}
            <div className="header-right">
              {isLoggedIn ? (
                <div className="auth-section">
                  <button className="icon-btn" onClick={goToCart}>
                    <span className="material-icons">shopping_cart</span>
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </button>
                  <div className="notification-container">
                    <button className="icon-btn" onClick={toggleNotifications}>
                      <span className="material-icons">notifications</span>
                      {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount}</span>
                      )}
                    </button>
                    
                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <div className="notification-dropdown">
                        <div className="notification-header">
                          <h3>Notifications</h3>
                          <button 
                            className="close-notifications" 
                            onClick={() => setShowNotifications(false)}
                          >
                            <span className="material-icons">close</span>
                          </button>
                        </div>
                        <div className="notification-list">
                          {notifications && notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                              <div 
                                key={index} 
                                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                onClick={() => markNotificationAsRead(index)}
                              >
                                <div className="notification-icon">
                                  <span className="material-icons">
                                    {notification.type === 'order' ? 'shopping_bag' : 
                                     notification.type === 'message' ? 'message' : 
                                     notification.type === 'promotion' ? 'local_offer' : 'notifications'}
                                  </span>
                                </div>
                                <div className="notification-content">
                                  <h4>{notification.title || 'New Notification'}</h4>
                                  <p>{notification.message || 'You have a new notification'}</p>
                                  <span className="notification-time">
                                    {notification.time || 'Just now'}
                                  </span>
                                </div>
                                {!notification.read && <div className="unread-indicator"></div>}
                              </div>
                            ))
                          ) : (
                            <div className="no-notifications">
                              <span className="material-icons">notifications_none</span>
                              <p>No notifications yet</p>
                            </div>
                          )}
                        </div>
                        {notifications && notifications.length > 0 && (
                          <div className="notification-footer">
                            <button 
                              className="mark-all-read"
                              onClick={() => {
                                notifications.forEach((_, index) => markNotificationAsRead(index));
                              }}
                            >
                              Mark all as read
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="profile-container">
                    <button className="icon-btn" onClick={toggleProfileMenu}>
                      <span className="material-icons">account_circle</span>
                    </button>
                    
                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                      <div className="profile-dropdown">
                        <div className="profile-header">
                          <h3>Account</h3>
                          <button 
                            className="close-profile" 
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <span className="material-icons">close</span>
                          </button>
                        </div>
                        <div className="profile-menu">
                          <button 
                            className="profile-menu-item"
                            onClick={() => {
                              setShowProfileMenu(false);
                              if (onNavigate) onNavigate("/profile");
                              else window.location.href = "/profile";
                            }}
                          >
                            <span className="material-icons">settings</span>
                            <span className="menu-text">Settings</span>
                            <span className="menu-arrow">→</span>
                          </button>
                          <button 
                            className="profile-menu-item"
                            onClick={() => {
                              setShowProfileMenu(false);
                              if (onNavigate) onNavigate("/request_history");
                              else window.location.href = "/request_history";
                            }}
                          >
                            <span className="material-icons">history</span>
                            <span className="menu-text">Request History</span>
                            <span className="menu-arrow">→</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="logout-btn" onClick={handleLogout}>
                    <span className="material-icons">logout</span>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <button className="register-btn" onClick={goToRegister}>
                    Register
                  </button>
                  <button className="login-btn" onClick={goToLogin}>
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
