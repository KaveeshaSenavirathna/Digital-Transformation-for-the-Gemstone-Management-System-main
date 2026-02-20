import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductCard.css';

const API_BASE_URL = "http://localhost:5000";

const ProductCard = ({ 
  product, 
  mode = 'marketplace', // 'marketplace' or 'admin'
  onUpdate, 
  onDelete, 
  onPublish,
  onUnpublish,
  showActions = true 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const formatPrice = (price) => {
    const num = parseFloat(price);
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const handlePublish = async () => {
    if (!product._id) return;
    
    setIsLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/products/publish/${product._id}`);
      setMessage("✅ Product published successfully!");
      if (onPublish) onPublish(product._id);
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error publishing product:", err);
      setMessage("❌ Error publishing product");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!product._id) return;
    
    setIsLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/products/unpublish/${product._id}`);
      setMessage("✅ Product unpublished successfully!");
      if (onUnpublish) onUnpublish(product._id);
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error unpublishing product:", err);
      setMessage("❌ Error unpublishing product");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product._id) return;
    
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/products/delete/${product._id}`);
      setMessage("✅ Product deleted successfully!");
      if (onDelete) onDelete(product._id);
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting product:", err);
      setMessage("❌ Error deleting product");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (Array.isArray(imagePath) && imagePath.length > 0) {
      return `${API_BASE_URL}${imagePath[0]}`;
    }
    if (typeof imagePath === 'string') {
      return `${API_BASE_URL}${imagePath}`;
    }
    return null;
  };

  return (
    <div className={`product-card ${mode}`}>
      {message && (
        <div className="product-message">
          {message}
        </div>
      )}
      
      {/* Image Container */}
      <div className="product-image-container">
        <div className="product-image">
          {getImageUrl(product.image) ? (
            <img 
              src={getImageUrl(product.image)} 
              alt={`${product.type} - ${product.color}`}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="placeholder-image">💎</div>
          )}
          <div className="placeholder-image" style={{display: 'none'}}>💎</div>
        </div>
        
        {/* Image Count Badge */}
        {product.image && Array.isArray(product.image) && product.image.length > 1 && (
          <div className="image-count-badge">
            +{product.image.length - 1}
          </div>
        )}
        
        {/* Status Overlay */}
        <div className="product-status-overlay">
          <span className={`status-badge ${product.published ? 'published' : 'draft'}`}>
            {product.published ? 'Published' : 'Draft'}
          </span>
        </div>
        
        {/* Quick Actions Overlay */}
        {mode === 'marketplace' && (
          <div className="quick-actions-overlay">
            <Link 
              to={`/product/${product._id}`} 
              className="quick-action-btn"
              title="View Details"
            >
              👁️
            </Link>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <div className="product-content">
          <h3 className="product-title">{product.type}</h3>
          <p className="product-subtitle">{product.color}</p>
          
          <div className="product-details">
            {product.Shape && <span className="detail-tag">◆ {product.Shape}</span>}
            {product.Size && <span className="detail-tag">📏 {product.Size}</span>}
            {product.Origin && <span className="detail-tag">🌍 {product.Origin}</span>}
          </div>
          
          {product.description && (
            <p className="product-description">
              {product.description.length > 100 
                ? `${product.description.substring(0, 100)}...` 
                : product.description
              }
            </p>
          )}
          
          <div className="product-price">${formatPrice(product.price || 0)}</div>
        </div>
        
        {/* Action Buttons */}
        {showActions && (
          <div className="product-actions">
            {mode === 'admin' ? (
              <>
                <button 
                  className="btn btn-info btn-sm"
                  onClick={() => {
                    if (onUpdate) onUpdate(product);
                  }}
                  disabled={isLoading}
                >
                  👁️ View
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (onUpdate) onUpdate(product);
                  }}
                  disabled={isLoading}
                >
                  ✏️ Edit
                </button>
                {product.published ? (
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={handleUnpublish}
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳' : '📤'} Unpublish
                  </button>
                ) : (
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={handlePublish}
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳' : '📢'} Publish
                  </button>
                )}
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  🗑️ Delete
                </button>
              </>
            ) : (
              <>
                <Link 
                  to={`/product/${product._id}`}
                  className="btn btn-primary btn-sm"
                >
                  👁️ View Details
                </Link>
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => {
                    // Add to cart functionality
                    console.log('Add to cart:', product);
                  }}
                >
                  🛒 Add to Cart
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
