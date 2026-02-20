import { useEffect, useState } from "react";
import api from "../utils/api";
import "../Styles/RequestHistory.css";

function RequestHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/requests/my-requests", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="request-history-container">
        <div className="request-history-main">
          <div className="request-history-wrapper">
            <div className="request-loading">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your request history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-history-container">
      <div className="request-history-main">
        <div className="request-history-wrapper">
          <div className="request-history-header">
            <h1 className="request-history-title">My Request History</h1>
            <p className="request-history-subtitle">Track all your gemstone requests and their status</p>
          </div>
          
          {requests.length === 0 ? (
            <div className="empty-requests">
              <div className="empty-requests-icon">📜</div>
              <h3>No Requests Yet</h3>
              <p>You haven't made any requests yet. Start by exploring our gemstone collection!</p>
              <button 
                className="empty-requests-btn"
                onClick={() => window.location.href = "/explore"}
              >
                Browse Gemstones
              </button>
            </div>
          ) : (
            <div className="requests-grid">
              {requests.map((req, index) => (
                <div key={index} className="request-card">
                  <div className="request-card-header">
                    <h3 className="request-product-name">
                      {req.product?.type || "Unknown Product"}
                    </h3>
                    <span className="request-status">Pending</span>
                  </div>
                  
                  <div className="request-details">
                    <div className="request-detail-item">
                      <span className="request-detail-label">Shape</span>
                      <span className="request-detail-value">{req.desiredShape || "Not specified"}</span>
                    </div>
                    <div className="request-detail-item">
                      <span className="request-detail-label">Color</span>
                      <span className="request-detail-value">{req.desiredColor || "Not specified"}</span>
                    </div>
                    <div className="request-detail-item">
                      <span className="request-detail-label">Size</span>
                      <span className="request-detail-value">{req.desiredSize || "Not specified"}</span>
                    </div>
                    <div className="request-detail-item">
                      <span className="request-detail-label">Quantity</span>
                      <span className="request-detail-value">{req.quantity}</span>
                    </div>
                    <div className="request-detail-item">
                      <span className="request-detail-label">Intensity</span>
                      <span className="request-detail-value">{req.intensity || "Not specified"}</span>
                    </div>
                    <div className="request-detail-item">
                      <span className="request-detail-label">Unit Price</span>
                      <span className="request-detail-value">${req.product?.price || "-"}</span>
                    </div>
                  </div>
                  
                  <div className="request-price">
                    Total: ${req.totalPrice || (req.product?.price * req.quantity) || "-"}
                  </div>
                  
                  <div className="request-footer">
                    <span className="request-date">
                      Requested: {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                    <div className="request-actions">
                      <button className="request-action-btn">View Details</button>
                      <button className="request-action-btn">Contact Support</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestHistory;
