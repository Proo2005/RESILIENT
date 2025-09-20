import React, { useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import Sidebar from "../components/sidebar";
import '../styles/dashboard.css';

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [stateFilter, setStateFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [hotspots, setHotspots] = useState([]); 


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setFilteredData(results.data);
      },
    });
  };

  const handleStateFilter = (e) => {
    const selectedState = e.target.value;
    setStateFilter(selectedState);
    filterData(selectedState, regionFilter);
  };
  const handleRegionFilter = (e) => {
    const selectedRegion = e.target.value;
    setRegionFilter(selectedRegion);
    filterData(stateFilter, selectedRegion);
  };
  const filterData = (state, region) => {
    let temp = [...data];
    if (state !== "All") temp = temp.filter((row) => row.State === state);
    if (region !== "All") temp = temp.filter((row) => row.Region === region);
    setFilteredData(temp);
  };


  const handlePredict = async () => {
    if (!filteredData.length) {
      alert("Upload CSV and select state/region first!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/predict", {
        csvData: filteredData
      });
      if(res.data.hotspots){
        setHotspots(res.data.hotspots); 
      }
    } catch (err) {
      console.error(err);
      alert("Prediction failed!");
    } finally {
      setLoading(false);
    }
  };


  const totalStats = filteredData.reduce(
    (acc, row) => {
      acc.Population += Number(row.Population) || 0;
      acc.DeathRate += Number(row["Death Rate (%)"]) || 0;
      acc.Diseased += Number(row["Pandemic/Diseased Total"]) || 0;
      acc.Hospital += Number(row["Hospital Admission"]) || 0;
      return acc;
    },
    { Population: 0, DeathRate: 0, Diseased: 0, Hospital: 0 }
  );

  const pieData = {
    labels: ["Diseased", "Healthy"],
    datasets: [
      {
        data: [totalStats.Diseased, totalStats.Population - totalStats.Diseased],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const barData = {
    labels: filteredData.map((row, index) => row.Region + "-" + (index + 1)),
    datasets: [
      {
        label: "Hospital Admission",
        data: filteredData.map((row) => Number(row["Hospital Admission"]) || 0),
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Death Rate (%)",
        data: filteredData.map((row) => Number(row["Death Rate (%)"]) || 0),
        backgroundColor: "#FF9F40",
      },
    ],
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="header">Result Analysis</h1>

        {!data.length && (
          <div className="upload-section">
            <input type="file" accept=".csv" onChange={handleFileUpload} />
          </div>
        )}

        {data.length > 0 && (
          <>
           
            <div className="stats-grid">
              <div className="card">
                <h2>Population</h2>
                <p>{totalStats.Population}</p>
              </div>
              <div className="card">
                <h2>Death Rate (%)</h2>
                <p>{filteredData.length ? (totalStats.DeathRate / filteredData.length).toFixed(2) : 0}</p>
              </div>
              <div className="card">
                <h2>Pandemic Total</h2>
                <p>{totalStats.Diseased}</p>
              </div>
              <div className="card">
                <h2>Hospital Admission</h2>
                <p>{totalStats.Hospital}</p>
              </div>
            </div>

            <div className="filters">
              <div>
                <label>State:</label>
                <select value={stateFilter} onChange={handleStateFilter}>
                  <option value="All">All</option>
                  {[...new Set(data.map((row) => row.State))].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Region:</label>
                <select value={regionFilter} onChange={handleRegionFilter}>
                  <option value="All">All</option>
                  {[...new Set(data.filter((row) => (stateFilter === "All" ? true : row.State === stateFilter))
                    .map((row) => row.Region))].map((reg) => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
            </div>

           
            <div className="charts-grid">
              <div className="card chart-card">
                <h3>Diseased vs Healthy</h3>
                <Pie data={pieData} />
              </div>
              <div className="card chart-card">
                <h3>Hospital Admission & Death Rate</h3>
                <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
              </div>
            </div>
           <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <button className="predict-btn" onClick={handlePredict}>
                {loading ? "Predicting..." : "Predict Analysis"}
              </button>
            </div>

            {hotspots.length > 0 && (
              <div className="hotspot-section">
                <h2>Top 3 Potential Hotspot Areas</h2>
                <table className="hotspot-table">
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>Region</th>
                      <th>Predicted Diseased</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.map((h, index) => (
                      <tr key={index} className={index === 0 ? "top-hotspot" : ""}>
                        <td>{h.State}</td>
                        <td>{h.Region}</td>
                        <td>{h.Predicted_Diseased}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
