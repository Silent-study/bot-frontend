import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="privacy-container" style={{
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

      <div className="privacy-wrapper" style={{
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

        {/* Policy Intro */}
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
            Privacy Policy
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)'
          }}>
            <span>Effective Date: May 25, 2026</span>
            <span style={{ color: 'var(--border-bright)' }}>•</span>
            <span style={{
              background: 'rgba(34, 197, 94, 0.1)',
              color: 'var(--green)',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              Active &amp; Compliant
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section 1 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>1. Who We Are</h3>
            <p style={paraStyle}>
              Silent Study ("we", "our", or "us") operates the Silent Study browser extension and the backend service 
              available at <span style={{ color: 'var(--text-white)', fontWeight: 600 }}>silentstudy.net</span>. This policy explains what data we collect, 
              how we use it, and your rights regarding that data.
            </p>
            <p style={paraStyle}>
              If you have any questions or feedback regarding this policy, please reach out to us directly at{' '}
              <a href="mailto:privacy@silentstudy.net" style={{ color: 'var(--blue-light)', textDecoration: 'underline' }}>
                privacy@silentstudy.net
              </a>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>2. Data We Collect</h3>
            
            <p style={{ ...paraStyle, color: 'var(--text-white)', fontWeight: 600, marginBottom: '8px' }}>
              Account Credentials
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                Your <span style={highlightStyle}>email address</span> is collected during registration to create your account, manage subscriptions, and allow secure authentication.
              </li>
              <li style={listItemStyle}>
                Your <span style={highlightStyle}>password</span> is processed safely over HTTPS. We only store a secure, salted <code>bcrypt</code> hash; your plain-text password is never saved or seen by us.
              </li>
              <li style={listItemStyle}>
                An <span style={highlightStyle}>authentication token (JWT)</span> is issued post-login and stored in isolated local browser storage (<code>chrome.storage.local</code>). This token is strictly used to authenticate your extension and is never shared.
              </li>
            </ul>

            <p style={{ ...paraStyle, color: 'var(--text-white)', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>
              Edgenuity Page Content
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                When active, the extension reads <span style={highlightStyle}>question text and response choices</span> from Edgenuity Learning Management System (LMS) pages that you actively view.
              </li>
              <li style={listItemStyle}>
                This content is securely transmitted to our backend at <span style={highlightStyle}>silentstudy.net</span> to generate contextual study guidance. This transmission is processed in real time and is never stored permanently or coupled to your identity beyond your active session.
              </li>
            </ul>

            <p style={{ ...paraStyle, color: 'var(--text-white)', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>
              Usage Statistics
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                Counts of completed activities (e.g. solved questions, reviewed vocab, video checkpoints) are tracked on our servers and visualised in your user dashboard.
              </li>
              <li style={listItemStyle}>
                These counts are stored strictly as aggregate numerical statistics; we do not record the specific context of your academic answers.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>3. What We Do NOT Collect</h3>
            <p style={paraStyle}>
              We are committed to absolute data minimization. To protect your digital footprint:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>We do not collect any health, financial, or sensitive demographic information.</li>
              <li style={listItemStyle}>
                We do not track your general browsing history. The extension only runs on specified Edgenuity educational environments (<code>edgenuity.com</code>, <code>edgex.com</code>, <code>k12.com</code>).
              </li>
              <li style={listItemStyle}>We never log cursor tracking, screen records, keystrokes, or media inputs.</li>
              <li style={listItemStyle}>We do not set third-party marketing, analytics, or advertising cookies.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>4. How We Use Your Data</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <span style={highlightStyle}>Authentication</span> — Checking subscription periods and authorizing API request tokens.
              </li>
              <li style={listItemStyle}>
                <span style={highlightStyle}>Study Assistance</span> — Processing slide and question context to compute dynamic and highly relevant study answers.
              </li>
              <li style={listItemStyle}>
                <span style={highlightStyle}>Dashboard Diagnostics</span> — Saving aggregated performance metrics to display in your Control Panel.
              </li>
              <li style={listItemStyle}>
                <span style={highlightStyle}>Service Reliability</span> — Running anonymised log telemetry to ensure the bot continues to parse changes in the learning platform correctly.
              </li>
            </ul>
            <p style={{ ...paraStyle, marginTop: '14px' }}>
              We do not sell, rent, or repurpose your user data for ad targeting, background profiling, or credit eligibility.
            </p>
          </div>

          {/* Section 5 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>5. Data Sharing &amp; Infrastructure</h3>
            <p style={paraStyle}>
              We <span style={highlightStyle}>never sell, rent, or trade</span> your personal information. Data transmission is limited to:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <span style={highlightStyle}>Secure Infrastructure Hosting</span> — Running our API and database instances on encrypted, top-tier cloud hosting providers who process data strictly on our behalf under Data Processing Agreements.
              </li>
              <li style={listItemStyle}>
                <span style={highlightStyle}>Legal Directives</span> — Disclosing data only when bound by court order, state legislation, or in emergency situations to safeguard life and limb.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>6. Data Retention Policies</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                Authentication JWT tokens stored on your browser are destroyed when you select "Log Out" in the extension menu or upon subscription expiration.
              </li>
              <li style={listItemStyle}>
                Account history data is retained for the active lifecycle of your subscription. You can request instant data purge at any time by emailing us at{' '}
                <a href="mailto:privacy@silentstudy.net" style={{ color: 'var(--blue-light)', textDecoration: 'underline' }}>
                  privacy@silentstudy.net
                </a>.
              </li>
              <li style={listItemStyle}>
                Edgenuity page content transmitted to solve questions is discarded immediately after returning the computed response; it is never written to permanent disk storage.
              </li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>7. Industry-Standard Security</h3>
            <p style={paraStyle}>
              All data transmitted to and from the browser extension uses robust <span style={highlightStyle}>HTTPS/TLS end-to-end encryption</span>. 
              Client data is locked inside Chrome's sandbox storage to block XSS and cross-origin reads. Passwords are saved with 
              high-entropy bcrypt salts. We carry out regular security reviews to defend your account from modern threats.
            </p>
          </div>

          {/* Section 8 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>8. Your Data Rights</h3>
            <p style={paraStyle}>
              Regardless of your region, you have complete sovereignty over your data:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}>The right to view and export the personal data we hold.</li>
              <li style={listItemStyle}>The right to correct inaccurate email addresses or settings.</li>
              <li style={listItemStyle}>The right to request absolute deletion of all profile elements.</li>
              <li style={listItemStyle}>The right to terminate consent by deleting the extension and closing your account.</li>
            </ul>
            <p style={{ ...paraStyle, marginTop: '14px' }}>
              Submit data requests to <a href="mailto:privacy@silentstudy.net" style={{ color: 'var(--blue-light)', textDecoration: 'underline' }}>privacy@silentstudy.net</a>. We process requests within 30 days free of charge.
            </p>
          </div>

          {/* Section 9 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>9. Children's Privacy</h3>
            <p style={paraStyle}>
              Silent Study is an academic tool created for secondary and higher education contexts. We do not knowingly collect personal 
              information from children under the age of 13. If you are a parent or legal guardian and suspect that a minor has shared personal details 
              with our platform, email us to initiate an immediate clean purge of that account.
            </p>
          </div>

          {/* Section 10 */}
          <div className="privacy-section" style={sectionStyle}>
            <h3 style={sectionTitleStyle}>10. Policy Modifications</h3>
            <p style={paraStyle}>
              We periodically update this policy to align with browser ecosystem shifts and regulatory modifications. When amendments occur, 
              we revise the effective date at the top. Major changes will be highlighted via notice boards inside the extension view or emailed 
              directly to registered users. Continued usage confirms consent.
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
          <p>© 2026 Silent Study • <a href="mailto:privacy@silentstudy.net" style={{ color: 'var(--blue-light)' }}>privacy@silentstudy.net</a> • <a href="/" style={{ color: 'var(--blue-light)' }}>silentstudy.net</a></p>
        </footer>

      </div>
    </div>
  );
}

// Inline Style Tokens for Aesthetic Layout
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

const highlightStyle = {
  color: 'var(--text-white)',
  fontWeight: 600
};
