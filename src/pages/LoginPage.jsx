// src/pages/LoginPage.jsx - Responsive dengan API authentication
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check screen size dan authentication status
  useEffect(() => {
    // Check if user sudah login
    if (apiService.isAuthenticated()) {
      navigate('/dashboard');
    }

    // Check screen size untuk responsive
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener untuk resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error saat user mengetik
    if (error) {
      setError('');
    }
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!formData.username || !formData.password) {
      setError('Username dan password harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call API login
      const response = await apiService.login(formData.username, formData.password);
      
      // Login berhasil
      console.log('Login successful:', response);
      
      // Navigate ke dashboard dengan username
      navigate('/dashboard', { 
        state: { username: response.user.username } 
      });
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Test connection dengan backend
  const testConnection = async () => {
    try {
      await apiService.healthCheck();
      setError('');
      alert('Koneksi ke server berhasil!');
    } catch {
      setError('Tidak dapat terhubung ke server. Pastikan backend berjalan.');
    }
  };

  // Desktop Layout
  const renderDesktopLayout = () => (
    <div className="page-container">
      <div className="background-overlay" />

      {/* Logo kiri */}
      <div className="square-logo">
        <img src="/logo-kiri.png" alt="Logo Kiri" />
      </div>

      {/* Logo kanan */}
      <div className="logo-circle small">
        <img src="/logo-3.png" alt="Logo 1" />
      </div>
      <div className="logo-circle small main">
        <img src="/logo-1.png" alt="Main Logo" />
      </div>
      <div className="logo-circle small">
        <img src="/logo-2.png" alt="Logo 2" />
      </div>

      {/* Form login */}
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login to GreenHouse 🌿</h2>

        {/* Error message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Username field */}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        {/* Password field */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        {/* Login button */}
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        {/* Test connection button */}
        <button 
          type="button" 
          className="test-connection-btn"
          onClick={testConnection}
          disabled={loading}
        >
          Test Connection
        </button>

        {/* Demo credentials info */}
        <div className="demo-info">
          <p>Demo credentials:</p>
          <p><strong>Username:</strong> admin</p>
          <p><strong>Password:</strong> admin123</p>
        </div>
      </form>
    </div>
  );

  // Mobile Layout
  const renderMobileLayout = () => (
    <div className="page-container">
      <div className="background-overlay" />

      {/* Mobile Header Logo */}
      <div className="mobile-header-logo">
        <div className="square-logo">
          <img src="/logo-kiri.png" alt="Logo Brand" />
        </div>
      </div>

      {/* Mobile Content Container */}
      <div className="mobile-content-container">
        {/* Form login */}
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login to GreenHouse 🌿</h2>

          {/* Error message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Username field */}
          <label htmlFor="username-mobile">Username</label>
          <input
            type="text"
            id="username-mobile"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={loading}
            required
          />

          {/* Password field */}
          <label htmlFor="password-mobile">Password</label>
          <input
            type="password"
            id="password-mobile"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            required
          />

          {/* Login button */}
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          {/* Test connection button */}
          <button 
            type="button" 
            className="test-connection-btn"
            onClick={testConnection}
            disabled={loading}
          >
            Test Connection
          </button>

          {/* Demo credentials info */}
          <div className="demo-info">
            <p>Demo credentials:</p>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </form>
      </div>

      {/* Mobile Bottom Logos */}
      <div className="mobile-bottom-logos">
        <div className="mobile-logo">
          <img src="/logo-3.png" alt="Logo 1" />
        </div>
        <div className="mobile-logo">
          <img src="/logo-1.png" alt="Main Logo" />
        </div>
        <div className="mobile-logo">
          <img src="/logo-2.png" alt="Logo 2" />
        </div>
      </div>
    </div>
  );

  // Render berdasarkan screen size
  return isMobile ? renderMobileLayout() : renderDesktopLayout();
}

export default LoginPage;