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
        <button className="back-btn" onClick={handleBackToDashboard}>
          ← DASHBOARD
        </button>
        <h1 className="page-title">MANAGE YOUR PLANT</h1>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar with Zone Navigation */}
        <div className="sidebar">
          <button 
            className="zone-btn active" 
            onClick={() => handleZoneClick('cabai')}
          >
            CABAI
          </button>
          <button 
            className="zone-btn" 
            onClick={() => handleZoneClick('zona1')}
          >
            ZONA 1
          </button>
          <button 
            className="zone-btn" 
            onClick={() => handleZoneClick('zona2')}
          >
            ZONA 2
          </button>
          <button 
            className="zone-btn" 
            onClick={() => handleZoneClick('zona3')}
          >
            ZONA 3
          </button>
          <button 
            className="zone-btn" 
            onClick={() => handleZoneClick('zona4')}
          >
            ZONA 4
          </button>
          <button 
            className="zone-btn" 
            onClick={() => handleZoneClick('zona5')}
          >
            ZONA 5
          </button>
          <button 
            className="zone-btn" 
            onClick={() => handleZoneClick('zona6')}
          >
            ZONA 6
          </button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Cabai Title - Center Top */}
          <div className="cabai-title-container">
            <h2 className="cabai-title">MONITORING YOUR PLANT</h2>
          </div>

          <div className="monitoring-section">
            <div className="plant-info">
              <div className="plant-image">
                <img 
                  src="/cabai.jpg" 
                  alt="Chili Plant" 
                />
              </div>
              
              <div className="plant-description">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Suspendisse tincidunt, ex a euismod posuere, justo risus fermentum 
                  tortor, a molestie velit arcu eget est. Vestibulum scelerisque velit ligula, 
                  sed finibus nibh rutrum vitae. Fusce viverra nulla nec mi porttitor, sit 
                  amet rutrum massa commodo. Sed consectetur, nunc vel tincidunt hendrerit, 
                  libero massa efficitur nulla, a cursus magna nisi quis nunc.
                </p>
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

export default Cabai;