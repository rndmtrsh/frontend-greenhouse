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

  // Function untuk navigasi zona
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

      {/* Back to Dashboard Button */}
      <div className="back-button-container">
        <button className="back-btn" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>
      </div>

      {/* Main Plant Button */}
      <div className="main-plant-container">
        <button 
          className="main-plant-btn" 
          onClick={() => handleZoneClick('melon')}
        >
          MELON
        </button>
      </div>

      {/* Zone Buttons */}
      <div className="zone-buttons-container">
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
      </div>

      {/* Central Title */}
      <div className="central-title">
        <h2>MONITORING YOUR PLANT</h2>
      </div>
      
      <div className="melon-container">
        <img src="/melon.jpg" alt="Melon" className="melon-img" />
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

export default Melon;