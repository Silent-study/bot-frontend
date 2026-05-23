import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { getToken, getAuthData, getStats, getUser, getSocketUrl, clearAuth, downloadExtension, getConfig, saveConfig, getNotes } from '../services/api';
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

export default function ControlPanel({ onLogout, activeTab = 'dashboard' }) {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [socketStatus, setSocketStatus] = useState('connecting'); // connecting, connected, error
  const [logs, setLogs] = useState([]);
  const [dashboardTab, setDashboardTab] = useState('activity');
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

  const [botActive, setBotActive] = useState(false);
  const [config, setConfig] = useState({
    autoAdvance: true,
    autoSubmit: true,
    autoAssessment: true,
    assessmentAccuracy: 75,
    autoAssignment: true,
    autoWrite: true,
    autoProject: true,
    autoVocab: true,
  });
  
  const [notesData, setNotesData] = useState({
    notes: [],
    total: 0,
    page: 1,
    pages: 1,
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

    // Load config
    getConfig()
      .then(data => {
        if (data.config) setConfig(data.config);
        setBotActive(!!data.botActive);
      })
      .catch(err => console.error('Failed to load config:', err));
      
    // Load initial notes
    loadNotes(1);
  }, []);

  const loadNotes = (page) => {
    getNotes(page)
      .then(data => setNotesData(data))
      .catch(err => console.error('Failed to load notes:', err));
  };

  const handleSaveConfig = () => {
    if (botActive) {
      showToast('Cannot update config while bot is active. Stop the bot first.', 'error');
      return;
    }
    saveConfig(config)
      .then(() => showToast('Configuration saved successfully!'))
      .catch(err => showToast(err.message, 'error'));
  };

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
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div className={`nav-item ${activeTab === 'extension' ? 'active' : ''}`} onClick={() => navigate('/extension')}>Extension Guide</div>
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

              {/* Inner Tabs for Dashboard */}
              <div className="tab-nav">
                <button className={`tab-btn ${dashboardTab === 'activity' ? 'active' : ''}`} onClick={() => setDashboardTab('activity')}>Live Activity</button>
                <button className={`tab-btn ${dashboardTab === 'config' ? 'active' : ''}`} onClick={() => setDashboardTab('config')}>Bot Config</button>
                <button className={`tab-btn ${dashboardTab === 'enotes' ? 'active' : ''}`} onClick={() => setDashboardTab('enotes')}>eNotes</button>
              </div>

              {dashboardTab === 'activity' && (
                <div className="tab-panel">
                  <section className="status-card">
                    <div className="status-header">
                      <h2>Live Activity Log</h2>
                      <div className={`badge ${socketStatus === 'connected' ? 'active' : 'inactive'}`}>
                        {socketStatus === 'connected' ? 'LIVE' : 'OFFLINE'}
                      </div>
                    </div>
                    <div className="logs-window" ref={logsRef}>
                      {logs.length === 0 && (
                        <div className="log-entry system">
                          Waiting for activity from Chrome Extension... Install the extension and enable the bot to see live logs here.
                        </div>
                      )}
                      {logs.map((log, i) => (
                        <div key={i} className={`log-entry ${log.type}`}>
                          <span className="log-time">[{formatTimestamp(log.timestamp)}]</span>
                          <span>{log.msg}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {dashboardTab === 'config' && (
                <div className="tab-panel">
                  <section className="status-card config-tab-card">
                    <div className="status-header">
                      <h2>Bot Configuration</h2>
                      <div className={`badge ${botActive ? 'active' : 'inactive'}`}>
                        {botActive ? 'BOT ACTIVE' : 'BOT INACTIVE'}
                      </div>
                    </div>
                    
                    {botActive && (
                      <p className="config-locked-msg">
                        ⚠️ Bot is currently active. Stop the bot from the extension to edit settings.
                      </p>
                    )}
                    
                    <div className={botActive ? 'config-form-disabled' : ''}>
                      <div className="config-item">
                        <div className="config-item-info">
                          <span className="config-label">Auto Advance</span>
                          <span className="config-desc">Automatically clicks through lessons and moves forward without user input.</span>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked={config.autoAdvance} disabled={botActive} onChange={e => setConfig({...config, autoAdvance: e.target.checked})} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="config-item">
                        <div className="config-item-info">
                          <span className="config-label">Auto Submit</span>
                          <span className="config-desc">Automatically hits the submit button on quizzes and assignments with a humanised delay.</span>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked={config.autoSubmit} disabled={botActive} onChange={e => setConfig({...config, autoSubmit: e.target.checked})} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="config-item">
                        <div className="config-item-info">
                          <span className="config-label">Auto Assessment</span>
                          <span className="config-desc">Automatically selects answers on quizzes and tests — the core answer-bot feature.</span>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked={config.autoAssessment} disabled={botActive} onChange={e => setConfig({...config, autoAssessment: e.target.checked})} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="config-item config-item-slider">
                        <div className="config-item-info">
                          <span className="config-label">Assessment Accuracy — <span>{config.assessmentAccuracy}</span>%</span>
                          <span className="config-desc">Percentage of correct answers the bot targets (40 – 90%). Lower values look more natural.</span>
                        </div>
                        <div className="slider-track-wrap">
                          <span className="slider-min">40%</span>
                          <input 
                            type="range" 
                            min="40" 
                            max="90" 
                            value={config.assessmentAccuracy} 
                            disabled={botActive}
                            onChange={e => setConfig({...config, assessmentAccuracy: parseInt(e.target.value)})} 
                            className="range-slider"
                          />
                          <span className="slider-max">90%</span>
                        </div>
                      </div>

                      <div className="config-item">
                        <div className="config-item-info">
                          <span className="config-label">Auto Assignment</span>
                          <span className="config-desc">Handles written and structured assignments like vocab activities, labs, and drag-and-drop tasks.</span>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked={config.autoAssignment} disabled={botActive} onChange={e => setConfig({...config, autoAssignment: e.target.checked})} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="config-item">
                        <div className="config-item-info">
                          <span className="config-label">Auto Write</span>
                          <span className="config-desc">Uses AI to generate and submit free-response answers and essays with a built-in humaniser.</span>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked={config.autoWrite} disabled={botActive} onChange={e => setConfig({...config, autoWrite: e.target.checked})} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="config-item">
                        <div className="config-item-info">
                          <span className="config-label">Auto Project</span>
                          <span className="config-desc">Handles larger project-based tasks assigned by Edgenuity automatically.</span>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked={config.autoProject} disabled={botActive} onChange={e => setConfig({...config, autoProject: e.target.checked})} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="config-item">
                        <div className="config-item-info">
                          <span className="config-label">Auto Vocab / Instructions</span>
                          <span className="config-desc">Automatically handles vocabulary activities and instruction slides including lesson intro pages.</span>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked={config.autoVocab} disabled={botActive} onChange={e => setConfig({...config, autoVocab: e.target.checked})} />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="config-actions">
                        <button 
                          className="btn-primary btn-save-config" 
                          onClick={handleSaveConfig}
                          disabled={botActive}
                        >
                          Save Configuration
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {dashboardTab === 'enotes' && (
                <div className="tab-panel">
                  <section className="status-card notes-card">
                    <div className="status-header">
                      <h2>eNotes</h2>
                      <div className="notes-meta">
                        <span className="muted">{notesData.total || 0} total</span>
                        <button className="btn-ghost-sm" onClick={() => loadNotes(notesData.page)}>Refresh</button>
                      </div>
                    </div>
                    <div className="notes-container">
                      {notesData.notes.length === 0 ? (
                        <div className="notes-empty muted">No notes yet — answered questions will appear here.</div>
                      ) : (
                        notesData.notes.map(note => (
                          <div key={note._id} className="note-card">
                            <div className="note-card-header">
                              <span className="note-type-badge">{note.activityType || 'MCQ'}</span>
                              <span className={`note-source-badge ${note.source || 'ai'}`}>
                                {note.source === 'db' ? 'cached' : 'ai'}
                              </span>
                              <span className="note-timestamp">
                                {new Date(note.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="note-question">{note.questionText}</div>
                            <div className="note-answer">{note.answer}</div>
                          </div>
                        ))
                      )}
                    </div>
                    {notesData.pages > 1 && (
                      <div className="notes-pagination">
                        <button 
                          className="btn-ghost-sm"
                          disabled={notesData.page <= 1} 
                          onClick={() => loadNotes(notesData.page - 1)}
                        >
                          ← Prev
                        </button>
                        <span className="muted">Page {notesData.page} of {notesData.pages}</span>
                        <button 
                          className="btn-ghost-sm"
                          disabled={notesData.page >= notesData.pages} 
                          onClick={() => loadNotes(notesData.page + 1)}
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </section>
                </div>
              )}
            </>
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

