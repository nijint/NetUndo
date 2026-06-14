import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignalHigh, Users, Map as MapIcon, Navigation, Search, Activity, MapPin } from 'lucide-react';
import SearchBar from '../components/SearchBar';

const AnimatedLogo = () => {
  const modes = [
    { text: 'E', color: 'red', level: 1 },
    { text: '2G', color: 'red', level: 1 },
    { text: '3G', color: 'orange', level: 2 },
    { text: '4G', color: 'green', level: 3 },
    { text: '5G', color: 'green', level: 4 }
  ];
  const [index, setIndex] = useState(4); // Start at 5G

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % modes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [modes.length]);

  const current = modes[index];

  return (
    <div className="animated-logo-container">
      <div className={`signal-bars-icon ${current.color}`}>
        <div className={`signal-bar bar-1 ${current.level >= 1 ? 'filled' : ''}`}></div>
        <div className={`signal-bar bar-2 ${current.level >= 2 ? 'filled' : ''}`}></div>
        <div className={`signal-bar bar-3 ${current.level >= 3 ? 'filled' : ''}`}></div>
        <div className={`signal-bar bar-4 ${current.level >= 4 ? 'filled' : ''}`}></div>
      </div>
      <div className={`signal-badge badge-${current.color}`}>
        <span key={current.text} className="signal-text animate-pop">{current.text}</span>
      </div>
    </div>
  );
};

const SpotlightCard = ({ item, activeAdvantage, setActiveAdvantage }) => {
  const cardRef = React.useRef(null);
  const isActive = activeAdvantage === item.id;
  const isDimmed = activeAdvantage !== null && activeAdvantage !== item.id;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className={`advantage-card ${item.danger ? 'danger' : ''} ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
      onClick={() => setActiveAdvantage(isActive ? null : item.id)}
      onMouseMove={handleMouseMove}
    >
      <div className="card-border-glow"></div>
      <div className="card-inner">
        <div className="card-icon-wrapper">
          <item.icon size={24} className="card-icon" />
        </div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-desc">{item.desc}</p>
        <div className="card-glow-effect"></div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeAdvantage, setActiveAdvantage] = useState(null);

  const handleMapNavigation = () => {
    navigate('/map');
  };

  const handleReportNavigation = () => {
    navigate('/map', { state: { openReportingMode: true } });
  };

  const handleSearchSelect = (loc) => {
    navigate('/map', { state: { searchedLocation: loc } });
  };

  return (
    <div className="app-container">
      {/* Ambient Background Orbs */}
      <div className="ambient-background">
        <div className="ambient-orb orb-mint"></div>
        <div className="ambient-orb orb-red"></div>
      </div>

      {/* Navbar */}
      <nav className="navbar animate-fade-in-down">
        <div className="nav-brand">
          <AnimatedLogo />
          <span className="nav-brand-text">NetUndo</span>
        </div>

        <div className="nav-actions">
          <button className="nav-btn-primary" onClick={handleMapNavigation}>Open Live Map</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content animate-fade-in-up">

          <div className="live-status-badge">
            <div className="live-dot-glow"></div>
            <span>Live: 1,245 Reports Today</span>
          </div>

          <h1 className="hero-title">
            Lost <span className="text-danger">signal</span>?<br />Not <span className="text-accent">anymore</span>.
          </h1>

          <p className="hero-subtitle">
            Carrier maps lie. NetUndo doesn't. Join the community mapping true 5G zones, call drops, and total deadzones to identify network issues across Kerala before you go off the grid.
          </p>

          <div className="hero-search">
            <SearchBar onLocationSelect={handleSearchSelect} />

            <div className="hero-actions">
              <button className="btn-pill btn-pill-primary" onClick={handleMapNavigation}>
                Open Live Map
              </button>
              <button className="btn-pill btn-pill-outline" onClick={handleReportNavigation}>
                Report a deadzone
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The NetUndo Advantage Section */}
      <section className="advantage-section">
        <div className="section-header animate-fade-in-up">
          <h2 className="section-title">The NetUndo <span>Advantage</span></h2>
          <p className="section-subtitle">Real network data, collected by the community, for the community.</p>
        </div>

        <div className="advantage-grid">
          {[
            { id: 1, icon: Users, title: 'Community-Driven', desc: 'Real spots pinned by real people who have actually connected there. No fake listings, no corporate spin.' },
            { id: 2, icon: MapIcon, title: 'Kerala at a Glance', desc: 'Full coverage map tracking cellular networks. Tap a pin to see exact speed, carrier, and signal strength.' },
            { id: 3, icon: Navigation, title: 'Know Before You Go', desc: 'Signal rated 1 to 5 by the community. Never walk into a "connected, no internet" zone again.' }
          ].map((item) => (
            <SpotlightCard
              key={item.id}
              item={item}
              activeAdvantage={activeAdvantage}
              setActiveAdvantage={setActiveAdvantage}
            />
          ))}
        </div>
      </section>

      {/* How it Connects Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It <span>Connects</span></h2>
          <p className="section-subtitle">No logins, no manuals. Just three quick steps to check or report speed.</p>
        </div>

        <div className="network-path-container">
          <div className="network-line"></div>

          <div className="node-step">
            <div className="node-marker">
              <div className="node-pulse"></div>
              <div className="node-core"><Search size={20} /></div>
            </div>
            <div className="node-content">
              <h3>Explore the Map</h3>
              <p>Zoom in on your area, or search for a specific city in Kerala to view existing network data.</p>
            </div>
          </div>

          <div className="node-step alternate">
            <div className="node-marker">
              <div className="node-pulse"></div>
              <div className="node-core"><Activity size={20} /></div>
            </div>
            <div className="node-content">
              <h3>Analyze the Signal</h3>
              <p>Each pin shows verified speeds, coverage type (5G/4G/Deadzone), and community ratings.</p>
            </div>
          </div>

          <div className="node-step danger">
            <div className="node-marker">
              <div className="node-pulse"></div>
              <div className="node-core"><MapPin size={20} /></div>
            </div>
            <div className="node-content">
              <h3>Pin Your Own</h3>
              <p>Found a deadzone or blazing fast 5G? Drop a pin to help map out true connectivity.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        Made with chaya ☕ by <a href="https://github.com/nijint" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold'}}>nijint</a> © 2026
      </footer>
    </div>
  );
};

export default LandingPage;
