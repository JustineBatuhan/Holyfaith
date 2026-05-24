import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { Mail, MailOpen, Trash2, Calendar, User } from 'lucide-react';

export default function InboxManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    setLoading(true);
    apiRequest('/api/messages')
      .then(res => {
        setMessages(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading messages:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await apiRequest(`/api/messages/${id}/read`, {
        method: 'PATCH'
      });
      fetchMessages();
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message permanently?")) {
      return;
    }

    try {
      await apiRequest(`/api/messages/${id}`, {
        method: 'DELETE'
      });
      fetchMessages();
    } catch (err) {
      console.error("Delete message failed:", err);
    }
  };

  return (
    <div>
      <div className="dashboard-actions-bar">
        <div>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Inquiries Inbox</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Read and respond to feedback submitted through your website's contact form</p>
        </div>
      </div>

      {loading ? (
        <div>Loading message inbox...</div>
      ) : (
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-card ${!msg.read ? 'unread' : ''}`}>
              <div className="message-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} style={{ color: 'var(--accent-rose)' }} />
                  <span className="message-sender">{msg.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>&lt;<a href={`mailto:${msg.email}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{msg.email}</a>&gt;</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} />
                  <span className="message-date">
                    {new Date(msg.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="message-subject">Subject: {msg.subject}</div>
              <div className="message-body">{msg.message}</div>

              <div className="message-actions">
                {!msg.read && (
                  <button 
                    onClick={() => handleMarkRead(msg.id)} 
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }}
                  >
                    <MailOpen size={14} />
                    Mark Read
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(msg.id)} 
                  className="btn btn-danger btn-sm"
                  style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Your inbox is currently empty. Direct messages will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
