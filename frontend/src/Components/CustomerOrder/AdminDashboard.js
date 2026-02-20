import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";
import dashboardLogger from "../utils/dashboardLogger";
import "../Styles/AdminDashboard.css";

const API_BASE_URL = "http://localhost:5000";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    type: "",
    color: "",
    Shape: "",
    Size: "",
    Cut: "",
    intensity: "",
    Clarity: "",
    Treatment: "",
    Origin: "",
    description: "",
    price: "",
    images: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const gemstoneOptions = {
    types: [
      "Ruby", "Sapphire", "Emerald", "Diamond", "Topaz", "Garnet",
      "Amethyst", "Citrine", "Peridot", "Aquamarine", "Tourmaline",
      "Opal", "Tanzanite", "Spinel", "Jade", "Turquoise", "Onyx",
      "Moonstone", "Labradorite", "Other"
    ],
    colors: [
      "Red", "Blue", "Green", "Yellow", "Pink", "Purple", "Orange",
      "White", "Black", "Brown", "Gray", "Colorless", "Multi-color",
      "Deep Red", "Royal Blue", "Forest Green", "Golden Yellow",
      "Light Blue", "Dark Blue", "Light Green", "Other"
    ],
    sizes: [
      "0.5 ct", "0.75 ct", "1 ct", "1.25 ct", "1.5 ct", "1.75 ct",
      "2 ct", "2.5 ct", "3 ct", "3.5 ct", "4 ct", "4.5 ct", "5 ct",
      "6 ct", "7 ct", "8 ct", "9 ct", "10 ct", "5x3mm", "6x4mm",
      "7x5mm", "8x6mm", "9x7mm", "10x8mm", "11x9mm", "12x10mm",
      "8x8mm", "10x10mm", "12x12mm", "Other"
    ],
    shapes: [
      "Round", "Oval", "Cushion", "Emerald Cut", "Princess", "Pear",
      "Marquise", "Heart", "Asscher", "Radiant", "Trillion",
      "Baguette", "Square", "Octagon", "Cabochon", "Other"
    ],
    cuts: [
      "Brilliant", "Step", "Mixed", "Rose", "Cabochon", "Briolette",
      "Buff Top", "Fantasy", "Portuguese", "Barion", "Other"
    ],
    intensities: [
      "Faint", "Very Light", "Light", "Fancy Light", "Fancy",
      "Fancy Intense", "Fancy Vivid", "Deep", "Medium", "Strong",
      "Vivid", "Other"
    ],
    clarities: [
      "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2",
      "I1", "I2", "I3", "Eye Clean", "Slightly Included",
      "Included", "Other"
    ],
    treatments: [
      "Natural/Unheated", "Heat Only", "Heat + Oil", "Heat + Flux",
      "Irradiation", "Diffusion", "Fracture Filling", "Dyed",
      "Synthetic", "Enhanced", "Other"
    ],
    origins: [
      "Burma/Myanmar", "Ceylon/Sri Lanka", "Thailand", "Cambodia",
      "Madagascar", "Mozambique", "Tanzania", "Kenya", "Brazil",
      "Colombia", "Zambia", "Afghanistan", "Pakistan", "Kashmir",
      "Other"
    ]
  };

  useEffect(() => {
    dashboardLogger.logDashboardAccess("Admin Dashboard");
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      let productsData = [];
      try {
        const productsRes = await axios.get(`${API_BASE_URL}/products`);
        productsData = productsRes.data || [];
      } catch (err) {
        console.warn("Could not fetch products:", err.message);
        productsData = [];
      }
      setProducts(productsData);

      setRequests([
        {
          id: 1,
          title: "Custom Ruby Ring Request",
          description: "Looking for a 2ct ruby ring with diamond accents",
          customerName: "John Doe",
          status: "pending",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: "Emerald Necklace Inquiry",
          description: "Interested in a Colombian emerald necklace",
          customerName: "Jane Smith",
          status: "approved",
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: "Sapphire Earrings Request",
          description: "Need matching sapphire earrings for wedding",
          customerName: "Bob Johnson",
          status: "pending",
          createdAt: new Date().toISOString()
        }
      ]);

      setCustomers([
        { id: 1, name: "John Doe", email: "john@example.com", phone: "+1234567890", totalOrders: 5, totalSpent: 15000 },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", totalOrders: 3, totalSpent: 8500 },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892", totalOrders: 7, totalSpent: 22000 },
        { id: 4, name: "Alice Brown", email: "alice@example.com", phone: "+1234567893", totalOrders: 2, totalSpent: 6000 },
        { id: 5, name: "Charlie Wilson", email: "charlie@example.com", phone: "+1234567894", totalOrders: 4, totalSpent: 12000 }
      ]);

      setOrders([
        { id: 1, customerName: "John Doe", productName: "Ruby Ring", total: 1500, status: "completed", createdAt: "2024-01-15", orderNumber: "ORD-001" },
        { id: 2, customerName: "Jane Smith", productName: "Emerald Necklace", total: 2500, status: "processing", createdAt: "2024-01-16", orderNumber: "ORD-002" },
        { id: 3, customerName: "Bob Johnson", productName: "Sapphire Earrings", total: 1800, status: "pending", createdAt: "2024-01-17", orderNumber: "ORD-003" },
        { id: 4, customerName: "Alice Brown", productName: "Diamond Bracelet", total: 3200, status: "shipped", createdAt: "2024-01-18", orderNumber: "ORD-004" },
        { id: 5, customerName: "Charlie Wilson", productName: "Topaz Pendant", total: 950, status: "completed", createdAt: "2024-01-19", orderNumber: "ORD-005" }
      ]);

      dashboardLogger.log("Admin Dashboard", "All data loaded successfully");
      setMessage("✅ Dashboard loaded successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error fetching data:", err);
      dashboardLogger.log("Admin Dashboard", "Error loading data", "error");
      setMessage("⚠️ Dashboard loaded with sample data");
      setTimeout(() => setMessage(""), 5000);
      setProducts([]);
      setCustomers([]);
      setOrders([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "images") {
      setForm({ ...form, images: e.target.files });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.type || form.type.trim() === "") newErrors.type = "Gemstone type is required";
    if (!form.color || form.color.trim() === "") newErrors.color = "Color is required";
    if (!form.Shape || form.Shape.trim() === "") newErrors.Shape = "Shape is required";
    if (!form.Size || form.Size.trim() === "") newErrors.Size = "Size is required";
    if (!form.Origin || form.Origin.trim() === "") newErrors.Origin = "Origin is required";
    if (!form.description || form.description.trim() === "") {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }
    if (!form.price && form.price !== 0) {
      newErrors.price = "Price is required";
    } else {
      const priceNum = parseFloat(form.price);
      if (isNaN(priceNum) || priceNum <= 0) newErrors.price = "Price must be a valid positive number";
      else if (priceNum < 1) newErrors.price = "Price must be at least $1";
      else if (priceNum > 1000000) newErrors.price = "Price cannot exceed $1,000,000";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("❌ Please fix the validation errors before submitting.");
      return;
    } else {
      setErrors({});
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      const value = form[key];
      if (key === "images" && value) {
        Array.from(value).forEach((file) => {
          formData.append("images", file);
        });
        return;
      }
      if (value === null || value === undefined) return;
      if (key === "price") {
        const num = parseFloat(String(value).trim());
        if (!isNaN(num)) formData.append("price", num);
        return;
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed !== "") formData.append(key, trimmed);
      } else if (typeof value !== "object") {
        formData.append(key, String(value));
      }
    });

    try {
      setMessage("⏳ Submitting product...");
      if (editingId) {
        const response = await api.put(`/products/update/${editingId}`, formData);
        console.log("Update response:", response.data);
        setMessage("✅ Product updated successfully!");
        dashboardLogger.log("Admin Dashboard", "Product updated", "success");
      } else {
        const response = await api.post(`/products/add`, formData);
        console.log("Add response:", response.data);
        setMessage("✅ Product added successfully!");
        dashboardLogger.log("Admin Dashboard", "Product added", "success");
      }
      fetchAllData();
      setForm({
        type: "", color: "", Shape: "", Size: "", Cut: "", intensity: "",
        Clarity: "", Treatment: "", Origin: "", description: "", price: "", images: null,
      });
      setEditingId(null);
      setActiveSection("products");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error submitting product:", err.response?.data || err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error occurred";
      setMessage(`❌ Error submitting product: ${errorMessage}`);
      dashboardLogger.log("Admin Dashboard", `Product submission failed: ${errorMessage}`, "error");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const getImageUrl = (product) => {
    const first = Array.isArray(product?.image) && product.image.length > 0 ? product.image[0] : null;
    if (!first) return null;
    if (first.startsWith("http://") || first.startsWith("https://")) return first;
    // stored as /uploads/...
    return `${API_BASE_URL}${first}`;
  };

  const handlePublish = async (productId, nextPublished) => {
    try {
      const endpoint = nextPublished ? `/products/publish/${productId}` : `/products/unpublish/${productId}`;
      await api.put(endpoint);
      setMessage(nextPublished ? "✅ Product published successfully!" : "✅ Product unpublished successfully!");
      fetchAllData();
    } catch (err) {
      setMessage("❌ Failed to update publish state");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/delete/${productId}`);
      setMessage("✅ Product deleted successfully!");
      fetchAllData();
    } catch (err) {
      setMessage("❌ Failed to delete product");
    }
  };

  const formatPrice = (price) => {
    const num = parseFloat(price);
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const preventInvalidPriceKey = (e) => {
    const invalidKeys = ["e", "E", "+", "-"];
    if (invalidKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }
    if (e.key === "." && String(form.price || "").includes(".")) e.preventDefault();
  };

  const handlePriceBlur = () => {
    if (form.price === undefined || form.price === null || form.price === "") return;
    const val = parseFloat(form.price);
    if (!isNaN(val) && val > 0) setForm({ ...form, price: val.toFixed(2) });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && product.published) ||
      (filterStatus === "draft" && !product.published);
    return matchesSearch && matchesStatus;
  });

  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const totalOrders = orders.length;
  const totalRequests = requests.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <div className="sidebar-profile">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <div className="profile-name">Admin</div>
            <div className="profile-role">System Administrator</div>
          </div>
        </div>

        <nav className="nav-links">
          <button className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => setActiveSection("dashboard")}>Dashboard</button>
          <button className={`nav-item ${activeSection === "products" ? "active" : ""}`} onClick={() => setActiveSection("products")}>Products</button>
          <button className={`nav-item ${activeSection === "customers" ? "active" : ""}`} onClick={() => setActiveSection("customers")}>Customers</button>
          <button className={`nav-item ${activeSection === "orders" ? "active" : ""}`} onClick={() => setActiveSection("orders")}>Orders</button>
          <button className={`nav-item ${activeSection === "requests" ? "active" : ""}`} onClick={() => setActiveSection("requests")}>Requests</button>
          <button className={`nav-item ${activeSection === "analytics" ? "active" : ""}`} onClick={() => setActiveSection("analytics")}>Analytics</button>
        </nav>

        <div className="back-btn">
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your gemstone marketplace</p>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {activeSection === "dashboard" && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💎</div>
                <div className="stat-content">
                  <div className="stat-number">{totalProducts}</div>
                  <div className="stat-label">Total Products</div>
                  <div className="stat-trend positive">+12% this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">{totalCustomers}</div>
                  <div className="stat-label">Total Customers</div>
                  <div className="stat-trend positive">+8% this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <div className="stat-number">{totalOrders}</div>
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-trend positive">+15% this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-number">${formatPrice(totalRevenue)}</div>
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-trend positive">+23% this month</div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">💎</div>
                  <div className="activity-content">
                    <div className="activity-title">New Product Added</div>
                    <div className="activity-description">Ruby Ring - $1,500</div>
                    <div className="activity-time">2 minutes ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👥</div>
                  <div className="activity-content">
                    <div className="activity-title">New Customer Registered</div>
                    <div className="activity-description">John Doe - john@example.com</div>
                    <div className="activity-time">15 minutes ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📦</div>
                  <div className="activity-content">
                    <div className="activity-title">Order Completed</div>
                    <div className="activity-description">Emerald Necklace - $2,500</div>
                    <div className="activity-time">1 hour ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "products" && (
          <div className="products-content">
            <div className="content-header">
              <h2>Product Management</h2>
              <button className="btn btn-primary" onClick={() => setActiveSection("add-product")}>
                ➕ Add Product
              </button>
            </div>

            <div className="search-filter">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                <option value="all">All Products</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Type</th>
                    <th>Color</th>
                    <th>Shape</th>
                    <th>Size</th>
                    <th>Origin</th>
                    <th>Cut</th>
                    <th>Clarity</th>
                    <th>Treatment</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product._id || index}>
                      <td>
                        {getImageUrl(product) ? (
                          <img src={getImageUrl(product)} alt={product.type || 'product'} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />
                        ) : (
                          <span style={{ color: '#94a3b8' }}>No image</span>
                        )}
                      </td>
                      <td>{product.type || "-"}</td>
                      <td>{product.color || "-"}</td>
                      <td>{product.Shape || "-"}</td>
                      <td>{product.Size || "-"}</td>
                      <td>{product.Origin || "-"}</td>
                      <td>{product.Cut || "-"}</td>
                      <td>{product.Clarity || "-"}</td>
                      <td>{product.Treatment || "-"}</td>
                      <td>${formatPrice(product.price)}</td>
                      <td>
                        <span className={`status-badge ${product.published ? 'completed' : 'pending'}`}>
                          {product.published ? 'published' : 'draft'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" onClick={() => {
                          setEditingId(product._id);
                          setForm(product);
                          setActiveSection("add-product");
                        }}>Edit</button>
                        {product.published ? (
                          <button className="btn btn-secondary" style={{ marginLeft: 6 }} onClick={() => handlePublish(product._id, false)}>Unpublish</button>
                        ) : (
                          <button className="btn btn-primary" style={{ marginLeft: 6 }} onClick={() => handlePublish(product._id, true)}>Publish</button>
                        )}
                        <button className="btn btn-danger" style={{ marginLeft: 6 }} onClick={() => handleDelete(product._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "add-product" && (
          <div className="add-product-content">
            <div className="content-header">
              <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button className="btn btn-secondary" onClick={() => {
                setActiveSection("products");
                setEditingId(null);
                setForm({
                  type: "", color: "", Shape: "", Size: "", Cut: "", intensity: "",
                  Clarity: "", Treatment: "", Origin: "", description: "", price: "", images: null,
                });
                setErrors({});
              }}>
                ← Back to Products
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Gemstone Type *</label>
                  <select name="type" value={form.type} onChange={handleChange} className={`form-input ${errors.type ? "error" : ""}`} required>
                    <option value="">Select Type</option>
                    {gemstoneOptions.types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.type && <div className="form-error">{errors.type}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Color *</label>
                  <select name="color" value={form.color} onChange={handleChange} className={`form-input ${errors.color ? "error" : ""}`} required>
                    <option value="">Select Color</option>
                    {gemstoneOptions.colors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  {errors.color && <div className="form-error">{errors.color}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Shape *</label>
                  <select name="Shape" value={form.Shape} onChange={handleChange} className={`form-input ${errors.Shape ? "error" : ""}`} required>
                    <option value="">Select Shape</option>
                    {gemstoneOptions.shapes.map((shape) => (
                      <option key={shape} value={shape}>{shape}</option>
                    ))}
                  </select>
                  {errors.Shape && <div className="form-error">{errors.Shape}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Size *</label>
                  <select name="Size" value={form.Size} onChange={handleChange} className={`form-input ${errors.Size ? "error" : ""}`} required>
                    <option value="">Select Size</option>
                    {gemstoneOptions.sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.Size && <div className="form-error">{errors.Size}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Price *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} onKeyDown={preventInvalidPriceKey} onBlur={handlePriceBlur} className={`form-input ${errors.price ? "error" : ""}`} placeholder="0.00" step="0.01" min="0" required />
                  {errors.price && <div className="form-error">{errors.price}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Origin *</label>
                  <select name="Origin" value={form.Origin} onChange={handleChange} className={`form-input ${errors.Origin ? "error" : ""}`} required>
                    <option value="">Select Origin</option>
                    {gemstoneOptions.origins.map((origin) => (
                      <option key={origin} value={origin}>{origin}</option>
                    ))}
                  </select>
                  {errors.Origin && <div className="form-error">{errors.Origin}</div>}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className={`form-input ${errors.description ? "error" : ""}`} placeholder="Describe the gemstone (minimum 10 characters)..." rows="4" required />
                  {errors.description && <div className="form-error">{errors.description}</div>}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Images</label>
                  <input type="file" name="images" onChange={handleChange} className="form-input" multiple accept="image/*" />
                  {form.images && form.images.length > 0 && (
                    <div className="image-preview-container">
                      <p className="image-preview-label">Preview:</p>
                      <div className="image-preview-grid">
                        {Array.from(form.images).map((file, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="image-preview" />
                            <span className="image-preview-name">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{editingId ? "Update Product" : "Add Product"}</button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setActiveSection("products");
                  setEditingId(null);
                  setForm({
                    type: "", color: "", Shape: "", Size: "", Cut: "", intensity: "",
                    Clarity: "", Treatment: "", Origin: "", description: "", price: "", images: null,
                  });
                  setErrors({});
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSection === "customers" && (
          <div className="customers-content">
            <div className="content-header">
              <h2>Customer Management</h2>
            </div>
            <div className="customers-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total Orders</th>
                    <th>Total Spent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.totalOrders}</td>
                      <td>${formatPrice(customer.totalSpent)}</td>
                      <td>
                        <button className="btn btn-primary">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "orders" && (
          <div className="orders-content">
            <div className="content-header">
              <h2>Order Management</h2>
            </div>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.customerName}</td>
                      <td>{order.productName}</td>
                      <td>${formatPrice(order.total)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-primary">View</button>
                        <button className="btn btn-secondary">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "requests" && (
          <div className="requests-content">
            <div className="content-header">
              <h2>Purchase Requests</h2>
            </div>
            <div className="requests-grid">
              {requests.map((request, index) => (
                <div key={index} className="request-card">
                  <div className="request-header">
                    <h3 className="request-title">{request.title || "Purchase Request"}</h3>
                    <span className={`status-badge ${request.status || 'pending'}`}>
                      {request.status || 'pending'}
                    </span>
                  </div>
                  <div className="request-content">
                    <p className="request-description">{request.description || "No description provided"}</p>
                    <div className="request-details">
                      <span className="request-customer">{request.customerName || "Anonymous"}</span>
                      <span className="request-date">{new Date(request.createdAt || new Date()).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button className="btn btn-success">Approve</button>
                    <button className="btn btn-danger">Reject</button>
                    <button className="btn btn-secondary">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "analytics" && (
          <div className="analytics-content">
            <div className="content-header">
              <h2>Analytics & Reports</h2>
            </div>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Sales Overview</h3>
                <div className="chart-placeholder">📈 Sales chart would be displayed here</div>
              </div>
              <div className="analytics-card">
                <h3>Customer Demographics</h3>
                <div className="chart-placeholder">👥 Demographics chart would be displayed here</div>
              </div>
              <div className="analytics-card">
                <h3>Product Performance</h3>
                <div className="chart-placeholder">💎 Product performance chart would be displayed here</div>
              </div>
              <div className="analytics-card">
                <h3>Revenue Trends</h3>
                <div className="chart-placeholder">💰 Revenue trends chart would be displayed here</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;


