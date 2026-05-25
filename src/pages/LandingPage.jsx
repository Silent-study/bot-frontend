import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LandingPage({ isLoggedIn }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const carouselRef = useRef(null);
  const [selectedAddon, setSelectedAddon] = useState('base');
  
  // Interactive Chrome Extension Mockup States
  const [mTab, setMTab] = useState('features');
  const [mTheme, setMTheme] = useState('dark');
  const [mAccuracy, setMAccuracy] = useState(85);
  const [mToggles, setMToggles] = useState({
    autoAdvance: true,
    autoSubmit: true,
    autoENotes: false,
    autoInstruction: true,
    autoAssignment: false,
    autoAssessment: true,
    autoWrite: true,
    autoProject: false,
    languageSkipper: true,
    videoControls: false
  });

  const mockFeaturesList = [
    { id: 'autoAdvance', label: 'Auto Advance', gear: true },
    { id: 'autoSubmit', label: 'Auto Submit', gear: true },
    { id: 'autoENotes', label: 'Auto eNotes', gear: false },
    { id: 'autoInstruction', label: 'Auto Instruction/Vocab', gear: false },
    { id: 'autoAssignment', label: 'Auto Assignment', gear: true },
    { id: 'autoAssessment', label: 'Auto Assessment', gear: true },
    { id: 'autoWrite', label: 'Auto Write', gear: true },
    { id: 'autoProject', label: 'Auto Project', gear: true },
    { id: 'languageSkipper', label: 'Language Activity Skipper', gear: true },
    { id: 'videoControls', label: 'Video Controls', gear: true },
  ];

  // Handle ?payment=success from Stripe redirect
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      navigate('/login?payment=success', { replace: true });
    }
  }, [searchParams, navigate]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const mockupRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (mockupRef.current) {
        const rect = mockupRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const diff = elementCenter - viewportCenter;
        let progress = diff / viewportCenter;
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPlanPrice = (planId) => {
    const pricingMatrix = {
      base: { day: '2.50', week: '10.00', month: '20.00', six_month: '40.00' },
      service: { day: '10.00', week: '35.00', month: '100.00', six_month: '250.00' },
      proctor: { day: '5.00', week: '17.50', month: '30.00', six_month: '60.00' },
      both: { day: '15.00', week: '42.50', month: '130.00', six_month: '310.00' }
    };
    return pricingMatrix[selectedAddon]?.[planId] || '0.00';
  };

  const getPlanUsers = () => {
    return (selectedAddon === 'service' || selectedAddon === 'both') ? '5 users' : '1 user';
  };

  const scrollToPricing = (e) => {
    if (e) e.preventDefault();
    const pricing = document.getElementById('pricing');
    if (pricing) {
      pricing.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatures = (e) => {
    if (e) e.preventDefault();
    const features = document.getElementById('features');
    if (features) {
      features.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckout = (planId) => {
    const addons = [];
    if (selectedAddon === 'service' || selectedAddon === 'both') addons.push('service');
    if (selectedAddon === 'proctor' || selectedAddon === 'both') addons.push('proctor');
    
    navigate('/register', { state: { planId, addons } });
  };

  const testimonials = [
    { initial: 'Z', name: 'Zayn', handle: '@zayneducation', text: 'bought SilentStudy a few months ago and got my grades up from Ds to straight As. Easiest Edgenuity bypass out there, literally a lifesaver!', color: '#3b82f6', pos: 'top-left' },
    { initial: 'M', name: 'Maddy', handle: '@maddy_study', text: "W SilentStudy, spent like 15 bucks and finished 5 classes in a week. Highly recommend if you want to bypass proctorio and get all quizzes done.", color: '#a855f7', pos: 'bottom-left' },
    { initial: 'R', name: 'Ryan', handle: '@ryan_r', text: "11/10 best extension I've tried for Edgenuity. Works perfectly with the new system, skips videos instantly, and answers actually get a 100% score.", color: '#10b981', pos: 'top-right' },
    { initial: 'E', name: 'Elena', handle: '@elena_k', text: 'Best GPA booster ever, thank god SilentStudy has such active devs. The stealth mode is perfect for tests when you are sharing screens. 🔥', color: '#f97316', pos: 'bottom-right' }
  ];

  const carouselFeatures = [
    { title: "Auto Assessment", desc: "Answers every quiz, test, and exam with a perfect score using saved answers, with advanced AI as a fallback. Works on multiple-choice, true/false, fill-in-the-blank, and more.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M9 12l2 2 4-4"></path></svg> },
    { title: "Undetected Operation", desc: "Silent Study operates like a real browser extension and is completely undetected by Edgenuity's bot-checking algorithms. Use customizable delays to stay under the radar.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
    { title: "Video Skipper", desc: "Automatically skips required videos on EX classes so you never sit through another lecture. Skip what you don't need and move on instantly.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg> },
    { title: "Auto Write (AI)", desc: "Writes undetectable AI-generated answers for free response questions. Passes plagiarism checks every time.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> },
    { title: "Proctorio Bypass", desc: "Lets Silent Study run on Proctorio-monitored assessments. Removes fullscreen lock and clipboard block so Silent Study can work normally during proctored exams.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg> },
    { title: "Discord Logging", desc: "Stay updated with real-time activity logs sent directly to your Discord server. Track everything Silent Study does across all your tabs.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },
    { title: "Prevent Logout", desc: "Prevents being logged out due to AFK. Run Silent Study overnight and wake up to completed classes without lifting a finger.", icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> }
  ];

  const features = [
    {
      title: "Auto Submit",
      desc: "Automatically submits assignments without any input. Set a min and max delay per activity type - Silent Study picks a random time in between.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
      color: "blue"
    },
    {
      title: "Auto Write (AI)",
      desc: "Answers writing questions and essays using AI. Choose pure AI or a humanizer for less detectable output. Uses keyword matching for Online Content activities.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>,
      color: "purple"
    },
    {
      title: "Auto Project",
      desc: "Automatically submits a corrupted PDF file for project assignments so you can go onto other assignments.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
      color: "green"
    },
    {
      title: "Censor Private Info",
      desc: "Blurs your name, school, class, and other sensitive info on screen - useful when screensharing or taking screenshots to send to others.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>,
      color: "yellow"
    },
    {
      title: "Auto eNotes",
      desc: "Automatically takes notes on videos for assignments and fills in the eNotes section.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
      color: "pink"
    },
    {
      title: "Language Activity Skipper",
      desc: "Skips interactive games and activities in foreign language classes. Can also skip speaking assignments by submitting a corrupted audio file.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>,
      color: "blue"
    },
    {
      title: "Stealth Mode",
      desc: "Highlights correct answers only when you hover over them if a teacher is watching you.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
      color: "purple"
    },
    {
      title: "Configurable Delays",
      desc: "Set min/max delay ranges per activity type for both auto submit and auto advance. Silent Study picks a random value in between each time.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
      color: "green"
    },
    {
      title: "Config System",
      desc: "Save all your settings as a shareable preset. Import recommended configs from others or export your own - no manual re-setup needed.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
      color: "orange"
    },
    {
      title: "Activity Skipping",
      desc: "Skips labs, minigames, and math graphs with full credit.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
      color: "pink"
    },
    {
      title: "Advanced Class Support",
      desc: "Full EdgeEx and Nova class support with advanced features for all Edgenuity class types.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
      color: "blue"
    },
    {
      title: "Proctorio Bypass",
      desc: "Bypasses the locked browser screen before assessments so that Silent Study can run on them.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
      color: "purple"
    },
    {
      title: "Prevent Logout",
      desc: "Prevents being logged out or timed out by Edgenuity's inactivity system. Run Silent Study overnight and wake up to completed classes.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
      color: "green"
    },
    {
      title: "Duplicate Tabs",
      desc: "Run Silent Study across multiple classes simultaneously to finish faster.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
      color: "yellow"
    },
    {
      title: "Discord Logging",
      desc: "Real-time activity logs sent directly to your Discord server so you can monitor your progress anywhere and anytime.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
      color: "pink"
    },
    {
      title: "Scheduler",
      desc: "Set active time windows, day filters, and auto-breaks. Run unattended during school hours and pause automatically at night.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
      color: "blue"
    },
    {
      title: "Mobile Dashboard",
      desc: "Monitor live scores and session status from your phone. Send pause/resume commands remotely - fully end-to-end encrypted.",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
      color: "purple"
    }
  ];

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
            <path d="M12 2L2 7l10 5 10-5-10-5Z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          SilentStudy
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#tutorial" className="nav-link">Tutorial</a>
          <a href="#support" className="nav-link">Support</a>
          {isLoggedIn ? (
            <button className="nav-btn-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button className="nav-link" style={{background:'none', border:'none', cursor:'pointer', color:'var(--text-secondary)'}} onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="nav-btn-primary" onClick={scrollToPricing}>
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      <main>
        <section className="hero-section">
          {/* Top Radial Glow */}
          <div className="hero-top-glow"></div>
          {/* Floating Testimonials */}
          {testimonials.map((t, i) => (
            <div key={i} className={`testimonial-card floating-${t.pos}`}>
              <div className="t-header">
                <div className="t-avatar" style={{backgroundColor: t.color}}>{t.initial}</div>
                <div className="t-user">
                  <div className="t-name">{t.name}</div>
                  <div className="t-handle">{t.handle}</div>
                </div>
              </div>
              <div className="t-text">{t.text}</div>
              <div className="t-stars">★★★★★</div>
            </div>
          ))}

          <div className="hero-content-wrapper">
            <div className="hero-badge-modern">
              <span className="dot"></span> Undetected · Always Updated
            </div>
            
            <h1 className="hero-title">
              The best tool for<br/>
              <span className="text-blue-gradient">Edgenuity answers.</span>
            </h1>
            
            <p className="hero-subtitle">
              The Edgenuity AI bot that finishes your classes - instant answers, video<br/>
              skipping, and EdgeEX support.
            </p>
            <p className="hero-subtitle-small">
              The Edgenuity hack students actually use. <strong>Get 100s automatically.</strong>
            </p>
            
            <div className="hero-actions">
              <button className="btn-outline" onClick={scrollToFeatures}>Explore Features</button>
              <button className="nav-btn-primary" onClick={isLoggedIn ? () => navigate('/dashboard') : scrollToPricing} style={{padding: '0.8rem 2rem', fontSize: '1.05rem'}}>
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stars-yellow">★★★★★</span> Trusted by <strong>10,000+</strong> students
              </div>
              <div className="stat-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <strong>2M+</strong> questions answered
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Extension Mockup Section (Separate Section) */}
        <section className="hero-mockup-section">
          <div className="hero-mockup-glow"></div>
          <div className="mockup-content-wrapper">
            {/* Interactive Chrome Extension Mockup */}
            <div className="ext-mock-wrapper" ref={mockupRef} style={{
              perspective: '1500px',
              transform: `rotateX(${scrollProgress * 20}deg) translateY(${scrollProgress * 30}px)`,
              transition: 'transform 0.15s ease-out'
            }}>
              {/* Left Background Card: Logs Mockup */}
              <div className="hero-bg-card left-bg-card">
                <div className="logs-mockup">
                  <div className="lm-header">
                    <div className="lm-dots">
                      <div className="lm-dot r"></div>
                      <div className="lm-dot y"></div>
                      <div className="lm-dot g"></div>
                    </div>
                    nexus logs
                  </div>
                  <div className="lm-body">
                    <div className="lm-row">
                      <div className="lm-meta">
                        <span className="lm-author">Nexus Bot</span>
                        <span className="lm-time">1:52 am</span>
                      </div>
                      <div className="lm-embed-row">
                        <span className="lm-activity">Quiz - World History</span>
                        <span className="lm-score green">100%</span>
                      </div>
                    </div>
                    <div className="lm-row">
                      <div className="lm-meta">
                        <span className="lm-author">Nexus Bot</span>
                        <span className="lm-time">1:50 am</span>
                      </div>
                      <div className="lm-embed-row">
                        <span className="lm-activity">Video - Science Ch. 4</span>
                        <span className="lm-score gray">Skipped</span>
                      </div>
                    </div>
                    <div className="lm-row">
                      <div className="lm-meta">
                        <span className="lm-author">Nexus Bot</span>
                        <span className="lm-time">1:48 am</span>
                      </div>
                      <div className="lm-embed-row">
                        <span className="lm-activity">Free Response - English</span>
                        <span className="lm-score blue">AI Written</span>
                      </div>
                    </div>
                    <div className="lm-row">
                      <div className="lm-meta">
                        <span className="lm-author">Nexus Bot</span>
                        <span className="lm-time">1:45 am</span>
                      </div>
                      <div className="lm-embed-row">
                        <span className="lm-activity">Test - Algebra Unit 3</span>
                        <span className="lm-score green">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`ext-mock-card ${mTheme}`}>
                
                {/* Header */}
                <div className="ext-mock-header">
                  <div className="ext-mock-brand">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5Z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                    <div className="ext-mock-title">Silent<span>Study</span></div>
                  </div>

                  <div className="ext-mock-tabs">
                    <button 
                      className={`ext-mock-tab-btn ${mTab === 'features' ? 'active' : ''}`}
                      onClick={() => setMTab('features')}
                    >
                      Features
                    </button>
                    <button 
                      className={`ext-mock-tab-btn ${mTab === 'settings' ? 'active' : ''}`}
                      onClick={() => setMTab('settings')}
                    >
                      Settings
                    </button>
                    <button 
                      className={`ext-mock-tab-btn ${mTab === 'about' ? 'active' : ''}`}
                      onClick={() => setMTab('about')}
                    >
                      About
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="ext-mock-content">
                  {mTab === 'features' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {mockFeaturesList.map(item => (
                        <div key={item.id} className="ext-mock-row">
                          <div className="ext-mock-row-left">
                            <span className="ext-mock-row-label">{item.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {item.gear && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                              </svg>
                            )}
                            <label className="ext-mock-switch">
                              <input 
                                type="checkbox" 
                                checked={mToggles[item.id]} 
                                onChange={(e) => setMToggles({ ...mToggles, [item.id]: e.target.checked })}
                              />
                              <span className="ext-mock-slider"></span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {mTab === 'settings' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '5px 0' }}>
                      <div className="ext-mock-settings-group">
                        <div className="ext-mock-settings-label">Assessment Accuracy</div>
                        <div className="ext-mock-slider-row">
                          <input 
                            type="range" 
                            min="40" 
                            max="100" 
                            value={mAccuracy} 
                            onChange={(e) => setMAccuracy(parseInt(e.target.value))} 
                            className="ext-mock-settings-range"
                          />
                          <span className="ext-mock-settings-val">{mAccuracy}%</span>
                        </div>
                      </div>

                      <div className="ext-mock-settings-group">
                        <div className="ext-mock-settings-label">Target Grade</div>
                        <div className="ext-mock-slider-row" style={{ justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Target Letter Grade</span>
                          <select 
                            style={{
                              background: mTheme === 'dark' ? '#0f172a' : '#ffffff',
                              color: mTheme === 'dark' ? '#e2e8f0' : '#1e293b',
                              border: '1px solid rgba(59, 130, 246, 0.2)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              outline: 'none',
                              fontFamily: 'Outfit',
                              fontSize: '0.85rem',
                              fontWeight: 600
                            }}
                            defaultValue="A"
                          >
                            <option value="A">A (90-100%)</option>
                            <option value="B">B (80-89%)</option>
                            <option value="C">C (70-79%)</option>
                            <option value="D">D (60-69%)</option>
                          </select>
                        </div>
                      </div>

                      <div className="ext-mock-settings-group">
                        <div className="ext-mock-settings-label">Discord Logging</div>
                        <div className="ext-mock-slider-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Enable Webhook</span>
                            <label className="ext-mock-switch">
                              <input type="checkbox" defaultChecked />
                              <span className="ext-mock-slider"></span>
                            </label>
                          </div>
                          <input 
                            type="text" 
                            readOnly 
                            value="https://discord.com/api/webhooks/..." 
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              background: mTheme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                              border: '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '6px',
                              color: '#64748b',
                              fontSize: '0.75rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {mTab === 'about' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="ext-mock-about-box">
                        <div className="ext-mock-about-row">
                          <span className="ext-mock-about-label">Extension Version</span>
                          <span className="ext-mock-about-val">v2.1.0</span>
                        </div>
                        <div className="ext-mock-about-row">
                          <span className="ext-mock-about-label">System Status</span>
                          <span className="ext-mock-status-pill">Connected</span>
                        </div>
                        <div className="ext-mock-about-row">
                          <span className="ext-mock-about-label">Auto Updates</span>
                          <span className="ext-mock-about-val" style={{ color: '#10b981' }}>Active</span>
                        </div>
                        <div className="ext-mock-about-row">
                          <span className="ext-mock-about-label">Engine Framework</span>
                          <span className="ext-mock-about-val">EdgeEX & Nova V2</span>
                        </div>
                      </div>
                      
                      <div className="ext-mock-about-box" style={{ gap: '8px' }}>
                        <h5 style={{ margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>Device Security</h5>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                          This extension is legally bound to your device HWID. Do not attempt to run on unauthorized browsers.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="ext-mock-footer">
                  <button 
                    className="ext-mock-footer-btn"
                    onClick={() => setMTheme(mTheme === 'dark' ? 'light' : 'dark')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {mTheme === 'dark' ? (
                        <>
                          <circle cx="12" cy="12" r="5"></circle>
                          <line x1="12" y1="1" x2="12" y2="3"></line>
                          <line x1="12" y1="21" x2="12" y2="23"></line>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                          <line x1="1" y1="12" x2="3" y2="12"></line>
                          <line x1="21" y1="12" x2="23" y2="12"></line>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </>
                      ) : (
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                      )}
                    </svg>
                    {mTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  
                  <a 
                    href="#support" 
                    className="ext-mock-footer-btn" 
                    style={{ textDecoration: 'none' }}
                    onClick={(e) => {
                      e.preventDefault();
                      const support = document.getElementById('support');
                      if (support) support.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Support
                  </a>
                </div>

              </div>

              {/* Right Background Card: Assessment Mockup */}
              <div className="hero-bg-card right-bg-card">
                <div className="assessment-mockup">
                  <div className="am-header">
                    <div className="am-dots">
                      <div className="am-dot r"></div>
                      <div className="am-dot y"></div>
                      <div className="am-dot g"></div>
                    </div>
                    Edgenuity - Auto Assessment
                  </div>
                  <div className="am-body">
                    <div className="am-score-card">
                      <div className="am-score-val">100%</div>
                      <div className="am-score-label">Quiz Score - Auto Assessment</div>
                      <div className="am-badges">
                        <span className="am-badge green">✓ Submitted</span>
                        <span className="am-badge blue">Undetected</span>
                      </div>
                    </div>
                    <div className="am-questions" style={{ opacity: 0.85 }}>
                      <div className="am-q-row">
                        <div className="am-q-left">
                          <div className="am-q-icon db">✓</div>
                          Which of the following is a prime number?
                        </div>
                        <span className="am-tag db">DB</span>
                      </div>
                      <div className="am-q-row">
                        <div className="am-q-left">
                          <div className="am-q-icon db">✓</div>
                          The American Civil War ended in...
                        </div>
                        <span className="am-tag db">DB</span>
                      </div>
                      <div className="am-q-row">
                        <div className="am-q-left">
                          <div className="am-q-icon db">✓</div>
                          What is the chemical formula for water?
                        </div>
                        <span className="am-tag db">DB</span>
                      </div>
                      <div className="am-q-row">
                        <div className="am-q-left">
                          <div className="am-q-icon ai">✓</div>
                          Describe the causes of WWI. (Free response)
                        </div>
                        <span className="am-tag ai">AI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Horizontal Infinite Marquee Ticker */}
            <div className="hero-marquee">
              <div className="marquee-content">
                <span>Auto Assessment</span><span className="marquee-dot">✦</span>
                <span>Video Skipper</span><span className="marquee-dot">✦</span>
                <span>Auto Write (AI)</span><span className="marquee-dot">✦</span>
                <span>Proctorio Bypass</span><span className="marquee-dot">✦</span>
                <span>Discord Logging</span><span className="marquee-dot">✦</span>
                <span>Prevent Logout</span><span className="marquee-dot">✦</span>
                <span>Auto Advance</span><span className="marquee-dot">✦</span>
                <span>Auto Submit</span><span className="marquee-dot">✦</span>
                <span>Duplicate Tabs</span><span className="marquee-dot">✦</span>
                <span>Activity Skipping</span><span className="marquee-dot">✦</span>
                <span>Advanced Class Support</span><span className="marquee-dot">✦</span>
                <span>Auto Project</span><span className="marquee-dot">✦</span>
                <span>Undetected</span><span className="marquee-dot">✦</span>
                <span>AI-Powered</span><span className="marquee-dot">✦</span>
                
                {/* Duplicate for infinite loop scrolling */}
                <span>Auto Assessment</span><span className="marquee-dot">✦</span>
                <span>Video Skipper</span><span className="marquee-dot">✦</span>
                <span>Auto Write (AI)</span><span className="marquee-dot">✦</span>
                <span>Proctorio Bypass</span><span className="marquee-dot">✦</span>
                <span>Discord Logging</span><span className="marquee-dot">✦</span>
                <span>Prevent Logout</span><span className="marquee-dot">✦</span>
                <span>Auto Advance</span><span className="marquee-dot">✦</span>
                <span>Auto Submit</span><span className="marquee-dot">✦</span>
                <span>Duplicate Tabs</span><span className="marquee-dot">✦</span>
                <span>Activity Skipping</span><span className="marquee-dot">✦</span>
                <span>Advanced Class Support</span><span className="marquee-dot">✦</span>
                <span>Auto Project</span><span className="marquee-dot">✦</span>
                <span>Undetected</span><span className="marquee-dot">✦</span>
                <span>AI-Powered</span><span className="marquee-dot">✦</span>
              </div>
            </div>

          </div>

        </section>

        <section id="features" className="features-section">
          <div style={{textAlign: "center", marginBottom: "4rem"}}>
            <h2 style={{fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem"}}>Built for Every Student</h2>
            <p style={{color: "var(--text-secondary)", fontSize: "1.1rem"}}>
              Whether you need to pass a class, boost your GPA, or just finish faster - SilentStudy has every feature to get it done.
            </p>
          </div>
          
          <div className="features-carousel-viewport">
            <div className="features-carousel-track">
              {/* First set of cards */}
              {carouselFeatures.map((f, i) => (
                <div key={`c1-${i}`} className="c-card">
                  <div className="c-card-top">
                    <span className="c-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{f.icon}</span>
                  </div>
                  <div className="c-card-bottom">
                    <h3 className="c-title">{f.title}</h3>
                    <p className="c-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
              
              {/* Second identical set for seamless infinite loop */}
              {carouselFeatures.map((f, i) => (
                <div key={`c2-${i}`} className="c-card">
                  <div className="c-card-top">
                    <span className="c-icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{f.icon}</span>
                  </div>
                  <div className="c-card-bottom">
                    <h3 className="c-title">{f.title}</h3>
                    <p className="c-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="split-section">
          <div className="split-text">
            <h2 className="split-title">
              Perfect Scores, <span className="text-blue-gradient">Every Time</span>
            </h2>
            <p className="split-desc">
              Instant Edgenuity answers on every quiz and test - powered by a real answer database, with Edgenuity AI as fallback for anything new.
            </p>
            <p className="split-desc">
              Our <strong>Auto Assessment</strong> engine matches each question against a database of saved answers first. If it's not found, AI fills in - all without you lifting a finger. Works on multiple-choice, true/false, and more.
            </p>
            <h3 className="split-subtitle">Completely Undetected</h3>
            <p className="split-desc">
              Silent Study operates like a real browser extension and is <strong>undetected by Edgenuity's bot-checking algorithms.</strong> Use customizable delays to stay completely under the radar.
            </p>
          </div>

          <div className="split-visual">
            <div className="assessment-mockup">
              <div className="am-header">
                <div className="am-dots">
                  <div className="am-dot r"></div>
                  <div className="am-dot y"></div>
                  <div className="am-dot g"></div>
                </div>
                Edgenuity - Auto Assessment
              </div>
              
              <div className="am-body">
                <div className="am-score-card">
                  <div className="am-score-val">100%</div>
                  <div className="am-score-label">Quiz Score - Auto Assessment</div>
                  <div className="am-badges">
                    <span className="am-badge green">✓ Submitted</span>
                    <span className="am-badge blue">Undetected</span>
                  </div>
                </div>

                <div className="am-legend">
                  <div className="am-legend-item"><span className="am-tag db">DB</span> Saved answer</div>
                  <div className="am-legend-item"><span className="am-tag ai">AI</span> AI fallback</div>
                </div>

                <div className="am-questions">
                  <div className="am-q-row">
                    <div className="am-q-left">
                      <div className="am-q-icon db">✓</div>
                      Which of the following is a prime number?
                    </div>
                    <span className="am-tag db">DB</span>
                  </div>
                  <div className="am-q-row">
                    <div className="am-q-left">
                      <div className="am-q-icon db">✓</div>
                      The American Civil War ended in...
                    </div>
                    <span className="am-tag db">DB</span>
                  </div>
                  <div className="am-q-row">
                    <div className="am-q-left">
                      <div className="am-q-icon db">✓</div>
                      What is the chemical formula for water?
                    </div>
                    <span className="am-tag db">DB</span>
                  </div>
                  <div className="am-q-row">
                    <div className="am-q-left">
                      <div className="am-q-icon ai">✓</div>
                      Describe the causes of WWI. (Free response)
                    </div>
                    <span className="am-tag ai">AI</span>
                  </div>
                </div>

                <div className="am-footer">
                  Answered in 0.8s · Delays active · Silent Study v1.1.2
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="settings-section">
          <div className="settings-split">
            <div className="settings-text">
              <h2>Full Control,<br/><span>Your Way</span></h2>
              <p>Every aspect of Silent Study is fully configurable. Adjust delays, toggle features, set up Discord logging, and control exactly how Silent Study behaves on each class.</p>
              <h4>Customizable for every use case</h4>
              <p style={{ fontSize: '0.95rem' }}>Set custom advance speeds, submission delays, and assessment behavior. Run multiple tabs simultaneously for <strong>maximum efficiency.</strong></p>
            </div>
            
            <div className="settings-mockup">
              <div className="sm-header">
                <div className="sm-dot r"></div>
                <div className="sm-dot y"></div>
                <div className="sm-dot g"></div>
                <span className="sm-title">Silent Study - Settings</span>
              </div>
              <div className="sm-list">
                <div className="sm-row">
                  <span>Advance Speed</span>
                  <span className="sm-badge">Custom Delay</span>
                </div>
                <div className="sm-row">
                  <span>Submit Delay</span>
                  <span className="sm-badge">0.5s - 5s</span>
                </div>
                <div className="sm-row">
                  <span>Assessment Mode</span>
                  <span className="sm-badge">Auto (AI)</span>
                </div>
                <div className="sm-row">
                  <span>Detection Evasion</span>
                  <span className="sm-badge">Enabled</span>
                </div>
                <div className="sm-row">
                  <span>Discord Logging</span>
                  <span className="sm-badge">Webhook</span>
                </div>
                <div className="sm-row">
                  <span>Multi-Tab Mode</span>
                  <span className="sm-badge">Active</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#525252', marginTop: '1.5rem' }}>
                All settings sync instantly · Silent Study v1.1.2
              </div>
            </div>
          </div>

          <div className="logging-section">
            <h3>Real-Time <span>Discord Logging</span> for Every Session</h3>
            <div className="log-cards">
              <div className="log-card">
                <h4>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Webhook Integration
                </h4>
                <p>Connect any Discord webhook and receive live updates as Silent Study works through your assignments, quizzes, and tests.</p>
              </div>
              <div className="log-card">
                <h4>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                  Activity Tracking
                </h4>
                <p>Track scores, completion status, question answers, and session time - all logged to your server automatically.</p>
              </div>
            </div>
            <div className="log-wide-card">
              <h4>Monitor everything from your phone while Silent Study runs on your computer. Never miss a score or activity update.</h4>
              <p>Utilize the Mobile Dashboard to view live session data, send remote commands, and keep track of your progress on the go.</p>
            </div>
          </div>
        </section>

        <section className="features-grid-section" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-card-header">
                  <div className={`feature-icon-wrapper color-${f.color}`}>
                    {f.icon}
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                </div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>

        </section>

        <section className="discord-section">
          <div className="discord-split">
            <div className="discord-text">
              <h2>Stay Updated<br/><span>On Everything</span></h2>
              <p>Silent Study logs every action to your Discord server in real time, so you always know exactly what's happening.</p>
              <p>Get notified about <strong>every score, skip, and submission.</strong><br/>Fully customizable - choose exactly what gets logged and how.</p>
            </div>
            
            <div className="discord-right">
              <div className="discord-mockup">
                <div className="dm-header">
                  <div className="sm-dot r"></div>
                  <div className="sm-dot y"></div>
                  <div className="sm-dot g"></div>
                  <span className="sm-title"># silent-logs - Discord</span>
                </div>
                <div className="dm-body">
                  <div className="dm-message">
                    <div className="dm-avatar">S</div>
                    <div className="dm-content">
                      <div className="dm-meta">
                        <span className="dm-author">Silent Study Bot</span>
                        <span className="dm-time">Today at 11:32 AM</span>
                      </div>
                      <div className="dm-embed">
                        <div className="dm-embed-title">Session Activity Log</div>
                        <div className="dm-embed-row">
                          <span><span className="dm-check">✓</span> Quiz - World History</span>
                          <span className="dm-green">100%</span>
                        </div>
                        <div className="dm-embed-row">
                          <span><span className="dm-check">✓</span> Video - Science Ch. 4</span>
                          <span className="dm-gray">Skipped</span>
                        </div>
                        <div className="dm-embed-row">
                          <span><span className="dm-check">✓</span> Free Response - English</span>
                          <span className="dm-blue">AI Written</span>
                        </div>
                        <div className="dm-embed-row">
                          <span><span className="dm-check">✓</span> Test - Algebra Unit 3</span>
                          <span className="dm-green">100%</span>
                        </div>
                        <div className="dm-embed-footer">
                          Session duration: 4m 23s · 4 activities completed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="discord-stats">
                <div className="d-stat">
                  <h4>247</h4>
                  <span>Activities Done</span>
                </div>
                <div className="d-stat">
                  <h4>100%</h4>
                  <span>Avg Score</span>
                </div>
                <div className="d-stat">
                  <h4>18h</h4>
                  <span>Time Saved</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="updates-section">
          <div className="updates-split">
            <div className="updates-left">
              <h2>Always <span>Updated</span></h2>
              <p>Silent Study is constantly updated to stay ahead of Edgenuity's changes, <strong>with thousands of students relying on it daily.</strong> New features ship regularly - including the latest additions below.</p>
              
              <span className="u-label">NEW IN 2026</span>
              <div className="u-cards">
                <div className="u-card">
                  <div className="u-card-header">
                    <span className="u-icon">📱</span>
                    <span className="u-live-badge">Live Now</span>
                  </div>
                  <h4>Mobile Dashboard</h4>
                  <p>Monitor live scores and session status from your phone. Send <strong>pause, resume, and stop commands</strong> remotely - all end-to-end encrypted. The server never sees your data.</p>
                </div>
                <div className="u-card">
                  <div className="u-card-header">
                    <span className="u-icon">⏰</span>
                    <span className="u-live-badge">Live Now</span>
                  </div>
                  <h4>Scheduler</h4>
                  <p>Set active time windows, day-of-week filters, and automatic breaks every N activities. <strong>Run during school hours, pause at night</strong> - fully hands-free.</p>
                </div>
              </div>
            </div>

            <div className="updates-right">
              <div className="stats-card">
                <span className="u-label" style={{ marginBottom: 0 }}>SILENT STUDY STATS</span>
                <div className="stats-grid">
                  <div className="s-box">
                    <h3>2,945</h3>
                    <span>Active Users</span>
                  </div>
                  <div className="s-box">
                    <h3>2M+</h3>
                    <span>Questions Answered</span>
                  </div>
                  <div className="s-box">
                    <h3>99.9%</h3>
                    <span>Uptime</span>
                  </div>
                  <div className="s-box">
                    <h3>Weekly</h3>
                    <span>Update Frequency</span>
                  </div>
                </div>
              </div>
              
              <div className="recent-updates-card">
                <span className="u-label" style={{ marginBottom: 0 }}>Recent Updates</span>
                <div className="ru-row">
                  <span className="ru-badge">v1.2.0</span>
                  <span className="ru-text">Mobile Dashboard + Scheduler launch. Many bug fixes and feature improvements.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="comparison-section">
          <h2>Why <span>Silent Study</span> Wins</h2>
          <p className="sub">Most tools guess with AI and hope for the best. Silent Study uses a real answer database, smarter automation, and features no other bot offers.</p>

          <div className="comp-table-wrapper">
            <div className="comp-grid">
              {/* Header */}
              <div className="cg-header feature-col">Feature</div>
              <div className="cg-header bot-col active">
                <div className="bot-logo">S</div>
                <span>Silent Study</span>
              </div>
              <div className="cg-header bot-col">
                <span>Other Bots</span>
              </div>

              {/* Rows */}
              {[
                { title: "Saved answers & AI fallback", desc: "Most tools rely on just saved answers - Silent Study does that plus AI fallback for new questions", ss: "check", other: "cross" },
                { title: "Scheduler (time windows + breaks)", desc: "Set specific time windows for doing assignments and add random breaks to mimic real behavior", ss: "check", other: "cross" },
                { title: "Mobile Dashboard (remote control)", desc: "E2E encrypted - server never sees your data", ss: "check", other: "cross" },
                { title: "Proctorio Support", desc: "Run Silent Study during Proctorio-monitored assessments", ss: "check", other: "cross" },
                { title: "EdgeEX Full Support", desc: "Full support for EdgeEX quizzes, including activity skipping and video skipper - most bots only support basic question types", ss: "check", other: "dash" },
                { title: "Video Skipper (EdgeEX)", desc: "Skip videos in EdgeEX quizzes with customizable settings", ss: "check", other: "dash" },
                { title: "Auto Write", desc: "Generate high-quality free response answers using undetectable AI", ss: "check", other: "dash" },
                { title: "Activity Skipping (labs, graphs)", desc: "Skip non-question activities in EdgeEX assignments like labs and graphs - most bots can't handle these at all", ss: "check", other: "dash" },
                { title: "Discord Logging", desc: "Log activities to Discord for monitoring and analysis", ss: "check", other: "dash" },
                { title: "Detection Evasion", desc: "Customizable delays and natural-looking behavior", ss: "check", other: "dash" },
                { title: "Regular Updates", desc: "Weekly updates to stay ahead of Edgenuity changes", ss: "check", other: "cross" }
              ].map((row, idx) => (
                <div className="cg-row" key={idx}>
                  <div className="cg-cell">
                    <div className="c-feat-title">{row.title}</div>
                    <div className="c-feat-desc">{row.desc}</div>
                  </div>
                  <div className="cg-cell bot-cell active">
                    <span className={`c-icon ${row.ss}`}>{row.ss === 'check' ? '✓' : row.ss === 'cross' ? '✕' : '-'}</span>
                  </div>
                  <div className="cg-cell bot-cell">
                    <span className={`c-icon ${row.other}`}>{row.other === 'check' ? '✓' : row.other === 'cross' ? '✕' : '-'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="comp-legend">
              <span className="legend-title">Legend</span>
              <span><span className="c-icon check">✓</span> Fully supported</span>
              <span><span className="c-icon dash">-</span> Partial / limited</span>
              <span><span className="c-icon cross">✕</span> Not available</span>
            </div>
          </div>
        </section>
        <section id="pricing" className="pricing-section">
          <h2>All features and customization,<br/><span>for every price.</span></h2>
          <p className="p-sub">Pay once and get instant access. Choose the duration that works for you.</p>
          
          <div className="trust-badge">
            <div className="dot-red"></div>
            <span><strong>6,767 students</strong> purchased a key in the last 24 hours</span>
          </div>

          <div className="pricing-tabs">
            <button 
              className={`p-tab ${selectedAddon === 'base' ? 'active' : ''}`}
              onClick={() => setSelectedAddon('base')}
            >
              Base
            </button>
            <button 
              className={`p-tab ${selectedAddon === 'service' ? 'active' : ''}`}
              onClick={() => setSelectedAddon('service')}
            >
              + Service Key
              <span className="tooltip-trigger">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span className="tooltip-content">Allows up to 5 users on the same key — share across accounts or with friends.</span>
              </span>
            </button>
            <button 
              className={`p-tab ${selectedAddon === 'proctor' ? 'active' : ''}`}
              onClick={() => setSelectedAddon('proctor')}
            >
              + Proctor Bypass
              <span className="tooltip-trigger">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span className="tooltip-content">Lets Silent Study run on Proctorio-monitored assessments. Removes fullscreen lock, clipboard block, and tab restrictions so Silent Study can operate normally.</span>
              </span>
            </button>
            <button 
              className={`p-tab ${selectedAddon === 'both' ? 'active' : ''}`}
              onClick={() => setSelectedAddon('both')}
            >
              + Both Add-ons
              <span className="tooltip-trigger">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span className="tooltip-content">Includes both Service Key (5 users) and Proctorio Bypass add-ons at a bundled discount.</span>
              </span>
            </button>
          </div>

          <div className="pricing-grid">
            <div className="p-card">
              <div className="p-label">Day Key</div>
              <div className="p-price"><span>$</span>{getPlanPrice('day')}</div>
              <div className="p-duration">24 hours · {getPlanUsers()}</div>
              <button className="p-btn" onClick={() => handleCheckout('day')}>Get Started →</button>
            </div>

            <div className="p-card popular">
              <div className="p-pop-badge">Most Popular</div>
              <div className="p-label">Week Key</div>
              <div className="p-price"><span>$</span>{getPlanPrice('week')}</div>
              <div className="p-duration">1 week · {getPlanUsers()}</div>
              <button className="p-btn primary" onClick={() => handleCheckout('week')}>Get Started →</button>
            </div>

            <div className="p-card">
              <div className="p-label">Month Key</div>
              <div className="p-price"><span>$</span>{getPlanPrice('month')}</div>
              <div className="p-duration">1 month · {getPlanUsers()}</div>
              <button className="p-btn" onClick={() => handleCheckout('month')}>Get Started →</button>
            </div>

            <div className="p-card">
              <div className="p-label">6 Months Key</div>
              <div className="p-price"><span>$</span>{getPlanPrice('six_month')}</div>
              <div className="p-duration">6 months · {getPlanUsers()}</div>
              <button className="p-btn" onClick={() => handleCheckout('six_month')}>Get Started →</button>
            </div>
          </div>

          <div className="features-box">
            <div className="fb-title">All Plans Include</div>
            <div className="fb-grid">
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Auto Advance
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Auto Submit
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Auto Assessment (AI)
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Video Skipper
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Auto Write (AI)
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Auto Project
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Activity Skipping
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Advanced Class Support
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Prevent Logout
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Duplicate Tabs
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Discord Logging
              </div>
              <div className="fb-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Lifetime Updates
              </div>
            </div>

          </div>
        </section>
      </main>

      <footer className="footer-modern">
        <div className="footer-main">
          <div className="footer-left">
            <div className="footer-label">SUPPORTED PLATFORMS</div>
            <div className="platform-row">
              <strong>Chrome · Brave · Edge · Firefox</strong>
            </div>
            <div className="platform-sub">
              Windows · macOS · iOS · Android · Chromebook · Linux
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-label">QUICK LINKS</div>
            <div className="footer-links-grid">
              <a href="#support">Support ›</a>
              <a href="#get-started" onClick={scrollToPricing}>Get Started ›</a>
              <a href="#features">Features ›</a>
              <a href="#tutorial">Tutorial ›</a>
              <a href="https://discord.gg/silentstudy" target="_blank" rel="noreferrer">Discord Community ›</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-brand" style={{display: 'flex', alignItems: 'center'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M12 2L2 7l10 5 10-5-10-5Z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span style={{fontWeight: 800}}>SilentStudy</span>
            <span className="v-badge">v1.2.0</span>
          </div>
          <div className="footer-legal">
            <a href="#tos">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <span>Copyright © 2024-2026 Silent Study</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
