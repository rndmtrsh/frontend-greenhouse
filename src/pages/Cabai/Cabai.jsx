import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cabai.css';

const Cabai = () => {
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
    if (zone === 'cabai') {
      // Jika klik CABAI, tetap di halaman ini (tidak ada navigasi)
      return;
    } else {
      // Navigasi ke zona tertentu
      navigate(`/cabai/${zone}`);
    }
  };

  return (
    <div className="cabai-container">
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
          <div className="greeting" onClick={handleBackToDashboard}>
            <span className="greeting-text">
              <strong>← DASHBOARD</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar Navigation */}
        <div className="sidebar-navigation">
          <h3 className="nav-title">PLANT ZONES</h3>
          <div className="zone-buttons-grid">
            <button 
              className="zone-btn active" 
              onClick={() => handleZoneClick('cabai')}
            >
              <span className="zone-number">🌶️</span>
              <span className="zone-label">CABAI</span>
            </button>
            <button 
              className="zone-btn" 
              onClick={() => handleZoneClick('zona1')}
            >
              <span className="zone-number">1</span>
              <span className="zone-label">ZONA 1</span>
            </button>
            <button 
              className="zone-btn" 
              onClick={() => handleZoneClick('zona2')}
            >
              <span className="zone-number">2</span>
              <span className="zone-label">ZONA 2</span>
            </button>
            <button 
              className="zone-btn" 
              onClick={() => handleZoneClick('zona3')}
            >
              <span className="zone-number">3</span>
              <span className="zone-label">ZONA 3</span>
            </button>
            <button 
              className="zone-btn" 
              onClick={() => handleZoneClick('zona4')}
            >
              <span className="zone-number">4</span>
              <span className="zone-label">ZONA 4</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Plant Info Section */}
          <div className="plant-info-section">
            <div className="section-header">
              <h2 className="section-title">MONITORING YOUR PLANT</h2>
              <div className="section-indicator">
                <div className="indicator-dot"></div>
                <span className="indicator-text">LIVE STATUS</span>
              </div>
            </div>

            <div className="plant-info-grid">
              {/* Plant Image Card */}
              <div className="plant-image-card">
                <div className="image-container">
                  <img 
                    src="/cabai.jpg" 
                    alt="Chili Plant"
                    className="plant-image"
                  />
                  <div className="image-overlay">
                    <span className="plant-status">HEALTHY</span>
                  </div>
                </div>
                <div className="image-caption">
                  <h4>Capsicum Annuum</h4>
                  <p>Red Chili Pepper Plant</p>
                </div>
              </div>
              
              {/* Plant Description Card */}
              <div className="plant-description-card">
                <div className="description-header">
                  <h3>Plant Overview</h3>
                  <div className="growth-indicator">
                    <div className="growth-bar">
                      <div className="growth-progress" style={{width: '75%'}}></div>
                    </div>
                    <span className="growth-text">75% Growth</span>
                  </div>
                </div>
                
                <div className="description-content">
                  <p>
                    <strong>Cabai</strong> atau chili pepper merupakan tanaman yang berasal dari Amerika Tengah dan 
                    Selatan, kini menjadi salah satu komoditas penting di Indonesia. Tanaman ini termasuk dalam 
                    keluarga Solanaceae dan memiliki nama ilmiah <strong>Capsicum annuum</strong>.
                  </p>
                  <p>
                    Cabai mengandung <strong>capsaicin</strong> yang memberikan rasa pedas dan memiliki banyak manfaat 
                    kesehatan seperti meningkatkan metabolisme, anti-inflamasi, dan kaya akan vitamin C. 
                    Di Indonesia, cabai merupakan bumbu dapur yang sangat penting dan memiliki nilai ekonomi tinggi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="footer-bar">
        <div className="footer-content">
          <div className="welcome-text">
            WELCOME TO GREENHOUSE
          </div>
          <div className="footer-info">
            <span>🌱 Smart Agriculture System</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cabai;