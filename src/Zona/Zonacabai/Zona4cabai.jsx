// src/Zona/Zonacabai/Zona4cabai.jsx - Zona 4 Cabai Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/greenhouseAPI';
import './Zonacabai.css';

const Zona4cabai = () => {
  const navigate = useNavigate();
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);
  
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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartError, setChartError] = useState(null);
  const [plantInfo] = useState({
    name: 'Cabai',
    scientificName: 'Capsicum annuum',
    optimalConditions: {
      ph: { min: 6.0, max: 6.8, optimal: 6.4 },
      temperature: { min: 20, max: 30, optimal: 25 },
      ec: { min: 1.2, max: 2.5, optimal: 1.8 },
      moisture: { min: 60, max: 80, optimal: 70 }
    }
  });

  const deviceCode = 'CZ4'; // DEVICE CODE ZONA 4

  // Main data fetch - this determines overall status
  const fetchZoneData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching main data for device: ${deviceCode}`);

      const response = await apiService.getDeviceLatestReading(deviceCode);
      
      if (response && response.reading) {
        console.log('Main data response:', response);
        
        const decoded = apiService.decodeHexData(response.reading.encoded_data, deviceCode);
        console.log('Decoded main data:', decoded);
        
        if (decoded) {
          const metrics = {
            ph: (decoded.pH >= 0 && decoded.pH <= 14) ? decoded.pH : 0,
            temperature: (decoded.temperature >= -10 && decoded.temperature <= 60) ? decoded.temperature : 0,
            ec: (decoded.ec >= 0 && decoded.ec <= 10) ? decoded.ec : 0,
            moisture: (decoded.moisture >= 0 && decoded.moisture <= 100) ? decoded.moisture : 0
          };

          setZoneData(prev => ({
            ...prev,
            metrics,
            lastUpdated: response.reading.timestamp,
            status: 'online'
          }));

          return true;
        } else {
          throw new Error('Gagal decode data sensor');
        }
      } else {
        throw new Error(`Data ${deviceCode} tidak ditemukan`);
      }
      
    } catch (err) {
      console.error('Error fetching main zone data:', err);
      setError(err.message || 'Gagal mengambil data');
      setZoneData(prev => ({ ...prev, status: 'offline' }));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Chart data fetch - separate from main status
  const fetchChartData = async () => {
    try {
      setChartError(null);
      console.log(`Fetching chart data for: ${deviceCode}`);
      
      const response = await apiService.get24HourData(deviceCode);
      
      if (response && response.readings) {
        console.log(`Chart data: ${response.readings.length} points`);
        
        const chartData = {
          temperature: [],
          moisture: [],
          ph: [],
          ec: []
        };

        response.readings.forEach((reading) => {
          const decoded = apiService.decodeHexData(reading.encoded_data, deviceCode);
          if (decoded) {
            const timestamp = new Date(reading.timestamp);
            chartData.temperature.push({ value: decoded.temperature, timestamp });
            chartData.moisture.push({ value: decoded.moisture, timestamp });
            chartData.ph.push({ value: decoded.pH, timestamp });
            chartData.ec.push({ value: decoded.ec, timestamp });
          }
        });

        setZoneData(prev => ({ ...prev, chartData }));
        console.log('Chart data loaded successfully');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setChartError('Chart data unavailable (CORS issue)');
      return false;
    }
  };

  // Manual refresh - try both, but main data determines success
  const handleRefresh = async () => {
    const mainSuccess = await fetchZoneData();
    
    if (mainSuccess) {
      await fetchChartData();
    }
  };

  // Refresh only main data (lighter request)
  const handleRefreshMainOnly = async () => {
    await fetchZoneData();
  };

  useEffect(() => {
    console.log('Component mounted - ready for manual refresh');
  }, []);

  // Navigation handlers
  const handleBackToDashboard = () => navigate('/dashboard');
  const handleHomeClick = () => navigate('/dashboard');
  const handlePlantClick = () => setIsPlantDropdownOpen(!isPlantDropdownOpen);
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

  const generateSVGPath = (data) => {
    if (!data || data.length === 0) return 'M20,180 Q100,50 200,80 T380,150';
    
    const width = 400;
    const height = 200;
    const padding = 20;
    
    const values = data.map(d => d.value).filter(v => v !== null && v !== undefined);
    if (values.length === 0) return 'M20,180 Q100,50 200,80 T380,150';
    
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

  const formatMetricValue = (value, type) => {
    if (loading || value === null || value === undefined) return '--';
    if (typeof value !== 'number') return '--';
    
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
        return value.toString();
    }
  };

  const getMetricStatus = (value, type) => {
    if (!plantInfo || !plantInfo.optimalConditions || value === null || typeof value !== 'number') {
      return 'normal';
    }
    
    const conditions = plantInfo.optimalConditions[type];
    if (!conditions) return 'normal';
    
    if (value < conditions.min || value > conditions.max) return 'warning';
    if (Math.abs(value - conditions.optimal) <= (conditions.max - conditions.min) * 0.1) return 'optimal';
    return 'normal';
  };

  const getConnectionStatus = () => {
    if (!navigator.onLine) return 'offline';
    if (loading) return 'connecting';
    if (error) return 'offline';
    return zoneData.status;
  };

  return (
    <div className="zona1cabai-container">
      {/* Header Navigation */}
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
        
        {/* ZONE BADGE - ZONA 4 */}
        <div className="zone-badge-header" style={{
          marginLeft: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 15px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span>ZONE 4 - {deviceCode}</span>
            {zoneData.lastUpdated && (
              <div style={{
                fontSize: '11px',
                opacity: 0.8,
                marginTop: '2px'
              }}>
                {new Date(zoneData.lastUpdated).toLocaleTimeString('id-ID')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header with Manual Refresh Controls */}
      <div className="header">
        <button className="back-btn" onClick={handleBackToDashboard}>
          ← DASHBOARD
        </button>
        <h1 className="page-title">CABAI ZONE 4 - MANUAL MODE</h1>
        <div className="header-actions">
          <button 
            className={`refresh-btn ${loading ? 'loading' : ''}`} 
            onClick={handleRefresh} 
            disabled={loading}
            style={{
              padding: '10px 15px',
              fontSize: '13px',
              fontWeight: 'bold',
              marginRight: '10px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>↻</span>
            {loading ? 'Loading...' : 'Refresh All'}
          </button>
          
          <button 
            className="refresh-btn-quick" 
            onClick={handleRefreshMainOnly} 
            disabled={loading}
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              background: 'rgba(52, 152, 219, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            Quick
          </button>
          
          <div className={`status-indicator ${getConnectionStatus()}`}>
            <span className="status-dot"></span>
            {getConnectionStatus()}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!zoneData.lastUpdated && !loading && (
        <div style={{
          background: 'linear-gradient(135deg, #3498db, #2980b9)',
          color: 'white',
          padding: '12px',
          margin: '10px',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          <strong>Manual Refresh Mode</strong><br/>
          "Refresh All" = sensor data + charts | "Quick" = sensor data only
        </div>
      )}

      {/* Main Data Error */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button className="error-retry" onClick={handleRefreshMainOnly} disabled={loading}>
            {loading ? 'Loading...' : 'Retry'}
          </button>
        </div>
      )}

      {/* Chart Error (Separate, less critical) */}
      {chartError && zoneData.status === 'online' && (
        <div style={{
          background: 'linear-gradient(135deg, #f39c12, #e67e22)',
          color: 'white',
          padding: '10px',
          margin: '10px',
          borderRadius: '6px',
          fontSize: '13px',
          textAlign: 'center'
        }}>
          <span>📊 {chartError} - Main sensor data is working fine</span>
          <button 
            onClick={fetchChartData}
            style={{
              marginLeft: '10px',
              padding: '4px 8px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Retry Charts
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar Menu */}
        <div className="sidebar">
          <button className="zone-btn" onClick={() => handleZoneClick('cabai')}>CABAI</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona1')}>ZONA 1</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona2')}>ZONA 2</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona3')}>ZONA 3</button>
          <button className="zone-btn active" onClick={() => handleZoneClick('zona4')}>ZONA 4</button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          
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
              <div className="metric-range">
                Optimal: {plantInfo.optimalConditions.ph.optimal}
              </div>
            </div>

            <div className={`metric-card ${loading ? 'loading' : ''} ${getMetricStatus(zoneData.metrics.temperature, 'temperature')}`}>
              <div className="metric-icon">
                <img src="/temp-icon.png" alt="Temperature" />
              </div>
              <div className="metric-value">
                {formatMetricValue(zoneData.metrics.temperature, 'temperature')}
              </div>
              <div className="metric-label">Temperature</div>
              <div className="metric-range">
                Optimal: {plantInfo.optimalConditions.temperature.optimal}°C
              </div>
            </div>

            <div className={`metric-card ${loading ? 'loading' : ''} ${getMetricStatus(zoneData.metrics.ec, 'ec')}`}>
              <div className="metric-icon">
                <img src="/ec-icon.png" alt="EC" />
              </div>
              <div className="metric-value">
                {formatMetricValue(zoneData.metrics.ec, 'ec')}
              </div>
              <div className="metric-label">EC</div>
              <div className="metric-range">
                Optimal: {plantInfo.optimalConditions.ec.optimal}
              </div>
            </div>

            <div className={`metric-card ${loading ? 'loading' : ''} ${getMetricStatus(zoneData.metrics.moisture, 'moisture')}`}>
              <div className="metric-icon">
                <img src="/moist-icon.png" alt="Moist" />
              </div>
              <div className="metric-value">
                {formatMetricValue(zoneData.metrics.moisture, 'moisture')}
              </div>
              <div className="metric-label">Moisture</div>
              <div className="metric-range">
                Optimal: {plantInfo.optimalConditions.moisture.optimal}%
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-container">
              <div className="chart-label">
                Temperature
                {chartError && <span style={{color: '#f39c12', fontSize: '11px', marginLeft: '10px'}}>⚠️ Data unavailable</span>}
              </div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.temperature)}
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
                    d={`${generateSVGPath(zoneData.chartData.temperature)} L380,200 L20,200 Z`}
                    fill="url(#tempGradient4)"
                  />
                </svg>
                <div className="chart-time-labels">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-label">
                Moisture
                {chartError && <span style={{color: '#f39c12', fontSize: '11px', marginLeft: '10px'}}>⚠️ Data unavailable</span>}
              </div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.moisture)}
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d={`${generateSVGPath(zoneData.chartData.moisture)} L380,200 L20,200 Z`}
                    fill="url(#tempGradient4)"
                  />
                </svg>
                <div className="chart-time-labels">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-label">
                pH
                {chartError && <span style={{color: '#f39c12', fontSize: '11px', marginLeft: '10px'}}>⚠️ Data unavailable</span>}
              </div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.ph)}
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d={`${generateSVGPath(zoneData.chartData.ph)} L380,200 L20,200 Z`}
                    fill="url(#tempGradient4)"
                  />
                </svg>
                <div className="chart-time-labels">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-label">
                EC
                {chartError && <span style={{color: '#f39c12', fontSize: '11px', marginLeft: '10px'}}>⚠️ Data unavailable</span>}
              </div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.ec)}
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d={`${generateSVGPath(zoneData.chartData.ec)} L380,200 L20,200 Z`}
                    fill="url(#tempGradient4)"
                  />
                </svg>
                <div className="chart-time-labels">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <div className="welcome-text">CABAI ZONE 4 - MANUAL REFRESH MODE</div>
      </div>
    </div>
  );
};

export default Zona4cabai;