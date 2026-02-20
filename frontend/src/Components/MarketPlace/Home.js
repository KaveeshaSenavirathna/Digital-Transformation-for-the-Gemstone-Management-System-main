import React, { useEffect, useState, useRef } from "react";
import { formatPrice } from "../utils/format";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../Styles/Home.css";
import Header from "./Header";
import Footer from "./Footer";
import AIRecommendation from "./AIRecommendation";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentSlide, setCurrentSlide] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order #12345 has been confirmed and is being processed.',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'You have received a new message from our support team.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on all emerald collections this week!',
      time: '3 hours ago',
      read: true
    }
  ]);
  const [darkMode, setDarkMode] = useState(false);
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [aiNotification, setAiNotification] = useState(null);
  const [aiButtonPulse, setAiButtonPulse] = useState(false);
  const [currentAspirationalHeadline, setCurrentAspirationalHeadline] = useState(0);
  const navigate = useNavigate();

  // Aspirational headlines for emotional connection
  const aspirationalHeadlines = [
    {
      title: "Create Your Gem Legacy",
      subtitle: "Build a collection that tells your unique story through time"
    },
    {
      title: "Craft Your Gemstone Story", 
      subtitle: "Every gem holds a tale waiting to be told through your journey"
    },
    {
      title: "Design Your Dream Collection",
      subtitle: "Transform your vision into a curated masterpiece of rare beauty"
    },
    {
      title: "Build Your Perfect Collection",
      subtitle: "Create lasting memories with gems that speak to your soul"
    },
    {
      title: "Discover Your Gem Destiny",
      subtitle: "Find the stones that will become part of your family's heritage"
    }
  ];

  // Refs for animation sections
  const categoriesRef = useRef(null);
  const searchRef = useRef(null);
  const featuredRef = useRef(null);
  const collectionsRef = useRef(null);
  const heritageRef = useRef(null);
  const categoryContainerRef = useRef(null);

  // Enhanced category showcase with high-quality gem images
  const categoryShowcase = [
    {
      id: 1,
      name: "Diamonds",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop&q=80",
      itemCount: "150+ stones",
      description: "Brilliant cuts, certified excellence",
      icon: "💎",
      color: "#b9f2ff",
      priceRange: "$500 - $50,000"
    },
    {
      id: 2,
      name: "Emeralds",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&q=80",
      itemCount: "120+ stones",
      description: "Deep green treasures",
      icon: "💚",
      color: "#50c878",
      priceRange: "$300 - $25,000"
    },
    {
      id: 3,
      name: "Sapphires",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop&q=80",
      itemCount: "180+ stones",
      description: "Royal blue perfection",
      icon: "💙",
      color: "#0f52ba",
      priceRange: "$400 - $30,000"
    },
    {
      id: 4,
      name: "Rubies",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=300&fit=crop&q=80",
      itemCount: "95+ stones",
      description: "Passionate red gemstones",
      icon: "❤️",
      color: "#e0115f",
      priceRange: "$600 - $40,000"
    },
    {
      id: 5,
      name: "Topaz",
      image: "https://images.unsplash.com/photo-1543571450-e67e45aba345?w=400&h=300&fit=crop&q=80",
      itemCount: "140+ stones",
      description: "Golden brilliance",
      icon: "💛",
      color: "#ffcc33",
      priceRange: "$100 - $5,000"
    },
    {
      id: 6,
      name: "Amethyst",
      image: "https://images.unsplash.com/photo-1594736797933-d0d3dc7ffa0c?w=400&h=300&fit=crop&q=80",
      itemCount: "110+ stones",
      description: "Purple majesty",
      icon: "💜",
      color: "#9966cc",
      priceRange: "$50 - $3,000"
    },
    {
      id: 7,
      name: "Aquamarine",
      image: "https://images.unsplash.com/photo-1590927887536-c88c3a245ab0?w=400&h=300&fit=crop&q=80",
      itemCount: "85+ stones",
      description: "Ocean blue serenity",
      icon: "🌊",
      color: "#7fffd4",
      priceRange: "$200 - $8,000"
    },
    {
      id: 8,
      name: "Opal",
      image: "https://images.unsplash.com/photo-1583937443566-fb8b08b6b672?w=400&h=300&fit=crop&q=80",
      itemCount: "70+ stones",
      description: "Rainbow fire within",
      icon: "🌈",
      color: "#ff6b6b",
      priceRange: "$150 - $12,000"
    },
    {
      id: 9,
      name: "Garnet",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80",
      itemCount: "90+ stones",
      description: "Deep red elegance",
      icon: "🔴",
      color: "#dc143c",
      priceRange: "$80 - $4,000"
    },
    {
      id: 10,
      name: "Peridot",
      image: "https://images.unsplash.com/photo-1594736797933-d0d3dc7ffa0c?w=400&h=300&fit=crop&q=80",
      itemCount: "65+ stones",
      description: "Olive green beauty",
      icon: "🟢",
      color: "#98fb98",
      priceRange: "$120 - $6,000"
    }
  ];

  const featuredCollections = [
    {
      id: 1,
      name: "Diamond Collection",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
      description: "Curated natural and lab-grown diamonds with documented provenance",
    },
    {
      id: 2,
      name: "Ruby Collection",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=300&fit=crop",
      description: "Vivid rubies graded for color, clarity, and cut",
    },
    {
      id: 3,
      name: "Emerald Collection",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
      description: "Premium emeralds with detailed inclusion patterns",
    },
    {
      id: 4,
      name: "Sapphire Collection",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      description: "Blue, pink, and fancy sapphires from trusted origins",
    },
    {
      id: 5,
      name: "Topaz Collection",
      image: "https://images.unsplash.com/photo-1543571450-e67e45aba345?w=400&h=300&fit=crop",
      description: "Select topaz varieties with certification",
    },
    {
      id: 6,
      name: "Specialty Collection",
      image: "https://images.unsplash.com/photo-1594736797933-d0d3dc7ffa0c?w=400&h=300&fit=crop",
      description: "Rare gemstones and unique specimens",
    },
  ];

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          
          const slideLeftElements = entry.target.querySelectorAll('.slide-in-left');
          const slideRightElements = entry.target.querySelectorAll('.slide-in-right');
          const fadeUpElements = entry.target.querySelectorAll('.fade-in-up');
          const scaleElements = entry.target.querySelectorAll('.scale-in');
          
          slideLeftElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
          });
          
          slideRightElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
          });
          
          fadeUpElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
          });
          
          scaleElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
          });
        }
      });
    }, observerOptions);

    const sections = [categoriesRef, searchRef, featuredRef, collectionsRef, heritageRef];
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Dark mode effect
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // AI Recommendation functions
  const showAINotification = (message, type = 'info') => {
    setAiNotification({ message, type, timestamp: Date.now() });
    setTimeout(() => setAiNotification(null), 5000);
  };

  const handleAIRecommendationClick = () => {
    // Show professional notification
    showAINotification('✨ AI is analyzing your preferences to find perfect gems...', 'ai');
    
    // Add pulse effect
    setAiButtonPulse(true);
    setTimeout(() => setAiButtonPulse(false), 2000);
    
    // Open recommendation modal
    setTimeout(() => {
      setShowAIRecommendation(true);
    }, 1000);
  };

  // AI notification effects
  useEffect(() => {
    if (aiNotification) {
      const timer = setTimeout(() => {
        setAiNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [aiNotification]);

  // Rotate aspirational headlines
  useEffect(() => {
    const headlineInterval = setInterval(() => {
      setCurrentAspirationalHeadline((prev) => (prev + 1) % aspirationalHeadlines.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(headlineInterval);
  }, [aspirationalHeadlines.length]);

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) fetchNotifications();

    fetchProducts();
    updateCartCount();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/published");
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProducts(sorted.slice(0, 6));

      const initialSlides = {};
      sorted.slice(0, 6).forEach((p) => (initialSlides[p._id] = 0));
      setCurrentSlide(initialSlides);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Auto slideshow for product images
  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const updated = { ...prev };
        products.forEach((p) => {
          if (p.image && p.image.length > 1) {
            updated[p._id] = (prev[p._id] + 1) % p.image.length;
          }
        });
        return updated;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [products.length]);

  const handleSearch = (e) => setSearch(e.target.value);

  const viewDetails = (id) => navigate(`/product/${id}`);

  const addToCart = (product) => {
    if (!isLoggedIn) {
      alert("Please log in to add items to cart");
      navigate("/login_web");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
      alert("Gemstone quantity updated in cart");
    } else {
      cart.push({
        _id: product._id,
        type: product.type,
        price: product.price,
        image: product.image[0] || "",
        quantity: 1,
      });
      alert("Gemstone added to cart successfully!");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  };

  const nextSlide = (id, direction) => {
    const p = products.find((prod) => prod._id === id);
    if (!p || !p.image || p.image.length <= 1) return;

    setCurrentSlide((prev) => ({
      ...prev,
      [id]:
        direction === "next"
          ? (prev[id] + 1) % p.image.length
          : (prev[id] - 1 + p.image.length) % p.image.length,
    }));
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

  const goToExplore = () => navigate("/explore");
  const goToUpload = () => navigate("/add-product");

  const displayedProducts = products.filter((p) =>
    p?.type?.toLowerCase().includes(search.toLowerCase())
  );

  // Category scroll functions
  const scrollCategories = (direction) => {
    if (categoryContainerRef.current) {
      const scrollAmount = 350;
      const newPosition = direction === 'left' 
        ? categoryScrollPosition - scrollAmount 
        : categoryScrollPosition + scrollAmount;
      
      categoryContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setCategoryScrollPosition(newPosition);
    }
  };

  return (
    <div className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        notifications={notifications}
        onLogout={handleLogout}
        onGoToCart={goToCart}
        onGoToProfile={goToProfile}
        onNavigate={navigate}
      />

      {/* Dark Mode Toggle */}
      <button className="dark-mode-toggle" onClick={toggleDarkMode} title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
        <span className="dark-mode-text">{darkMode ? 'Light' : 'Dark'}</span>
      </button>

      {/* AI Recommendation Floating Button */}
      <button 
        className={`ai-recommendation-toggle ${aiButtonPulse ? 'pulse' : ''}`} 
        onClick={handleAIRecommendationClick} 
        title="Get AI-Powered Gem Recommendations"
      >
        <span className="ai-icon">✨</span>
        <span className="ai-text">AI</span>
        <div className="ai-glow"></div>
      </button>

      {/* AI Notification Popup */}
      {aiNotification && (
        <div className={`ai-notification ai-notification-${aiNotification.type}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {aiNotification.type === 'ai' ? '✨' : '💎'}
            </div>
            <div className="notification-message">
              {aiNotification.message}
            </div>
            <button 
              className="notification-close"
              onClick={() => setAiNotification(null)}
            >
              ×
            </button>
          </div>
          <div className="notification-progress"></div>
        </div>
      )}

      {/* Animated Background */}
      <div className="animated-background">
        <div className="gem-float gem-1">◆</div>
        <div className="gem-float gem-2">◇</div>
        <div className="gem-float gem-3">◈</div>
        <div className="gem-float gem-4">◊</div>
        <div className="gem-float gem-5">◈</div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-subtitle">Premium Gemstone Marketplace</span>
          <h1 className="hero-title">Discover Rare Gemstones</h1>
          <div className="hero-divider"></div>
          <p className="hero-description">
            Explore certified diamonds, emeralds, sapphires, rubies and more. 
            Each stone includes grading details, provenance, and secure documentation.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn-primary" onClick={goToExplore}>
              Explore Collection
            </button>
            <button className="hero-btn-secondary" onClick={goToExplore}>
              Browse Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section with Carousel */}
      <section ref={categoriesRef} className="categories-section animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2 className="slide-in-left">Browse by Gem Type</h2>
            <p className="slide-in-right">Explore our curated gemstone categories with premium quality stones</p>
          </div>
          
          <div className="category-carousel-wrapper">
            <button 
              className="carousel-nav carousel-nav-left" 
              onClick={() => scrollCategories('left')}
              aria-label="Scroll left"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            
            <div className="category-carousel" ref={categoryContainerRef}>
              {categoryShowcase.map((category, index) => (
                <div 
                  key={category.id} 
                  className="category-card-premium fade-in-up"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    '--gem-color': category.color
                  }}
                >
                  <div className="category-image-wrapper">
                    <img src={category.image} alt={category.name} loading="lazy" />
                    <div className="category-overlay">
                      <div className="category-icon-large">{category.icon}</div>
                      <div className="category-badge">Premium</div>
                    </div>
                    <div className="category-gradient" style={{ background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)` }}></div>
                  </div>
                  <div className="category-content-premium">
                    <div className="category-header">
                      <h3>{category.name}</h3>
                      <span className="category-count">{category.itemCount}</span>
                    </div>
                    <p className="category-description">{category.description}</p>
                    <div className="category-price-range">{category.priceRange}</div>
                    <button className="category-btn-premium" onClick={goToExplore}>
                      <span>Explore Collection</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="carousel-nav carousel-nav-right" 
              onClick={() => scrollCategories('right')}
              aria-label="Scroll right"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </div>
          
          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {Array.from({ length: Math.ceil(categoryShowcase.length / 4) }).map((_, index) => (
              <button
                key={index}
                className={`indicator ${Math.floor(categoryScrollPosition / 350) === index ? 'active' : ''}`}
                onClick={() => {
                  if (categoryContainerRef.current) {
                    categoryContainerRef.current.scrollTo({
                      left: index * 350,
                      behavior: 'smooth'
                    });
                    setCategoryScrollPosition(index * 350);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Search Section */}
      {/* Advanced Search Section */}
{/* Enhanced Search Section - Fixed Alignment */}
<section ref={searchRef} className="search-section-enhanced animate-on-scroll">
  <div className="search-section-wrapper">
    <div className="container">
      <div className="search-header-content">
        <h2 className="search-main-title fade-in-up">Find Your Perfect Stone</h2>
        <p className="search-main-subtitle fade-in-up">
          Search by type, color, cut, carat, or origin
        </p>
      </div>

      {/* Main Search Bar - Aligned with Hero */}
      <div className="hero-aligned-search-container slide-in-up">
        <div className="search-bar-main">
          <div className="search-input-container">
            <span className="search-main-icon"></span>
            <input
              type="text"
              placeholder="Blue Sapphire, Round Cut Diamond, Burma Ruby..."
              value={search}
              onChange={handleSearch}
              className="search-main-input"
            />
            <button className="search-main-btn" onClick={goToExplore}>
              Search Stones
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="quick-filters-main">
          <button className="filter-chip-main" onClick={goToExplore}>
            <span className="filter-emoji">Diamond</span>
            Diamonds
          </button>
          <button className="filter-chip-main" onClick={goToExplore}>
            <span className="filter-emoji">Emerald</span>
            Emeralds
          </button>
          <button className="filter-chip-main" onClick={goToExplore}>
            <span className="filter-emoji">Sapphire</span>
            Sapphires
          </button>
          <button className="filter-chip-main" onClick={goToExplore}>
            <span className="filter-emoji">Ruby</span>
            Rubies
          </button>
          <button className="filter-chip-main" onClick={goToExplore}>
            <span className="filter-emoji">All</span>
            All Gems
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Featured Section */}
      <section ref={featuredRef} className="featured-section animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2 className="slide-in-left">Latest Gemstones</h2>
            <p className="slide-in-right">Discover newly added authenticated stones</p>
            <div className="section-actions">
              <button className="btn-secondary scale-in" onClick={goToExplore}>
                View All Stones
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading latest gemstones...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-content">
                <svg
                  className="no-products-icon"
                  viewBox="24 24 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <h3>No gemstones available yet</h3>
                <p>Add the first authenticated stone to the marketplace!</p>
                {isLoggedIn && (
                  <button
                    className="btn-primary"
                    onClick={goToUpload}
                    style={{ marginTop: "20px" }}
                  >
                    Upload Your First Stone
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="products-grid">
              {displayedProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="product-card fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="product-image-container">
                    {product.image && product.image.length > 0 ? (
                      <>
                        <img
                          src={`http://localhost:5000${
                            Array.isArray(product.image)
                              ? product.image[currentSlide[product._id] || 0] || ""
                              : product.image || ""
                          }`}
                          alt={product.type}
                          className="product-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop";
                          }}
                        />
                        {product.image.length > 1 && (
                          <div className="slide-indicator">
                            {product.image.map((_, idx) => (
                              <span
                                key={idx}
                                className={`dot ${
                                  idx === (currentSlide[product._id] || 0) ? "active" : ""
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="no-image">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>No Image Available</span>
                      </div>
                    )}
                    {product.image && product.image.length > 1 && (
                      <div className="slide-controls">
                        <button onClick={() => nextSlide(product._id, "prev")}>
                          Previous
                        </button>
                        <button onClick={() => nextSlide(product._id, "next")}>
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-category">Certified</div>
                    <h3>{product.type}</h3>
                    <p className="price">${formatPrice(product.price)}</p>
                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="star">★</span>
                      ))}
                      <span className="rating-text">(4.8)</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn-cart"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn-details"
                      onClick={() => viewDetails(product._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collections Section */}
      <section ref={collectionsRef} className="collections-section animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2 className="slide-in-left aspirational-headline">
              <span className="headline-title">
                {aspirationalHeadlines[currentAspirationalHeadline].title}
              </span>
              <span className="headline-subtitle">
                {aspirationalHeadlines[currentAspirationalHeadline].subtitle}
              </span>
            </h2>
            <div className="headline-indicators">
              {aspirationalHeadlines.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${currentAspirationalHeadline === index ? 'active' : ''}`}
                  onClick={() => setCurrentAspirationalHeadline(index)}
                />
              ))}
            </div>
          </div>
          <div className="collections-grid">
            {featuredCollections.map((collection, index) => (
              <div 
                key={collection.id} 
                className="collection-card fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img src={collection.image} alt={collection.name} />
                <div className="collection-overlay">
                  <h3>{collection.name}</h3>
                  <p>{collection.description}</p>
                  <button className="collection-btn" onClick={goToExplore}>
                    Explore Stones
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section ref={heritageRef} className="heritage-section animate-on-scroll">
        <div className="container">
          <div className="heritage-content">
            <div className="heritage-text slide-in-left">
              <h2>Expert Curation & Verification</h2>
              <p>
                Our experts combine gemological standards with innovative tools
                to ensure each stone's details are accurate and verifiable.
              </p>
              <p>
                Documentation, grading, and provenance data are managed
                end-to-end for transparency and buyer confidence.
              </p>
              <button
                className="btn-primary"
                onClick={() => navigate("/about")}
              >
                Learn About Our Process
              </button>
            </div>
            <div className="heritage-images slide-in-right">
              <img
                src="https://images.unsplash.com/photo-1543571450-e67e45aba345?w=500&h=350&fit=crop"
                alt="Verification"
                className="heritage-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
<section className="stats-section animate-on-scroll">
  <div className="container">
    <div className="stats-background">
      <div className="stats-gem-overlay gem-1">◆</div>
      <div className="stats-gem-overlay gem-2">◇</div>
      <div className="stats-gem-overlay gem-3">◈</div>
    </div>
    
    <div className="journey-content">
      <div className="journey-header">
        <h2 className="journey-title">Begin Your Gem Journey</h2>
        <p className="journey-subtitle">Discover the perfect gem that speaks to your soul and tells your unique story</p>
      </div>
      
      <div className="journey-actions">
        <div className="journey-card primary">
          <div className="card-icon">✨</div>
          <h3 className="card-title">Find My Perfect Gem</h3>
          <p className="card-description">Let our AI match you with gems that align with your personality and preferences</p>
          <button 
            className="journey-btn primary-btn"
            onClick={() => setShowAIRecommendation(true)}
          >
            Start AI Matching
          </button>
        </div>
        
        <div className="journey-card secondary">
          <div className="card-icon">🎯</div>
          <h3 className="card-title">Explore by Purpose</h3>
          <p className="card-description">Browse gems by occasion, investment goals, or personal meaning</p>
          <button 
            className="journey-btn secondary-btn"
            onClick={goToExplore}
          >
            Browse Collections
          </button>
        </div>
        
        <div className="journey-card tertiary">
          <div className="card-icon">👨‍💼</div>
          <h3 className="card-title">Get Expert Guidance</h3>
          <p className="card-description">Consult with our certified gemologists for personalized advice</p>
          <button 
            className="journey-btn tertiary-btn"
            onClick={() => navigate('/consultation')}
          >
            Book Consultation
          </button>
        </div>
      </div>
      
      <div className="journey-stats">
        <div className="mini-stat">
          <span className="mini-number">10,000+</span>
          <span className="mini-label">Certified Gems</span>
        </div>
        <div className="mini-stat">
          <span className="mini-number">5,000+</span>
          <span className="mini-label">Happy Collectors</span>
        </div>
        <div className="mini-stat">
          <span className="mini-number">50+</span>
          <span className="mini-label">Expert Gemologists</span>
        </div>
        <div className="mini-stat">
          <span className="mini-number">80+</span>
          <span className="mini-label">Countries</span>
        </div>
      </div>
    </div>
  </div>
</section>

      <Footer />
      
      {/* AI Recommendation Modal */}
      {showAIRecommendation && (
        <AIRecommendation 
          isLoggedIn={isLoggedIn}
          onClose={() => setShowAIRecommendation(false)}
          onShowNotification={showAINotification}
        />
      )}
    </div>
  );
}

export default Home;
/* 
// Add this with your other useEffects
useEffect(() => {
  const animateNumbers = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current) + '+';
      }, 16);
    });
  };

  // Create intersection observer for stats section
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumbers();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  return () => {
    if (statsSection) {
      statsObserver.unobserve(statsSection);
    }
  };
}, []);
 */



