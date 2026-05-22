import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import ControlPanel from './pages/ControlPanel';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import LoginPage from './pages/LoginPage';
import { isAuthenticated as checkAuth, clearAuth } from './services/api';

export default function App() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(checkAuth());
  }, []);

  const handleAuthSuccess = () => {
    setAuthed(true);
  };

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage isLoggedIn={authed} onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/register" element={<RegisterPage onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/login" element={<LoginPage onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/dashboard" 
          element={authed ? <ControlPanel onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}
