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
  { lat: 37.7749, lng: -77.4194, name: 'United States (VA)', projects: 5 },
  { lat: -12.0464, lng: -77.0428, name: 'Peru', projects: 3 },
  { lat: 18.4861, lng: -69.9312, name: 'Dominican Republic', projects: 4 },
  { lat: 45.4215, lng: -75.6972, name: 'Canada', projects: 2 },
  { lat: 40.4168, lng: -3.7038, name: 'Spain', projects: 4 },
  { lat: -6.3690, lng: 34.8888, name: 'Tanzania', projects: 3 },
  { lat: -15.7975, lng: -47.8919, name: 'Brazil', projects: 3 }
];

interface GlobeProps {
  disableInteractionOnMobile?: boolean;
}

const GlobeVisualization: React.FC<GlobeProps> = ({ disableInteractionOnMobile = true }) => {
  const globeRef = useRef<any>();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      
      // Set auto-rotation
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      
      // Disable interactions on mobile if specified
      if (isMobile && disableInteractionOnMobile) {
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableRotate = false;
        controls.autoRotate = true;
      }
      
      // Add ambient light for better visibility
      const ambientLight = globeRef.current.scene().children.find(obj => obj.type === 'AmbientLight');
      if (ambientLight) {
        ambientLight.intensity = 1.2;
      }

      // Adjust camera position for better mobile view
      const camera = globeRef.current.camera();
      camera.position.z = isMobile ? 400 : 300;
    }

    // Handle resize
    const handleResize = () => {
      if (globeRef.current) {
        const camera = globeRef.current.camera();
        const newIsMobile = window.innerWidth < 768;
        camera.position.z = newIsMobile ? 400 : 300;

        // Update controls on resize
        const controls = globeRef.current.controls();
        if (newIsMobile && disableInteractionOnMobile) {
          controls.enableZoom = false;
          controls.enablePan = false;
          controls.enableRotate = false;
          controls.autoRotate = true;
        } else {
          controls.enableZoom = true;
          controls.enablePan = true;
          controls.enableRotate = true;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [disableInteractionOnMobile, isMobile]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full"
    >
      <Globe
        ref={globeRef}
        width={window.innerWidth < 768 ? 600 : 900}
        height={window.innerWidth < 768 ? 600 : 900}
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