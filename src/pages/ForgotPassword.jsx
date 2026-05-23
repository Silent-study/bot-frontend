import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';
import '../ControlPanel.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Reset
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.ok) {
        setStep(2);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send reset OTP');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resetPassword({ email, otp, newPassword });
      if (res.ok) {
        alert('Password updated! Please login.');
        navigate('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Reset failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="control-panel-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#070708', padding: '2rem'}}>
      <div className="cp-card" style={{maxWidth: '450px', width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', margin: '0 auto'}}>
        <div className="cp-card-title" style={{justifyContent: 'center', fontSize: '1.5rem', marginBottom: '0.5rem'}}>
          Reset Password
        </div>
        <p style={{color: '#737373', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem'}}>
          {step === 1 ? 'Enter your email to receive a password reset code.' : 'Enter the code and your new password.'}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" required placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button className="btn-launch" type="submit" disabled={loading} style={{background: '#2563eb'}}>
              {loading ? 'Sending...' : 'Send Reset Code →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">Verification Code</label>
              <input type="text" className="form-input" required placeholder="123456" maxLength="6" value={otp} onChange={e => setOtp(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" required placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <button className="btn-launch" type="submit" disabled={loading} style={{background: '#22c55e'}}>
              {loading ? 'Updating...' : 'Update Password →'}
            </button>
          </form>
        )}
      </div>

      <div style={{marginTop: '2rem', color: '#404040', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Home
      </div>
    </div>
  );
}
