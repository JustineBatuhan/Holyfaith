import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import * as Icons from 'lucide-react';

// Safe icon renderer helper
const MinistryIcon = ({ name, size = 32, className = "ministry-icon" }) => {
  // Map string to Lucide icon component, fallback to BookOpen
  const IconComponent = Icons[name] || Icons.BookOpen;
  return <IconComponent size={size} className={className} />;
};

export default function Ministries() {
  const [ministries, setMinistries] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('General Volunteer');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    apiRequest('/api/public-data')
      .then(res => {
        setMinistries(res.ministries);
        setSettings(res.settings);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading ministries page:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);

    if (!name || !email || !message) {
      setFormError('Please fill in your name, email, and a short note about how you want to serve.');
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          subject: `Volunteer Signup: ${selectedMinistry}`,
          message: `Ministry interest: ${selectedMinistry}\n\n${message}`
        }),
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setSelectedMinistry(ministries[0]?.title || 'General Volunteer');
      setMessage('');
    } catch (err) {
      console.error('Volunteer signup error:', err);
      setFormError(err.message || 'Failed to submit your request. Please try again later.');
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
          <p className="section-meta">Ways to Grow</p>
          <h2 className="section-title" style={{ fontSize: '2.8rem' }}>Our Ministries</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Find your place to serve, connect, and grow in faith through our church ministries.
          </p>
        </div>

        <div className="ministries-grid">
          {ministries.map((min) => (
            <div key={min.id} className="ministry-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MinistryIcon name={min.icon} />
              </div>
              <h3 className="ministry-title">{min.title}</h3>
              <p className="ministry-description">{min.description}</p>
            </div>
          ))}
        </div>

        <section className="section-padding" style={{ marginTop: '64px' }}>
          <div style={{ maxWidth: '920px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', textAlign: 'center' }}>
              <p className="section-meta">Serve with Us</p>
              <h2 className="section-title" style={{ fontSize: '2.5rem' }}>Volunteer Opportunities</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Ready to serve? Tell us how you want to help, and we will connect you with the right ministry team.
              </p>
            </div>

            <div className="contact-grid" style={{ gap: '32px' }}>
              <div className="contact-info" style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '18px' }}>Ministry Support & Details</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Our ministries are open for volunteers of all ages and gifts. Choose the area you feel called to serve and share a little about yourself.
                </p>

                <div style={{ display: 'grid', gap: '18px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0' }}>Contact Email</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{settings?.contactEmail || 'info@holyfaithbcp.org'}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0' }}>Phone</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{settings?.contactPhone || '+63 34 123 4567'}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0' }}>Next Steps</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                      Fill out the volunteer form and we will follow up with details about serving, training, and ministry contact persons.
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact-form-container" style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                {success && (
                  <div style={{ backgroundColor: 'rgba(56, 142, 60, 0.12)', color: 'var(--text-primary)', padding: '16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600 }}>
                    Thank you! Your volunteer request was sent successfully. We will be in touch soon.
                  </div>
                )}

                {formError && (
                  <div style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: 'var(--error-color)', padding: '16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600 }}>
                    {formError}
                  </div>
                )}

                <form onSubmit={handleVolunteerSubmit}>
                  <div className="form-group">
                    <label htmlFor="volunteer-name">Full Name *</label>
                    <input
                      id="volunteer-name"
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="volunteer-email">Email Address *</label>
                    <input
                      id="volunteer-email"
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="volunteer-ministry">Interested Ministry</label>
                    <select
                      id="volunteer-ministry"
                      className="form-control"
                      value={selectedMinistry}
                      onChange={(e) => setSelectedMinistry(e.target.value)}
                    >
                      <option value="General Volunteer">General Volunteer</option>
                      {ministries.map((min) => (
                        <option key={min.id} value={min.title}>{min.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="volunteer-message">Tell Us How You Want to Help *</label>
                    <textarea
                      id="volunteer-message"
                      className="form-control"
                      rows="5"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your skills, availability, or why you want to serve."
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', marginTop: '10px' }}>
                    {submitting ? 'Sending request...' : 'Send Volunteer Request'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
