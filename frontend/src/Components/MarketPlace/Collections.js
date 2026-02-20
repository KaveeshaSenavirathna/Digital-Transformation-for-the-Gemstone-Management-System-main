import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../MarketPlace/Header";
import Footer from "../MarketPlace/Footer";
import "../Styles/Home.css";
import "../Styles/Collections.css";

function Collections() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((t, i) => t + (i.quantity || 1), 0);

  const goToCart = () =>
    isLoggedIn ? navigate("/cart") : navigate("/login_web");
  const goToProfile = () =>
    isLoggedIn ? navigate("/profile") : navigate("/login_web");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
    navigate("/login_web");
  };

  const collections = [
    {
      key: "diamond",
      name: "Diamond Collection",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop",
      description: "Curated natural and lab-grown diamonds",
    },
    {
      key: "ruby",
      name: "Ruby Collection",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=600&fit=crop",
      description: "Vivid rubies graded for color, clarity, and cut",
    },
    {
      key: "emerald",
      name: "Emerald Collection",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop",
      description: "Premium emeralds with detailed inclusion patterns",
    },
    {
      key: "sapphire",
      name: "Sapphire Collection",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
      description: "Blue, pink, and fancy sapphires from trusted origins",
    },
    {
      key: "topaz",
      name: "Topaz Collection",
      image:
        "https://images.unsplash.com/photo-1543571450-e67e45aba345?w=800&h=600&fit=crop",
      description: "Select topaz varieties with certification",
    },
    {
      key: "special",
      name: "Specialty Collection",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0d3dc7ffa0c?w=800&h=600&fit=crop",
      description: "Rare gemstones and unique specimens",
    },
  ];

  const openCollection = (key) => {
    // Navigate to Explore with a pre-filled search query
    navigate(`/explore?search=${encodeURIComponent(key)}`);
  };

  return (
    <div className="collections-container">
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        notifications={[]}
        onLogout={handleLogout}
        onGoToCart={goToCart}
        onGoToProfile={goToProfile}
        onNavigate={navigate}
      />

      <nav className="about-breadcrumb">
        <div className="container">
          <a href="/web_home" className="crumb">
            Home
          </a>
          <span className="crumb-sep">/</span>
          <span className="crumb active">Collections</span>
        </div>
      </nav>

      <section className="collections-section">
        <div className="container">
          <div className="section-header">
            <h2>Product Collections</h2>
            <p>Discover curated groups of gemstones by type</p>
          </div>

          <div className="collections-grid">
            {collections.map((c) => (
              <div
                key={c.key}
                className="collection-card"
                onClick={() => openCollection(c.key)}
                style={{ cursor: "pointer" }}
              >
                <img src={c.image} alt={c.name} />
                <div className="collection-overlay">
                  <h3>{c.name}</h3>
                  <p>{c.description}</p>
                  <button className="collection-btn">Explore</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Collections;
