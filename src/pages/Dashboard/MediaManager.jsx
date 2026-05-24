import React, { useEffect, useState } from 'react';
import { Trash2, PlusCircle, Save } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'holyFaithMediaItems';
const categories = ['Worship', 'Events', 'Ministries', 'Youth', 'Other'];

export default function MediaManager() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ caption: '', category: categories[0], preview: '' });
  const [newVideo, setNewVideo] = useState({ title: '', url: '', category: categories[0] });
  const [statusMessage, setStatusMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPhotos(parsed.photos || []);
        setVideos(parsed.videos || []);
      } catch (err) {
        console.error('Failed to read saved media data:', err);
      }
    }
  }, []);

  const saveMedia = (nextPhotos, nextVideos) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ photos: nextPhotos, videos: nextVideos }));
  };

  const handlePhotoFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewPhoto((prev) => ({ ...prev, preview: reader.result || '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = (event) => {
    event.preventDefault();
    if (!newPhoto.preview) {
      setStatusMessage('Please choose a photo to upload.');
      return;
    }
    setSaving(true);
    const nextPhotos = [
      ...photos,
      {
        id: Date.now(),
        caption: newPhoto.caption || 'Photo description',
        category: newPhoto.category,
        src: newPhoto.preview,
      },
    ];
    setPhotos(nextPhotos);
    saveMedia(nextPhotos, videos);
    setNewPhoto({ caption: '', category: categories[0], preview: '' });
    setStatusMessage('Photo added to gallery.');
    setSaving(false);
  };

  const handleAddVideo = (event) => {
    event.preventDefault();
    if (!newVideo.url.trim() || !newVideo.title.trim()) {
      setStatusMessage('Please add a title and video URL.');
      return;
    }
    setSaving(true);
    const nextVideos = [
      ...videos,
      {
        id: Date.now(),
        title: newVideo.title,
        url: newVideo.url.trim(),
        category: newVideo.category,
      },
    ];
    setVideos(nextVideos);
    saveMedia(photos, nextVideos);
    setNewVideo({ title: '', url: '', category: categories[0] });
    setStatusMessage('Video link added to gallery.');
    setSaving(false);
  };

  const removePhoto = (id) => {
    const nextPhotos = photos.filter((item) => item.id !== id);
    setPhotos(nextPhotos);
    saveMedia(nextPhotos, videos);
    setStatusMessage('Photo removed.');
  };

  const removeVideo = (id) => {
    const nextVideos = videos.filter((item) => item.id !== id);
    setVideos(nextVideos);
    saveMedia(photos, nextVideos);
    setStatusMessage('Video removed.');
  };

  const renderVideoPreview = (item) => {
    const isYoutube = item.url.includes('youtube.com') || item.url.includes('youtu.be');
    const isVideoFile = item.url.match(/\.(mp4|webm|ogg)$/i);

    if (isYoutube) {
      const videoIdMatch = item.url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      if (videoId) {
        return (
          <iframe
            title={item.title}
            width="100%"
            height="180"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
    }

    if (isVideoFile) {
      return (
        <video controls width="100%" style={{ borderRadius: '8px' }}>
          <source src={item.url} type={`video/${item.url.split('.').pop()}`} />
          Your browser does not support this video format.
        </video>
      );
    }

    return (
      <div className="video-link-preview">
        <a href={item.url} target="_blank" rel="noreferrer">
          Open video link
        </a>
      </div>
    );
  };

  return (
    <div>
      <div className="dashboard-actions-bar">
        <div>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Photo & Video Gallery</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Upload and manage church photos, plus add service or event videos for the public gallery.
          </p>
        </div>
        <button type="button" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }} disabled>
          <Save size={16} /> Save to browser
        </button>
      </div>

      {statusMessage && (
        <div className="success-message" style={{ marginBottom: '24px' }}>
          {statusMessage}
        </div>
      )}

      <div className="grid-2">
        <div className="dashboard-card">
          <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Add a New Photo
          </h4>

          <div className="form-group">
            <label>Photo caption</label>
            <input
              type="text"
              className="form-control"
              value={newPhoto.caption}
              placeholder="Describe this photo"
              onChange={(event) => setNewPhoto((prev) => ({ ...prev, caption: event.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="form-control"
              value={newPhoto.category}
              onChange={(event) => setNewPhoto((prev) => ({ ...prev, category: event.target.value }))}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Upload image</label>
            <input type="file" accept="image/*" onChange={handlePhotoFile} className="form-control" />
          </div>

          {newPhoto.preview && (
            <div className="image-upload-wrapper" style={{ marginBottom: '20px' }}>
              <img src={newPhoto.preview} alt="Preview" className="image-preview" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Preview before saving</p>
              </div>
            </div>
          )}

          <button type="button" className="btn btn-primary" onClick={handleAddPhoto} disabled={saving}>
            <PlusCircle size={16} /> Add Photo
          </button>
        </div>

        <div className="dashboard-card">
          <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Add a New Video
          </h4>

          <div className="form-group">
            <label>Video title</label>
            <input
              type="text"
              className="form-control"
              value={newVideo.title}
              placeholder="Service highlight, sermon, or event video"
              onChange={(event) => setNewVideo((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="form-control"
              value={newVideo.category}
              onChange={(event) => setNewVideo((prev) => ({ ...prev, category: event.target.value }))}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Video URL</label>
            <input
              type="url"
              className="form-control"
              value={newVideo.url}
              placeholder="YouTube link or MP4 URL"
              onChange={(event) => setNewVideo((prev) => ({ ...prev, url: event.target.value }))}
            />
          </div>

          <button type="button" className="btn btn-primary" onClick={handleAddVideo} disabled={saving}>
            <PlusCircle size={16} /> Add Video
          </button>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Photo Gallery
        </h4>
        {photos.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No photos added yet. Use the form above to upload church images.</p>
        ) : (
          <div className="media-gallery-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="media-card">
                <img src={photo.src} alt={photo.caption} style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', minHeight: '160px' }} />
                <div style={{ marginTop: '12px' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{photo.caption}</p>
                  <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{photo.category}</p>
                </div>
                <button type="button" className="btn-icon delete" onClick={() => removePhoto(photo.id)} title="Remove photo">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-card" style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Video Gallery
        </h4>
        {videos.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No videos added yet. Paste a YouTube or MP4 URL to add one.</p>
        ) : (
          <div className="media-gallery-grid">
            {videos.map((video) => (
              <div key={video.id} className="media-card">
                <div style={{ marginBottom: '12px' }}>{renderVideoPreview(video)}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{video.title}</p>
                  <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{video.category}</p>
                </div>
                <button type="button" className="btn-icon delete" onClick={() => removeVideo(video.id)} title="Remove video">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
