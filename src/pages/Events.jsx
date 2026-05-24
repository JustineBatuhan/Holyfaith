import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest('/api/public-data')
      .then(res => {
        // Sort events chronologically by date
        const sorted = [...res.events].sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading events page:", err);
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

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ margin: '0 auto 50px auto', textAlign: 'center' }}>
          <p className="section-meta">Mark Your Calendar</p>
          <h2 className="section-title" style={{ fontSize: '2.8rem' }}>Upcoming Events</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Join us for worship, fellowship, and community gatherings throughout the year.
          </p>
        </div>

        <div className="events-list">
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No upcoming events scheduled at this time. Check back soon!</p>
            </div>
          ) : (
            events.map((evt) => {
              // Parse the date (Format: YYYY-MM-DD)
              const dateObj = new Date(evt.date);
              
              // Handle invalid date fallbacks nicely
              const isValidDate = !isNaN(dateObj.getTime());
              const day = isValidDate ? dateObj.getDate() : evt.date.split('-')[2] || '??';
              const month = isValidDate 
                ? dateObj.toLocaleString('default', { month: 'short' }) 
                : 'MAY';
                
              return (
                <div key={evt.id} className="event-item">
                  {/* Date Badge */}
                  <div className="event-date-badge">
                    <div className="event-day">{day}</div>
                    <div className="event-month">{month}</div>
                  </div>
                  
                  {/* Event details */}
                  <div className="event-content">
                    <span className="event-tag">{evt.tag || 'WORSHIP'}</span>
                    <h3 className="event-title">{evt.title}</h3>
                    
                    <div className="event-meta">
                      <div className="event-meta-item">
                        <Clock size={16} style={{ color: 'var(--accent-rose)' }} />
                        <span>{evt.time}</span>
                      </div>
                      <div className="event-meta-item">
                        <MapPin size={16} style={{ color: 'var(--accent-rose)' }} />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                    
                    {evt.description && (
                      <p className="event-description">{evt.description}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
