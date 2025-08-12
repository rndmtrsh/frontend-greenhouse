// Dashboard.jsx
import React, { useState } from 'react';
import './Dashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || { username: 'User' };
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);

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
      {/* Video Section */}
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

      {/* Logo Container */}
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

      <div className="top-bar">
        <div className="greeting">HI!!! <strong>{username.toUpperCase()}</strong></div>
        <div className="title">MANAGE YOUR PLANT</div>
      </div>

      <div className="main-content">
        <div className="selection-box">
          <h3>SELECTION BOX</h3>

          <div className="plant-layout">
            <div className="box">
              CABAI 
              <button className="more" onClick={handleCabaiClick}>More</button>
            </div>
            <div className="box">
              SELADA 
              <button className="more" onClick={handleSeladaClick}>More</button>
            </div>
            <div className="box">
              MELON 
              <button className="more" onClick={handleMelonClick}>More</button>
            </div>

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
              MONITORING<br />
              FOR<br />
              KLIK<br />
            </div>
          </div>
        </div>

        <div className="room-condition">
          <h3>ROOM CONDITION</h3>
          <div className="condition-box kelembapan">
            <span className="label">KELEMBAPAN</span>
            <div className="circle">44%</div>
          </div>
          <div className="condition-box suhu">
            <div className="circle">20°C</div>
            <span className="label">SUHU</span>
          </div>
          <div className="condition-box cahaya">
            <span className="label">INTENSITAS CAHAYA</span>
            <div className="circle">54 LUX</div>
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <div className="welcome-text">WELCOME TO GREENHOUSE</div>
      </div>
    </div>
  );
};

export default Dashboard;