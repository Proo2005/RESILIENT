import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";

const PredictionPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const csvData = JSON.parse(localStorage.getItem("filteredData")) || [];
        const res = await axios.post("http://localhost:5000/api/predict", {
          csvData,
        });
        setPrediction(res.data.output_text || "No prediction returned");
      } catch (err) {
        console.error(err);
        setPrediction("Prediction failed");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);
  

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="header">Gemini Prediction</h1>
        {loading ? (
          <p>Loading prediction...</p>
        ) : (
          <div className="prediction-box">
            <p>{prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
