import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { Plus, Edit2, Trash2, X, BookOpen, Users, Heart, Music, Globe, Baby, Church, Flame, HandHeart } from 'lucide-react';

const availableIcons = [
  { name: 'BookOpen', label: 'Book / Bible Study' },
  { name: 'Users', label: 'People / Youth Group' },
  { name: 'Heart', label: 'Heart / Fellowship' },
  { name: 'Music', label: 'Music / Choir' },
  { name: 'Globe', label: 'Globe / Outreach' },
  { name: 'Baby', label: 'Baby / Children Church' },
  { name: 'Church', label: 'Church Building' },
  { name: 'Flame', label: 'Flame / Holy Spirit' },
  { name: 'HandHeart', label: 'Hand Heart / Charity' }
];

// Helper icon resolver for table preview
const IconPreview = ({ name }) => {
  const map = { BookOpen, Users, Heart, Music, Globe, Baby, Church, Flame, HandHeart };
  const IconComponent = map[name] || BookOpen;
  return <IconComponent size={18} style={{ color: 'var(--accent-rose)' }} />;
};

export default function MinistriesManager() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMinistries = () => {
    setLoading(true);
    apiRequest('/api/public-data')
      .then(res => {
        setMinistries(res.ministries);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading ministries:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const openAddModal = () => {
    setEditingMinistry(null);
    setTitle('');
    setDescription('');
    setIcon('BookOpen');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ministry) => {
    setEditingMinistry(ministry);
    setTitle(ministry.title);
    setDescription(ministry.description);
    setIcon(ministry.icon || 'BookOpen');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!title || !description) {
      setError("Please fill out all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      if (editingMinistry) {
        // Edit mode
        await apiRequest(`/api/ministries/${editingMinistry.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, description, icon })
        });
      } else {
        // Create mode
        await apiRequest('/api/ministries', {
          method: 'POST',
          body: JSON.stringify({ title, description, icon })
        });
      }
      setIsModalOpen(false);
      fetchMinistries();
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.message || "Failed to save ministry details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ministry? This action cannot be undone.")) {
      return;
    }

    try {
      await apiRequest(`/api/ministries/${id}`, {
        method: 'DELETE'
      });
      fetchMinistries();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.message || "Failed to delete ministry.");
    }
  };

  return (
    <div>
      <div className="dashboard-actions-bar">
        <div>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Manage Ministries</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add, update, or remove active church groups and ministries</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={16} />
          Add Ministry
        </button>
      </div>

      {loading ? (
        <div>Loading ministries database...</div>
      ) : (
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Icon</th>
                <th>Title</th>
                <th>Description</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ministries.map((min) => (
                <tr key={min.id}>
                  <td>
                    <div style={{ width: '36px', height: '36px', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center' }}>
                      <IconPreview name={min.icon} />
                    </div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{min.title}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {min.description}
                  </td>
                  <td>
                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                      <button onClick={() => openEditModal(min)} className="btn-icon edit" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(min.id)} className="btn-icon delete" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ministries.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '30px' }}>
                    No ministries found. Click "Add Ministry" to create one.
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
              <h3>{editingMinistry ? 'Edit Ministry' : 'Add New Ministry'}</h3>
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
                  <label>Ministry Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    placeholder="e.g. Bible Study"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Icon Identifier</label>
                  <select 
                    value={icon} 
                    onChange={(e) => setIcon(e.target.value)} 
                    className="form-control"
                  >
                    {availableIcons.map(item => (
                      <option key={item.name} value={item.name}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Short Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    rows="4"
                    placeholder="Provide a brief summary of what this ministry does, meeting times, etc."
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : 'Save Ministry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
