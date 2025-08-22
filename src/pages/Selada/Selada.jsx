// Selada.jsx - Responsive Structure with 4 Zones
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Selada.css';

const Selada = () => {
  const navigate = useNavigate();
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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

  // Function untuk navigasi zona
  const handleZoneClick = (zone) => {
    if (zone === 'selada') {
      // Jika klik SELADA, tetap di halaman ini (tidak ada navigasi)
      return;
    } else {
      // Navigasi ke zona tertentu
      navigate(`/selada/${zone}`);
    }
  };

  return (
    <div className="selada-container">
      {/* Navigation Header */}
      <div className="navigation-header">
        <div className="logo-container">
          <div className="logo-item" onClick={handleHomeClick}>
            <img src="/home-icon.png" alt="Home" />
            <span>Home</span>
          </div>
          
          <div className="plant-menu-container">
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
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <button className="back-button" onClick={handleBackToDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar Navigation */}
        <div className="sidebar-navigation">
          <h2 className="nav-title">Selada Zones</h2>
          <div className="zone-buttons-grid">
            <button 
              className="zone-btn" 
              onClick={() => handleZoneClick('zona1')}
            >
              <span className="zone-number">1</span>
              <span className="zone-label">Zona</span>
            </button>
            <button 
              className="zone-btn" 
              onClick={() => handleZoneClick('zona2')}
            >
              <span className="zone-number">2</span>
              <span className="zone-label">Zona</span>
            </button>
            <button 
              className="zone-btn" 
              onClick={() => handleZoneClick('zona3')}
            >
              <span className="zone-number">3</span>
              <span className="zone-label">Zona</span>
            </button>
            <button 
              className="zone-btn" 
              onClick={() => handleZoneClick('zona4')}
            >
              <span className="zone-number">4</span>
              <span className="zone-label">Zona</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Plant Info Section */}
          <div className="plant-info-section">
            <div className="section-header">
              <h2 className="section-title">Selada Overview</h2>
              <div className="section-indicator">
                <div className="indicator-dot"></div>
                <span className="indicator-text">Active</span>
              </div>
            </div>

            <div className="plant-info-grid">
              {/* Plant Image Card */}
              <div className="plant-image-card">
                <div className="image-container">
                  <img 
                    src="/selada.jpg" 
                    alt="Selada Plant" 
                    className="plant-image"
                  />
                  <div className="image-overlay">
                    <span className="plant-status">Healthy</span>
                  </div>
                </div>
                <div className="image-caption">
                  <h4>Fresh Lettuce</h4>
                  <p>Growing perfectly in controlled environment</p>
                </div>
              </div>

              {/* Plant Description Card */}
              <div className="plant-description-card">
                <div className="description-header">
                  <h3>Growth Progress</h3>
                  <div className="growth-indicator">
                    <div className="growth-bar">
                      <div className="growth-progress"></div>
                    </div>
                    <span className="growth-text">92%</span>
                  </div>
                </div>

                <div className="description-content">
                  <p>
                    <strong>Selada (Lactuca sativa)</strong> adalah tanaman sayuran hijau dari keluarga 
                    Asteraceae yang dikenal dengan daun segar dan renyah. Tanaman ini sedang dalam tahap 
                    <strong> pertumbuhan optimal</strong> dengan kondisi lingkungan hidroponik yang terkontrol.
                  </p>
                  
                  <p>
                    Saat ini selada berada dalam fase pembentukan daun dengan tingkat <strong>pH nutrisi, 
                    suhu, dan TDS</strong> yang terkontrol dengan baik di setiap zona. <strong>Prediksi panen</strong> 
                    dalam 1-2 minggu ke depan dengan kualitas daun yang sangat segar.
                  </p>
                  
                  <p>
                    Tanaman selada dikenal memiliki daun yang <strong>segar dan renyah</strong>, 
                    kaya akan vitamin A, K, dan C, serta mengandung antioksidan yang baik untuk kesehatan. 
                    Sayuran ini sangat cocok untuk salad dan makanan sehat karena kandungan seratnya 
                    yang tinggi dapat membantu <strong>pencernaan yang sehat</strong> secara alami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-bar">
        <div className="footer-content">
          <div className="welcome-text">
            Welcome to Greenhouse - Selada Monitoring System
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selada;