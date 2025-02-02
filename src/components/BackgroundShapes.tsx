import React from 'react';
import AnimatedShape from './AnimatedShape';

const BackgroundShapes = () => {
  // Define cube configurations
  const cubes = [
    { size: 32, color: 'bg-yellow-300', top: '10%', left: '10%', depth: 1.5, rotate: 12 },
    { size: 24, color: 'bg-pink-500', top: '30%', right: '20%', depth: 2, rotate: -12 },
    { size: 40, color: 'bg-purple-600', top: '60%', left: '25%', depth: 1.8, rotate: 24 },
    { size: 28, color: 'bg-white', top: '20%', left: '70%', depth: 1.3, rotate: -8 },
    { size: 36, color: 'bg-yellow-300', bottom: '30%', right: '15%', depth: 1.6, rotate: 16 },
    { size: 20, color: 'bg-pink-500', bottom: '20%', left: '40%', depth: 1.4, rotate: -20 },
    { size: 44, color: 'bg-purple-600', top: '40%', right: '40%', depth: 1.7, rotate: 30 },
    { size: 26, color: 'bg-white', bottom: '40%', left: '20%', depth: 1.2, rotate: -15 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {cubes.map((cube, index) => (
        <AnimatedShape 
          key={index}
          depth={cube.depth}
          className={`absolute ${cube.top ? `top-[${cube.top}]` : ''} ${cube.bottom ? `bottom-[${cube.bottom}]` : ''} ${cube.left ? `left-[${cube.left}]` : ''} ${cube.right ? `right-[${cube.right}]` : ''}`}
        >
          <div 
            className={`w-${cube.size} h-${cube.size} ${cube.color} border-4 border-black rotate-${cube.rotate} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
          />
        </AnimatedShape>
      ))}
    </div>
  );
};

export default BackgroundShapes;