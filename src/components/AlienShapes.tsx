
import React, { useEffect, useRef } from 'react';

// Alien shapes component that creates bizarre, organic, morphing shapes in the background
const AlienShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Create multiple shapes with different colors and sizes
    const colors = [
      '#5B81B1', // light blue (alien skin)
      '#792D54', // burgundy
      '#D0A659', // mustard/gold
      '#9B6D4C', // brown
      '#9B596D', // mauve
      '#4D6D82', // blue-gray
    ];
    
    const createShape = () => {
      const shape = document.createElement('div');
      const size = Math.random() * 300 + 100;
      
      // Random properties for each shape
      const color = colors[Math.floor(Math.random() * colors.length)];
      const initialX = Math.random() * window.innerWidth;
      const initialY = Math.random() * window.innerHeight;
      const duration = Math.random() * 60 + 40;
      
      // Create bizarre, organic shapes using border-radius
      const topLeft = Math.random() * 60;
      const topRight = Math.random() * 60;
      const bottomRight = Math.random() * 60;
      const bottomLeft = Math.random() * 60;
      
      shape.className = 'absolute pointer-events-none';
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.backgroundColor = color;
      shape.style.opacity = '0.3';
      shape.style.borderRadius = `${topLeft}% ${topRight}% ${bottomRight}% ${bottomLeft}%`;
      shape.style.filter = 'blur(10px)';
      shape.style.left = `${initialX}px`;
      shape.style.top = `${initialY}px`;
      shape.style.zIndex = '1';
      shape.style.transformOrigin = 'center';
      
      container.appendChild(shape);
      
      // Slow, eerie animation for each shape
      const animate = () => {
        // Random new positions and morphing shapes
        const newX = Math.random() * window.innerWidth;
        const newY = Math.random() * window.innerHeight;
        const newTopLeft = Math.random() * 60;
        const newTopRight = Math.random() * 60;
        const newBottomRight = Math.random() * 60;
        const newBottomLeft = Math.random() * 60;
        const newRotate = Math.random() * 360;
        const newScale = 0.8 + Math.random() * 0.5;
        
        shape.animate([
          { 
            left: `${shape.offsetLeft}px`,
            top: `${shape.offsetTop}px`,
            borderRadius: shape.style.borderRadius,
            transform: shape.style.transform || 'rotate(0deg) scale(1)',
          },
          { 
            left: `${newX}px`,
            top: `${newY}px`,
            borderRadius: `${newTopLeft}% ${newTopRight}% ${newBottomRight}% ${newBottomLeft}%`,
            transform: `rotate(${newRotate}deg) scale(${newScale})`,
          }
        ], {
          duration: duration * 1000,
          fill: 'forwards',
          easing: 'ease-in-out'
        });
        
        // Schedule next animation
        setTimeout(animate, duration * 1000);
      };
      
      // Start animation
      setTimeout(animate, Math.random() * 2000);
    };
    
    // Create multiple shapes
    for (let i = 0; i < 12; i++) {
      createShape();
    }
    
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);
  
  return <div ref={containerRef} className="fixed inset-0 overflow-hidden z-0"></div>;
};

export default AlienShapes;
