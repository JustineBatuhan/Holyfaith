import React, { useState, useEffect } from 'react';
import { apiRequest, uploadImage } from '../../utils/api';
import { Upload, Save, CheckCircle } from 'lucide-react';

export default function SettingsManager() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    apiRequest('/api/settings')
      .then(res => {
        setSettings(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading settings:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadProgress(prev => ({ ...prev, [fieldName]: 'Uploading...' }));
    try {
      const result = await uploadImage(file);
      setSettings(prev => ({
        ...prev,
        [fieldName]: result.imageUrl
      }));
      setUploadProgress(prev => ({ ...prev, [fieldName]: 'Success!' }));
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [fieldName]: null }));
      }, 3000);
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadProgress(prev => ({ ...prev, [fieldName]: 'Failed!' }));
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [fieldName]: null }));
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage('');

    try {
      const data = await apiRequest('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      setSettings(data.settings);
      setStatusMessage('Settings saved successfully!');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setStatusMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings editor...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="dashboard-actions-bar">
        <div>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Website Settings</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Customize the general information, banners, and media on your site</p>
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {statusMessage && (
        <div className={statusMessage.includes('successfully') ? 'success-message' : 'login-error'} style={{ marginBottom: '24px' }}>
          {statusMessage}
        </div>
      )}

      {/* Grid container */}
      <div className="grid-2">
        {/* Left Side: Text Details */}
        <div className="dashboard-card" style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>General Information</h4>
          
          <div className="form-group">
            <label>Church Name</label>
            <input
              type="text"
              name="churchName"
              value={settings.churchName || ''}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Hero Tagline / Subtitle</label>
            <input
              type="text"
              name="tagline"
              value={settings.tagline || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Hero Welcome Description</label>
            <textarea
              name="description"
              value={settings.description || ''}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>

          <h4 style={{ fontSize: '1.2rem', marginTop: '30px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Contact Details</h4>
          
          <div className="form-group">
            <label>Church Address / Map Location</label>
            <input
              type="text"
              name="contactAddress"
              value={settings.contactAddress || ''}
              onChange={handleChange}
              className="form-control"
            />
            <small style={{ color: 'var(--text-secondary)', marginTop: '6px', display: 'block', fontSize: '0.9rem' }}>
              This address is used for the map on the Contact page.
            </small>
          </div>

          <div className="form-group">
            <label>Contact Phone Number</label>
            <input
              type="text"
              name="contactPhone"
              value={settings.contactPhone || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Facebook Page Link</label>
            <input
              type="url"
              name="facebookUrl"
              value={settings.facebookUrl || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>YouTube Channel Link</label>
            <input
              type="url"
              name="youtubeUrl"
              value={settings.youtubeUrl || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Right Side: Media and Scriptures */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Images Upload Card */}
          <div className="dashboard-card">
            <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Website Media Assets</h4>
            
            {/* Hero Bg */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Hero Background Image</label>
              <input
                type="text"
                name="heroBgImage"
                value={settings.heroBgImage || ''}
                onChange={handleChange}
                className="form-control"
                placeholder="Image URL or upload a file"
              />
              <div className="image-upload-wrapper">
                <img src={settings.heroBgImage || '#'} alt="Hero Preview" className="image-preview" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }} />
                <div className="image-upload-btn-container">
                  <button type="button" className="btn btn-outline btn-sm" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Upload size={14} />
                    Upload Image
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'heroBgImage')}
                    className="image-upload-input"
                  />
                </div>
                {uploadProgress.heroBgImage && <span style={{ fontSize: '0.85rem', color: 'var(--accent-rose)' }}>{uploadProgress.heroBgImage}</span>}
              </div>
            </div>

            {/* About Image */}
            <div className="form-group">
              <label>About Us Section Image</label>
              <input
                type="text"
                name="aboutImage"
                value={settings.aboutImage || ''}
                onChange={handleChange}
                className="form-control"
                placeholder="Image URL or upload a file"
              />
              <div className="image-upload-wrapper">
                <img src={settings.aboutImage || '#'} alt="About Preview" className="image-preview" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }} />
                <div className="image-upload-btn-container">
                  <button type="button" className="btn btn-outline btn-sm" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Upload size={14} />
                    Upload Image
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'aboutImage')}
                    className="image-upload-input"
                  />
                </div>
                {uploadProgress.aboutImage && <span style={{ fontSize: '0.85rem', color: 'var(--accent-rose)' }}>{uploadProgress.aboutImage}</span>}
              </div>
            </div>
          </div>

          {/* Quotes and Subsections */}
          <div className="dashboard-card">
            <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Scripture Quotes & Subsections</h4>

            <div className="form-group">
              <label>Intro Section Title</label>
              <input
                type="text"
                name="aboutTitle"
                value={settings.aboutTitle || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Intro Section Quote / Scripture</label>
              <textarea
                name="aboutQuote"
                value={settings.aboutQuote || ''}
                onChange={handleChange}
                className="form-control"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Intro Quote Source (e.g. Matthew 11:28)</label>
              <input
                type="text"
                name="aboutQuoteSource"
                value={settings.aboutQuoteSource || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Intro Welcome Paragraph</label>
              <textarea
                name="aboutText"
                value={settings.aboutText || ''}
                onChange={handleChange}
                className="form-control"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Dark Banner Scripture Quote</label>
              <textarea
                name="aboutQuoteBanner"
                value={settings.aboutQuoteBanner || ''}
                onChange={handleChange}
                className="form-control"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Dark Banner Quote Source (e.g. Matthew 18:20)</label>
              <input
                type="text"
                name="aboutQuoteBannerSource"
                value={settings.aboutQuoteBannerSource || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Story Page Title</label>
              <input
                type="text"
                name="storyTitle"
                value={settings.storyTitle || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Story Page Text (use double enter for new paragraph)</label>
              <textarea
                name="storyText"
                value={settings.storyText || ''}
                onChange={handleChange}
                className="form-control"
                rows="6"
              />
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
