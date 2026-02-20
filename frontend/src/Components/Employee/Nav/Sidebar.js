import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import dashboardLogger from "../../utils/dashboardLogger";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Log logout action
    const userId = localStorage.getItem('userId') || 
                  localStorage.getItem('regId') || 
                  'anonymous';
    const userRole = localStorage.getItem('userRole') || 
                    localStorage.getItem('role') || 
                    'unknown';
    
    dashboardLogger.log("User logged out from Employee Dashboard", "info", {
      userId: userId,
      userRole: userRole,
      action: "logout",
      timestamp: new Date().toISOString()
    });

    // Clear all stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRegistrationId');
    localStorage.removeItem('userDepartment');
    localStorage.removeItem('userDesignation');
    sessionStorage.removeItem('userRole');
    sessionStorage.clear();

    // Navigate to login page
    navigate('/d_loging');
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Features</h2>
      </div>
      <div className="sidebar__inner">
        <ul>
          <li><a href="/empdashboard">Dashboard</a></li>
          <li><a href="/new_emp">New Employee</a></li>
          <li><a href="/employees_list">Employee List</a></li>
          <li><a href="/attendancenew">Attendance</a></li>
          <li><a href="/requestsemp">Holiday Requests</a></li>
          <li><a href="/task">Tasks</a></li>
          <li><a href="/performance">Performance</a></li>
          <li><a href="/analytics">Analytics</a></li>
          <li><a href="/emp/sendpdf">Reports / Other</a></li>
          <li><a href="/emp/conus">Contact Us</a></li>
        </ul>
      </div>
      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;