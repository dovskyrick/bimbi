import { usePaintings } from '../hooks/usePaintings';
import { PaintingCard } from '../components/PaintingCard';
import './Gallery.css';

export function Gallery() {
  const { paintings, loading, error } = usePaintings();

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="loading">Loading paintings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const availablePaintings = paintings.filter(p => p.status === 'available');
  const soldPaintings = paintings.filter(p => p.status === 'sold');

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h1>Bimbi</h1>
        <p className="subtitle">Original oil paintings</p>
      </header>

      {availablePaintings.length > 0 && (
        <section className="gallery-section">
          <h2>Available</h2>
          <div className="paintings-grid">
            {availablePaintings.map(painting => (
              <PaintingCard key={painting.id} painting={painting} />
            ))}
          </div>
        </section>
      )}

      {soldPaintings.length > 0 && (
        <section className="gallery-section sold-section">
          <h2>Sold</h2>
          <div className="paintings-grid">
            {soldPaintings.map(painting => (
              <PaintingCard key={painting.id} painting={painting} />
            ))}
          </div>
        </section>
      )}

      {paintings.length === 0 && (
        <div className="empty-state">
          <p>No paintings yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

