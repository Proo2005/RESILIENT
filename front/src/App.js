import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import Navbar from './components/navbar';
import Dashboard from './pages/dashboard';
import Sidebar from './components/sidebar';
import PredictionPage from './pages/prediction';
import AuthPage from './pages/auth';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/prediction" element={<PredictionPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      
    </Router>
  );
}

export default App;
