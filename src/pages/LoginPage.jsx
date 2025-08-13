import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Kirim data username ke dashboard
      navigate('/dashboard', { state: { username } });
    }, 1500); // Simulasi 1.5 detik loading
  };

  return (
    <div className="page-container">
      <div className="background-overlay" />

      {/* Mobile Layout */}
      {isMobile ? (
        <>
          {/* Mobile Header Logo - Brand logo memanjang di atas */}
          <div className="mobile-header-logo">
            <div className="square-logo">
              <img src="/logo-kiri.png" alt="Logo Brand" />
            </div>
          </div>

          {/* Mobile Content Container */}
          <div className="mobile-content-container">
            {/* Form Login */}
            <form className="login-form" onSubmit={handleLogin}>
              <h2>Login to GreenHouse 🌿</h2>

              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter password" 
                required 
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* 3 Logo Circles - DI BAWAH FORM LOGIN - UKURAN SAMA */}
            <div className="mobile-bottom-logos">
              <div className="mobile-logo">
                <img src="/logo-3.png" alt="Logo 3" />
              </div>
              <div className="mobile-logo">
                <img src="/logo-1.png" alt="Main Logo" />
              </div>
              <div className="mobile-logo">
                <img src="/logo-2.png" alt="Logo 2" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Desktop Layout - Original tetap sama */}
          <div className="square-logo">
            <img src="/logo-kiri.png" alt="Logo Kiri" />
          </div>

          <div className="logo-circle small">
            <img src="/logo-3.png" alt="Logo 1" />
          </div>
          <div className="logo-circle small main">
            <img src="/logo-1.png" alt="Main Logo" />
          </div>
          <div className="logo-circle small">
            <img src="/logo-2.png" alt="Logo 2" />
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login to GreenHouse 🌿</h2>

            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter password" 
              required 
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default LoginPage;