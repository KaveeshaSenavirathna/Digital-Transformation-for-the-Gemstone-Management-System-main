import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        {/* Fixed typo from "Featuers" to "Features" */}
        <h2 className="sidebar__title">Features</h2>
      </div>
      <div className="sidebar__inner">
        <ul>
          {/* Consider using a dedicated <NavLink> component from a router (like react-router-dom) 
              for active link styling in a real application, but <a> is fine for this example. */}
          <li><a href="/financedashboard">Dashboard</a></li>
          <li><a href="/WorkSummery">Work Summary</a></li>
          <li><a href="/PayData">Pay Data</a></li>
          <li><a href="/Paysheet">Paysheet</a></li>
          <li><a href="/Materials">Materials</a></li>
          <li><a href="/emp/sendpdf">Reports / Other</a></li> {/* Improved label */}
          <li><a href="/emp/conus">Contact Us</a></li> {/* Improved label */}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;