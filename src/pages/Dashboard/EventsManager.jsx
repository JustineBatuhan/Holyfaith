import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { Plus, Edit2, Trash2, X, Calendar, Clock, MapPin, Tag } from 'lucide-react';

const tagOptions = ['WORSHIP', 'STUDY', 'OUTREACH', 'YOUTH', 'FELLOWSHIP'];

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('Main Sanctuary');
  const [tag, setTag] = useState('WORSHIP');
  const [description, setDescription] = useState('');
  
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = () => {
    setLoading(true);
    apiRequest('/api/public-data')
      .then(res => {
        // Sort chronologically by date
        const sorted = [...res.events].sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading events:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle('');
    
    // Default to today's date formatted as YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    
    setTime('');
    setLocation('Main Sanctuary');
    setTag('WORSHIP');
    setDescription('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location || 'Main Sanctuary');
    setTag(event.tag || 'WORSHIP');
    setDescription(event.description || '');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!title || !date || !time) {
      setError("Title, Date, and Time are required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = { title, date, time, location, tag, description };
      
      if (editingEvent) {
        // Edit mode
        await apiRequest(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        // Create mode
        await apiRequest('/api/events', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Save event failed:", err);
      setError(err.message || "Failed to save event details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await apiRequest(`/api/events/${id}`, {
        method: 'DELETE'
      });
      fetchEvents();
    } catch (err) {
      console.error("Delete event failed:", err);
      alert(err.message || "Failed to delete event.");
    }
  };

  return (
    <div>
      <div className="dashboard-actions-bar">
        <div>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Manage Events</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Schedule church services, meetings, and special community gathers</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {loading ? (
        <div>Loading events scheduler...</div>
      ) : (
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Date</th>
                <th>Event Title</th>
                <th style={{ width: '150px' }}>Time</th>
                <th style={{ width: '150px' }}>Location</th>
                <th style={{ width: '120px' }}>Category</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id}>
                  <td style={{ fontWeight: '500' }}>
                    {new Date(evt.date).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td style={{ fontWeight: '600' }}>{evt.title}</td>
                  <td>{evt.time}</td>
                  <td>{evt.location}</td>
                  <td>
                    <span className="event-tag" style={{ margin: 0 }}>
                      {evt.tag}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                      <button onClick={() => openEditModal(evt)} className="btn-icon edit" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(evt.id)} className="btn-icon delete" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '30px' }}>
                    No events scheduled. Click "Add Event" to schedule one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingEvent ? 'Edit Event Schedule' : 'Schedule New Event'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {error && (
                  <div style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: 'var(--error-color)', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                    {error}
                  </div>
                )}
                
                <div className="form-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    placeholder="e.g. Sunday Holy Eucharist"
                    required
                  />
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label>Event Date *</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category Tag</label>
                    <select 
                      value={tag} 
                      onChange={(e) => setTag(e.target.value)} 
                      className="form-control"
                    >
                      {tagOptions.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '16px', marginTop: '8px' }}>
                  <div className="form-group">
                    <label>Meeting Time *</label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="form-control"
                      placeholder="e.g. 9:30 AM or 7:00 PM"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="form-control"
                      placeholder="e.g. Main Sanctuary"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '8px' }}>
                  <label>Event Details / Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    rows="3"
                    placeholder="Add brief details about the event structure, who should attend, etc."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
