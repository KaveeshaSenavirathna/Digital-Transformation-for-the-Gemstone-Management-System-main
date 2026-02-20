
import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Featuers</h2>
      </div>
      <div className="sidebar__inner">
        <ul>
          <li><a href="/pandpdashboard">Dashboard</a></li>
          <li><a href="/insertprocess">New</a></li>
          <li><a href="/preform">Preform</a></li>
          <li><a href="/calibrate">Calibrate</a></li>
          <li><a href="/cutandpolish">Cut and polish</a></li>
          <li><a href="/dop">Dop</a></li>
          <li><a href="/realtimesimulation">Real-Time Simulation</a></li>
          <li><a href="/emp/sendpdf">Other</a></li>
          <li><a href="/emp/conus">ContactUs</a></li>
          
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
