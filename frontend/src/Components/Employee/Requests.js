import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../Employee/Nav/Sidebar";
import "../Employee/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";
// --- NEW CSS IMPORT ---
import "../Styles/LeaveRequests.css"; 

function LeaveRequests() {
    // --- Sidebar State Management (Assuming collapse functionality) ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);
    // -----------------------------------------------------------------
    
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    // Fetch leave requests from backend
    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Using a specific endpoint for the main content
            const res = await axios.get("http://localhost:5000/api/leaves"); 
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to load leave requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Sync from Google Sheet
    const syncRequests = async () => {
        setLoading(true);
        try {
            await axios.get("http://localhost:5000/api/leaves/sync");
            fetchRequests();
            alert("Leave requests synced successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to sync leave requests.");
        } finally {
            setLoading(false);
        }
    };

    // Approve or Reject a request
    const handleUpdateStatus = async (id, status) => {
        const adminComment = prompt("Enter a comment (optional):");
        if (!window.confirm(`Are you sure you want to ${status} this leave?`)) return;

        try {
            setUpdatingId(id);
            await axios.patch(`http://localhost:5000/api/leaves/${id}`, { status, adminComment });
            fetchRequests();
            // No need for redundant alert here, the fetchRequests re-renders the table
        } catch (err) {
            console.error(err);
            alert("Failed to update leave status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const mainContentClass = `main-content-leave ${isSidebarOpen ? '' : 'main-content--full'}`;


    return (
        <div className="display-process-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            {/* Hamburger Icon if sidebar is closed (Assuming this exists in your layout) */}
            {!isSidebarOpen && (
                <button className="sidebar-toggle-icon" onClick={toggleSidebar}>
                    &#9776;
                </button>
            )}

            <div>
                <div style={{
                    marginBottom: '30px',
                    padding: '25px',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #dc3545',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h1 style={{
                            margin: '0 0 10px 0',
                            color: '#495057',
                            fontSize: '2rem',
                            fontWeight: '600'
                        }}>
                            Employee Leave Requests
                        </h1>
                        <p style={{
                            margin: '0',
                            color: '#666',
                            fontSize: '1rem'
                        }}>
                            Manage and approve employee holiday and leave requests
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={syncRequests} 
                    disabled={loading} 
                    style={{
                        padding: '10px 20px',
                        backgroundColor: loading ? '#6c757d' : '#17a2b8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(23, 162, 184, 0.3)',
                        marginBottom: '20px'
                    }}
                    onMouseOver={(e) => {
                        if (!loading) {
                            e.target.style.backgroundColor = '#138496';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(23, 162, 184, 0.4)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (!loading) {
                            e.target.style.backgroundColor = '#17a2b8';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(23, 162, 184, 0.3)';
                        }
                    }}
                >
                    {loading ? "Syncing..." : "Sync Requests from Google Form"}
                </button>

                <div className="table-responsive">
                    <table className="leave-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Email</th>
                                <th>Employee</th>
                                <th>ID</th>
                                <th>Dept</th>
                                <th>Desig.</th>
                                <th>Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Comment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && requests.length === 0 ? (
                                <tr>
                                    <td colSpan="13" className="no-requests-message">Loading...</td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="13" className="no-requests-message">No leave requests found.</td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id}>
                                        <td>{new Date(req.timestamp).toLocaleString()}</td>
                                        <td>{req.email}</td>
                                        <td>{req.name}</td>
                                        <td>{req.employeeId}</td>
                                        <td>{req.department}</td>
                                        <td>{req.designation}</td>
                                        <td>{req.leaveType}</td>
                                        <td>{new Date(req.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(req.endDate).toLocaleDateString()}</td>
                                        <td>{req.reason}</td>
                                        <td>
                                            <span className={`status-${req.status}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td>{req.adminComment || "-"}</td>
                                        <td>
                                            {req.status === "Pending" && (
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '8px',
                                                    justifyContent: 'center',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <button
                                                        onClick={() => handleUpdateStatus(req._id, "Approved")}
                                                        disabled={updatingId === req._id}
                                                        style={{
                                                            padding: '6px 12px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: '600',
                                                            backgroundColor: updatingId === req._id ? '#6c757d' : '#28a745',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: updatingId === req._id ? 'not-allowed' : 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            if (updatingId !== req._id) {
                                                                e.target.style.backgroundColor = '#218838';
                                                                e.target.style.transform = 'translateY(-1px)';
                                                                e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.4)';
                                                            }
                                                        }}
                                                        onMouseOut={(e) => {
                                                            if (updatingId !== req._id) {
                                                                e.target.style.backgroundColor = '#28a745';
                                                                e.target.style.transform = 'translateY(0)';
                                                                e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.3)';
                                                            }
                                                        }}
                                                    >
                                                        {updatingId === req._id ? "..." : "Approve"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(req._id, "Rejected")}
                                                        disabled={updatingId === req._id}
                                                        style={{
                                                            padding: '6px 12px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: '600',
                                                            backgroundColor: updatingId === req._id ? '#6c757d' : '#dc3545',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: updatingId === req._id ? 'not-allowed' : 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            if (updatingId !== req._id) {
                                                                e.target.style.backgroundColor = '#c82333';
                                                                e.target.style.transform = 'translateY(-1px)';
                                                                e.target.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.4)';
                                                            }
                                                        }}
                                                        onMouseOut={(e) => {
                                                            if (updatingId !== req._id) {
                                                                e.target.style.backgroundColor = '#dc3545';
                                                                e.target.style.transform = 'translateY(0)';
                                                                e.target.style.boxShadow = '0 2px 4px rgba(220, 53, 69, 0.3)';
                                                            }
                                                        }}
                                                    >
                                                        {updatingId === req._id ? "..." : "Reject"}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LeaveRequests;