import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { Calendar, Heart, BookOpen, ArrowRight } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroLogoSrc, setHeroLogoSrc] = useState('/uploads/logo.png');

  useEffect(() => {
    apiRequest('/api/public-data')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading home page:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setHeroLogoSrc(`/uploads/logo.png?${Date.now()}`);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-rose)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Welcome to Holy Faith Bcp Church...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 className="section-title">Failed to load content</h2>
        <p style={{ color: 'var(--error-color)', marginBottom: '20px' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  const { settings, ministries, events } = data;

  // Render first 3 events for summary
  const upcomingEvents = events.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${settings.heroBgImage || '/uploads/hero.jpg'})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-logo">
            <img src={heroLogoSrc} alt="Holy Faith Logo" />
          </div>
          <p className="hero-subtitle">{settings.tagline}</p>
          <h1 className="hero-title">
            {settings.churchName.split(' ').slice(0, 2).join(' ')} <span>{settings.churchName.split(' ').slice(2).join(' ')}</span>
          </h1>
          <div className="hero-divider" />
          <p className="hero-text">{settings.description}</p>
          <div className="hero-actions">
            <Link to="/about" className="btn btn-primary">Our Story</Link>
            <Link to="/events" className="btn btn-ghost">Upcoming Events</Link>
          </div>
        </div>
      </section>

      {/* Intro Welcome Section */}
      <section className="about-section section-padding">
        <div className="container about-grid">
          <div>
            <p className="section-meta">Our Community</p>
            <h2 className="section-title">{settings.aboutTitle}</h2>
            {settings.aboutQuote && (
              <blockquote className="about-quote">
                "{settings.aboutQuote}"
                {settings.aboutQuoteSource && <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'normal', fontWeight: '600', marginTop: '8px', letterSpacing: '0.05em' }}>— {settings.aboutQuoteSource}</span>}
              </blockquote>
            )}
            <p className="about-text">{settings.aboutText}</p>
            <Link to="/about" className="btn btn-outline" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
              Learn More About Us
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="about-image-container">
            <img src={settings.aboutImage} alt="Church Community" className="about-image" />
          </div>
        </div>
      </section>

      {/* Scripture Quote Banner */}
      {settings.aboutQuoteBanner && (
        <section className="quote-banner">
          <p className="banner-quote">"{settings.aboutQuoteBanner}"</p>
          {settings.aboutQuoteBannerSource && <p className="banner-quote-source">{settings.aboutQuoteBannerSource}</p>}
        </section>
      )}

      {/* Ministries Quick Preview */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px auto' }}>
            <p className="section-meta">Ways to Connect</p>
            <h2 className="section-title">Our Ministries</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Find your place to serve, connect, and grow in faith through our active church ministries.</p>
          </div>
          
          <div className="story-cards">
            {ministries.slice(0, 3).map((min) => (
              <div key={min.id} className="story-card">
                <h3 className="story-card-title">{min.title}</h3>
                <p className="story-card-text">{min.description}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/ministries" className="btn btn-outline">View All Ministries</Link>
          </div>
        </div>
      </section>

      {/* Events Quick Preview */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px auto' }}>
            <p className="section-meta">Mark Your Calendar</p>
            <h2 className="section-title">Upcoming Services & Events</h2>
          </div>

          <div className="events-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {upcomingEvents.map((evt) => {
              const dateObj = new Date(evt.date);
              const day = dateObj.getDate();
              const month = dateObj.toLocaleString('default', { month: 'short' });
              
              return (
                <div key={evt.id} className="event-item" style={{ gridTemplateColumns: '100px 1fr', gap: '24px' }}>
                  <div className="event-date-badge" style={{ padding: '12px 6px' }}>
                    <div className="event-day" style={{ fontSize: '1.5rem' }}>{day || evt.date.split('-')[2]}</div>
                    <div className="event-month">{month || 'Date'}</div>
                  </div>
                  <div className="event-content">
                    <span className="event-tag">{evt.tag}</span>
                    <h3 className="event-title" style={{ fontSize: '1.2rem' }}>{evt.title}</h3>
                    <div className="event-meta" style={{ fontSize: '0.8rem' }}>
                      <span className="event-meta-item">{evt.time}</span>
                      <span className="event-meta-item">&bull; {evt.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/events" className="btn btn-outline">View Full Calendar</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
