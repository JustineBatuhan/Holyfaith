import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import { MapPin, Phone, Mail, Facebook, Youtube } from 'lucide-react';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    apiRequest('/api/public-data')
      .then(res => {
        setSettings(res.settings);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading contact settings:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const mapQuery = settings?.contactAddress || '';
  const mapSrc = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setSuccess(false);

    if (!name || !email || !message) {
      setFormError("Please fill out all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      await apiRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message }),
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error("Form submission error:", err);
      setFormError(err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto 50px auto', textAlign: 'center' }}>
          <p className="section-meta">Get in Touch</p>
          <h2 className="section-title" style={{ fontSize: '2.8rem' }}>Contact Us</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            We'd love to hear from you. Reach out to us or send us a message below.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Info */}
          <div className="contact-info">
            <div className="contact-info-item">
              <MapPin className="contact-info-icon" size={24} />
              <div>
                <h4 className="contact-info-title">Our Location</h4>
                <p className="contact-info-text">{settings.contactAddress}</p>
              </div>
            </div>

            {mapQuery && (
              <div className="contact-map-wrapper">
                <iframe
                  title="Church location map"
                  src={mapSrc}
                  width="100%"
                  height="280"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <a href={`https://maps.google.com?q=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-rose)', textDecoration: 'underline' }}>
                    Open in Google Maps
                  </a>
                </p>
              </div>
            )}

            <div className="contact-info-item">
              <Phone className="contact-info-icon" size={24} />
              <div>
                <h4 className="contact-info-title">Phone Number</h4>
                <p className="contact-info-text">{settings.contactPhone}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <Mail className="contact-info-icon" size={24} />
              <div>
                <h4 className="contact-info-title">Email Address</h4>
                <p className="contact-info-text">
                  <a href={`mailto:${settings.contactEmail}`} style={{ borderBottom: '1px dotted var(--accent-rose)', color: 'var(--text-primary)' }}>
                    {settings.contactEmail}
                  </a>
                </p>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="contact-info-title" style={{ marginBottom: '12px' }}>Follow Us</h4>
              <div className="contact-socials">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="contact-social-link">
                    <Facebook size={18} />
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="contact-social-link">
                    <Youtube size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="contact-form-container">
            {success && (
              <div className="success-message">
                Thank you! Your message has been sent successfully. We will get back to you soon.
              </div>
            )}
            
            {formError && (
              <div style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: 'var(--error-color)', padding: '16px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-control"
                  placeholder="How can we help?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-control"
                  rows="5"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
              >
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
