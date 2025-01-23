import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Validasi token saat aplikasi dimuat
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL;
        await axios.get(`${API_URL}/api/auth/validate`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsLoading(true); // Mulai loading state
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const API_URL = import.meta.env.VITE_API_URL;
        await axios.post(`${API_URL}/api/auth/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setIsLoading(false); // Selesai loading
      navigate('/login', { replace: true }); // Gunakan replace untuk mencegah navigasi kembali
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 