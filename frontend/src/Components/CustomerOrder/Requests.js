import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "../Styles/CustomerOrderMain.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await api.get("/requests");
        setRequests(res.data || []);
      } catch (e) {
        setError("Requests endpoint requires auth; showing sample data.");
        setRequests([
          { id: 1, title: "Custom Ruby Ring Request", description: "Looking for a 2ct ruby ring with diamond accents", customerName: "John Doe", status: "pending", createdAt: new Date().toISOString() },
          { id: 2, title: "Emerald Necklace Inquiry", description: "Interested in a Colombian emerald necklace", customerName: "Jane Smith", status: "approved", createdAt: new Date().toISOString() },
          { id: 3, title: "Sapphire Earrings Request", description: "Need matching sapphire earrings for wedding", customerName: "Bob Johnson", status: "pending", createdAt: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="loading-text">Loading requests...</div>;

  return (
    <div className="requests-content">
      {error && <div className="message error">{error}</div>}
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
  );
}

export default Requests;


