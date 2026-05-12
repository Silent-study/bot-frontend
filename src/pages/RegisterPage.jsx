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
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      // 1. Register User in MongoDB
      const regRes = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password,
          plan: planId,
          addons
        })
      });

      const userData = await regRes.json();
      if (!regRes.ok) throw new Error(userData.error || 'Registration failed');

      // 2. Trigger Stripe Checkout
      const stripeRes = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId, 
          addons,
          userId: userData.userId 
        })
      });

      const session = await stripeRes.json();
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="control-panel-container" style={{justifyContent: 'center', minHeight: '100vh', background: '#070708'}}>
      <div className="cp-card" style={{maxWidth: '450px', width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)'}}>
        <div className="cp-card-title" style={{justifyContent: 'center', fontSize: '1.5rem', marginBottom: '0.5rem'}}>
          Finalize Checkout
        </div>
        <p style={{color: '#737373', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem'}}>
          Create an account to access your Silent Study key.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Create Password</label>
            <input 
              type="password" 
              className="form-input" 
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-input" 
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <div style={{background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span style={{color: '#737373', fontSize: '0.85rem'}}>Selected Plan:</span>
              <span style={{color: '#fff', fontWeight: '600', fontSize: '0.85rem'}}>{planId.toUpperCase()}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: '#737373', fontSize: '0.85rem'}}>Add-ons:</span>
              <span style={{color: '#3b82f6', fontSize: '0.85rem', fontWeight: '600'}}>{addons.length > 0 ? addons.join(', ') : 'None'}</span>
            </div>
          </div>

          <button className="btn-launch" type="submit" disabled={loading} style={{background: '#2563eb'}}>
            {loading ? 'Processing...' : 'Continue to Payment →'}
          </button>
        </form>

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
