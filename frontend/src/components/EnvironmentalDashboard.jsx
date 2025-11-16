import React, { useState, useEffect } from 'react';
import NASAAPI from '../services/nasaAPI';
import './EnvironmentalDashboard.css';

const EnvironmentalDashboard = ({ environmentData, weatherData, systemStatus }) => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (environmentData) {
      setLastUpdated(new Date());
      setIsLoading(false);
    }
  }, [environmentData]);

  const getTrendClass = (trend) => {
    if (!trend) return 'trend-stable';
    if (trend.toLowerCase().includes('increas') || trend.toLowerCase().includes('rising')) 
      return 'trend-increasing';
    if (trend.toLowerCase().includes('decreas') || trend.toLowerCase().includes('falling')) 
      return 'trend-decreasing';
    return 'trend-stable';
  };

  const getThreatLevelColor = (threat) => {
    switch (threat?.toLowerCase()) {
      case 'low': return '#44ff44';
      case 'moderate': return '#ffaa00';
      case 'high': return '#ff4444';
      case 'critical': return '#ff0066';
      default: return '#ffaa00';
    }
  };

  if (isLoading && !environmentData) {
    return (
      <div className="environmental-dashboard">
        <div className="dashboard-header">
          <h2>GaiaNet Planetary Intelligence</h2>
          <p>
            <span className="live-indicator"></span>
            Initializing Systems...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="environmental-dashboard">
      <div className="dashboard-header">
        <h2>GaiaNet Planetary Intelligence</h2>
        <p>
          <span className="live-indicator"></span>
          Live Environmental Monitoring
        </p>
        {lastUpdated && (
          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* System Status */}
      {systemStatus && (
        <div className="data-section">
          <div className="section-title">System Status</div>
          <div className="data-grid">
            <div className="data-item">
              <div className="data-label">Earth Visualization</div>
              <div className="data-value status-online">
                ACTIVE
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">Data Streams</div>
              <div className="data-value">
                {systemStatus.data_streams?.length || 3}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Environmental Metrics */}
      {environmentData && (
        <div className="data-section">
          <div className="section-title">Environmental Metrics</div>
          <div className="data-grid">
            <div className="data-item">
              <div className="data-label">Global Temperature</div>
              <div className="data-value">
                {environmentData.temperature?.global_average?.toFixed(1)}
                <span className="data-unit">°C</span>
              </div>
              <div className={`data-trend ${getTrendClass(environmentData.temperature?.trend)}`}>
                {environmentData.temperature?.anomaly > 0 ? '+' : ''}
                {environmentData.temperature?.anomaly?.toFixed(1)}°C anomaly
              </div>
            </div>
            
            <div className="data-item">
              <div className="data-label">CO₂ Concentration</div>
              <div className="data-value">
                {environmentData.co2?.value}
                <span className="data-unit">ppm</span>
              </div>
              <div className={`data-trend ${getTrendClass(environmentData.co2?.trend)}`}>
                Trend: {environmentData.co2?.trend}
              </div>
            </div>

            <div className="data-item">
              <div className="data-label">Vegetation Health</div>
              <div className="data-value">
                {environmentData.vegetation?.health_index?.toFixed(1)}
                <span className="data-unit">/100</span>
              </div>
              <div style={{ fontSize: '0.75em', color: '#a0f0d0' }}>
                NDVI: {environmentData.vegetation?.ndvi_global?.toFixed(2)}
              </div>
            </div>

            <div className="data-item">
              <div className="data-label">Biodiversity Index</div>
              <div className="data-value">
                {environmentData.biodiversity?.species_richness?.toFixed(1)}
                <span className="data-unit">/10</span>
              </div>
              <div style={{ 
                fontSize: '0.75em', 
                color: getThreatLevelColor(environmentData.biodiversity?.threat_level)
              }}>
                Threat: {environmentData.biodiversity?.threat_level}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weather Data */}
      {weatherData && (
        <div className="data-section">
          <div className="section-title">Current Conditions</div>
          <div className="data-grid">
            <div className="data-item">
              <div className="data-label">Temperature</div>
              <div className="data-value">
                {weatherData.current?.temperature}
                <span className="data-unit">°C</span>
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">Humidity</div>
              <div className="data-value">
                {weatherData.current?.humidity}
                <span className="data-unit">%</span>
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">Wind Speed</div>
              <div className="data-value">
                {weatherData.current?.wind_speed}
                <span className="data-unit">m/s</span>
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">Conditions</div>
              <div className="data-value" style={{ textTransform: 'capitalize', fontSize: '1.1em' }}>
                {weatherData.current?.conditions?.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Sources */}
      {environmentData?.data_sources && (
        <div className="data-sources">
          Data sources: {environmentData.data_sources.join(', ')}
        </div>
      )}
    </div>
  );
};

export default EnvironmentalDashboard;