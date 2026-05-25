import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import ControlPanel from './pages/ControlPanel';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import LoginPage from './pages/LoginPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { isAuthenticated as checkAuth, clearAuth } from './services/api';

export default function App() {
  const [authed, setAuthed] = useState(() => checkAuth());

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
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/tos" element={<Navigate to="/terms" replace />} />
        <Route 
          path="/dashboard" 
          element={authed ? <ControlPanel activeTab="dashboard" onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/config" 
          element={authed ? <ControlPanel activeTab="config" onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/enotes" 
          element={authed ? <ControlPanel activeTab="enotes" onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/setup" 
          element={authed ? <ControlPanel activeTab="setup" onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/extension" 
          element={<Navigate to="/setup" replace />} 
        />
      </Routes>
    </Router>
  );
}

