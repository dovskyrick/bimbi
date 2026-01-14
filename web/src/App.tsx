import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Gallery } from './pages/Gallery';
import { PaintingDetail } from './pages/PaintingDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/painting/:id" element={<PaintingDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
