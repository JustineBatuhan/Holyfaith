import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest('/api/public-data')
      .then(res => {
        setSettings(res.settings);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading about page settings:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTop: '3px solid var(--accent-rose)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 className="section-title">Failed to load content</h2>
        <p style={{ color: 'var(--error-color)' }}>{error}</p>
      </div>
    );
  }

  // Format paragraphs from storyText
  const paragraphs = settings.storyText ? settings.storyText.split('\n\n') : [];

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="section-meta">Who We Are</p>
          <h2 className="section-title" style={{ fontSize: '2.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
            {settings.storyTitle || 'Our Story & Mission'}
          </h2>
          
          <div style={{ marginTop: '32px' }}>
            {paragraphs.map((p, i) => (
              <p 
                key={i} 
                style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '1.1rem', 
                  lineHeight: '1.8', 
                  marginBottom: '24px',
                  fontWeight: '300'
                }}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Three Core Pillars Cards */}
          <div className="story-cards" style={{ marginTop: '60px' }}>
            <div className="story-card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h3 className="story-card-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', fontWeight: '400', marginBottom: '16px' }}>
                Prayer
              </h3>
              <p className="story-card-text" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                The heart of our worship
              </p>
            </div>
            <div className="story-card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h3 className="story-card-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', fontWeight: '400', marginBottom: '16px' }}>
                Service
              </h3>
              <p className="story-card-text" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                Loving our neighbors
              </p>
            </div>
            <div className="story-card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h3 className="story-card-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', fontWeight: '400', marginBottom: '16px' }}>
                Family
              </h3>
              <p className="story-card-text" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                Growing together in faith
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
