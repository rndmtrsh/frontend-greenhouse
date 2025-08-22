// Zona1cabai.jsx - Fixed refresh interval error
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api'; // Using your existing api.js
import './Zonacabai.css';

const Zona4cabai = () => {
  const navigate = useNavigate();
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);
  
  // State for zone data
  const [zoneData, setZoneData] = useState({
    zoneId: 4,
    plantType: 'cabai',
    metrics: {
      ph: 0,
      temperature: 0,
      ec: 0,
      moisture: 0
    },
    chartData: {
      temperature: [],
      moisture: [],
      ph: [],
      ec: []
    },
    lastUpdated: null,
    status: 'offline'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [isOnline, setIsOnline] = useState(apiService.isOnline());

  // Fetch data from database using existing api service
  const fetchZoneData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!apiService.isAuthenticated()) {
        setError('Authentication required');
        return;
      }

      // Fetch zone data and plant info in parallel
      const [zoneResult, plantResult] = await Promise.all([
        apiService.getZoneData('cabai', 1),
        apiService.getPlantInfo('cabai')
      ]);
      
      setZoneData(zoneResult);
      setPlantInfo(plantResult);
      
    } catch (err) {
      setError(err.message || 'Failed to load zone data');
      console.error('Error fetching zone data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data
  useEffect(() => {
    // Initial fetch
    fetchZoneData();
    
    // Set up auto-refresh using the subscription method from api service
    const unsubscribe = apiService.subscribeToZoneUpdates(
      'cabai', 
      4, 
      (data) => {
        setZoneData(data);
        setError(null);
      },
      30000 // 30 seconds interval
    );
    
    // Monitor online status
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Cleanup
    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    await fetchZoneData();
  };

  // Navigation handlers
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
    if (zone === 'cabai') {
      navigate('/cabai');
    } else {
      navigate(`/cabai/${zone}`);
    }
  };

  // Generate SVG path for charts
  const generateSVGPath = (data) => {
    if (!data || data.length === 0) return '';
    
    const width = 400;
    const height = 200;
    const padding = 20;
    
    const values = data.map(d => d.value).filter(v => v !== null && v !== undefined);
    if (values.length === 0) return '';
    
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;
    
    const points = data.map((point, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');
    
    return `M${points.replace(/,/g, ' ').replace(/ /g, ' L').substring(2)}`;
  };

  // Format metric values
  const formatMetricValue = (value, type) => {
    if (loading || value === null || value === undefined) return '--';
    
    switch (type) {
      case 'temperature':
        return `${value.toFixed(1)}°C`;
      case 'moisture':
        return `${Math.round(value)}%`;
      case 'ph':
        return value.toFixed(1);
      case 'ec':
        return value.toFixed(1);
      default:
        return value;
    }
  };

  // Check if metric is within optimal range
  const getMetricStatus = (value, type) => {
    if (!plantInfo || !plantInfo.optimalConditions || value === null) return 'normal';
    
    const conditions = plantInfo.optimalConditions[type];
    if (!conditions) return 'normal';
    
    if (value < conditions.min || value > conditions.max) return 'warning';
    if (Math.abs(value - conditions.optimal) <= (conditions.max - conditions.min) * 0.1) return 'optimal';
    return 'normal';
  };

  // Get connection status
  const getConnectionStatus = () => {
    if (!isOnline) return 'offline';
    if (loading) return 'connecting';
    if (error) return 'offline';
    return 'online';
  };

  // Handle authentication redirect
  const handleAuthRedirect = () => {
    navigate('/');
  };

  return (
    <div className="zona4cabai-container">
      {/* Logo Container */}
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
        <div className="header-actions">
          <button 
            className={`refresh-btn ${loading ? 'loading' : ''}`} 
            onClick={handleRefresh} 
            disabled={loading}
            title="Refresh data"
          >
            <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>↻</span>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <div className={`status-indicator ${getConnectionStatus()}`} title={`System is ${getConnectionStatus()}`}>
            <span className="status-dot"></span>
            {getConnectionStatus()}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">
            {error === 'Authentication required' ? 
              'Session expired. Please login again.' : 
              error
            }
          </span>
          {error === 'Authentication required' ? (
            <button className="error-retry" onClick={handleAuthRedirect}>Login</button>
          ) : (
            <button className="error-retry" onClick={handleRefresh}>Retry</button>
          )}
        </div>
      )}

      {/* Offline Message */}
      {!isOnline && (
        <div className="error-message" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
          <span className="error-icon">📶</span>
          <span className="error-text">No internet connection. Showing cached data.</span>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <button className="zone-btn" onClick={() => handleZoneClick('cabai')}>CABAI</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona1')}>ZONA 1</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona2')}>ZONA 2</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona3')}>ZONA 3</button>
          <button className="zone-btn active" onClick={() => handleZoneClick('zona4')}>ZONA 4</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona5')}>ZONA 5</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona6')}>ZONA 6</button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Zone Badge */}
          <div className="zone-badge">
            <span className="zone-title">ZONE 4</span>
            {zoneData.lastUpdated && (
              <span className="last-updated">
                Last updated: {new Date(zoneData.lastUpdated).toLocaleTimeString()}
              </span>
            )}
            {apiService.getCurrentUser() && (
              <span className="user-info">
                User: {apiService.getCurrentUser().username}
              </span>
            )}
          </div>

          {/* Monitoring Cards */}
          <div className="monitoring-cards">
            <div className={`metric-card ${loading ? 'loading' : ''} ${getMetricStatus(zoneData.metrics.ph, 'ph')}`}>
              <div className="metric-icon">
                <img src="/ph-icon.png" alt="pH" />
              </div>
              <div className="metric-value">
                {formatMetricValue(zoneData.metrics.ph, 'ph')}
              </div>
              <div className="metric-label">pH</div>
              {plantInfo && (
                <div className="metric-range">
                  Optimal: {plantInfo.optimalConditions.ph?.optimal}
                </div>
              )}
            </div>

            <div className={`metric-card ${loading ? 'loading' : ''} ${getMetricStatus(zoneData.metrics.temperature, 'temperature')}`}>
              <div className="metric-icon">
                <img src="/temp-icon.png" alt="Temperature" />
              </div>
              <div className="metric-value">
                {formatMetricValue(zoneData.metrics.temperature, 'temperature')}
              </div>
              <div className="metric-label">Temperature</div>
              {plantInfo && (
                <div className="metric-range">
                  Optimal: {plantInfo.optimalConditions.temperature?.optimal}°C
                </div>
              )}
            </div>

            <div className={`metric-card ${loading ? 'loading' : ''} ${getMetricStatus(zoneData.metrics.ec, 'ec')}`}>
              <div className="metric-icon">
                <img src="/ec-icon.png" alt="EC" />
              </div>
              <div className="metric-value">
                {formatMetricValue(zoneData.metrics.ec, 'ec')}
              </div>
              <div className="metric-label">EC</div>
              {plantInfo && (
                <div className="metric-range">
                  Optimal: {plantInfo.optimalConditions.ec?.optimal}
                </div>
              )}
            </div>

            <div className={`metric-card ${loading ? 'loading' : ''} ${getMetricStatus(zoneData.metrics.moisture, 'moisture')}`}>
              <div className="metric-icon">
                <img src="/moist-icon.png" alt="Moist" />
              </div>
              <div className="metric-value">
                {formatMetricValue(zoneData.metrics.moisture, 'moisture')}
              </div>
              <div className="metric-label">Moist</div>
              {plantInfo && (
                <div className="metric-range">
                  Optimal: {plantInfo.optimalConditions.moisture?.optimal}%
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-container">
              <div className="chart-label">Temp</div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.temperature) || "M20,180 Q100,50 200,80 T380,150"}
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="tempGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.3}} />
                      <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0.1}} />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${generateSVGPath(zoneData.chartData.temperature) || "M20,180 Q100,50 200,80 T380,150"} L380,200 L20,200 Z`}
                    fill="url(#tempGradient4)"
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
              <div className="chart-label">MOIST</div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.moisture) || "M20,160 Q100,60 200,90 T380,140"}
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d={`${generateSVGPath(zoneData.chartData.moisture) || "M20,160 Q100,60 200,90 T380,140"} L380,200 L20,200 Z`}
                    fill="url(#tempGradient4)"
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
                    d={generateSVGPath(zoneData.chartData.ph) || "M20,170 Q100,70 200,100 T380,160"}
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d={`${generateSVGPath(zoneData.chartData.ph) || "M20,170 Q100,70 200,100 T380,160"} L380,200 L20,200 Z`}
                    fill="url(#tempGradient4)"
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
                    d={generateSVGPath(zoneData.chartData.ec) || "M20,150 Q100,80 200,110 T380,170"}
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d={`${generateSVGPath(zoneData.chartData.ec) || "M20,150 Q100,80 200,110 T380,170"} L380,200 L20,200 Z`}
                    fill="url(#tempGradient4)"
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

export default Zona4cabai;