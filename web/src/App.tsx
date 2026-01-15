import { useState, useEffect } from 'react';
import './App.css';

// Hardcoded painting data for testing
const paintings = [
  {
    id: 'A',
    title: 'Whispers of Dawn',
    image: '/A.jpg',
    price: 450,
    medium: 'Oil on canvas',
    dimensions: '60 × 80 cm',
    year: 2024,
    description: 'A serene exploration of light breaking through morning mist. Soft brushstrokes capture the ephemeral moment when night surrenders to day.',
  },
  {
    id: 'B',
    title: 'Urban Echoes',
    image: '/B.jpg',
    price: 520,
    medium: 'Oil on canvas',
    dimensions: '70 × 90 cm',
    year: 2024,
    description: 'The rhythm of city life translated into bold strokes and vibrant colors. A celebration of movement and energy in urban spaces.',
  },
  {
    id: 'C',
    title: 'Coastal Reverie',
    image: '/C.jpg',
    price: 380,
    medium: 'Oil on canvas',
    dimensions: '50 × 70 cm',
    year: 2024,
    description: 'Where land meets sea, this piece captures the eternal dance of waves against ancient shores. A meditation on nature\'s timeless beauty.',
  },
];

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      <nav className={`navbar ${scrolled ? 'hidden' : ''}`}>
        <h1 className="logo">Bimbi Gallery</h1>
        <p className="subtitle">Original Oil Paintings</p>
      </nav>

      <main className="gallery">
        {paintings.map((painting, index) => (
          <PaintingSection key={painting.id} painting={painting} index={index} />
        ))}
      </main>

      <footer className="footer">
        <p>© 2024 Bimbi Gallery • Lisbon, Portugal</p>
      </footer>
    </div>
  );
}

function PaintingSection({ painting, index }: { painting: typeof paintings[0]; index: number }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(`painting-${painting.id}`);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate visibility (0 to 1)
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;
      const distance = Math.abs(elementCenter - windowCenter);
      const maxDistance = windowHeight / 2 + rect.height / 2;
      const visibility = Math.max(0, 1 - distance / maxDistance);

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
          <img src={painting.image} alt={painting.title} />
        </div>

        <div className="painting-info">
          <h2 className="painting-title">{painting.title}</h2>
          <p className="painting-price">€{painting.price.toLocaleString('pt-PT')}</p>

          <div className="painting-details">
            <p><strong>Medium:</strong> {painting.medium}</p>
            <p><strong>Dimensions:</strong> {painting.dimensions}</p>
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
