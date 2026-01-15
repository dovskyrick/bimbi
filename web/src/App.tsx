import { useState, useEffect } from 'react';
import { usePaintings } from './hooks/usePaintings';
import type { Painting } from './types/painting';
import './App.css';

function App() {
  const { paintings, loading, error } = usePaintings();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">Bimbi Gallery</h1>
          <p className="subtitle">Original Oil Paintings</p>
        </nav>
        <main className="gallery">
          <div className="loading-state">
            <p>Loading gallery...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">Bimbi Gallery</h1>
          <p className="subtitle">Original Oil Paintings</p>
        </nav>
        <main className="gallery">
          <div className="error-state">
            <p>Error loading paintings: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  // Filter to show only available paintings (or all if you want to show sold too)
  const displayPaintings = paintings.filter(p => p.available);

  if (displayPaintings.length === 0) {
    return (
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">Bimbi Gallery</h1>
          <p className="subtitle">Original Oil Paintings</p>
        </nav>
        <main className="gallery">
          <div className="empty-state">
            <p>No paintings available yet.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className={`navbar ${scrolled ? 'hidden' : ''}`}>
        <h1 className="logo">Bimbi Gallery</h1>
        <p className="subtitle">Original Oil Paintings</p>
      </nav>

      <main className="gallery">
        {displayPaintings.map((painting, index) => (
          <PaintingSection key={painting.id} painting={painting} index={index} />
        ))}
      </main>

      <footer className="footer">
        <p>© 2024 Bimbi Gallery • Lisbon, Portugal</p>
      </footer>
    </div>
  );
}

function PaintingSection({ painting, index }: { painting: Painting; index: number }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(`painting-${painting.id}`);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate visibility (0 to 1) with sharper fade zone
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;
      const distance = Math.abs(elementCenter - windowCenter);
      
      // Smaller fade zone - only fade when far from center
      const fadeZoneStart = windowHeight * 0.3; // Start fading at 30% of window height from center
      const fadeZoneSize = windowHeight * 0.4;   // Fade over 40% of window height
      
      let visibility = 1;
      if (distance > fadeZoneStart) {
        visibility = Math.max(0, 1 - (distance - fadeZoneStart) / fadeZoneSize);
      }

      setVisible(visibility);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [painting.id]);

  const isLeft = index % 2 === 0;

  return (
    <section
      id={`painting-${painting.id}`}
      className="painting-section"
      style={{ opacity: visible }}
    >
      <div className={`painting-content ${isLeft ? 'left' : 'right'}`}>
        <div className="painting-image">
          <img src={painting.imageUrl} alt={painting.title} loading="lazy" />
        </div>

        <div className="painting-info">
          <h2 className="painting-title">{painting.title}</h2>
          <p className="painting-price">€{painting.price.toLocaleString('pt-PT')}</p>

          <div className="painting-details">
            <p><strong>Medium:</strong> {painting.medium}</p>
            <p><strong>Dimensions:</strong> {painting.width} × {painting.height} cm</p>
            <p><strong>Year:</strong> {painting.year}</p>
          </div>

          <p className="painting-description">{painting.description}</p>

          <button className="contact-btn">Inquire</button>
        </div>
      </div>
    </section>
  );
}

export default App;
