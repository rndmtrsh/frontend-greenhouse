// src/components/ProxyTest.jsx - Test proxy configuration
import React, { useState } from 'react';

const ProxyTest = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, status, message) => {
    setResults(prev => [...prev, {
      test,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testProxy = async () => {
    setTesting(true);
    setResults([]);

    // Test 1: Basic proxy test
    addResult('Proxy Test', 'info', 'Testing proxy configuration...');

    try {
      // Test dengan relative URL (harus menggunakan proxy)
      const response = await fetch('/api/latest-readings', {
        headers: {
          'X-API-KEY': 'your_api_key_here'
        }
      });

      if (response.ok) {
        addResult('Proxy Test', 'success', 'Proxy is working! Status: ' + response.status);
        
        const data = await response.json();
        addResult('Data Test', 'success', `Received ${data.readings?.length || 0} readings`);
        
        // Test CZ1 specific
        const cz1Response = await fetch('/api/latest-readings/CZ1', {
          headers: {
            'X-API-KEY': 'your_api_key_here'
          }
        });
        
        if (cz1Response.ok) {
          addResult('CZ1 Test', 'success', 'CZ1 data accessible through proxy');
        } else {
          addResult('CZ1 Test', 'error', `CZ1 failed: ${cz1Response.status}`);
        }
        
      } else {
        addResult('Proxy Test', 'error', `Proxy working but API error: ${response.status}`);
      }
    } catch (error) {
      if (error.message.includes('CORS')) {
        addResult('Proxy Test', 'error', 'CORS Error - Proxy not working');
      } else {
        addResult('Proxy Test', 'error', `Network Error: ${error.message}`);
      }
    }

    setTesting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#27ae60';
      case 'error': return '#e74c3c';
      case 'warning': return '#f39c12';
      case 'info': return '#3498db';
      default: return '#95a5a6';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '350px',
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Proxy Test</h3>
      
      <button 
        onClick={testProxy}
        disabled={testing}
        style={{
          padding: '10px 15px',
          backgroundColor: testing ? '#95a5a6' : '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: testing ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '15px'
        }}
      >
        {testing ? 'Testing...' : 'Test Proxy'}
      </button>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {results.map((result, index) => (
          <div key={index} style={{
            padding: '8px',
            margin: '5px 0',
            backgroundColor: '#f8f9fa',
            border: `1px solid ${getStatusColor(result.status)}`,
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <strong style={{ color: getStatusColor(result.status) }}>
              {result.test}:
            </strong>
            <br />
            {result.message}
            <br />
            <small style={{ color: '#7f8c8d' }}>{result.timestamp}</small>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <p style={{ 
          color: '#7f8c8d', 
          fontStyle: 'italic',
          textAlign: 'center',
          margin: '20px 0'
        }}>
          Click "Test Proxy" to check if proxy is working
        </p>
      )}
    </div>
  );
};

export default ProxyTest;