import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Kasir from './pages/Kasir';
import Riwayat from './pages/Riwayat';
import './styles/Riwayat.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Kasir />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kasir" element={<Kasir />} />
        <Route path="/riwayat" element={<Riwayat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 