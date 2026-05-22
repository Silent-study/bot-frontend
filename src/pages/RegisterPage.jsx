import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendOtp, register, createCheckout, isAuthenticated } from '../services/api';
import '../ControlPanel.css';

export default function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  const { planId, addons } = location.state || { planId: 'week', addons: [] };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp(formData.email);
      if (res.ok) {
        setStep(2);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const regRes = await register({ 
        email: formData.email, 
        password: formData.password,
        plan: planId,
        addons,
        otp: formData.otp
      });

      const userData = await regRes.json();
      if (!regRes.ok) throw new Error(userData.error || 'Registration failed');

      const stripeRes = await createCheckout({ planId, addons, userId: userData.userId });

      const session = await stripeRes.json();
      if (session.url) window.location.href = session.url;
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="control-panel-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#070708', padding: '2rem'}}>
      <div className="cp-card" style={{maxWidth: '450px', width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', margin: '0 auto'}}>
        <div className="cp-card-title" style={{justifyContent: 'center', fontSize: '1.5rem', marginBottom: '0.5rem'}}>
          {step === 1 ? 'Finalize Checkout' : 'Verify Email'}
        </div>
        <p style={{color: '#737373', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem'}}>
          {step === 1 ? 'Create an account to access your Silent Study key.' : `Enter the 6-digit code sent to ${formData.email}`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" required placeholder="name@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Create Password</label>
              <div style={{position: 'relative'}}>
                <input 
                  type={showPass ? "text" : "password"} 
                  className="form-input" 
                  required 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                <span 
                  onClick={() => setShowPass(!showPass)} 
                  style={{position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '0.8rem', color: '#737373', userSelect: 'none'}}
                >
                  {showPass ? 'HIDE' : 'SHOW'}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{position: 'relative'}}>
                <input 
                  type={showConfirmPass ? "text" : "password"} 
                  className="form-input" 
                  required 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                />
                <span 
                  onClick={() => setShowConfirmPass(!showConfirmPass)} 
                  style={{position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '0.8rem', color: '#737373', userSelect: 'none'}}
                >
                  {showConfirmPass ? 'HIDE' : 'SHOW'}
                </span>
              </div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
              <span style={{color: '#737373', fontSize: '0.85rem'}}>
                Already have an account? <span style={{color: '#3b82f6', cursor: 'pointer', fontWeight: '600'}} onClick={() => navigate('/login')}>Login</span>
              </span>
              <span style={{color: '#3b82f6', fontSize: '0.85rem', cursor: 'pointer'}} onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
            </div>

            <div style={{background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{color: '#737373', fontSize: '0.85rem'}}>Selected Plan:</span>
                <span style={{color: '#fff', fontWeight: '600', fontSize: '0.85rem'}}>{planId.toUpperCase()}</span>
              </div>
            </div>
            <button className="btn-launch" type="submit" disabled={loading} style={{background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
              {loading ? 'Sending OTP...' : (
                <>
                  Next: Verify Email
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalRegister}>
            <div className="form-group">
              <label className="form-label">Verification Code</label>
              <input type="text" className="form-input" required placeholder="123456" maxLength="6" value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})} />
            </div>
            <button className="btn-launch" type="submit" disabled={loading} style={{background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
              {loading ? 'Verifying...' : (
                <>
                  Finalize & Pay
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </>
              )}
            </button>
            <div style={{marginTop: '1rem', textAlign: 'center'}}>
              <span style={{color: '#737373', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'}} onClick={() => setStep(1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back to details
              </span>
            </div>
          </form>
        )}

        <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#404040'}}>
          Secure payment powered by Stripe.
        </div>
      </div>
      <div style={{marginTop: '2rem', color: '#404040', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Pricing
      </div>
    </div>
  );
}
