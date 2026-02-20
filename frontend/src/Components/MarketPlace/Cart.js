import { formatPrice } from "../utils/format";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Header from "../MarketPlace/Header";
import Footer from "../MarketPlace/Footer";
import "../Styles/Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login_web");
      return;
    }
    setIsLoggedIn(true);
    loadCart();
    fetchNotifications();
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

  const loadCart = () => {
    setLoading(true);
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
      setCartCount(
        savedCart.reduce((total, item) => total + (item.quantity || 1), 0)
      );
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(index);
      return;
    }

    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartCount(
      newCart.reduce((total, item) => total + (item.quantity || 1), 0)
    );
  };

  const handleRemove = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartCount(
      newCart.reduce((total, item) => total + (item.quantity || 1), 0)
    );
  };

  const handleRequest = (item) => {
    navigate(`/request/${item._id}`);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + parseFloat(item.price) * (item.quantity || 1);
    }, 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() >= 500 ? 0 : 25;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const goToCart = () => navigate("/cart");
  const goToProfile = () => navigate("/profile");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setCartCount(0);
    navigate("/login_web");
  };

  if (loading) {
    return (
      <div className="cart-container">
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          notifications={notifications}
          onLogout={handleLogout}
          onGoToCart={goToCart}
          onGoToProfile={goToProfile}
          onNavigate={navigate}
        />

        <main className="cart-main">
          <div className="cart-loading">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Loading your cart...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-container">
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        notifications={notifications}
        onLogout={handleLogout}
        onGoToCart={goToCart}
        onGoToProfile={goToProfile}
        onNavigate={navigate}
      />

      <main className="cart-main">
        <div className="cart-wrapper">
          <div className="breadcrumb-nav">
            <button
              className="breadcrumb-item"
              onClick={() => navigate("/web_home")}
            >
              <svg
                className="breadcrumb-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </button>
            <svg
              className="breadcrumb-separator"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="breadcrumb-current">Shopping Cart</span>
          </div>

          <div className="cart-header">
            <div className="header-content">
              <div className="cart-icon-wrapper">
                <svg
                  className="cart-header-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
              <div className="header-text">
                <h1 className="cart-title">Shopping Cart</h1>
                <p className="cart-subtitle">
                  Review your selected items and proceed to secure checkout
                </p>
              </div>
            </div>
            <div className="cart-stats">
              <div className="stat-item">
                <span className="stat-number">{cartCount}</span>
                <span className="stat-label">Items</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  ${formatPrice(calculateSubtotal())}
                </span>
                <span className="stat-label">Subtotal</span>
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-content">
                <div className="empty-cart-icon-wrapper">
                  <svg
                    className="empty-cart-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <h3 className="empty-cart-title">Your cart is empty</h3>
                <p className="empty-cart-description">
                  Discover our exquisite collection of premium jewelry and
                  gemstones
                </p>
                <div className="empty-cart-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/explore")}
                  >
                    <svg
                      className="btn-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Browse Collection
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/web_home")}
                  >
                    <svg
                      className="btn-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Return Home
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items-section">
                <div className="items-header">
                  <h2 className="items-title">Your Items</h2>
                  <span className="items-count">
                    {cart.length} product{cart.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="cart-items">
                  {cart.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="item-image-wrapper">
                        {item.image ? (
                          <img
                            src={`http://localhost:5000${item.image}`}
                            alt={item.type}
                            className="item-image"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=180&h=180&fit=crop";
                            }}
                          />
                        ) : (
                          <div className="no-image-placeholder">
                            <svg
                              className="placeholder-icon"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>No Image</span>
                          </div>
                        )}
                      </div>

                      <div className="item-details">
                        <div className="item-header">
                          <h3 className="item-title">{item.type}</h3>
                          <div className="item-category-badge">Premium</div>
                        </div>

                        <div className="item-price-info">
                          <span className="unit-price">
                            ${formatPrice(item.price)} each
                          </span>
                          <span className="total-price">
                            $
                            {formatPrice(
                              parseFloat(item.price) * (item.quantity || 1)
                            )}{" "}
                            total
                          </span>
                        </div>

                        <div className="quantity-section">
                          <label className="quantity-label">
                            <svg
                              className="quantity-icon"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 11-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Quantity
                          </label>
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn decrease"
                              onClick={() =>
                                updateQuantity(index, (item.quantity || 1) - 1)
                              }
                              aria-label="Decrease quantity"
                            >
                              <svg viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <span className="quantity-display">
                              {item.quantity || 1}
                            </span>
                            <button
                              className="quantity-btn increase"
                              onClick={() =>
                                updateQuantity(index, (item.quantity || 1) + 1)
                              }
                              aria-label="Increase quantity"
                            >
                              <svg viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="item-actions">
                        <button
                          className="btn btn-secondary view-btn"
                          onClick={() => navigate(`/product/${item._id}`)}
                        >
                          <svg
                            className="btn-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          View Details
                        </button>
                        <button
                          className="btn btn-primary request-btn"
                          onClick={() => handleRequest(item)}
                        >
                          <svg
                            className="btn-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          Make Request
                        </button>
                        <button
                          className="btn btn-danger remove-btn"
                          onClick={() => handleRemove(index)}
                        >
                          <svg
                            className="btn-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-summary-section">
                <div className="summary-card">
                  <div className="summary-header">
                    <h3 className="summary-title">Order Summary</h3>
                    <div className="security-badge">
                      <svg
                        className="security-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Secure Checkout
                    </div>
                  </div>

                  <div className="summary-breakdown">
                    <div className="summary-line">
                      <span className="line-label">
                        <svg
                          className="line-icon"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Subtotal ({cartCount} item{cartCount !== 1 ? "s" : ""})
                      </span>
                      <span className="line-value">
                        ${formatPrice(calculateSubtotal())}
                      </span>
                    </div>

                    <div className="summary-line">
                      <span className="line-label">
                        <svg
                          className="line-icon"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                        Shipping
                      </span>
                      <span
                        className={`line-value ${
                          calculateShipping() === 0 ? "free-shipping" : ""
                        }`}
                      >
                        {calculateShipping() === 0
                          ? "Free"
                          : `$${formatPrice(calculateShipping())}`}
                      </span>
                    </div>

                    <div className="summary-line">
                      <span className="line-label">
                        <svg
                          className="line-icon"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Tax (8%)
                      </span>
                      <span className="line-value">
                        ${formatPrice(calculateTax())}
                      </span>
                    </div>

                    {calculateShipping() === 0 && (
                      <div className="free-shipping-notice">
                        <svg
                          className="notice-icon"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>You qualify for free shipping!</span>
                      </div>
                    )}
                  </div>

                  <div className="summary-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">
                      ${formatPrice(calculateTotal())}
                    </span>
                  </div>

                  <div className="checkout-actions">
                    <button className="btn btn-primary checkout-btn">
                      <svg
                        className="btn-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Proceed to Secure Checkout
                    </button>
                    <button
                      className="btn btn-secondary continue-btn"
                      onClick={() => navigate("/explore")}
                    >
                      <svg
                        className="btn-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Continue Shopping
                    </button>
                  </div>

                  <div className="shipping-benefits">
                    <h4 className="benefits-title">Shipping Benefits</h4>
                    <div className="benefits-list">
                      <div className="benefit-item">
                        <svg
                          className="benefit-icon"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                        <span>Free shipping on orders over $500</span>
                      </div>
                      <div className="benefit-item">
                        <svg
                          className="benefit-icon"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Standard delivery: 3-5 business days</span>
                      </div>
                      <div className="benefit-item">
                        <svg
                          className="benefit-icon"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Fully insured and trackable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Cart;
