import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../Common/ProductCard';
import './MarketplaceHome.css';

const API_BASE_URL = "http://localhost:5000";

const MarketplaceHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products/published`);
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || product.type === filterType;
    
    const matchesPrice = filterPrice === 'all' || 
                        (filterPrice === 'low' && product.price < 1000) ||
                        (filterPrice === 'medium' && product.price >= 1000 && product.price < 5000) ||
                        (filterPrice === 'high' && product.price >= 5000);
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const uniqueTypes = [...new Set(products.map(p => p.type).filter(Boolean))];

  if (loading) {
    return (
      <div className="marketplace-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="marketplace-home">
      {/* Header */}
      <div className="marketplace-header">
        <div className="header-content">
          <h1>💎 Premium Gemstone Collection</h1>
          <p>Discover our exquisite collection of rare and beautiful gemstones</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="marketplace-filters">
        <div className="filters-container">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search gemstones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-section">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Prices</option>
              <option value="low">Under $1,000</option>
              <option value="medium">$1,000 - $5,000</option>
              <option value="high">Over $5,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="marketplace-content">
        <div className="products-header">
          <h2>Featured Products</h2>
          <p>{filteredProducts.length} products found</p>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">💎</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product._id || index}
                product={product}
                mode="marketplace"
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="marketplace-footer">
        <div className="footer-content">
          <p>&copy; 2024 Premium Gemstone Collection. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHome;
