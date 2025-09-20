import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img 
          src="/images/R1.jpg" 
          alt="Ayursutra Logo" 
          className="logo-img"
        />
        <span className="logo-text">RESILIENT</span>
      </div>

      <ul className="nav-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === "/room" ? "active" : ""}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className={location.pathname === "/services" ? "active" : ""}>
          <Link to="/services">Resource</Link>
        </li>
        <li className={location.pathname === "/prescription" ? "active" : ""}>
          <Link to="/prescription">Alerts</Link>
        </li>
      </ul>

      <Link to="/auth">
        <button className="login-btn">Login / Signup</button>
      </Link>
    </nav>
  );
}
