import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login as apiLogin, isAuthenticated } from '../services/api';
import '../ControlPanel.css';

export default function LoginPage({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Handle ?payment=success from Stripe redirect
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await apiLogin({ email, password });
      if (result.success) {
        if (onAuthSuccess) onAuthSuccess();
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="control-panel-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#070708', padding: '2rem'}}>
      <div className="cp-card" style={{maxWidth: '450px', width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', margin: '0 auto'}}>
        
        {paymentSuccess && (
          <div className="payment-success-banner" style={{marginBottom: '1.5rem'}}>
            <h3>🎉 Payment Successful!</h3>
            <p>Your account has been activated. Log in below to access your dashboard.</p>
          </div>
        )}

        <div className="cp-card-title" style={{justifyContent: 'center', fontSize: '1.5rem', marginBottom: '0.5rem'}}>
          Welcome Back
        </div>
        <p style={{color: '#737373', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem'}}>
          Log in to your Silent Study account
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              placeholder="name@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{position: 'relative'}}>
              <input 
                type={showPass ? "text" : "password"} 
                className="form-input" 
                required 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <span 
                onClick={() => setShowPass(!showPass)} 
                style={{position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '0.8rem', color: '#737373', userSelect: 'none'}}
              >
                {showPass ? 'HIDE' : 'SHOW'}
              </span>
            </div>
          </div>
          
          <div style={{textAlign: 'right', marginBottom: '1rem'}}>
            <span style={{color: '#3b82f6', fontSize: '0.85rem', cursor: 'pointer'}} onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
          </div>

          <button className="btn-launch" type="submit" disabled={loading} style={{background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
            {loading ? (
              <>
                <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{animation: 'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Logging in...
              </>
            ) : (
              <>
                Log In
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </>
            )}
          </button>
        </form>

        <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#525252'}}>
          Don't have an account?{' '}
          <span style={{color: '#3b82f6', cursor: 'pointer', fontWeight: '600'}} onClick={() => navigate('/register')}>
            Get Started
          </span>
        </div>
      </div>

      <div style={{marginTop: '2rem', color: '#404040', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Home
      </div>
    </div>
  );
}
