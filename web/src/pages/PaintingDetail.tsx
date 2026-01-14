import { useParams, Link } from 'react-router-dom';
import { usePainting } from '../hooks/usePaintings';
import './PaintingDetail.css';

export function PaintingDetail() {
  const { id } = useParams<{ id: string }>();
  const { painting, loading, error } = usePainting(id);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !painting) {
    return (
      <div className="container">
        <div className="error">{error || 'Painting not found'}</div>
        <Link to="/" className="back-link">← Back to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← Back to Gallery</Link>
      
      <div className="painting-detail">
        <div className="painting-detail-image">
          <img src={painting.imageUrl} alt={painting.title} />
          {!painting.available && (
            <div className="sold-overlay">
              <span className="sold-text">Sold</span>
            </div>
          )}
        </div>

        <div className="painting-detail-info">
          <h1>{painting.title}</h1>
          
          <div className="detail-section">
            <p className="price">€{painting.price.toLocaleString('pt-PT')}</p>
            {painting.available && (
              <p className="availability">Available</p>
            )}
          </div>

          <div className="detail-section">
            <h2>Details</h2>
            <dl className="details-list">
              <dt>Medium</dt>
              <dd>{painting.medium}</dd>
              
              <dt>Dimensions</dt>
              <dd>{painting.width} × {painting.height} cm</dd>
              
              <dt>Year</dt>
              <dd>{painting.year}</dd>
            </dl>
          </div>

          <div className="detail-section">
            <h2>Description</h2>
            <p className="description">{painting.description}</p>
          </div>

          {painting.tags && painting.tags.length > 0 && (
            <div className="detail-section">
              <div className="tags">
                {painting.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {painting.available && (
            <div className="detail-section">
              <p className="contact-note">
                Interested in this piece? Contact us to purchase.
              </p>
              {/* Cart button will be added in Phase 2 */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
