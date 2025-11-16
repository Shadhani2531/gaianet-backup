import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DataVisualization = ({ activeLayers, environmentData, layerOpacities }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef();
  const dataLayersRef = useRef(new Map());

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene for data visualization
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear previous layers
    dataLayersRef.current.forEach(layer => {
      sceneRef.current.remove(layer);
    });
    dataLayersRef.current.clear();

    // Add new visualization layers
    activeLayers.forEach(layer => {
      const visualization = createDataVisualization(layer, environmentData, layerOpacities[layer]);
      if (visualization) {
        sceneRef.current.add(visualization);
        dataLayersRef.current.set(layer, visualization);
      }
    });

  }, [activeLayers, environmentData, layerOpacities]);

  const createDataVisualization = (layer, data, opacity) => {
    switch (layer) {
      case 'temperature':
        return createTemperatureViz(data, opacity);
      case 'co2':
        return createCO2Viz(data, opacity);
      case 'vegetation':
        return createVegetationViz(data, opacity);
      default:
        return null;
    }
  };

  const createTemperatureViz = (data, opacity) => {
    const temp = data?.temperature?.global_average || 15;
    const anomaly = data?.temperature?.anomaly || 0;
    
    // Create temperature gradient visualization
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6 - (temp / 30), 0.8, 0.5),
      transparent: true,
      opacity: opacity
    });
    
    return new THREE.Mesh(geometry, material);
  };

  const createCO2Viz = (data, opacity) => {
    const co2 = data?.co2?.value || 417;
    const intensity = Math.min(1, (co2 - 300) / 200);
    
    const group = new THREE.Group();
    
    // CO2 molecule-like visualization
    const centerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: opacity * intensity
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    group.add(center);
    
    // Surrounding particles
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8800,
        transparent: true,
        opacity: opacity * 0.7
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0);
      group.add(particle);
    }
    
    return group;
  };

  const createVegetationViz = (data, opacity) => {
    const ndvi = data?.vegetation?.ndvi_global || 0.4;
    const health = data?.vegetation?.health_index || 75;
    
    const group = new THREE.Group();
    
    // Tree-like visualization
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8);
    const trunkMaterial = new THREE.MeshBasicMaterial({
      color: 0x8B4513,
      transparent: true,
      opacity: opacity
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    group.add(trunk);
    
    // Canopy based on vegetation health
    const canopyGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const canopyMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.3, 0.8, 0.3 + (health / 200)),
      transparent: true,
      opacity: opacity * 0.8
    });
    const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
    canopy.position.y = 0.8;
    group.add(canopy);
    
    return group;
  };

  return (
    <div className="data-visualization">
      <h3>Data Visualization</h3>
      <div ref={mountRef} className="viz-canvas"></div>
      <div className="viz-legend">
        {activeLayers.map(layer => (
          <div key={layer} className="legend-item">
            <span className="legend-color"></span>
            <span className="legend-label">{layer}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataVisualization;