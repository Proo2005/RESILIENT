import React from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "../styles/landing.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const LandingPage = () => {
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Cases",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  const pieData = {
    labels: ["Recovered", "Active", "Deaths"],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: ["#10B981", "#3B82F6", "#EF4444"],
      },
    ],
  };

  return (
    <div className="landing-page">
        

      <div className="carousel-container">
        <img
          src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="carousel"
          className="carousel-image"
        />
        <div className="carousel-text">
          <h1>Empowering Informed Decisions for a Safer Future</h1>
          <p>Take proactive steps with real-time insights and analytics.</p>
          <Link to="/dashboard">
            <button>Explore Dashboard</button>
          </Link>
        </div>
      </div>


      <section className="key-features">
        <h2>Key Features</h2>
        <div className="features-container">
          {[
            { name: "Data Analytics", link: "/analytics" },
            { name: "Resource Allocation", link: "/resources" },
            { name: "Communication", link: "/communication" },
            { name: "System Alerts", link: "/alerts" },
          ].map((feature, idx) => (
            <Link key={idx} to={feature.link} className="feature-card">
              {feature.name}
            </Link>
          ))}
        </div>
      </section>

 
      <section className="data-overview">
        <h2>Real-time Data Overview</h2>
        <div className="overview-container">
         
          <div className="chart-card">
            <div className="chart-section">
              <h3>Bar Chart</h3>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="chart-section">
              <h3>Pie Chart</h3>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Right: Info Cards */}
          <div className="info-cards">
            <Link to="#">Official Guidelines</Link>
            <Link to="#">Facts & Support</Link>
            <Link to="#">Recent News</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
