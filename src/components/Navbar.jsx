import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Download } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/uploads/logo.png');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login state on render and route changes
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsLoggedIn(!!token);
  }, [location]);

  useEffect(() => {
    setLogoSrc(`/uploads/logo.png?${Date.now()}`);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleDownload = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted' || outcome === 'dismissed') {
        setDeferredPrompt(null);
      }
      return;
    }

    alert('To install the app, open your browser menu and choose Add to Home screen.');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Ministries', path: '/ministries' },
    { label: 'Events', path: '/events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-logo">
          <img src={logoSrc} alt="Holy Faith Logo" />
          Holy Faith <span>BCP Church</span>
        </Link>

        {/* Desktop navigation */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={handleDownload}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}
            >
              <Download size={14} />
              Download App
            </button>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-primary btn-sm" 
                  style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn btn-outline btn-sm">Admin</Link>
            </li>
          )}
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation panel */}
      {isOpen && (
        <div id="mobile-navigation" style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 99
        }}>
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              onClick={() => setIsOpen(false)}
              style={({ isActive }) => ({
                fontSize: '0.9rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isActive ? 'var(--accent-rose)' : 'var(--text-secondary)',
                padding: '8px 0',
                borderBottom: '1px solid #FAF0EE'
              })}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => { handleDownload(); setIsOpen(false); }}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', marginTop: '10px', display: 'inline-flex', justifyContent: 'center', gap: '8px' }}
          >
            <Download size={14} />
            Download App
          </button>
          {isLoggedIn ? (
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
              >
                Dashboard
              </Link>
              <button 
                onClick={() => { handleLogout(); setIsOpen(false); }} 
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="btn btn-outline btn-sm"
              style={{ marginTop: '10px', textAlign: 'center' }}
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
