import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">MyDashboard</div>
      <nav className="sidebar-menu">
        <NavLink to="/dashboard" activeclassname="active">
          Data Overview
        </NavLink>
        <NavLink to="/predictions" activeclassname="active">
          Predictions
        </NavLink>
        <NavLink to="/resources" activeclassname="active">
          Resources
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
