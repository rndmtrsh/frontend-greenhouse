import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Zonamelon.css';

const Zona3melon = () => {
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

  const handleZoneClick = (zone) => {
    if (zone === 'melon') {
      navigate('/melon');
    } else {
      navigate(`/melon/${zone}`);
    }
  };

  return (
    <div className="zona3melon-container">
      {/* Logo Container - Same as Cabai.jsx */}
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

      {/* Header */}
      <div className="header">
        <button className="back-btn" onClick={handleBackToDashboard}>
          ← DASHBOARD
        </button>
        <h1 className="page-title">MANAGE YOUR PLANT</h1>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <button className="zone-btn" onClick={() => handleZoneClick('melon')}>MELON</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona1')}>ZONA 1</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona2')}>ZONA 2</button>
          <button className="zone-btn active" onClick={() => handleZoneClick('zona3')}>ZONA 3</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona4')}>ZONA 4</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona5')}>ZONA 5</button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Zone Badge */}
          <div className="zone-badge">
            ZONE 3
          </div>

          {/* Monitoring Cards - Only 3 cards (no Moist) */}
          <div className="monitoring-cards">
            <div className="metric-card">
              <div className="metric-icon">
                <img src="/ph-icon.png" alt="pH" />
              </div>
              <div className="metric-value">7.1</div>
              <div className="metric-label">pH</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <img src="/temp-icon.png" alt="Temperature" />
              </div>
              <div className="metric-value">29°C</div>
              <div className="metric-label">Temperature</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <img src="/ec-icon.png" alt="EC" />
              </div>
              <div className="metric-value">1.9</div>
              <div className="metric-label">EC</div>
            </div>
          </div>

          {/* Charts Section - Only 3 charts (no Moist) */}
          <div className="charts-section">
            <div className="chart-container">
              <div className="chart-label">Temp</div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d="M20,150 Q100,50 200,75 T380,125"
                    stroke="#4ade80"
                    strokeWidth="3"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="tempGradientMelon3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#4ade80', stopOpacity: 0.3}} />
                      <stop offset="100%" style={{stopColor: '#4ade80', stopOpacity: 0.1}} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20,150 Q100,50 200,75 T380,125 L380,200 L20,200 Z"
                    fill="url(#tempGradientMelon3)"
                  />
                </svg>
                <div className="chart-time-labels">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-label">pH</div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d="M20,140 Q100,70 200,95 T380,135"
                    stroke="#4ade80"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M20,140 Q100,70 200,95 T380,135 L380,200 L20,200 Z"
                    fill="url(#tempGradientMelon3)"
                  />
                </svg>
                <div className="chart-time-labels">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-label">EC</div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d="M20,160 Q100,90 200,115 T380,155"
                    stroke="#4ade80"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M20,160 Q100,90 200,115 T380,155 L380,200 L20,200 Z"
                    fill="url(#tempGradientMelon3)"
                  />
                </svg>
                <div className="chart-time-labels">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="footer-bar">
        <div className="welcome-text">
          WELCOME TO GREENHOUSE
        </div>
      </div>
    </div>
  );
};

export default Zona3melon;