// src/services/api.js - EXTENDED VERSION
// API Service untuk menghubungkan frontend dengan backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.enableMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';
  }

  // Set token untuk autentikasi
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get headers dengan authorization
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method - ENHANCED with fallback
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.requireAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Return fallback data if enabled and method supports it
      if (this.enableMockData && options.fallbackMethod) {
        console.warn(`Using fallback data for ${endpoint}`);
        return options.fallbackMethod();
      }
      
      throw error;
    }
  }

  // ==================== AUTH METHODS ====================

  // Login user
  async login(username, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      requireAuth: false,
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // Logout user
  logout() {
    this.setToken(null);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // ==================== DASHBOARD METHODS ====================

  // Get room conditions untuk dashboard - ENHANCED
  async getRoomConditions() {
    return await this.request('/dashboard/room-conditions', {
      fallbackMethod: () => this.getFallbackDashboardData()
    });
  }

  // Get dashboard summary - NEW
  async getDashboardSummary() {
    return await this.request('/dashboard/summary', {
      fallbackMethod: () => this.getFallbackDashboardData()
    });
  }

  // ==================== PLANT DATA METHODS - ENHANCED ====================

  // Get Selada data - ENHANCED
  async getSeladaData() {
    return await this.request('/plants/selada', {
      fallbackMethod: () => this.getFallbackPlantInfo('selada')
    });
  }

  // Get Cabai data by zone - ENHANCED
  async getCabaiData(zone) {
    return await this.request(`/plants/cabai/${zone}`, {
      fallbackMethod: () => this.getFallbackZoneData('cabai', zone)
    });
  }

  // Get Melon data by zone - ENHANCED
  async getMelonData(zone) {
    return await this.request(`/plants/melon/${zone}`, {
      fallbackMethod: () => this.getFallbackZoneData('melon', zone)
    });
  }

  // ==================== NEW ZONE MANAGEMENT METHODS ====================

  // Get specific zone data
  async getZoneData(plantType, zoneNumber) {
    return await this.request(`/zones/${plantType}/${zoneNumber}`, {
      fallbackMethod: () => this.getFallbackZoneData(plantType, zoneNumber)
    });
  }

  // Update zone data
  async updateZoneData(plantType, zoneNumber, data) {
    return await this.request(`/zones/${plantType}/${zoneNumber}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Get all zones for a plant type
  async getAllZones(plantType) {
    return await this.request(`/zones/${plantType}`, {
      fallbackMethod: () => this.getFallbackAllZones(plantType)
    });
  }

  // Get chart/historical data
  async getChartData(plantType, zoneNumber, metric, timeRange = '24h') {
    return await this.request(`/zones/${plantType}/${zoneNumber}/history/${metric}?range=${timeRange}`, {
      fallbackMethod: () => this.generateMockChartData(metric)
    });
  }

  // ==================== PLANT INFO METHODS - NEW ====================

  // Get all plants
  async getAllPlants() {
    return await this.request('/plants', {
      fallbackMethod: () => this.getFallbackPlantsData()
    });
  }

  // Get specific plant info
  async getPlantInfo(plantType) {
    return await this.request(`/plants/${plantType}/info`, {
      fallbackMethod: () => this.getFallbackPlantInfo(plantType)
    });
  }

  // ==================== ALERTS & NOTIFICATIONS - NEW ====================

  // Get alerts
  async getAlerts(plantType = null, zoneNumber = null) {
    const endpoint = plantType && zoneNumber 
      ? `/alerts?plant=${plantType}&zone=${zoneNumber}`
      : '/alerts';
    
    return await this.request(endpoint, {
      fallbackMethod: () => []
    });
  }

  // Mark alert as read
  async markAlertAsRead(alertId) {
    return await this.request(`/alerts/${alertId}/read`, {
      method: 'PUT',
    });
  }

  // Get system notifications
  async getNotifications() {
    return await this.request('/notifications', {
      fallbackMethod: () => []
    });
  }

  // ==================== SETTINGS METHODS - NEW ====================

  // Get system settings
  async getSystemSettings() {
    return await this.request('/settings', {
      fallbackMethod: () => this.getFallbackSystemSettings()
    });
  }

  // Update system settings
  async updateSystemSettings(settings) {
    return await this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // ==================== UTILITY METHODS ====================

  // Health check
  async healthCheck() {
    return await this.request('/health', { requireAuth: false });
  }

  // Test connection
  async testConnection() {
    try {
      await this.healthCheck();
      return true;
    } catch  {
      return false;
    }
  }

  // Get current user info from token
  getCurrentUser() {
    if (!this.token) return null;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return {
        id: payload.id,
        username: payload.username,
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  // Check if online
  isOnline() {
    return navigator.onLine;
  }

  // ==================== FALLBACK DATA METHODS - NEW ====================

  getFallbackZoneData(plantType, zoneNumber) {
    const baseValues = {
      cabai: { ph: 6.8, temperature: 26, ec: 2.1, moisture: 65 },
      selada: { ph: 6.5, temperature: 23, ec: 1.8, moisture: 70 },
      melon: { ph: 6.2, temperature: 28, ec: 2.3, moisture: 60 }
    };

    const base = baseValues[plantType] || baseValues.cabai;
    
    return {
      zoneId: zoneNumber,
      plantType: plantType,
      metrics: {
        ph: Number((base.ph + (Math.random() - 0.5) * 0.4).toFixed(1)),
        temperature: Number((base.temperature + (Math.random() - 0.5) * 4).toFixed(1)),
        ec: Number((base.ec + (Math.random() - 0.5) * 0.4).toFixed(1)),
        moisture: Math.round(base.moisture + (Math.random() - 0.5) * 10)
      },
      chartData: {
        temperature: this.generateMockChartData('temperature', base.temperature, 4),
        moisture: this.generateMockChartData('moisture', base.moisture, 10),
        ph: this.generateMockChartData('ph', base.ph, 0.4),
        ec: this.generateMockChartData('ec', base.ec, 0.4)
      },
      lastUpdated: new Date().toISOString(),
      status: 'online',
      alerts: []
    };
  }

  getFallbackAllZones(plantType) {
    const zones = [];
    const zoneCount = plantType === 'melon' ? 5 : plantType === 'selada' ? 1 : 6;
    
    for (let i = 1; i <= zoneCount; i++) {
      zones.push(this.getFallbackZoneData(plantType, i));
    }
    
    return zones;
  }

  getFallbackPlantsData() {
    return [
      {
        id: 'cabai',
        name: 'Cabai',
        zones: 6,
        status: 'active',
        image: '/cabai.jpg',
        description: 'Tanaman cabai dengan sistem hidroponik'
      },
      {
        id: 'selada',
        name: 'Selada',
        zones: 1,
        status: 'active',
        image: '/selada.jpg',
        description: 'Tanaman selada segar dengan nutrisi optimal'
      },
      {
        id: 'melon',
        name: 'Melon',
        zones: 5,
        status: 'active',
        image: '/melon.jpg',
        description: 'Tanaman melon manis dengan perawatan khusus'
      }
    ];
  }

  getFallbackPlantInfo(plantType) {
    const plantsInfo = {
      cabai: {
        name: 'Cabai',
        scientificName: 'Capsicum annuum',
        zones: 6,
        optimalConditions: {
          ph: { min: 6.0, max: 7.0, optimal: 6.5 },
          temperature: { min: 22, max: 30, optimal: 26 },
          ec: { min: 1.8, max: 2.5, optimal: 2.1 },
          moisture: { min: 60, max: 75, optimal: 68 }
        },
        growthStages: ['Seeding', 'Vegetative', 'Flowering', 'Fruiting'],
        harvestTime: '90-120 days'
      },
      selada: {
        name: 'Selada',
        scientificName: 'Lactuca sativa',
        zones: 1,
        optimalConditions: {
          ph: { min: 6.0, max: 7.0, optimal: 6.5 },
          temperature: { min: 20, max: 25, optimal: 23 },
          ec: { min: 1.5, max: 2.0, optimal: 1.8 },
          moisture: { min: 65, max: 80, optimal: 70 }
        },
        growthStages: ['Seeding', 'Vegetative', 'Mature'],
        harvestTime: '45-60 days'
      },
      melon: {
        name: 'Melon',
        scientificName: 'Cucumis melo',
        zones: 5,
        optimalConditions: {
          ph: { min: 6.0, max: 6.8, optimal: 6.2 },
          temperature: { min: 25, max: 32, optimal: 28 },
          ec: { min: 2.0, max: 2.8, optimal: 2.3 },
          moisture: { min: 55, max: 70, optimal: 60 }
        },
        growthStages: ['Seeding', 'Vegetative', 'Flowering', 'Fruiting'],
        harvestTime: '100-130 days'
      }
    };

    return plantsInfo[plantType] || plantsInfo.cabai;
  }

  getFallbackDashboardData() {
    return {
      totalPlants: 3,
      totalZones: 12,
      activeZones: 11,
      alerts: 2,
      overallHealth: 'Good',
      roomConditions: {
        kelembapan: 44,
        suhu: 20,
        intensitasCahaya: 54
      },
      recentActivity: [
        {
          id: 1,
          type: 'alert',
          message: 'pH level tinggi di Cabai Zone 3',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: 2,
          type: 'update',
          message: 'Suhu normal di Melon Zone 2',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        }
      ],
      quickStats: {
        avgTemperature: 25.3,
        avgMoisture: 67.2,
        avgPH: 6.4,
        avgEC: 2.0
      }
    };
  }

  getFallbackSystemSettings() {
    return {
      refreshInterval: 30000,
      alertThresholds: {
        ph: { min: 5.5, max: 7.5 },
        temperature: { min: 18, max: 35 },
        ec: { min: 1.0, max: 3.0 },
        moisture: { min: 40, max: 90 }
      },
      notifications: {
        email: true,
        push: false,
        sound: true
      },
      units: {
        temperature: 'celsius',
        time: '24h'
      }
    };
  }

  generateMockChartData(metric, baseValue = 25, variance = 5) {
    const data = [];
    const times = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    
    // Set base value based on metric if not provided
    if (!baseValue) {
      const defaults = {
        temperature: 25,
        moisture: 65,
        ph: 6.5,
        ec: 2.0
      };
      baseValue = defaults[metric] || 25;
    }
    
    times.forEach((time, index) => {
      const sinWave = Math.sin((index / times.length) * 2 * Math.PI) * (variance / 2);
      const randomNoise = (Math.random() - 0.5) * (variance / 4);
      const value = baseValue + sinWave + randomNoise;
      
      data.push({
        time: time,
        value: Math.max(0, Number(value.toFixed(1))),
        timestamp: new Date(`2024-01-01T${time}:00`).toISOString()
      });
    });
    
    return data;
  }

  // ==================== REAL-TIME METHODS - NEW ====================

  // Subscribe to zone updates (polling for now, WebSocket later)
  subscribeToZoneUpdates(plantType, zoneNumber, callback, interval = 30000) {
    const pollData = async () => {
      try {
        const data = await this.getZoneData(plantType, zoneNumber);
        callback(data);
      } catch (error) {
        console.error('Error in polling updates:', error);
      }
    };

    // Initial call
    pollData();

    // Set up polling
    const intervalId = setInterval(pollData, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  // ==================== BATCH OPERATIONS - NEW ====================

  // Get multiple zones data at once
  async getMultipleZonesData(requests) {
    const promises = requests.map(({ plantType, zoneNumber }) => 
      this.getZoneData(plantType, zoneNumber).catch(error => ({ error, plantType, zoneNumber }))
    );

    return await Promise.all(promises);
  }

  // Batch update multiple zones
  async updateMultipleZones(updates) {
    const promises = updates.map(({ plantType, zoneNumber, data }) => 
      this.updateZoneData(plantType, zoneNumber, data).catch(error => ({ error, plantType, zoneNumber }))
    );

    return await Promise.all(promises);
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;