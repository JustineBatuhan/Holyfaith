import React, { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'holyFaithMediaItems';
const categories = ['All', 'Worship', 'Events', 'Ministries', 'Youth', 'Other'];

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter((photo) => photo.category === selectedCategory);

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter((video) => video.category === selectedCategory);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPhotos(parsed.photos || []);
        setVideos(parsed.videos || []);
      } catch (err) {
        console.error('Failed to read gallery data:', err);
      }
    }
  }, []);

  const openPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="page-section" style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Church Media Gallery</h1>
        <p style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Browse church photos and videos shared from the admin dashboard.
        </p>

        <div className="gallery-filter-bar">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
            {selectedCategory === 'All' ? 'Photos' : `${selectedCategory} Photos`}
          </h2>
          <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {filteredPhotos.length} photo{filteredPhotos.length === 1 ? '' : 's'} shown.
          </p>
          {filteredPhotos.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>
              No photos are published for this category yet.
            </p>
          ) : (
            <div className="media-gallery-grid">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="media-card">
                  <button
                    type="button"
                    className="media-card-button"
                    onClick={() => openPhoto(photo)}
                    aria-label={`View ${photo.caption} larger`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="media-card-image"
                    />
                  </button>
                  <div style={{ marginTop: '14px' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{photo.caption}</p>
                    <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{photo.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>
            {selectedCategory === 'All' ? 'Videos' : `${selectedCategory} Videos`}
          </h2>
          <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {filteredVideos.length} video{filteredVideos.length === 1 ? '' : 's'} shown.
          </p>
          {filteredVideos.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>
              No videos are published for this category yet.
            </p>
          ) : (
            <div className="media-gallery-grid">
              {filteredVideos.map((video) => {
                const isYoutube = video.url.includes('youtube.com') || video.url.includes('youtu.be');
                const isVideoFile = video.url.match(/\.(mp4|webm|ogg)$/i);
                return (
                  <div key={video.id} className="media-card">
                    {isYoutube ? (
                      <iframe
                        title={video.title}
                        width="100%"
                        height="220"
                        src={`https://www.youtube.com/embed/${video.url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]+)/)?.[1]}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: '8px' }}
                      />
                    ) : isVideoFile ? (
                      <video controls width="100%" style={{ borderRadius: '8px' }}>
                        <source src={video.url} type={`video/${video.url.split('.').pop()}`} />
                        Your browser does not support this video format.
                      </video>
                    ) : (
                      <div className="video-link-preview" style={{ padding: '16px', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <a href={video.url} target="_blank" rel="noreferrer">
                          Open video link
                        </a>
                      </div>
                    )}

                    <div style={{ marginTop: '14px' }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>{video.title}</p>
                      <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{video.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox} role="dialog" aria-modal="true">
          <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Close image preview">
              ×
            </button>
            <img src={selectedPhoto.src} alt={selectedPhoto.caption} className="lightbox-image" />
            <div className="lightbox-caption">
              <p style={{ margin: 0, fontWeight: 600 }}>{selectedPhoto.caption}</p>
              <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{selectedPhoto.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
