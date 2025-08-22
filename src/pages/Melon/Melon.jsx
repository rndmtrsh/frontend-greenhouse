// Melon.jsx - Responsive Structure - Updated for 2 Zones Only
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Melon.css';

const Melon = () => {
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

  // Function untuk navigasi zona - Updated for 2 zones only
  const handleZoneClick = (zone) => {
    if (zone === 'melon') {
      // Jika klik MELON, tetap di halaman ini (tidak ada navigasi)
      return;
    } else {
      // Navigasi ke zona tertentu
      navigate(`/melon/${zone}`);
    }
  };

  return (
    <div className="melon-container">
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
        {/* Sidebar Navigation - Updated for 2 zones only */}
        <div className="sidebar-navigation">
          <h2 className="nav-title">Melon Zones</h2>
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
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Plant Info Section */}
          <div className="plant-info-section">
            <div className="section-header">
              <h2 className="section-title">Melon Overview</h2>
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
                    src="/melon.jpg" 
                    alt="Melon Plant" 
                    className="plant-image"
                  />
                  <div className="image-overlay">
                    <span className="plant-status">Healthy</span>
                  </div>
                </div>
                <div className="image-caption">
                  <h4>Sweet Cantaloupe</h4>
                  <p>Growing beautifully in optimal conditions</p>
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
                    <span className="growth-text">85%</span>
                  </div>
                </div>

                <div className="description-content">
                  <p>
                    <strong>Melon (Cucumis melo)</strong> adalah tanaman buah dari keluarga labu-labuan 
                    yang dikenal dengan rasa manis dan segar. Tanaman ini sedang dalam tahap 
                    <strong> pertumbuhan optimal</strong> dengan kondisi lingkungan yang mendukung.
                  </p>
                  
                  <p>
                    Saat ini melon berada dalam fase pembentukan buah dengan tingkat kelembaban 
                    dan suhu yang terkontrol dengan baik. <strong>Prediksi panen</strong> dalam 
                    2-3 minggu ke depan dengan kualitas buah yang sangat baik.
                  </p>
                  
                  <p>
                    Tanaman melon dikenal memiliki daging buah yang <strong>manis dan segar</strong>, 
                    kaya akan vitamin A dan C, serta mengandung antioksidan yang baik untuk kesehatan. 
                    Buah ini sangat cocok untuk dinikmati saat cuaca panas karena kandungan airnya 
                    yang tinggi dapat membantu <strong>menghidrasi tubuh</strong> secara alami.
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
            Welcome to Greenhouse - Melon Monitoring System
          </div>
        </div>
      </div>
    </div>
  );
};

export default Melon;