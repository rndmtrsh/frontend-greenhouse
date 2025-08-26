// src/utils/apiTester.js - Script untuk testing koneksi API
import apiService from '../services/GreenhouseAPI';

class ApiTester {
  constructor() {
    this.results = [];
  }

  log(message, status = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, status };
    this.results.push(logEntry);
    
    const styles = {
      info: 'color: #3498db',
      success: 'color: #27ae60; font-weight: bold',
      error: 'color: #e74c3c; font-weight: bold',
      warning: 'color: #f39c12'
    };
    
    console.log(`%c[${timestamp}] ${message}`, styles[status]);
  }

  async testConnection() {
    this.log('🚀 Memulai test koneksi API...', 'info');
    
    try {
      // Test basic connection
      await apiService.request('/api/health');
      this.log('✅ Koneksi ke server berhasil', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Gagal terhubung ke server: ${error.message}`, 'error');
      return false;
    }
  }

  async testEndpoints() {
    this.log('🔍 Testing API endpoints...', 'info');
    
    const tests = [
      {
        name: 'Get Devices',
        test: () => apiService.getDevices()
      },
      {
        name: 'Get Latest Readings',
        test: () => apiService.getLatestReadings()
      },
      {
        name: 'Get Plants',
        test: () => apiService.getPlants()
      },
      {
        name: 'Get Device Reading (CZ1)',
        test: () => apiService.getDeviceLatestReading('CZ1')
      }
    ];

    for (const { name, test } of tests) {
      try {
        const result = await test();
        this.log(`✅ ${name}: OK`, 'success');
        
        // Log sample data
        if (result && typeof result === 'object') {
          this.log(`   Data keys: ${Object.keys(result).join(', ')}`, 'info');
        }
      } catch (error) {
        this.log(`❌ ${name}: ${error.message}`, 'error');
      }
    }
  }

  async testDataDecoding() {
    this.log('🔧 Testing data decoding...', 'info');
    
    try {
      const response = await apiService.getLatestReadings();
      
      if (response && response.readings) {
        this.log(`📊 Total readings: ${response.readings.length}`, 'info');
        
        response.readings.forEach(reading => {
          const decoded = apiService.decodeHexData(reading.encoded_data, reading.zone_code);
          
          if (decoded) {
            this.log(`✅ ${reading.zone_code}: ${JSON.stringify(decoded)}`, 'success');
          } else {
            this.log(`⚠️ ${reading.zone_code}: Gagal decode data`, 'warning');
          }
        });
      }
    } catch (error) {
      this.log(`❌ Error testing decoding: ${error.message}`, 'error');
    }
  }

  async testDashboardData() {
    this.log('📊 Testing dashboard data format...', 'info');
    
    try {
      const response = await apiService.getLatestReadings();
      const dashboardData = apiService.formatForDashboard(response.readings);
      
      if (dashboardData) {
        this.log(`✅ Dashboard data: ${JSON.stringify(dashboardData)}`, 'success');
      } else {
        this.log('⚠️ Tidak ada data greenhouse (GZ1) untuk dashboard', 'warning');
      }
    } catch (error) {
      this.log(`❌ Error testing dashboard data: ${error.message}`, 'error');
    }
  }

  async testZoneData() {
    this.log('🌿 Testing zone data format...', 'info');
    
    const zones = ['CZ', 'SZ', 'MZ'];
    
    for (const zone of zones) {
      try {
        const response = await apiService.getLatestReadings();
        const zoneData = apiService.formatForZone(response.readings, zone);
        
        this.log(`✅ ${zone} zones: ${zoneData.length} devices found`, 'success');
        
        zoneData.forEach(device => {
          this.log(`   ${device.zone_code}: ${Object.keys(device).filter(k => k !== 'zone_code' && k !== 'timestamp').join(', ')}`, 'info');
        });
      } catch (error) {
        this.log(`❌ Error testing ${zone} data: ${error.message}`, 'error');
      }
    }
  }

  async runAllTests() {
    this.log('🧪 Memulai comprehensive API testing...', 'info');
    this.log('=====================================', 'info');
    
    // Test 1: Connection
    const connected = await this.testConnection();
    if (!connected) {
      this.log('❌ Testing dihentikan karena tidak dapat terhubung', 'error');
      return this.getResults();
    }

    // Test 2: Endpoints
    await this.testEndpoints();
    
    // Test 3: Data Decoding
    await this.testDataDecoding();
    
    // Test 4: Dashboard Data
    await this.testDashboardData();
    
    // Test 5: Zone Data
    await this.testZoneData();
    
    this.log('=====================================', 'info');
    this.log('🎉 Testing selesai!', 'success');
    
    return this.getResults();
  }

  getResults() {
    return {
      results: this.results,
      summary: {
        total: this.results.length,
        success: this.results.filter(r => r.status === 'success').length,
        error: this.results.filter(r => r.status === 'error').length,
        warning: this.results.filter(r => r.status === 'warning').length
      }
    };
  }
}

// Function untuk menjalankan test dari console
window.testAPI = async () => {
  const tester = new ApiTester();
  return await tester.runAllTests();
};

// Function untuk test cepat koneksi
window.testConnection = async () => {
  const tester = new ApiTester();
  return await tester.testConnection();
};

export default ApiTester;