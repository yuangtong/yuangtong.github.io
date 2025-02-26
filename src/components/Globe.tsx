import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';

interface Country {
  lat: number;
  lng: number;
  name: string;
  projects: number;
}

const countries: Country[] = [
  { lat: 40.4168, lng: -3.7038, name: 'Spain', projects: 5 },
  { lat: 51.5074, lng: -0.1278, name: 'United Kingdom', projects: 3 },
  { lat: 52.5200, lng: 13.4050, name: 'Germany', projects: 4 },
  { lat: 48.8566, lng: 2.3522, name: 'France', projects: 2 },
  { lat: 37.7749, lng: -122.4194, name: 'United States', projects: 6 },
  { lat: 35.6762, lng: 139.6503, name: 'Japan', projects: 3 },
  { lat: -33.8688, lng: 151.2093, name: 'Australia', projects: 2 }
];

const GlobeVisualization = () => {
  const globeRef = useRef<any>();

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      
      // Add ambient light for better visibility
      const ambientLight = globeRef.current.scene().children.find(obj => obj.type === 'AmbientLight');
      if (ambientLight) {
        ambientLight.intensity = 1.2;
      }

      // Adjust camera position for better mobile view
      const camera = globeRef.current.camera();
      camera.position.z = window.innerWidth < 768 ? 400 : 300;
    }

    // Handle resize
    const handleResize = () => {
      if (globeRef.current) {
        const camera = globeRef.current.camera();
        camera.position.z = window.innerWidth < 768 ? 400 : 300;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full"
    >
      <Globe
        ref={globeRef}
        width={window.innerWidth < 768 ? 400 : 800}
        height={window.innerWidth < 768 ? 400 : 800}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={countries}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#F0ABFC'}
        pointAltitude={0.12}
        pointRadius={window.innerWidth < 768 ? 0.1 : 0.08}
        pointsMerge={true}
        atmosphereColor="#F0ABFC"
        atmosphereAltitude={0.15}
        labelText="name"
        labelSize={window.innerWidth < 768 ? 2.5 : 2.0}
        labelDotRadius={window.innerWidth < 768 ? 0.8 : 0.6}
        labelColor={() => '#F0ABFC'}
        labelResolution={2}
        labelAltitude={0.01}
        labelDotOrientation={() => 'right'}
        hexPolygonsData={[]}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => '#1a1a1a'}
        glowCoefficient={0.3}
        atmosphereGlowCoefficient={8}
        atmosphereGlowColor="#F0ABFC"
        atmosphereGlowPower={4}
        atmosphereGlowRadiusScale={1.2}
      />
    </motion.div>
  );
};

export default GlobeVisualization;