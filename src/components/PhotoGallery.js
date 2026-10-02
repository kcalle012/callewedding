import React, { useState, useEffect } from 'react';
import siteConfig from '../siteConfig';
import Modal from './ui/Modal';

function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('all');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const allPhotos = [];
        
        // Load static photos from config
        const staticPhotos = (siteConfig.photoGallery?.staticPhotos || []).map((url, idx) => ({
          id: `static-${idx}`,
          url: url,
          caption: `Photo ${idx + 1}`,
          date: new Date().toISOString(),
          category: 'static',
        }));
        allPhotos.push(...staticPhotos);
        
        // Load memory photos from ourStory
        const memoryPhotos = (siteConfig.ourStory?.memories?.images || []).map((img, idx) => ({
          id: `memory-${idx}`,
          url: img,
          caption: `Memory ${idx + 1}`,
          date: new Date().toISOString(),
          category: 'memories',
        }));
        allPhotos.push(...memoryPhotos);
        
        // Load uploaded photos from Google Drive if enabled
        if (siteConfig.photoGallery?.showUploadedPhotos) {
          try {
            const response = await fetch('/.netlify/functions/get-photos');
            const data = await response.json();
            
            if (data.success && data.photos) {
              allPhotos.push(...data.photos);
            } else {
              console.warn('Failed to load uploaded photos:', data.message);
            }
          } catch (err) {
            console.warn('Error loading uploaded photos:', err);
            // Don't show error to user, just log it
            // Photos from Drive are optional
          }
        }
        
        setPhotos(allPhotos);
      } catch (err) {
        console.error('Error loading photos:', err);
        setError('Failed to load photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === filter);

  const categories = ['all', ...new Set(photos.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="page-header-title">
            {siteConfig.photoGallery?.title || 'Photo Gallery'}
          </h1>
          <p className="text-lg text-apple-gray-600 max-w-2xl mx-auto">
            {siteConfig.photoGallery?.subtitle || 'Memories captured from our special day'}
          </p>
        </div>

        {/* Filter */}
        {siteConfig.photoGallery?.enableFiltering && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === category
                    ? 'bg-apple-gray-900 text-white shadow-apple'
                    : 'bg-white text-apple-gray-700 hover:bg-apple-gray-100 shadow-apple'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-gray-900 mx-auto mb-4"></div>
            <p className="text-apple-gray-600">Loading photos...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-apple-gray-900 text-white rounded-full hover:bg-apple-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Photo Grid */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    if (photo.thumbnailUrl && photo.thumbnailUrl !== photo.url) {
                      e.target.src = photo.url;
                    }
                  }}
                />
                {/* Caption overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-end pb-3 px-2">
                  {photo.caption && (
                    <p className="text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2"
                      style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '0.8rem' }}>
                      {photo.caption}
                    </p>
                  )}
                  {photo.uploaderName && (
                    <p className="text-white/70 text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                      style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: '0.06em' }}>
                      — {photo.uploaderName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-apple-gray-500 text-lg">No photos available yet.</p>
            <p className="text-apple-gray-400 mt-2">
              {siteConfig.photoGallery?.showUploadedPhotos
                ? 'Upload photos to see them here!'
                : 'Check back soon for updates!'}
            </p>
          </div>
        )}

        {/* Lightbox Modal */}
        <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)}>
          {selectedPhoto && (
            <div className="p-6">
              <img
                src={selectedPhoto.downloadUrl || selectedPhoto.url}
                alt={selectedPhoto.caption || 'Photo'}
                className="w-full h-auto rounded-lg mb-4 max-h-[70vh] object-contain mx-auto"
                onError={(e) => {
                  // Fallback to thumbnail if main image fails
                  if (selectedPhoto.thumbnailUrl && selectedPhoto.thumbnailUrl !== selectedPhoto.url) {
                    e.target.src = selectedPhoto.thumbnailUrl;
                  }
                }}
              />
              {selectedPhoto.caption && (
                <p className="text-gray-700 text-center mb-1"
                  style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1rem' }}>
                  {selectedPhoto.caption}
                </p>
              )}
              {selectedPhoto.uploaderName && (
                <p className="text-gray-400 text-sm text-center mb-1"
                  style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: '0.06em' }}>
                  — {selectedPhoto.uploaderName}
                </p>
              )}
              {selectedPhoto.date && (
                <p className="text-apple-gray-500 text-sm text-center mb-4">
                  {new Date(selectedPhoto.date).toLocaleDateString()}
                </p>
              )}
              {siteConfig.photoGallery?.enableDownload && (
                <div className="mt-4 text-center">
                  <a
                    href={selectedPhoto.downloadUrl || selectedPhoto.url}
                    download={selectedPhoto.name || 'photo'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-apple-gray-900 text-white rounded-full hover:bg-apple-gray-800 transition-colors"
                  >
                    Download Photo
                  </a>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default PhotoGallery;

