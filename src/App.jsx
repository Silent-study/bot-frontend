import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';
import LandingPage from './pages/LandingPage';
import ControlPanel from './pages/ControlPanel';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ControlPanel />} />
      </Routes>
    </Router>
  );
}
