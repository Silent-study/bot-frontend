import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { getToken, getAuthData, getStats, getUser, getSocketUrl, clearAuth, downloadExtension } from '../services/api';
import '../ControlPanel.css';

// Map backend event codes to friendly labels
function eventToLabel(event) {
  const map = {
    'MCQ_ANSWERED': '✅ MCQ Answered',
    'ESSAY_ANSWERED': '📝 Essay Written',
    'VOCAB_DONE': '📖 Vocab Completed',
    'VIDEO_SKIP_DONE': '⏭️ Video Skipped',
    'VIDEO_SKIP_START': '▶️ Video Skip Started',
    'NEXT_ACTIVITY_CLICKED': '➡️ Next Activity',
    'CHECKBOX_ANSWERED': '☑️ Checkbox Answered',
    'DROPDOWN_ANSWERED': '📋 Dropdown Answered',
    'DIRECT_INSTRUCTION_DONE': '🎬 Direct Instruction Done',
    'DIRECT_INSTRUCTION_START': '🎬 Direct Instruction Started',
    'ACTIVITY_CYCLE_START': '🔄 Activity Cycle',
  };
  return map[event] || event;
}

function eventToType(event) {
  if (!event) return 'info';
  if (event.includes('ANSWERED') || event.includes('DONE') || event.includes('COMPLETED')) return 'system';
  if (event.includes('ERROR') || event.includes('FAIL')) return 'error';
  if (event.includes('WARN') || event.includes('SKIP')) return 'warning';
  return 'info';
}

export default function ControlPanel({ onLogout }) {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [socketStatus, setSocketStatus] = useState('connecting'); // connecting, connected, error
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const logsRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [stats, setStats] = useState({
    questionsAnswered: 0,
    videosSkipped: 0,
    vocabCompleted: 0,
    activitiesTotal: 0,
  });

  const [userInfo, setUserInfo] = useState({
    email: '',
    plan: '',
    expiryDate: null,
    addons: [],
    licenseKey: '',
    isPaid: false,
  });

  // Load user info & stats on mount
  useEffect(() => {
    // Set initial data from localStorage (instant, no network)
    const authData = getAuthData();
    setUserInfo(prev => ({
      ...prev,
      email: authData.email || '',
      plan: authData.plan || '',
      expiryDate: authData.expiresAt || null,
      addons: authData.addons || [],
    }));

    // Fetch fresh user data from backend
    getUser()
      .then(data => {
        setUserInfo({
          email: data.email,
          plan: data.plan,
          expiryDate: data.expiryDate,
          addons: data.addons || [],
          licenseKey: data.licenseKey || '',
          isPaid: data.isPaid,
        });
      })
      .catch(err => {
        console.error('Failed to load user info:', err);
      });

    // Load 24h stats
    getStats()
      .then(data => {
        setStats({
          questionsAnswered: data.questionsAnswered || 0,
          videosSkipped: data.videosSkipped || 0,
          vocabCompleted: data.vocabCompleted || 0,
          activitiesTotal: data.activitiesTotal || 0,
        });
        // Also load recent logs from stats
        if (data.recentLogs && data.recentLogs.length > 0) {
          setLogs(data.recentLogs.map(l => ({
            msg: `${eventToLabel(l.event)}${l.detail ? ' — ' + l.detail : ''}`,
            type: eventToType(l.event),
            timestamp: l.timestamp,
          })));
        }
      })
      .catch(err => {
        console.error('Failed to load stats:', err);
      });
  }, []);

  // Socket.IO connection — aligned with backend events
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const s = io(getSocketUrl(), { transports: ['websocket'] });
    
    s.on('connect', () => {
      console.log('[Dashboard] Socket connected, authenticating...');
      s.emit('authenticate', token);
    });

    s.on('authenticated', ({ userId, plan }) => {
      console.log('[Dashboard] Authenticated:', userId, plan);
      setSocketStatus('connected');
      setLogs(prev => [...prev, {
        msg: '🔗 Connected to live feed',
        type: 'system',
        timestamp: new Date().toISOString(),
      }]);
    });

    s.on('auth-error', ({ error }) => {
      console.error('[Dashboard] Auth error:', error);
      setSocketStatus('error');
      setLogs(prev => [...prev, {
        msg: '❌ Authentication failed: ' + error,
        type: 'error',
        timestamp: new Date().toISOString(),
      }]);
    });

    s.on('activity-log', ({ event, detail, timestamp }) => {
      setLogs(prev => [...prev, {
        msg: `${eventToLabel(event)}${detail ? ' — ' + detail : ''}`,
        type: eventToType(event),
        timestamp: timestamp || new Date().toISOString(),
      }]);

      // Update stats counters in real-time
      setStats(prev => {
        const updated = { ...prev };
        if (event.includes('ANSWERED')) updated.questionsAnswered += 1;
        if (event === 'VIDEO_SKIP_DONE') updated.videosSkipped += 1;
        if (event === 'VOCAB_DONE') updated.vocabCompleted += 1;
        if (event === 'NEXT_ACTIVITY_CLICKED') updated.activitiesTotal += 1;
        return updated;
      });
    });

    s.on('disconnect', () => {
      setSocketStatus('connecting');
    });

    setSocket(s);
    return () => s.disconnect();
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  // Format expiry date
  const formatExpiry = (dateStr) => {
    if (!dateStr) return 'N/A';
    const expiry = new Date(dateStr);
    const now = new Date();
    const diff = expiry - now;
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const formatPlan = (plan) => {
    const map = { day: 'Day Key', week: 'Week Key', month: 'Month Key', six_month: '6 Months Key' };
    return map[plan] || plan || 'N/A';
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="dashboard-wrapper">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        </div>
      )}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
            <path d="M12 2L2 7l10 5 10-5-10-5Z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          Silent<span>Study</span>
        </div>
        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</div>
          <div className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>Activity Logs</div>
          <div className={`nav-item ${activeTab === 'extension' ? 'active' : ''}`} onClick={() => setActiveTab('extension')}>Extension Guide</div>
        </nav>
        <div className="sidebar-footer">
          <div style={{fontSize: '0.75rem', color: '#525252', marginBottom: '0.75rem', textAlign: 'center'}}>
            {userInfo.email || 'Loading...'}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">Dashboard</div>
          <div className="user-profile">
            <div className={`connection-badge ${socketStatus}`}>
              <span className="connection-dot"></span>
              {socketStatus === 'connected' ? 'Live' : socketStatus === 'error' ? 'Error' : 'Connecting...'}
            </div>
          </div>
        </header>

        <div className="dashboard-scrollable">
          {activeTab === 'dashboard' && (
            <>
              {/* Subscription Card */}
              <div className="sub-card">
                <div className="sub-info">
                  <h3>Active Subscription</h3>
                  <p>Your account is authorized for Silent Study Pro features.</p>
                </div>
                <div className="sub-status">
                  <div className="stat-box">
                    <div className="stat-label">Current Plan</div>
                    <div className="stat-value">{formatPlan(userInfo.plan)}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Status</div>
                    <div className={`stat-value ${userInfo.isPaid ? 'success' : ''}`}>
                      {userInfo.isPaid ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Expires In</div>
                    <div className="stat-value">{formatExpiry(userInfo.expiryDate)}</div>
                  </div>
                  {userInfo.licenseKey && (
                    <div className="stat-box">
                      <div className="stat-label">License Key</div>
                      <div className="stat-value" style={{fontSize: '0.85rem', letterSpacing: '0.5px'}}>{userInfo.licenseKey}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-card-value">{stats.questionsAnswered}</div>
                  <div className="stat-card-label">Questions Answered</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-value">{stats.videosSkipped}</div>
                  <div className="stat-card-label">Videos Skipped</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-value">{stats.vocabCompleted}</div>
                  <div className="stat-card-label">Vocab Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-value">{stats.activitiesTotal}</div>
                  <div className="stat-card-label">Total Activities</div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'logs' && (
            <div className="cp-grid">
              {/* Live Activity Log */}
              <div className="cp-card" style={{gridColumn: '1 / -1'}}>
                <div className="cp-card-title">
                  Live Activity Log
                  <div className={`status-badge ${socketStatus === 'connected' ? 'RUNNING' : ''}`}>
                    {socketStatus === 'connected' ? 'LIVE' : 'OFFLINE'}
                  </div>
                </div>
                <div className="logs-window" ref={logsRef}>
                  {logs.length === 0 && (
                    <div className="log-entry info">
                      Waiting for activity from Chrome Extension... Install the extension and enable the bot to see live logs here.
                    </div>
                  )}
                  {logs.map((log, i) => (
                    <div key={i} className={`log-entry ${log.type}`}>
                      <span className="log-time">{formatTimestamp(log.timestamp)}</span>
                      {log.msg}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'extension' && (
            <div className="cp-card">
              <div className="cp-card-title" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span>Chrome Extension Setup</span>
                <button 
                  onClick={async () => {
                    try {
                      await downloadExtension();
                      showToast('Extension downloaded successfully!');
                    } catch (e) {
                      showToast('Download failed. Please try again.', 'error');
                    }
                  }} 
                  style={{
                    background: '#2563eb', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                  Download Extension (ZIP)
                </button>
              </div>
              <div className="setup-steps" style={{marginTop: '1.5rem'}}>
                <div className="setup-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Download & Extract</h4>
                    <p>Click the <b>Download Extension</b> button above to get the zip file. Extract the downloaded zip file into a folder on your computer.</p>
                  </div>
                </div>
                <div className="setup-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Install in Chrome</h4>
                    <p>Go to <code 
                      style={{cursor: 'pointer', color: '#3b82f6', textDecoration: 'underline'}} 
                      onClick={() => {
                        navigator.clipboard.writeText('chrome://extensions');
                        showToast('Copied chrome://extensions to clipboard! Paste it in a new tab.');
                      }}
                      title="Click to copy"
                    >chrome://extensions</code> in your browser. Turn on <b>Developer mode</b> (top right). Click <b>Load unpacked</b> and select the extracted folder.</p>
                  </div>
                </div>
                <div className="setup-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Login to Extension</h4>
                    <p>Click the Silent Study extension icon in your Chrome toolbar. Log in using your email and password.</p>
                  </div>
                </div>
                <div className="setup-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Start Automating</h4>
                    <p>Toggle the bot ON in the extension popup. Navigate to your Edgenuity class and Silent Study will handle everything automatically!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
