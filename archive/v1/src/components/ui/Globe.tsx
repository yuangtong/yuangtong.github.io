import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import * as THREE from 'three';

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
  
  // Add state for dimensions that updates on resize
  const [dimensions, setDimensions] = React.useState({
    width: isMobile ? 320 : 600,
    height: isMobile ? 320 : 600
  });

  useEffect(() => {
    // Set initial dimensions
    updateDimensions();
    
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
      const ambientLight = globeRef.current.scene().children.find((obj: THREE.Object3D) => obj.type === 'AmbientLight');
      if (ambientLight) {
        ambientLight.intensity = 1.2;
      }

      // Adjust camera position for better mobile view
      const camera = globeRef.current.camera();
      camera.position.z = isMobile ? 400 : 300;
    }

    // Function to update dimensions based on container size and screen width
    function updateDimensions() {
      const containerWidth = window.innerWidth;
      let newWidth, newHeight;
      
      if (containerWidth < 768) {
        // Mobile sizes
        newWidth = Math.min(containerWidth - 40, 320);
        newHeight = newWidth;
      } else if (containerWidth < 1024) {
        // Tablet sizes
        newWidth = Math.min(containerWidth * 0.6, 500);
        newHeight = newWidth;
      } else {
        // Desktop sizes
        newWidth = Math.min(containerWidth * 0.4, 600);
        newHeight = newWidth;
      }
      
      setDimensions({
        width: newWidth,
        height: newHeight
      });
    }

    // Handle resize
    const handleResize = () => {
      updateDimensions();
      
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
      className="h-full w-full flex items-center justify-center"
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={countries}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#F0ABFC'}
        pointAltitude={0.12}
        pointRadius={isMobile ? 0.12 : 0.08}
        pointsMerge={true}
        atmosphereColor="#F0ABFC"
        atmosphereAltitude={0.15}
        labelText="name"
        labelSize={isMobile ? 2.5 : 2.0}
        labelDotRadius={isMobile ? 0.8 : 0.6}
        labelColor={() => '#F0ABFC'}
        labelResolution={2}
        labelAltitude={0.01}
        labelDotOrientation={() => 'right'}
        hexPolygonsData={[]}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => '#1a1a1a'}        
        // glowCoefficient={0.3}
        // atmosphereGlowCoefficient={8}
        // atmosphereGlowColor="#F0ABFC"
        // atmosphereGlowPower={4}
        // atmosphereGlowRadiusScale={1.2}
      />
    </motion.div>
  );
};

export default GlobeVisualization;