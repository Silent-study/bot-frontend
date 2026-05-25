import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="tos-container" style={{
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      minHeight: '100vh',
      padding: '80px 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Atmospheric Glows */}
      <div className="hero-top-glow" style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1200px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.03) 50%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="tos-wrapper" style={{
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header Navigation */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '50px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5Z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
              Silent<span style={{ color: 'var(--blue-light)' }}>Study</span>
            </span>
          </div>
          <button onClick={() => navigate('/')} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            padding: '8px 16px',
            borderRadius: 'var(--radius)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          className="btn-hover-effect">
            ← Back to Home
          </button>
        </header>

        {/* Intro */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-1px',
            marginBottom: '12px',
            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Terms of Service
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)'
          }}>
            <span>Last Updated: May 25, 2026</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="tos-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>1. Acceptance of Terms</h3>
            <p style={paraStyle}>
              By downloading, installing, or interacting with the Silent Study browser extension or browsing the{' '}
              <span style={{ color: 'var(--text-white)' }}>silentstudy.net</span> website, you explicitly agree to comply with and be bound by 
              these Terms of Service. If you disagree with any portion of these conditions, you must immediately uninstall the extension and 
              terminate usage of our site.
            </p>
          </div>

          <div className="tos-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>2. Description of Service</h3>
            <p style={paraStyle}>
              Silent Study provides educational tools, automatic assistance features, and diagnostic dashboard panels designed to support study 
              efficacy within educational LMS platforms. The extension reads page contexts locally and displays assistant helpers.
            </p>
            <p style={paraStyle}>
              We grant you a personal, non-transferable, revocable license to use the software strictly under the terms outlined herein.
            </p>
          </div>

          <div className="tos-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>3. User Obligations &amp; Usage Boundaries</h3>
            <p style={paraStyle}>
              To safeguard the platform and preserve service accessibility for all users, you agree that you will not:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>Attempt to reverse-engineer, decompile, or intercept the API endpoints of the browser extension.</li>
              <li style={listItemStyle}>Run high-frequency bots, scrapers, or automated bulk scripts against our server interfaces.</li>
              <li style={listItemStyle}>Share your active subscription credentials or license keys with third parties (license keys are locked to specific browser sandboxes).</li>
              <li style={listItemStyle}>Use the application in any manner that infringes upon local academic institutions' honor codes or code-of-conduct agreements.</li>
            </ul>
          </div>

          <div className="tos-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>4. Subscription, Billing &amp; Refunds</h3>
            <p style={paraStyle}>
              Certain services on Silent Study are billed on a subscription basis through Stripe. Subscriptions renew automatically based on your 
              selected tier (Daily, Weekly, Monthly, 6-Monthly) unless cancelled prior to the renewal date.
            </p>
            <p style={paraStyle}>
              Due to the digital nature of immediate value delivery, refunds are handled on a case-by-case basis through our support team at{' '}
              <a href="mailto:support@silentstudy.net" style={{ color: 'var(--blue-light)', textDecoration: 'underline' }}>
                support@silentstudy.net
              </a>.
            </p>
          </div>

          <div className="tos-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>5. Disclaimers &amp; Limitations of Liability</h3>
            <p style={paraStyle}>
              SILENT STUDY AND ALL SERVICES PROVIDED ON THE WEBSITE ARE OFFERED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF 
              ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A SPECIFIC PURPOSE.
            </p>
            <p style={paraStyle}>
              UNDER NO CIRCUMSTANCES SHALL SILENT STUDY BE HELD LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT 
              OF THE USE OR INABILITY TO USE THE UTILITY, REGARDLESS OF THE LEGAL BASIS OF LIABILITY, AND EVEN IF NOTIFIED OF THE POTENTIAL FOR 
              SUCH DAMAGES.
            </p>
          </div>

        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem'
        }}>
          <p>© 2026 Silent Study • <a href="mailto:support@silentstudy.net" style={{ color: 'var(--blue-light)' }}>support@silentstudy.net</a> • <a href="/" style={{ color: 'var(--blue-light)' }}>silentstudy.net</a></p>
        </footer>

      </div>
    </div>
  );
}

const sectionStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '30px',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
};

const sectionTitleStyle = {
  fontSize: '0.9rem',
  fontWeight: 700,
  color: 'var(--blue-light)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '16px'
};

const paraStyle = {
  fontSize: '0.95rem',
  lineHeight: '1.7',
  color: 'var(--text-secondary)',
  marginBottom: '12px'
};

const listStyle = {
  listStyle: 'none',
  paddingLeft: '0',
  marginTop: '8px'
};

const listItemStyle = {
  fontSize: '0.95rem',
  lineHeight: '1.7',
  color: 'var(--text-secondary)',
  paddingLeft: '20px',
  position: 'relative',
  marginBottom: '10px'
};
