import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/CustomerOrderMain.css";
import jsPDF from "jspdf";
import api from "../utils/api";

function CustomerOrderMain() {
  const kpis = useMemo(
    () => [
      { key: "orders", label: "Active Orders", value: 24, icon: "🧾" },
      { key: "requests", label: "New Requests", value: 8, icon: "📥" },
      { key: "customers", label: "Customers", value: 132, icon: "👥" },
      {
        key: "revenue",
        label: "Monthly Revenue",
        value: "$12,480",
        icon: "💎",
      },
    ],
    []
  );

  const quickLinks = [
    {
      to: "/place",
      title: "Place Product",
      description:
        "Add a new gemstone to the marketplace with images and details.",
      cta: "Add Product",
      className: "card-blue",
    },
    {
      to: "/requests",
      title: "View Requests",
      description: "Review, confirm, or reject customer purchase requests.",
      cta: "Manage Requests",
      className: "card-green",
    },
  ];

  const [activeTab, setActiveTab] = useState("overview");
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantInsights, setAssistantInsights] = useState([]);
  const [assistantMode, setAssistantMode] = useState("insights");

  const [realCustomers, setRealCustomers] = useState([]);
  const [realOrders, setRealOrders] = useState([]);
  const [realProducts, setRealProducts] = useState([]);
  const [realRequests, setRealRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const insights = [
    { key: "avgOrder", label: "Avg. Order Value", value: "$520", trend: "+8%" },
    { key: "fulfillment", label: "Fulfillment Rate", value: "96%", trend: "+2%" },
    { key: "response", label: "Avg. Response Time", value: "1h 12m", trend: "-18%" },
  ];

  const generateInsights = () => {
    const mockInsights = [
      { type: "trend", title: "📈 Sales Trend Analysis", message: "Your emerald sales increased 23% this week. Consider restocking popular cuts.", priority: "high", action: "View Analytics", category: "sales" },
      { type: "prediction", title: "🔮 Demand Forecast", message: "Based on seasonal patterns, diamond demand will peak in 2 weeks. Prepare inventory.", priority: "medium", action: "Plan Inventory", category: "inventory" },
      { type: "optimization", title: "⚡ Performance Optimization", message: "Your response time improved 18% this month. Great job on customer service!", priority: "low", action: "View Details", category: "performance" },
      { type: "alert", title: "🚨 Smart Alert", message: "3 customers are waiting for ruby restocks. Consider prioritizing this category.", priority: "high", action: "Check Requests", category: "customers" },
    ];
    setAssistantInsights(mockInsights);
  };

  const fetchRealData = async () => {
    try {
      setLoading(true);
      try {
        const customersRes = await api.get("/users");
        setRealCustomers(customersRes.data || []);
      } catch {
        setRealCustomers([]);
      }
      try {
        const productsRes = await api.get("/products");
        setRealProducts(productsRes.data || []);
      } catch {
        setRealProducts([]);
      }
      try {
        const ordersRes = await api.get("/orders");
        setRealOrders(ordersRes.data || []);
      } catch {
        setRealOrders([]);
      }
      try {
        const requestsRes = await api.get("/requests");
        setRealRequests(requestsRes.data || []);
      } catch {
        setRealRequests([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    generateInsights();
    const interval = setInterval(() => { if (Math.random() > 0.7) generateInsights(); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const exportCustomerOrderPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      doc.setFontSize(16);
      doc.text("Customer & Order Management Report", 20, 20);
      doc.save(`Gem-Marketplace-Report-${new Date().toISOString().split("T")[0]}.pdf`);
      alert("✅ Report exported successfully!");
    } catch (error) {
      alert("❌ Error exporting PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const [showPalette, setShowPalette] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const paletteInputRef = useRef(null);
  const paletteActions = [
    { label: "Add Product", hint: "Go to Place Product", action: () => (window.location.href = "/place") },
    { label: "View Requests", hint: "Open Requests board", action: () => (window.location.href = "/requests") },
    { label: "Open Customers tab", hint: "Switch tab", action: () => setActiveTab("customers") },
    { label: "Open Orders tab", hint: "Switch tab", action: () => setActiveTab("orders") },
    { label: "Open Overview", hint: "Switch tab", action: () => setActiveTab("overview") },
  ];
  const filteredPalette = paletteActions.filter((a) => a.label.toLowerCase().includes(paletteQuery.toLowerCase()));

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setShowPalette((v) => !v);
      } else if (e.key === "Escape") { setShowPalette(false); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (showPalette) { requestAnimationFrame(() => paletteInputRef.current?.focus()); } else { setPaletteQuery(""); }
  }, [showPalette]);

  const tickerRef = useRef(null);
  useEffect(() => {
    if (!tickerRef.current) return;
    let y = 0; const el = tickerRef.current;
    const step = () => { y += 0.5; el.style.transform = `translateY(-${y}px)`; if (y > el.scrollHeight / 2) y = 0; raf = requestAnimationFrame(step); };
    let raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [activeTab]);

  return (
    <>
      <div className="order-container">
        <div className="bg-decoration" aria-hidden>
          <div className="blob b1"></div>
          <div className="blob b2"></div>
          <div className="grid-overlay"></div>
        </div>
        <div className="order-hero">
          <div className="hero-left">
            <h1 className="hero-title">Customer & Order Management</h1>
            <p className="hero-subtitle">Operate your gemstone storefront with clarity — manage listings, track requests, and keep customers delighted.</p>
            <div className="hero-actions">
              <Link to="/place" className="btn btn-primary">➕ Add Product</Link>
              <Link to="/requests" className="btn btn-secondary">📋 View Requests</Link>
              <button className="btn btn-assistant" onClick={() => setShowAssistant(!showAssistant)} title="Smart Assistant">🤖 AI Assistant</button>
              <button className="btn btn-export" onClick={exportCustomerOrderPDF} disabled={isExporting} title="Export Customer & Order Report">{isExporting ? "Exporting..." : "Export PDF"}</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-badge">✨ Professional Console</div>
            <div className="hero-gem" aria-hidden>♦</div>
          </div>
        </div>

        <div className="kpi-grid">
          {kpis.map((k) => (
            <div key={k.key} className="kpi-card">
              <div className="kpi-icon" aria-hidden>{k.icon}</div>
              <div className="kpi-content">
                <div className="kpi-value">{k.value}</div>
                <div className="kpi-label">{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="insights-row">
          {insights.map((i) => (
            <div key={i.key} className="insight">
              <div className="insight-label">{i.label}</div>
              <div className="insight-value">{i.value}</div>
              <div className="insight-trend">{i.trend}</div>
            </div>
          ))}
        </div>

        {showAssistant && (
          <div className="assistant-panel">
            <div className="assistant-header">
              <div className="assistant-title"><span className="assistant-icon">🤖</span><span>Smart Dashboard Assistant</span></div>
              <div className="assistant-modes">
                <button className={`mode-btn ${assistantMode === "insights" ? "active" : ""}`} onClick={() => setAssistantMode("insights")}>Insights</button>
                <button className={`mode-btn ${assistantMode === "predictions" ? "active" : ""}`} onClick={() => setAssistantMode("predictions")}>Predictions</button>
                <button className={`mode-btn ${assistantMode === "suggestions" ? "active" : ""}`} onClick={() => setAssistantMode("suggestions")}>Suggestions</button>
              </div>
              <button className="assistant-close" onClick={() => setShowAssistant(false)}>×</button>
            </div>
            <div className="assistant-content">
              {assistantMode === "insights" && (
                <div className="insights-mode">
                  <h3>📊 Real-time Insights</h3>
                  <div className="insights-list">
                    {assistantInsights.map((insight, idx) => (
                      <div key={idx} className={`insight-card ${insight.priority}`}>
                        <div className="insight-header">
                          <span className="insight-type-icon">{insight.type === "trend" && "📈"}{insight.type === "prediction" && "🔮"}{insight.type === "optimization" && "⚡"}{insight.type === "alert" && "🚨"}</span>
                          <span className="insight-title">{insight.title}</span>
                          <span className={`priority-badge ${insight.priority}`}>{insight.priority}</span>
                        </div>
                        <p className="insight-message">{insight.message}</p>
                        <button className="insight-action">{insight.action}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {assistantMode === "predictions" && (
                <div className="predictions-mode">
                  <h3>🔮 Predictive Analytics</h3>
                  <div className="prediction-cards">
                    <div className="prediction-card">
                      <div className="prediction-header"><span className="prediction-icon">📈</span><span className="prediction-title">Sales Forecast</span></div>
                      <div className="prediction-chart"><div className="chart-bar" style={{ height: "60%" }}></div><div className="chart-bar" style={{ height: "80%" }}></div><div className="chart-bar" style={{ height: "100%" }}></div><div className="chart-bar" style={{ height: "75%" }}></div></div>
                      <p className="prediction-text">Expected 15% increase in next 7 days</p>
                    </div>
                    <div className="prediction-card">
                      <div className="prediction-header"><span className="prediction-icon">👥</span><span className="prediction-title">Customer Behavior</span></div>
                      <div className="behavior-stats"><div className="behavior-item"><span className="behavior-label">Return Rate</span><span className="behavior-value">+12%</span></div><div className="behavior-item"><span className="behavior-label">Engagement</span><span className="behavior-value">+8%</span></div></div>
                      <p className="prediction-text">Customer satisfaction trending upward</p>
                    </div>
                  </div>
                </div>
              )}

              {assistantMode === "suggestions" && (
                <div className="suggestions-mode">
                  <h3>💡 Smart Suggestions</h3>
                  <div className="suggestions-list">
                    <div className="suggestion-item"><div className="suggestion-icon">🎯</div><div className="suggestion-content"><h4>Optimize Product Listings</h4><p>Add more detailed descriptions to increase conversion by 23%</p><button className="suggestion-btn">Apply Suggestion</button></div></div>
                    <div className="suggestion-item"><div className="suggestion-icon">⏰</div><div className="suggestion-content"><h4>Peak Time Optimization</h4><p>Schedule product updates during peak hours (2-4 PM)</p><button className="suggestion-btn">Schedule Update</button></div></div>
                    <div className="suggestion-item"><div className="suggestion-icon">💰</div><div className="suggestion-content"><h4>Pricing Strategy</h4><p>Consider dynamic pricing for high-demand items</p><button className="suggestion-btn">Review Pricing</button></div></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="tabs">
          <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
          <button className={`tab-btn ${activeTab === "customers" ? "active" : ""}`} onClick={() => setActiveTab("customers")}>Customers</button>
          <button className={`tab-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>Orders</button>
        </div>

        {activeTab === "overview" && (
          <div className="activity-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="ticker">
              <div className="ticker-track" ref={tickerRef}>
                <div className="ticker-list">
                  <div className="activity-item"><span className="activity-icon">📦</span><div className="activity-content"><div className="activity-text">New order placed for <strong>Emerald Oval 1.2ct</strong></div><div className="activity-time">2 hours ago</div></div></div>
                  <div className="activity-item"><span className="activity-icon">✅</span><div className="activity-content"><div className="activity-text">Request confirmed for <strong>Diamond Round 0.9ct</strong></div><div className="activity-time">Yesterday</div></div></div>
                  <div className="activity-item"><span className="activity-icon">📝</span><div className="activity-content"><div className="activity-text">Product updated <strong>Ruby Cushion 2.1ct</strong></div><div className="activity-time">3 days ago</div></div></div>
                  <div className="activity-item"><span className="activity-icon">📦</span><div className="activity-content"><div className="activity-text">New order placed for <strong>Emerald Oval 1.2ct</strong></div><div className="activity-time">2 hours ago</div></div></div>
                  <div className="activity-item"><span className="activity-icon">✅</span><div className="activity-content"><div className="activity-text">Request confirmed for <strong>Diamond Round 0.9ct</strong></div><div className="activity-time">Yesterday</div></div></div>
                  <div className="activity-item"><span className="activity-icon">📝</span><div className="activity-content"><div className="activity-text">Product updated <strong>Ruby Cushion 2.1ct</strong></div><div className="activity-time">3 days ago</div></div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="placeholder">
            <div className="empty-illustration">👥</div>
            <h3>Customer directory coming soon</h3>
            <p>Track returning buyers and engagement here. I can wire this to your backend if you have endpoints.</p>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="placeholder">
            <div className="empty-illustration">🧾</div>
            <h3>Orders board coming soon</h3>
            <p>List of orders with statuses and filters. Say the word and I’ll implement.</p>
          </div>
        )}
      </div>

      {showPalette && (
        <div className="palette-overlay" onClick={() => setShowPalette(false)}>
          <div className="palette" onClick={(e) => e.stopPropagation()}>
            <div className="palette-header">Command Palette</div>
            <input ref={paletteInputRef} value={paletteQuery} onChange={(e) => setPaletteQuery(e.target.value)} className="palette-input" placeholder="Type a command... (e.g., Add Product)" />
            <div className="palette-list">
              {filteredPalette.length === 0 ? (
                <div className="palette-empty">No commands found</div>
              ) : (
                filteredPalette.map((a, idx) => (
                  <button key={idx} className="palette-item" onClick={() => { a.action(); setShowPalette(false); }}>
                    <span className="pi-label">{a.label}</span>
                    <span className="pi-hint">{a.hint}</span>
                  </button>
                ))
              )}
            </div>
            <div className="palette-footer">Press Esc to close • Ctrl+K to toggle</div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerOrderMain;


