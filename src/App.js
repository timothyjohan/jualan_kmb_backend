import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 