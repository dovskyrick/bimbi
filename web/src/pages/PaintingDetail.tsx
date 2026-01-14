import { useParams, Link } from 'react-router-dom';
import { usePainting } from '../hooks/usePainting';
import './PaintingDetail.css';

export function PaintingDetail() {
  const { id } = useParams<{ id: string }>();
  const { painting, loading, error } = usePainting(id!);

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !painting) {
    return (
      <div className="detail-container">
        <div className="error">{error || 'Painting not found'}</div>
        <Link to="/" className="back-link">← Back to gallery</Link>
      </div>
    );
  }

  const isAvailable = painting.status === 'available';

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">← Back to gallery</Link>
      
      <div className="detail-content">
        <div className="detail-image-section">
          <div className="detail-image-container">
            <img 
              src={painting.imageUrl} 
              alt={painting.title}
              className="detail-image"
            />
            {!isAvailable && (
              <div className="sold-overlay">
                <span className="sold-badge">Sold</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-info-section">
          <h1 className="detail-title">{painting.title}</h1>
          
          <div className="detail-metadata">
            <p><strong>Medium:</strong> {painting.medium}</p>
            <p><strong>Dimensions:</strong> {painting.width} × {painting.height} cm</p>
            <p><strong>Year:</strong> {painting.year}</p>
            <p className="detail-price">€{painting.price}</p>
          </div>

          <div className="detail-description">
            <p>{painting.description}</p>
          </div>

          {isAvailable ? (
            <div className="detail-actions">
              <p className="coming-soon">
                Shopping cart coming soon! <br />
                For now, please contact us to purchase.
              </p>
            </div>
          ) : (
            <div className="detail-actions">
              <p className="sold-message">This painting has been sold.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

