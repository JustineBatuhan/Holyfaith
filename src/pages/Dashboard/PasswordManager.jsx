import React, { useState } from 'react';
import { apiRequest } from '../../utils/api';
import { KeyRound, ShieldCheck } from 'lucide-react';

export default function PasswordManager() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setIsError(true);
      setMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setIsError(true);
      setMessage("New password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      setIsError(false);
      setMessage(response.message || "Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error("Password change failed:", err);
      setIsError(true);
      setMessage(err.message || "Failed to update password. Check your current password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Security Settings</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Change your dashboard administrator password</p>
      </div>

      {message && (
        <div 
          className={isError ? 'login-error' : 'success-message'}
          style={{ marginBottom: '20px' }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <KeyRound size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '40px', width: '100%' }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <KeyRound size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '40px', width: '100%' }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShieldCheck size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '40px', width: '100%' }}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '20px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
