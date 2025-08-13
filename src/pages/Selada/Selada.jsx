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

  return (
    <div className="selada-container">
      {/* Menu Container */}
      <div className="menu-container">
        <div className="menu-item" onClick={handleHomeClick}>
          <img src="/home-icon.png" alt="Home" />
          <span>Home</span>
        </div>
        <div className="menu-item plant-menu-container">
          <div className="menu-item-inner" onClick={handlePlantClick}>
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
        <div className="header-buttons">
          <div className="back-button" onClick={handleBackToDashboard}>
            <span>← DASHBOARD</span>
          </div>
          <div className="selada-button">
            <span>SELADA</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Left Section - Monitoring */}
        <div className="left-section">
          <h2 className="section-title">MONITORING YOUR PLANT</h2>
          
          {/* Plant Image */}
          <div className="plant-image-container">
            <img 
              src="/selada.jpg" 
              alt="Selada Plant"
              className="plant-image"
            />
          </div>

          {/* Description Box */}
          <div className="description-box">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Suspendisse tincidunt, ex a euismod posuere, justo 
              risus fermentum tortor, a molestie velit arcu eget est. 
              Vestibulum scelerisque velit ligula, sed finibus nibh 
              rutrum vitae. Fusce viverra nulla nec mi porttitor, sit 
              amet rutrum massa commodo.
            </p>
          </div>
        </div>

        {/* Center Section - Plant Condition */}
        <div className="center-section">
          <div className="plant-condition-card">
            <h3 className="condition-title">PLANT CONDITION</h3>
            
            {/* PH Nutrisi */}
            <div className="condition-item">
              <span className="condition-label">PH NUTRISI</span>
              <div className="condition-indicator ph-nutrisi">
                <span className="indicator-value">44%</span>
              </div>
            </div>

            {/* Suhu */}
            <div className="condition-item suhu-item">
              <div className="condition-indicator suhu-indicator">
                <span className="indicator-value">20°C</span>
              </div>
              <span className="condition-label">SUHU</span>
            </div>

            {/* TDS */}
            <div className="condition-item">
              <span className="condition-label">TDS</span>
              <div className="condition-indicator tds-indicator">
                <span className="indicator-value">54 LUX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Plant Image */}
        <div className="right-section">
          <img 
            src="/selada.jpg" 
            alt="Selada Plant Vertical"
            className="vertical-plant-image"
          />
        </div>
      </div>

      {/* Bottom Navigation - Footer */}
      <div className="footer-bar">
        <div className="welcome-text">
          WELCOME TO GREENHOUSE
        </div>
      </div>
    </div>
  );
};

export default Selada;