
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
          <li><a href="/indashboard">Dashboard</a></li>
          <li><a href="/New_Supply">New</a></li>
          <li><a href="/New_Manage">Supply</a></li>
          <li><a href="/newlot">Create Lot</a></li>
          <li><a href="/newlotlist">Lot List</a></li>
          <li><a href="/outcome">Outcome</a></li>
          <li><a href="/raw_m">Materials</a></li>
          <li><a href="/emp/sendpdf">Other</a></li>
          <li><a href="/emp/conus">ContactUs</a></li>
          
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
