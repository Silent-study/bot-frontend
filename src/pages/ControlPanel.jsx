import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import '../ControlPanel.css';

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin;

export default function ControlPanel() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [creds, setCreds] = useState({
    username: 'Secor.zoe',
    password: 'r9j5723t',
    courseName: ''
  });
  const [botRunning, setBotRunning] = useState(false);
  const [currentState, setCurrentState] = useState('IDLE');
  const [logs, setLogs] = useState([{ msg: 'Ready to launch. Enter credentials and click start.', type: 'system' }]);
  const logsRef = useRef(null);

  const [subscription, setSubscription] = useState({
    plan: 'Loading...',
    status: 'Checking...',
    expiry: '...'
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('uid');

    const verifyAndFetch = async () => {
      if (uid) {
        // 1. Verify Payment
        try {
          const res = await fetch(`http://localhost:3000/verify-payment?uid=${uid}`);
          const data = await res.json();
          if (data.isPaid) {
            localStorage.setItem('isPaid', 'true');
            localStorage.setItem('userId', uid);
          }
        } catch (err) {
          console.error('Verification failed');
        }
      }

      // 2. Fetch User Data
      const currentUid = uid || localStorage.getItem('userId');
      if (currentUid) {
        try {
          // We need an endpoint for this, but for now we'll mock or add one
          // Let's assume we can fetch it. For now, I'll just set it based on localStorage
          setSubscription({
            plan: 'Week Key (Pro)',
            status: 'Active',
            expiry: '4 days, 12 hours'
          });
        } catch (err) {}
      }
    };

    verifyAndFetch();

    const s = io(SOCKET_URL, { transports: ['websocket'] });
    
    s.on('connect', () => {
      console.log('Connected to server');
    });

    s.on('log', (msg) => {
      let type = 'info';
      if (msg.includes('✅') || msg.includes('success')) type = 'system';
      if (msg.includes('❌') || msg.includes('Error')) type = 'error';
      if (msg.includes('⚠️')) type = 'warning';

      setLogs(prev => [...prev, { msg, type }]);
    });

    s.on('state', (state) => setCurrentState(state));

    s.on('bot-finished', () => {
      setBotRunning(false);
      setCurrentState('FINISHED');
    });

    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const handleStart = () => {
    if (!socket || !creds.username || !creds.password) return;
    setBotRunning(true);
    setCurrentState('STARTING');
    setLogs([{ msg: '🚀 Launching automation...', type: 'system' }]);
    socket.emit('start-bot', creds);
  };

  const handleStop = () => {
    if (!socket) return;
    socket.emit('stop-bot');
    setBotRunning(false);
    setCurrentState('STOPPED');
  };

  const handleLogout = () => {
    localStorage.removeItem('isPaid');
    localStorage.removeItem('userId');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-logo">
          SILENT<span>STUDY</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">Automation Logs</div>
          <div className="nav-item">Settings</div>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">Automation Dashboard</div>
          <div className="user-profile">
            <div className="user-badge">{localStorage.getItem('userId')?.substring(0, 8) || 'User'}</div>
          </div>
        </header>

        <div className="dashboard-scrollable">
          <div className="sub-card">
            <div className="sub-info">
              <h3>Active Subscription</h3>
              <p>Your account is fully authorized for Silent Study Pro features.</p>
            </div>
            <div className="sub-status">
              <div className="stat-box">
                <div className="stat-label">Current Plan</div>
                <div className="stat-value">{subscription.plan}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Status</div>
                <div className={`stat-value ${subscription.status === 'Active' ? 'success' : ''}`}>{subscription.status}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Expires In</div>
                <div className="stat-value">{subscription.expiry}</div>
              </div>
            </div>
          </div>

          <div className="cp-grid">
            <div className="cp-card">
              <div className="cp-card-title">Launch Automation</div>
              <div className="form-group">
                <label className="form-label">Edgenuity Username</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Username" 
                  value={creds.username} 
                  onChange={e => setCreds({...creds, username: e.target.value})} 
                  disabled={botRunning}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Edgenuity Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Password" 
                  value={creds.password} 
                  onChange={e => setCreds({...creds, password: e.target.value})} 
                  disabled={botRunning}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target Course (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. English 10" 
                  value={creds.courseName} 
                  onChange={e => setCreds({...creds, courseName: e.target.value})} 
                  disabled={botRunning}
                />
              </div>

              {botRunning ? (
                <button className="btn-stop" onClick={handleStop}>Stop Automation</button>
              ) : (
                <button className="btn-launch" onClick={handleStart}>Start Bot</button>
              )}
            </div>

            <div className="cp-card">
              <div className="cp-card-title">
                Live Activity Logs
                <div className={`status-badge ${botRunning ? 'RUNNING' : ''}`}>{currentState}</div>
              </div>
              <div className="logs-window" ref={logsRef}>
                {logs.length === 0 && <div className="log-entry info">Ready to launch. Enter credentials and click start.</div>}
                {logs.map((log, i) => (
                  <div key={i} className={`log-entry ${log.type}`}>
                    {log.msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
