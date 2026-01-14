import { Link } from 'react-router-dom';
import type { Painting } from '../types/painting';
import './PaintingCard.css';

interface PaintingCardProps {
  painting: Painting;
}

export function PaintingCard({ painting }: PaintingCardProps) {
  const isAvailable = painting.status === 'available';

  return (
    <Link to={`/painting/${painting.id}`} className="painting-card">
      <div className="painting-image-container">
        <img 
          src={painting.thumbnailUrl} 
          alt={painting.title}
          loading="lazy"
          className="painting-image"
        />
        {!isAvailable && (
          <div className="sold-overlay">
            <span className="sold-badge">Sold</span>
          </div>
        )}
      </div>
      <div className="painting-info">
        <h3 className="painting-title">{painting.title}</h3>
        <p className="painting-details">
          {painting.width} × {painting.height} cm
        </p>
        <p className="painting-price">€{painting.price}</p>
      </div>
    </Link>
  );
}

