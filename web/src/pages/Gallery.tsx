import { Link } from 'react-router-dom';
import { usePaintings } from '../hooks/usePaintings';
import './Gallery.css';

export function Gallery() {
  const { paintings, loading, error } = usePaintings();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const availablePaintings = paintings.filter(p => p.available);
  const soldPaintings = paintings.filter(p => !p.available);

  return (
    <div className="container">
      <header className="gallery-header">
        <h1>Bimbi Gallery</h1>
        <p className="subtitle">Original Oil Paintings</p>
      </header>

      {availablePaintings.length > 0 && (
        <section className="gallery-section">
          <h2>Available Works</h2>
          <div className="gallery-grid">
            {availablePaintings.map(painting => (
              <Link
                key={painting.id}
                to={`/painting/${painting.id}`}
                className="painting-card"
              >
                <div className="painting-image-wrapper">
                  <img
                    src={painting.thumbnailUrl}
                    alt={painting.title}
                    className="painting-image"
                    loading="lazy"
                  />
                </div>
                <div className="painting-info">
                  <h3 className="painting-title">{painting.title}</h3>
                  <p className="painting-details">
                    {painting.width} × {painting.height} cm
                  </p>
                  <p className="painting-price">
                    €{painting.price.toLocaleString('pt-PT')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {soldPaintings.length > 0 && (
        <section className="gallery-section">
          <h2>Sold Works</h2>
          <div className="gallery-grid">
            {soldPaintings.map(painting => (
              <Link
                key={painting.id}
                to={`/painting/${painting.id}`}
                className="painting-card sold"
              >
                <div className="painting-image-wrapper">
                  <img
                    src={painting.thumbnailUrl}
                    alt={painting.title}
                    className="painting-image"
                    loading="lazy"
                  />
                  <div className="sold-badge">Sold</div>
                </div>
                <div className="painting-info">
                  <h3 className="painting-title">{painting.title}</h3>
                  <p className="painting-details">
                    {painting.width} × {painting.height} cm
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {paintings.length === 0 && (
        <div className="empty-state">
          <p>No paintings available yet.</p>
        </div>
      )}
    </div>
  );
}
