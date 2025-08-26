// Dashboard.jsx - Updated untuk GreenhouseAPI dengan format yang sama
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/GreenhouseAPI'; // Update import

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || { username: 'User' };
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);

  // STATE UNTUK API DATA - SAMA PERSIS DENGAN ORIGINAL
  const [roomData, setRoomData] = useState({
    humidity: 0,        // Default values agar tidak kosong
    temperature: 0,
    light_intensity: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // LOAD DATA DARI GREENHOUSE API
  useEffect(() => {
    loadRoomConditions();
    
    // Auto refresh setiap 30 detik
    const interval = setInterval(loadRoomConditions, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // FUNCTION UNTUK LOAD DATA - UPDATED UNTUK GREENHOUSE API
  const loadRoomConditions = async () => {
    try {
      setError(null);
      
      // Fetch latest readings menggunakan GreenhouseAPI
      const response = await apiService.getLatestReadings();
      
      if (response && response.readings) {
        // Format data untuk dashboard menggunakan built-in formatter
        const dashboardData = apiService.formatForDashboard(response.readings);
        
        if (dashboardData) {
          setRoomData({
            humidity: dashboardData.humidity || 44,
            temperature: dashboardData.temperature || 20,
            light_intensity: dashboardData.light_intensity || 54
          });
        } else {
          // Jika tidak ada data GZ1, cari manual atau gunakan default
          setRoomData({
            humidity: 44,
            temperature: 20,
            light_intensity: 54
          });
          setError('Data greenhouse tidak tersedia');
        }
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (err) {
      console.error('Error loading room conditions:', err);
      setError('Koneksi ke server gagal');
      
      // Tetap pakai default values jika error
      setRoomData({
        humidity: 44,
        temperature: 20,
        light_intensity: 54
      });
    } finally {
      setLoading(false);
    }
  };

  // FUNCTION UNTUK REFRESH - SAMA PERSIS
  const handleRefreshData = () => {
    setLoading(true);
    loadRoomConditions();
  };

  // NAVIGATION FUNCTIONS - SAMA PERSIS DENGAN ORIGINAL
  const handleSeladaClick = () => {
    navigate('/selada');
  };

  const handleCabaiClick = () => {
    navigate('/cabai');
  };

  const handleMelonClick = () => {
    navigate('/melon');
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  const handlePlantClick = () => {
    setIsPlantDropdownOpen(!isPlantDropdownOpen);
  };

  const handlePlantMenuClick = (plantType) => {
    setIsPlantDropdownOpen(false);
    navigate(`/${plantType}`);
  };

  return (
    <div className="dashboard-container">
      {/* Video Section - SAMA PERSIS DENGAN ORIGINAL */}
      <div className="video-section">
        <video 
          className="dashboard-video" 
          autoPlay 
          muted 
          loop
          poster="/greenhouse-poster.jpg"
        >
          <source src="/greenhouse-video.mp4" type="video/mp4" />
          <source src="/greenhouse-video.webm" type="video/webm" />
        </video>
      </div>

      {/* Logo Container - SAMA PERSIS DENGAN ORIGINAL */}
      <div className="logo-container">
        <div className="logo-item" onClick={handleHomeClick}>
          <img src="/home-icon.png" alt="Home" />
          <span>Home</span>
        </div>
        <div className="logo-item plant-menu-container">
          <div className="logo-item-inner" onClick={handlePlantClick}>
            <img src="/plant-icon.png" alt="Plant" />
            <span>Plant</span>
            <span className={`dropdown-arrow ${isPlantDropdownOpen ? 'open' : ''}`}>▼</span>
          </div>
          
          {/* Plant Dropdown Menu */}
          <div className={`plant-dropdown ${isPlantDropdownOpen ? 'show' : ''}`}>
            <div className="dropdown-item" onClick={() => handlePlantMenuClick('selada')}>
              <span>Selada</span>
            </div>
            <div className="dropdown-item" onClick={() => handlePlantMenuClick('cabai')}>
              <span>Cabai</span>
            </div>
            <div className="dropdown-item" onClick={() => handlePlantMenuClick('melon')}>
              <span>Melon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bar - SAMA DENGAN ORIGINAL + Refresh button yang tidak menggangu */}
      <div className="top-bar">
        <div className="greeting">HI!!! <strong>{username.toUpperCase()}</strong></div>
        <div className="title">MANAGE YOUR PLANT</div>
        
        {/* REFRESH BUTTON - HANYA DI DESKTOP, TIDAK MENGGANGU MOBILE */}
        {!loading && error && (
          <div className="refresh-hint" onClick={handleRefreshData}>
            <span title="Refresh Data">↻</span>
          </div>
        )}
      </div>

      {/* Mobile Indicators - SAMA PERSIS STRUKTUR, CUMA ISI DATA BERUBAH */}
      <div className="mobile-indicators">
        <div className="mobile-indicator kelembapan">
          <div className="circle">
            {loading ? '...' : `${roomData.humidity.toFixed ? roomData.humidity.toFixed(1) : roomData.humidity}%`}
          </div>
          <span className="label">KELEMBAPAN</span>
        </div>
        <div className="mobile-indicator suhu">
          <div className="circle">
            {loading ? '...' : `${roomData.temperature.toFixed ? roomData.temperature.toFixed(1) : roomData.temperature}°C`}
          </div>
          <span className="label">SUHU</span>
        </div>
        <div className="mobile-indicator cahaya">
          <div className="circle">
            {loading ? '...' : `${roomData.light_intensity.toFixed ? roomData.light_intensity.toFixed(0) : roomData.light_intensity} LUX`}
          </div>
          <span className="label">INTENSITAS CAHAYA</span>
        </div>
      </div>

      {/* Main Content - SAMA PERSIS DENGAN ORIGINAL */}
      <div className="main-content">
        <div className="selection-box">
          <h3>SELECTION BOX</h3>

          <div className="plant-layout">
            <div className="box box-cabai" onClick={handleCabaiClick}>
              CABAI 
              <button className="more">More</button>
              {/* Mobile image inside box */}
              <div className="mobile-plant-image">
                <img src="/cabai.jpg" alt="Cabai" />
              </div>
            </div>
            <div className="box box-selada" onClick={handleSeladaClick}>
              SELADA 
              <button className="more">More</button>
              {/* Mobile image inside box */}
              <div className="mobile-plant-image">
                <img src="/selada.jpg" alt="Selada" />
              </div>
            </div>
            <div className="box box-melon" onClick={handleMelonClick}>
              MELON 
              <button className="more">More</button>
              {/* Mobile image inside box */}
              <div className="mobile-plant-image">
                <img src="/melon.jpg" alt="Melon" />
              </div>
            </div>

            {/* Desktop image section - Hidden on mobile */}
            <div className="image-section">
              <div className="image-row">
                <img src="/cabai.jpg" alt="Cabai" />
                <img src="/selada.jpg" alt="Selada" />
              </div>
              <div className="image-row">
                <img src="/melon.jpg" alt="Melon" />
              </div>
            </div>

            <div className="monitoring-text">
              
            </div>
          </div>
        </div>

        {/* Desktop Room Condition - SAMA PERSIS STRUKTUR, CUMA ISI DATA BERUBAH */}
        <div className="room-condition">
          <h3>ROOM CONDITION</h3>
          
          <div className="condition-box kelembapan">
            <span className="label">KELEMBAPAN</span>
            <div className="circle">
              {loading ? '...' : `${roomData.humidity.toFixed ? roomData.humidity.toFixed(1) : roomData.humidity}%`}
            </div>
          </div>
          
          <div className="condition-box suhu">
            <div className="circle">
              {loading ? '...' : `${roomData.temperature.toFixed ? roomData.temperature.toFixed(1) : roomData.temperature}°C`}
            </div>
            <span className="label">SUHU</span>
          </div>
          
          <div className="condition-box cahaya">
            <span className="label">INTENSITAS CAHAYA</span>
            <div className="circle">
              {loading ? '...' : `${roomData.light_intensity.toFixed ? roomData.light_intensity.toFixed(0) : roomData.light_intensity} LUX`}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar - SAMA PERSIS DENGAN ORIGINAL */}
      <div className="footer-bar">
        <div className="welcome-text">WELCOME TO GREENHOUSE</div>
        {/* MINIMAL ERROR INFO DI FOOTER JIKA ADA ERROR */}
        {error && (
          <div className="connection-status" onClick={handleRefreshData}>
            <span>⚠️ {error} - Tap to retry</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;