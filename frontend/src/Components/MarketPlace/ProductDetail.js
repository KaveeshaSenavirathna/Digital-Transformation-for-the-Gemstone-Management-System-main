import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Header from "../MarketPlace/Header";
import Footer from "../MarketPlace/Footer";
import { formatPrice } from "../utils/format";
import "../Styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        alert("Product not found");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      if (!token) return;
      try {
        const res = await api.get("/users/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(
        cart.reduce((total, item) => total + (item.quantity || 1), 0)
      );
    };

    fetchProduct();
    fetchNotifications();
    updateCartCount();
  }, [id, navigate]);

  const addToCart = () => {
    if (!isLoggedIn) {
      alert("Please log in to add items to cart");
      navigate("/login_web");
      return;
    }

    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
      alert("Product quantity updated in cart");
    } else {
      cart.push({
        _id: product._id,
        type: product.type,
        price: product.price,
        image: product.image?.[0] || "",
        quantity: 1,
      });
      alert("Product added to cart successfully!");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.reduce((total, item) => total + (item.quantity || 1), 0));
  };

  const goToCart = () => {
    if (!isLoggedIn) {
      alert("Please log in to view your cart");
      navigate("/login_web");
      return;
    }
    navigate("/cart");
  };

  const goToProfile = () => {
    if (!isLoggedIn) {
      alert("Please log in to view your profile");
      navigate("/login_web");
      return;
    }
    navigate("/profile");
  };

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
      <div className="home-container">
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          notifications={notifications}
          onLogout={handleLogout}
          onGoToCart={goToCart}
          onGoToProfile={goToProfile}
          onNavigate={navigate}
        />
        <section className="product-detail-section">
          <div className="container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading product details...</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="home-container">
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          notifications={notifications}
          onLogout={handleLogout}
          onGoToCart={goToCart}
          onGoToProfile={goToProfile}
          onNavigate={navigate}
        />
        <section className="product-detail-section">
          <div className="container">
            <div className="no-products">
              <h2>Product not found</h2>
              <button
                className="btn-primary"
                onClick={() => navigate("/explore")}
              >
                Browse Collection
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const images = product.image || [];
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="home-container">
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        notifications={notifications}
        onLogout={handleLogout}
        onGoToCart={goToCart}
        onGoToProfile={goToProfile}
        onNavigate={navigate}
      />
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-grid">
            <div className="image-gallery">
              <div className="main-image-wrapper">
                {images && images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${images[currentIndex]}`}
                    alt={product.type}
                    className="main-image"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop";
                    }}
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                    <span>No Image</span>
                  </div>
                )}
                {images.length > 1 && (
                  <div className="image-nav">
                    <button
                      className="nav prev"
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      className="nav next"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="thumbs">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`thumb ${
                        idx === currentIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      <img
                        src={`http://localhost:5000${img}`}
                        alt={`${product.type} ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=160&fit=crop";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-info-panel">
              <div className="breadcrumb">
                <button
                  className="breadcrumb-link"
                  onClick={() => navigate("/web_home")}
                >
                  Home
                </button>
                /
                <button
                  className="breadcrumb-link"
                  onClick={() => navigate("/explore")}
                >
                  Shop
                </button>
                <span className="breadcrumb-current">Details</span>
              </div>

              <h1 className="detail-title">{product.type}</h1>
              <div className="detail-price">${formatPrice(product.price)}</div>

              <div className="detail-attributes">
                {product.color && (
                  <div className="attr">
                    <span className="attr-label">Color:</span> {product.color}
                  </div>
                )}
                {product.Shape && (
                  <div className="attr">
                    <span className="attr-label">Shape:</span> {product.Shape}
                  </div>
                )}
                {product.Size && (
                  <div className="attr">
                    <span className="attr-label">Size:</span> {product.Size}
                  </div>
                )}
                {product.carat && (
                  <div className="attr">
                    <span className="attr-label">Carat:</span> {product.carat}
                  </div>
                )}
                {product.origin && (
                  <div className="attr">
                    <span className="attr-label">Origin:</span> {product.origin}
                  </div>
                )}
                {product.certification && (
                  <div className="attr">
                    <span className="attr-label">Certification:</span>{" "}
                    {product.certification}
                  </div>
                )}
              </div>

              <div className="detail-actions">
                <button className="btn btn-primary" onClick={addToCart}>
                  Add to Cart
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/explore")}
                >
                  Back to Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default ProductDetail;
