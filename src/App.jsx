import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import ControlPanel from './pages/ControlPanel';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already "paid" or "authenticated" via localStorage for demo
    const paid = localStorage.getItem('isPaid');
    if (paid === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage onAuthSuccess={() => setIsAuthenticated(true)} />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <ControlPanel /> : <Navigate to="/register" />} 
        />
      </Routes>
    </Router>
  );
}
