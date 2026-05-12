import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import ControlPanel from './pages/ControlPanel';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const paid = localStorage.getItem('isPaid');
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('uid');

    if (paid === 'true' || uid) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage onAuthSuccess={() => setIsAuthenticated(true)} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/dashboard" 
          element={(isAuthenticated || new URLSearchParams(window.location.search).get('uid')) ? <ControlPanel /> : <Navigate to="/register" />} 
        />
      </Routes>
    </Router>
  );
}
