// ===========================================
// Zona2melon.jsx - Template untuk Extended Api.js with Moisture
// ===========================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import './Zonamelon.css';

const Zona2melon = () => {
  const navigate = useNavigate();
  const [isPlantDropdownOpen, setIsPlantDropdownOpen] = useState(false);
  
  // State untuk zone data - Added moisture
  const [zoneData, setZoneData] = useState({
    zoneId: 2,
    plantType: 'melon',
    metrics: {
      ph: 0,
      temperature: 0,
      ec: 0,
      moisture: 0  // Added moisture
    },
    chartData: {
      temperature: [],
      ph: [],
      ec: [],
      moisture: []  // Added moisture chart
    },
    lastUpdated: null,
    status: 'offline',
    alerts: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [isOnline, setIsOnline] = useState(apiService.isOnline());
  const [alerts, setAlerts] = useState([]);

  // Fetch data menggunakan extended API methods
  const fetchZoneData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      if (!apiService.isAuthenticated()) {
        setError('Authentication required');
        return;
      }

      // Fetch zone data, plant info, dan alerts secara parallel
      const [zoneResult, plantResult, alertsResult] = await Promise.all([
        apiService.getZoneData('melon', 2),
        apiService.getPlantInfo('melon'),
        apiService.getAlerts('melon', 2)
      ]);
      
      setZoneData(zoneResult);
      setPlantInfo(plantResult);
      setAlerts(alertsResult);
      
    } catch (err) {
      setError(err.message || 'Failed to load zone data');
      console.error('Error fetching zone data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chart data untuk specific metric
  const fetchChartData = async (metric, timeRange = '24h') => {
    try {
      const chartData = await apiService.getChartData('melon', 2, metric, timeRange);
      setZoneData(prev => ({
        ...prev,
        chartData: {
          ...prev.chartData,
          [metric]: chartData
        }
      }));
    } catch (err) {
      console.error(`Error fetching ${metric} chart data:`, err);
    }
  };

  // Auto-refresh data menggunakan subscription
  useEffect(() => {
    // Initial fetch
    fetchZoneData();
    
    // Set up auto-refresh menggunakan subscription dari API
    const unsubscribe = apiService.subscribeToZoneUpdates(
      'melon', 
      2, 
      (data) => {
        setZoneData(data);
        setError(null);
      },
      30000 // 30 seconds interval
    );
    
    // Monitor online status
    const handleOnlineStatus = () => {
      const online = apiService.isOnline();
      setIsOnline(online);
      
      // Reconnect when back online
      if (online && error) {
        fetchZoneData();
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Cleanup
    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  },);

  // Manual refresh function
  const handleRefresh = async () => {
    await fetchZoneData();
  };

  // Load specific chart data
  const handleLoadChartData = async (metric) => {
    await fetchChartData(metric, '24h');
  };

  // Mark alert as read
  const handleMarkAlertAsRead = async (alertId) => {
    try {
      await apiService.markAlertAsRead(alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  };

  // Navigation handlers
  const handleBackToDashboard = () => navigate('/dashboard');
  const handleHomeClick = () => navigate('/dashboard');
  const handlePlantClick = () => setIsPlantDropdownOpen(!isPlantDropdownOpen);
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

  // Generate SVG path untuk charts
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

  // Format metric values - Added moisture
  const formatMetricValue = (value, type) => {
    if (loading || value === null || value === undefined) return '--';
    
    switch (type) {
      case 'temperature':
        return `${value.toFixed(1)}°C`;
      case 'ph':
        return value.toFixed(1);
      case 'ec':
        return value.toFixed(1);
      case 'moisture':
        return `${value.toFixed(1)}%`;  // Added moisture formatting
      default:
        return value;
    }
  };

  // Check metric status berdasarkan optimal conditions - Added moisture
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
    <div className="zona2melon-container">
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

      {/* Header dengan enhanced actions */}
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
          {alerts.length > 0 && (
            <div className="alerts-indicator" title={`${alerts.length} alerts`}>
              <span className="alert-icon">⚠️</span>
              <span className="alert-count">{alerts.length}</span>
            </div>
          )}
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

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-item ${alert.severity}`}>
              <span className="alert-message">{alert.message}</span>
              <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              <button 
                className="alert-dismiss"
                onClick={() => handleMarkAlertAsRead(alert.id)}
                title="Mark as read"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar - Updated for 2 zones only, ZONA 2 is active */}
        <div className="sidebar">
          <button className="zone-btn" onClick={() => handleZoneClick('melon')}>MELON</button>
          <button className="zone-btn" onClick={() => handleZoneClick('zona1')}>ZONA 1</button>
          <button className="zone-btn active" onClick={() => handleZoneClick('zona2')}>ZONA 2</button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Zone Badge dengan enhanced info */}
          <div className="zone-badge">
            <span className="zone-title">ZONE 2</span>
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
            {plantInfo && (
              <span className="plant-info">
                {plantInfo.name} ({plantInfo.scientificName})
              </span>
            )}
          </div>

          {/* Monitoring Cards - Now 4 cards for melon (including moisture) */}
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
                  <br />
                  Range: {plantInfo.optimalConditions.ph?.min} - {plantInfo.optimalConditions.ph?.max}
                </div>
              )}
              <button 
                className="chart-load-btn"
                onClick={() => handleLoadChartData('ph')}
                title="Load pH chart data"
              >
                📊
              </button>
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
                  <br />
                  Range: {plantInfo.optimalConditions.temperature?.min}°C - {plantInfo.optimalConditions.temperature?.max}°C
                </div>
              )}
              <button 
                className="chart-load-btn"
                onClick={() => handleLoadChartData('temperature')}
                title="Load temperature chart data"
              >
                📊
              </button>
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
                  <br />
                  Range: {plantInfo.optimalConditions.ec?.min} - {plantInfo.optimalConditions.ec?.max}
                </div>
              )}
              <button 
                className="chart-load-btn"
                onClick={() => handleLoadChartData('ec')}
                title="Load EC chart data"
              >
                📊
              </button>
            </div>

            {/* Added Moisture Card */}
            <div className={`metric-card ${loading ? 'loading' : ''} ${getMetricStatus(zoneData.metrics.moisture, 'moisture')}`}>
              <div className="metric-icon">
                <img src="/moisture-icon.png" alt="Moisture" />
              </div>
              <div className="metric-value">
                {formatMetricValue(zoneData.metrics.moisture, 'moisture')}
              </div>
              <div className="metric-label">Moisture</div>
              {plantInfo && (
                <div className="metric-range">
                  Optimal: {plantInfo.optimalConditions.moisture?.optimal}%
                  <br />
                  Range: {plantInfo.optimalConditions.moisture?.min}% - {plantInfo.optimalConditions.moisture?.max}%
                </div>
              )}
              <button 
                className="chart-load-btn"
                onClick={() => handleLoadChartData('moisture')}
                title="Load moisture chart data"
              >
                📊
              </button>
            </div>
          </div>

          {/* Charts Section - Now 4 charts for melon (including moisture) */}
          <div className="charts-section">
            <div className="chart-container">
              <div className="chart-label">
                Temperature
                <span className="chart-info">
                  Current: {zoneData.metrics.temperature}°C
                </span>
              </div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.temperature) || "M20,160 Q100,40 200,70 T380,130"}
                    stroke="#4ade80"
                    strokeWidth="3"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="tempGradientMelon2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#4ade80', stopOpacity: 0.3}} />
                      <stop offset="100%" style={{stopColor: '#4ade80', stopOpacity: 0.1}} />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${generateSVGPath(zoneData.chartData.temperature) || "M20,160 Q100,40 200,70 T380,130"} L380,200 L20,200 Z`}
                    fill="url(#tempGradientMelon2)"
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
              <div className="chart-label">
                pH Level
                <span className="chart-info">
                  Current: {zoneData.metrics.ph}
                </span>
              </div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.ph) || "M20,150 Q100,60 200,90 T380,140"}
                    stroke="#4ade80"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d={`${generateSVGPath(zoneData.chartData.ph) || "M20,150 Q100,60 200,90 T380,140"} L380,200 L20,200 Z`}
                    fill="url(#tempGradientMelon2)"
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
              <div className="chart-label">
                EC (Electrical Conductivity)
                <span className="chart-info">
                  Current: {zoneData.metrics.ec}
                </span>
              </div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.ec) || "M20,170 Q100,80 200,110 T380,160"}
                    stroke="#4ade80"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d={`${generateSVGPath(zoneData.chartData.ec) || "M20,170 Q100,80 200,110 T380,160"} L380,200 L20,200 Z`}
                    fill="url(#tempGradientMelon2)"
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

            {/* Added Moisture Chart */}
            <div className="chart-container">
              <div className="chart-label">
                Moisture Level
                <span className="chart-info">
                  Current: {zoneData.metrics.moisture}%
                </span>
              </div>
              <div className="chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <path
                    d={generateSVGPath(zoneData.chartData.moisture) || "M20,180 Q100,90 200,120 T380,170"}
                    stroke="#4ade80"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d={`${generateSVGPath(zoneData.chartData.moisture) || "M20,180 Q100,90 200,120 T380,170"} L380,200 L20,200 Z`}
                    fill="url(#tempGradientMelon2)"
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

          {/* Plant Growth Stage Info - New Feature */}
          {plantInfo && (
            <div className="plant-status-section">
              <h3>Plant Status</h3>
              <div className="growth-info">
                <span>Harvest Time: {plantInfo.harvestTime}</span>
                <span>Growth Stages: {plantInfo.growthStages?.join(' → ')}</span>
              </div>
            </div>
          )}
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

export default Zona2melon;