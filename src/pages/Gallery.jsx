// src/components/Gallery.jsx
import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import '../styles/Gallery.css';

const galleryData = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    category: 'Bridal',
    title: 'Bridal Makeup'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    category: 'Hair',
    title: 'Hair Styling'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400',
    category: 'Facial',
    title: 'Facial Treatment'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
    category: 'Makeup',
    title: 'Makeup Artistry'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400',
    category: 'Spa',
    title: 'Spa & Wellness'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    category: 'Nails',
    title: 'Nail Art'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
    category: 'Bridal',
    title: 'Bridal Package'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
    category: 'Hair',
    title: 'Hair Color'
  }
];

const categories = ['All', 'Bridal', 'Hair', 'Facial', 'Makeup', 'Spa', 'Nails'];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    768: 2,
    480: 1
  };

  const filteredImages = selectedCategory === 'All' 
    ? galleryData 
    : galleryData.filter(img => img.category === selectedCategory);

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        {/* Header */}
        <div className="gallery-header">
          <span className="gallery-subtitle">Our Work</span>
          <h1 className="gallery-title">Gallery Showcase</h1>
          <p className="gallery-description">
            Explore our collection of beautiful transformations and styling masterpieces
          </p>
        </div>

        {/* Category Filter */}
        <div className="gallery-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Gallery */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="gallery-masonry"
          columnClassName="gallery-masonry-column"
        >
          {filteredImages.map((image) => (
            <div 
              key={image.id} 
              className="gallery-item"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.title}
                loading="lazy"
                className="gallery-image"
              />
              <div className="gallery-overlay">
                <span className="gallery-category">{image.category}</span>
                <h3 className="gallery-item-title">{image.title}</h3>
                <button className="view-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  View
                </button>
              </div>
            </div>
          ))}
        </Masonry>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage.url} alt={selectedImage.title} />
              <div className="lightbox-info">
                <span className="lightbox-category">{selectedImage.category}</span>
                <h3 className="lightbox-title">{selectedImage.title}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;