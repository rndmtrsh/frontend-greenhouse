// src/components/MonitoringCard.jsx
import React from 'react';
import './MonitoringCard.css';

const MonitoringCard = ({ 
  title, 
  value, 
  unit = '', 
  icon, 
  loading = false, 
  error = false,
  optimal = null,
  type = 'default'
}) => {
  const getStatusClass = () => {
    if (loading || error) return '';
    if (optimal === null) return '';
    
    // Status berdasarkan nilai optimal
    if (optimal.min !== undefined && optimal.max !== undefined) {
      const numValue = parseFloat(value);
      if (numValue < optimal.min || numValue > optimal.max) {
        return 'warning';
      }
      return 'good';
    }
    
    return '';
  };

  const formatValue = () => {
    if (loading) return '...';
    if (error) return '--';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value || '--';
    
    // Format berdasarkan type
    switch (type) {
      case 'temperature':
        return numValue.toFixed(1);
      case 'ph':
        return numValue.toFixed(2);
      case 'percentage':
        return numValue.toFixed(1);
      case 'ec':
        return numValue.toFixed(2);
      case 'integer':
        return Math.round(numValue);
      default:
        return numValue.toFixed(1);
    }
  };

  return (
    <div className={`monitoring-card ${getStatusClass()}`}>
      <div className="card-header">
        {icon && <div className="card-icon">{icon}</div>}
        <div className="card-title">{title}</div>
      </div>
      
      <div className="card-content">
        <div className="card-value">
          <span className="value">{formatValue()}</span>
          {unit && <span className="unit">{unit}</span>}
        </div>
        
        {optimal && !loading && !error && (
          <div className="optimal-range">
            <small>
              Optimal: {optimal.min}
              {optimal.max !== undefined ? `-${optimal.max}` : '+'}
              {unit}
            </small>
          </div>
        )}
      </div>
      
      {error && (
        <div className="card-error">
          <small>Data tidak tersedia</small>
        </div>
      )}
    </div>
  );
};

export default MonitoringCard;