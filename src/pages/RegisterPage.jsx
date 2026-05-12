import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../ControlPanel.css';

export default function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isPaid') === 'true') {
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
      const res = await fetch('http://localhost:3000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
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
      const regRes = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password,
          plan: planId,
          addons,
          otp: formData.otp
        })
      });

      const userData = await regRes.json();
      if (!regRes.ok) throw new Error(userData.error || 'Registration failed');

      const stripeRes = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, addons, userId: userData.userId })
      });

      const session = await stripeRes.json();
      if (session.url) window.location.href = session.url;
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="control-panel-container" style={{justifyContent: 'center', minHeight: '100vh', background: '#070708'}}>
      <div className="cp-card" style={{maxWidth: '450px', width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)'}}>
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
            
            <div style={{textAlign: 'right', marginBottom: '1rem'}}>
              <span style={{color: '#3b82f6', fontSize: '0.85rem', cursor: 'pointer'}} onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
            </div>

            <div style={{background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span style={{color: '#737373', fontSize: '0.85rem'}}>Selected Plan:</span>
                <span style={{color: '#fff', fontWeight: '600', fontSize: '0.85rem'}}>{planId.toUpperCase()}</span>
              </div>
            </div>
            <button className="btn-launch" type="submit" disabled={loading} style={{background: '#2563eb'}}>
              {loading ? 'Sending OTP...' : 'Next: Verify Email →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalRegister}>
            <div className="form-group">
              <label className="form-label">Verification Code</label>
              <input type="text" className="form-input" required placeholder="123456" maxLength="6" value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})} />
            </div>
            <button className="btn-launch" type="submit" disabled={loading} style={{background: '#22c55e'}}>
              {loading ? 'Verifying...' : 'Finalize & Pay →'}
            </button>
            <div style={{marginTop: '1rem', textAlign: 'center'}}>
              <span style={{color: '#737373', fontSize: '0.85rem', cursor: 'pointer'}} onClick={() => setStep(1)}>← Back to details</span>
            </div>
          </form>
        )}

        <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#404040'}}>
          Secure payment powered by Stripe.
        </div>
      </div>
      <div style={{marginTop: '2rem', color: '#404040', fontSize: '0.85rem', cursor: 'pointer'}} onClick={() => navigate('/')}>
        ← Back to Pricing
      </div>
    </div>
  );
}
