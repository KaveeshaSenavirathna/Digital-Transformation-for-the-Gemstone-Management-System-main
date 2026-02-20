import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { formatPrice } from "../utils/format";
import api from "../utils/api";
import SimpleStarRating from "./StarRating";
import "../Styles/Explore.css";
import Header from "../MarketPlace/Header";
import Footer from "../MarketPlace/Footer";

function Explore() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    color: "",
    Shape: "",
    Size: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    carat: "",
    clarity: "",
    cut: "",
    origin: "",
    treatment: "",
    certification: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentSlide, setCurrentSlide] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [submittingRating, setSubmittingRating] = useState({});
  const [ratingSuccess, setRatingSuccess] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) fetchNotifications();
  }, []);

  useEffect(() => {
    fetchProducts();
    updateCartCount();

    // Handle URL search parameters
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [location.search]);

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/published");
      setProducts(res.data);
      setFilteredProducts(res.data);

      const initialSlides = {};
      res.data.forEach((p) => (initialSlides[p._id] = 0));
      setCurrentSlide(initialSlides);

      const initialRatings = {};
      res.data.forEach((p) => (initialRatings[p._id] = 5));
      setSelectedRatings(initialRatings);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((total, item) => total + (item.quantity || 1), 0));
  };

  useEffect(() => {
    if (filteredProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const updated = { ...prev };
        filteredProducts.forEach((p) => {
          if (p.image && p.image.length > 1) {
            updated[p._id] = (prev[p._id] + 1) % p.image.length;
          }
        });
        return updated;
      });
    }, 6000); // Reduced frequency for better performance
    return () => clearInterval(interval);
  }, [filteredProducts.length]); // Only depend on length, not the full array

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Enforce integer, non-negative for price fields
    if (name === "minPrice" || name === "maxPrice") {
      // Remove non-digits
      const digitsOnly = value.replace(/\D+/g, "");
      setFilters({ ...filters, [name]: digitsOnly });
      return;
    }
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({
      type: "",
      color: "",
      Shape: "",
      Size: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      carat: "",
      clarity: "",
      cut: "",
      origin: "",
      treatment: "",
      certification: "",
    });
    setSortBy("newest");
  };

  const getAverageRating = useCallback((ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / ratings.length;
  }, []);

  useEffect(() => {
    // Debounce search to improve performance
    const timeoutId = setTimeout(() => {
      let filtered = [...products];

      if (search) {
        filtered = filtered.filter(
          (p) =>
            p.type?.toLowerCase().includes(search.toLowerCase()) ||
            p.color?.toLowerCase().includes(search.toLowerCase()) ||
            p.Shape?.toLowerCase().includes(search.toLowerCase())
        );
      }

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          if (key === "minPrice") {
            filtered = filtered.filter(
              (p) => p.price >= parseFloat(filters[key])
            );
          } else if (key === "maxPrice") {
            filtered = filtered.filter(
              (p) => p.price <= parseFloat(filters[key])
            );
          } else if (key === "minRating") {
            filtered = filtered.filter(
              (p) => getAverageRating(p.ratings) >= parseFloat(filters[key])
            );
          } else if (key === "carat") {
            filtered = filtered.filter((p) =>
              p.carat?.toString().includes(filters[key])
            );
          } else {
            filtered = filtered.filter((p) =>
              p[key]?.toLowerCase().includes(filters[key].toLowerCase())
            );
          }
        }
      });

      switch (sortBy) {
        case "priceLowHigh":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "priceHighLow":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => {
            const avgA = getAverageRating(a.ratings);
            const avgB = getAverageRating(b.ratings);
            return avgB - avgA;
          });
          break;
        case "alphabetical":
          filtered.sort((a, b) => a.type.localeCompare(b.type));
          break;
        case "newest":
        default:
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
      }

      setFilteredProducts(filtered);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [search, filters, sortBy, products]);

  const handleRatingChange = (productId, rating) => {
    setSelectedRatings({
      ...selectedRatings,
      [productId]: rating,
    });
  };

  const submitRating = async (productId) => {
    if (!isLoggedIn) {
      alert("Please log in to rate a product");
      navigate("/login_web");
      return;
    }

    const rating = selectedRatings[productId];
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    try {
      setSubmittingRating({ ...submittingRating, [productId]: true });

      await api.post(
        `/products/${productId}/rate`,
        { rating },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setRatingSuccess({ ...ratingSuccess, [productId]: true });
      setTimeout(() => {
        setRatingSuccess({ ...ratingSuccess, [productId]: false });
      }, 2000);

      await fetchProducts();
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmittingRating({ ...submittingRating, [productId]: false });
    }
  };

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
      alert("Product quantity updated in cart");
    } else {
      cart.push({
        _id: product._id,
        type: product.type,
        price: product.price,
        image: product.image[0] || "",
        quantity: 1,
      });
      alert("Product added to cart successfully!");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  };

  const viewDetails = (id) => navigate(`/product/${id}`);

  const nextSlide = (id, direction) => {
    const p = filteredProducts.find((prod) => prod._id === id);
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

  if (loading) {
    return (
      <div className="explore-container">
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          notifications={notifications}
          onLogout={handleLogout}
          onGoToCart={goToCart}
          onGoToProfile={goToProfile}
          onNavigate={navigate}
        />

        <main className="explore-main">
          <div className="explore-loading">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Loading our jewelry collection...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="explore-container">
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        notifications={notifications}
        onLogout={handleLogout}
        onGoToCart={goToCart}
        onGoToProfile={goToProfile}
        onNavigate={navigate}
      />

      <main className="explore-main">
        <div className="explore-wrapper">
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
            <span className="breadcrumb-current">Collection</span>
          </div>

          <div className="explore-header">
            <div className="header-content">
              <h1 className="explore-title">Explore Our Collection</h1>
              <p className="explore-subtitle">
                Discover exquisite gemstones and fine jewelry from our curated
                selection of premium pieces
              </p>
            </div>
          </div>

          <div className="search-filter-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <svg
                  className="search-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by type, color, or shape..."
                  value={search}
                  onChange={handleSearch}
                  className="search-input"
                />
                {search && (
                  <button
                    className="clear-search"
                    onClick={() => setSearch("")}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="filter-controls">
              <button
                className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg
                  className="filter-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              <div className="sort-container">
                <svg
                  className="sort-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              <div className="results-info">
                <span className="results-count">
                  {filteredProducts.length} item
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>

            {showFilters && (
              <div className="advanced-filters">
                <div className="filters-header">
                  <h3>Advanced Filters</h3>
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    <svg
                      className="clear-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Clear All
                  </button>
                </div>

                <div className="filters-grid">
                  <div className="filter-group">
                    <h4>Product Type</h4>
                    <select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Types</option>
                      <option value="Diamond">Diamond</option>
                      <option value="Ruby">Ruby</option>
                      <option value="Sapphire">Sapphire</option>
                      <option value="Emerald">Emerald</option>
                      <option value="Amethyst">Amethyst</option>
                      <option value="Topaz">Topaz</option>
                    </select>

                    <select
                      name="color"
                      value={filters.color}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Colors</option>
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Green">Green</option>
                      <option value="Yellow">Yellow</option>
                      <option value="Purple">Purple</option>
                      <option value="Pink">Pink</option>
                      <option value="White">White</option>
                      <option value="Clear">Clear</option>
                    </select>

                    <select
                      name="Shape"
                      value={filters.Shape}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Shapes</option>
                      <option value="Round">Round</option>
                      <option value="Oval">Oval</option>
                      <option value="Cushion">Cushion</option>
                      <option value="Princess">Princess</option>
                      <option value="Emerald">Emerald Cut</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <h4>Price Range</h4>
                    <input
                      name="minPrice"
                      type="number"
                      placeholder="Min Price ($)"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      min={0}
                      step={1}
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        if (["e", "E", "-", "."].includes(e.key))
                          e.preventDefault();
                      }}
                    />
                    <input
                      name="maxPrice"
                      type="number"
                      placeholder="Max Price ($)"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      min={0}
                      step={1}
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        if (["e", "E", "-", "."].includes(e.key))
                          e.preventDefault();
                      }}
                    />
                    <select
                      name="minRating"
                      value={filters.minRating}
                      onChange={handleFilterChange}
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-content">
                <svg
                  className="no-products-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3>No products found</h3>
                <p>
                  Try adjusting your search terms or filters to find what you're
                  looking for
                </p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  <svg
                    className="btn-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Show All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="products-section">
              <div className="products-grid">
                {filteredProducts.map((product) => {
                  const avgRating = getAverageRating(product.ratings);
                  const ratingCount = product.ratings?.length || 0;

                  return (
                    <div key={product._id} className="product-card">
                      <div className="product-image-container">
                        {product.image && product.image.length > 0 ? (
                          <>
                            <img
                              src={`http://localhost:5000${
                                product.image[currentSlide[product._id] || 0]
                              }`}
                              alt={product.type}
                              className="product-image"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop";
                              }}
                            />
                            {product.image.length > 1 && (
                              <div className="image-nav-buttons">
                                <button
                                  className="nav-btn prev-btn"
                                  onClick={() => nextSlide(product._id, "prev")}
                                >
                                  <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                      fillRule="evenodd"
                                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                                <button
                                  className="nav-btn next-btn"
                                  onClick={() => nextSlide(product._id, "next")}
                                >
                                  <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                      fillRule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="no-image-placeholder">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>No Image Available</span>
                          </div>
                        )}
                      </div>

                      <div className="product-content">
                        <div className="product-header">
                          <div className="product-category-badge">Premium</div>
                          <h3 className="product-title">{product.type}</h3>
                        </div>

                        <div className="product-details">
                          {product.color && (
                            <span className="detail-chip">
                              <svg
                                className="chip-icon"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 2h2v4h4V6h2v2h-4v4h4v2h-2v-4H9v4H7v-2h4V8H7V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {product.color}
                            </span>
                          )}
                          {product.Shape && (
                            <span className="detail-chip">
                              <svg
                                className="chip-icon"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {product.Shape}
                            </span>
                          )}
                          {product.Size && (
                            <span className="detail-chip">
                              <svg
                                className="chip-icon"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 11-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {product.Size}
                            </span>
                          )}
                        </div>

                        <div className="product-price">
                          ${formatPrice(product.price)}
                        </div>

                        <div className="product-rating">
                          <SimpleStarRating
                            rating={avgRating}
                            readonly={true}
                            size="small"
                          />
                          <span className="rating-summary">
                            {avgRating > 0 ? avgRating.toFixed(1) : "0.0"} (
                            {ratingCount} review{ratingCount !== 1 ? "s" : ""})
                          </span>
                        </div>

                        {isLoggedIn && (
                          <div className="rating-section">
                            <div className="rating-header">
                              <h4>Rate this item</h4>
                              {ratingSuccess[product._id] && (
                                <div className="success-alert">
                                  <svg
                                    className="success-icon"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Rating submitted!
                                </div>
                              )}
                            </div>

                            <div className="rating-input-group">
                              <SimpleStarRating
                                rating={selectedRatings[product._id] || 5}
                                onRatingChange={(rating) =>
                                  handleRatingChange(product._id, rating)
                                }
                                readonly={false}
                                size="medium"
                              />
                              <span className="rating-display"></span>
                              <button
                                className="btn btn-primary rating-submit-btn"
                                onClick={() => submitRating(product._id)}
                                disabled={submittingRating[product._id]}
                              >
                                {submittingRating[product._id] ? (
                                  <>
                                    <div className="btn-spinner"></div>
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="btn-icon"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Submit Rating
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="product-actions">
                          <button
                            className="btn btn-primary add-to-cart-btn"
                            onClick={() => addToCart(product)}
                          >
                            <svg
                              className="btn-icon"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            Add to Cart
                          </button>
                          <button
                            className="btn btn-secondary view-details-btn"
                            onClick={() => viewDetails(product._id)}
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
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Explore;
