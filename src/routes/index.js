import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import KasirPage from '../pages/KasirPage';
import RiwayatPage from '../pages/RiwayatPage';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/kasir" 
        element={
          <ProtectedRoute>
            <KasirPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/riwayat" 
        element={
          <ProtectedRoute>
            <RiwayatPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/kasir" />} />
    </Routes>
  );
};

export default AppRoutes; 