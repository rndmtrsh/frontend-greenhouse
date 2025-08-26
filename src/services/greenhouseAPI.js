/* eslint-disable no-unused-vars */
// src/services/GreenhouseAPI.js - Fixed proxy configuration
class GreenhouseAPI {
    constructor() {
        // IMPORTANT: Empty baseURL untuk development agar menggunakan proxy
        this.baseURL = 'https://kedairekagreenhouse.my.id';
        this.apiKey = 'ithinkyouthinktoomuchofme'; // GANTI DENGAN API KEY YANG BENAR
        
        console.log('GreenhouseAPI initialized with proxy config:', {
            baseURL: this.baseURL || 'using proxy',
            environment: import.meta.env.MODE
        });
    }

    async request(endpoint, options = {}) {
        // Untuk development, baseURL kosong = menggunakan proxy
        // Request akan ke http://localhost:5173/api/* yang di-proxy ke https://kedairekagreenhouse.my.id/api/*
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            method: 'GET',
            headers: {
                'X-API-KEY': this.apiKey,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        console.log(`Making request to: ${url}`);
        console.log('Request headers:', config.headers);

        try {
            const response = await fetch(url, config);
            
            console.log(`Response: ${response.status} ${response.statusText}`);
            
            if (!response.ok) {
                let errorText = `HTTP ${response.status}`;
                try {
                    const responseText = await response.text();
                    errorText = responseText || errorText;
                } catch (err) {
                    // Ignore error reading response text
                }
                throw new Error(errorText);
            }
            
            const data = await response.json();
            console.log('Response data received successfully');
            return data;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // API Methods
    async getLatestReadings() {
        return this.request('/api/latest-readings');
    }

    async getDeviceLatestReading(deviceCode) {
        return this.request(`/api/latest-readings/${deviceCode}`);
    }

    async get24HourData(deviceCode) {
        return this.request(`/api/${deviceCode}/24`);
    }

    async healthCheck() {
        return this.request('/api/health');
    }

    // Decode HEX data
    decodeHexData(hexString, deviceCode) {
        if (!hexString || typeof hexString !== 'string') {
            console.log(`Invalid hex string for ${deviceCode}:`, hexString);
            return null;
        }
        
        console.log(`Decoding hex data for ${deviceCode}: ${hexString}`);
        
        try {
            if (deviceCode.startsWith('CZ')) {  // Cabai (4 sensors)
                const result = {
                    pH: parseInt(hexString.substr(0, 4), 16) / 100,
                    moisture: parseInt(hexString.substr(4, 4), 16) / 10,
                    ec: parseInt(hexString.substr(8, 4), 16) / 100,
                    temperature: parseInt(hexString.substr(12, 4), 16) / 10
                };
                console.log(`Decoded CZ data:`, result);
                return result;
            }
            
            if (deviceCode.startsWith('MZ') || deviceCode.startsWith('SZ')) {  // Melon/Selada (3 sensors)
                const result = {
                    pH: parseInt(hexString.substr(0, 4), 16) / 100,
                    ec: parseInt(hexString.substr(4, 4), 16) / 100,
                    temperature: parseInt(hexString.substr(8, 4), 16) / 10
                };
                console.log(`Decoded MZ/SZ data:`, result);
                return result;
            }
            
            if (deviceCode.startsWith('GZ')) {  // Greenhouse (3 sensors)
                const result = {
                    temperature: parseInt(hexString.substr(0, 4), 16) / 10,
                    humidity: parseInt(hexString.substr(4, 4), 16) / 10,
                    light: parseInt(hexString.substr(8, 4), 16)
                };
                console.log(`Decoded GZ data:`, result);
                return result;
            }
        } catch (error) {
            console.error(`Error decoding hex data for ${deviceCode}:`, error);
            return null;
        }
        
        console.log(`Unknown device code: ${deviceCode}`);
        return null;
    }

    // Test connection
    async testConnection() {
        console.log('Testing API connection through proxy...');
        try {
            const response = await this.getLatestReadings();
            console.log('Connection test successful:', response);
            return true;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
}

// Create and export instance
const apiService = new GreenhouseAPI();

// Make available for browser console debugging
if (typeof window !== 'undefined') {
    window.greenhouseAPI = apiService;
}

export default apiService;