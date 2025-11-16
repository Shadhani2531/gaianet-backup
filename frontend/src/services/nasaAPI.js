import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

class NASAAPI {
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getEnvironmentalData() {
        try {
            const response = await this.client.get('/api/environment/data');
            return response.data;
        } catch (error) {
            console.error('Error fetching environmental data:', error);
            return this.getSampleEnvironmentalData();
        }
    }

    async getNASAImagery(lat = 40.7128, lon = -74.0060, date = null) {
        try {
            const params = { lat, lon };
            if (date) params.date = date;
            
            const response = await this.client.get('/api/nasa/imagery', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching NASA imagery:', error);
            return this.getSampleImageryData();
        }
    }

    async getWeatherData() {
        try {
            const response = await this.client.get('/api/nasa/weather');
            return response.data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return this.getSampleWeatherData();
        }
    }

    async getSystemStatus() {
        try {
            const response = await this.client.get('/api/gaianet/status');
            return response.data;
        } catch (error) {
            console.error('Error fetching system status:', error);
            return { status: 'offline', message: 'Backend unavailable' };
        }
    }

    // Fallback sample data
    getSampleEnvironmentalData() {
        return {
            temperature: {
                global_average: 15.1,
                anomaly: 1.05,
                trend: "increasing",
                unit: "°C"
            },
            co2: {
                value: 417.8,
                unit: "ppm", 
                trend: "rising"
            },
            vegetation: {
                ndvi_global: 0.41,
                health_index: 76.8,
                trend: "stable"
            },
            biodiversity: {
                species_richness: 8.1,
                threat_level: "moderate",
                protected_areas: 15.2
            },
            last_updated: new Date().toISOString(),
            data_sources: ["Sample Data"]
        };
    }

    getSampleImageryData() {
        return {
            date: new Date().toISOString().split('T')[0],
            image_url: "https://eoimages.gsfc.nasa.gov/images/imagerecords/147000/147190/eo_base_2020_clean_3600x1800.png",
            coordinates: { lat: 0, lon: 0 },
            caption: "Global satellite imagery (sample)",
            source: "NASA GIBS"
        };
    }

    getSampleWeatherData() {
        return {
            current: {
                temperature: 21.5,
                humidity: 63,
                pressure: 1012,
                wind_speed: 4.8,
                conditions: "partly_cloudy"
            },
            forecast: {
                trend: "warming", 
                confidence: 0.82
            },
            alerts: {
                heat_wave: false,
                storm_watch: false,
                air_quality: "moderate"
            }
        };
    }
}


export default new NASAAPI();