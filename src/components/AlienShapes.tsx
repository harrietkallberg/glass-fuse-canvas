
import React, { useEffect, useRef } from 'react';

// Enhanced organic shapes component with smoke, twigs, and small creatures
const AlienShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Create multiple shapes with different colors and sizes - earthy tones
    const colors = [
      '#C8E0B8', // yellowing green
      '#A0C1A3', // leaf green
      '#D2A976', // warm sand
      '#A67F5D', // earthy brown
      '#CB8F7E', // clay color
      '#8BA888', // sage green
      '#73594C', // dark soil
      '#F0F4D5', // light smoke
      '#E6E8D4', // smoke
    ];
    
    // Create base organic shapes
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
    
    // Create "smoke" particles
    const createSmoke = () => {
      const smoke = document.createElement('div');
      const size = Math.random() * 200 + 50;
      const opacity = Math.random() * 0.3 + 0.1;
      const duration = Math.random() * 30 + 30;
      const initialX = Math.random() * window.innerWidth;
      
      smoke.className = 'absolute pointer-events-none';
      smoke.style.width = `${size}px`;
      smoke.style.height = `${size}px`;
      smoke.style.backgroundColor = '#E6E8D4';
      smoke.style.opacity = `${opacity}`;
      smoke.style.borderRadius = '50%';
      smoke.style.filter = 'blur(20px)';
      smoke.style.left = `${initialX}px`;
      smoke.style.bottom = '-100px';
      smoke.style.zIndex = '2';
      
      container.appendChild(smoke);
      
      // Smoke rises animation
      const rise = () => {
        const height = window.innerHeight + 200;
        smoke.animate([
          { bottom: '-100px', opacity: `${opacity}`, transform: 'scale(1)' },
          { bottom: `${height}px`, opacity: '0', transform: 'scale(2)' }
        ], {
          duration: duration * 1000,
          fill: 'forwards',
          easing: 'ease-out'
        });
      };
      
      rise();
      
      // Remove smoke after animation
      setTimeout(() => {
        if (container.contains(smoke)) {
          container.removeChild(smoke);
        }
        createSmoke();
      }, duration * 1000);
    };
    
    // Create twig elements
    const createTwig = () => {
      const twig = document.createElement('div');
      const height = Math.random() * 50 + 20;
      const width = height * 0.2;
      const rotation = Math.random() * 360;
      const initialX = Math.random() * window.innerWidth;
      const initialY = Math.random() * window.innerHeight;
      
      twig.className = 'absolute pointer-events-none';
      twig.style.width = `${width}px`;
      twig.style.height = `${height}px`;
      twig.style.backgroundColor = '#73594C';
      twig.style.borderRadius = '40% 20% 40% 20%';
      twig.style.transform = `rotate(${rotation}deg)`;
      twig.style.left = `${initialX}px`;
      twig.style.top = `${initialY}px`;
      twig.style.zIndex = '3';
      twig.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.3)';
      
      // Add branches
      const branchCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < branchCount; i++) {
        const branch = document.createElement('div');
        const branchHeight = height * (Math.random() * 0.5 + 0.2);
        const branchWidth = width * 0.7;
        const branchRotation = Math.random() * 90 - 45;
        const topPosition = Math.random() * height * 0.7;
        
        branch.className = 'absolute';
        branch.style.width = `${branchWidth}px`;
        branch.style.height = `${branchHeight}px`;
        branch.style.backgroundColor = '#73594C';
        branch.style.borderRadius = '30% 20% 30% 20%';
        branch.style.transformOrigin = '0 0';
        branch.style.transform = `rotate(${branchRotation}deg)`;
        branch.style.left = '100%';
        branch.style.top = `${topPosition}px`;
        
        twig.appendChild(branch);
      }
      
      container.appendChild(twig);
      
      // Subtle movement animation
      const animate = () => {
        const newRotation = rotation + (Math.random() * 10 - 5);
        
        twig.animate([
          { transform: `rotate(${rotation}deg)` },
          { transform: `rotate(${newRotation}deg)` }
        ], {
          duration: 10000,
          fill: 'forwards',
          easing: 'ease-in-out'
        });
      };
      
      animate();
    };
    
    // Create small creatures
    const createCreature = () => {
      const creature = document.createElement('div');
      const size = Math.random() * 15 + 5;
      const initialX = Math.random() * window.innerWidth;
      const initialY = Math.random() * window.innerHeight;
      
      // Creature body
      creature.className = 'absolute pointer-events-none flex items-center justify-center';
      creature.style.width = `${size}px`;
      creature.style.height = `${size}px`;
      creature.style.borderRadius = '50%';
      creature.style.backgroundColor = Math.random() > 0.5 ? '#637557' : '#A67F5D'; 
      creature.style.left = `${initialX}px`;
      creature.style.top = `${initialY}px`;
      creature.style.zIndex = '4';
      
      // Create legs
      const legCount = Math.floor(Math.random() * 4) + 3;
      for (let i = 0; i < legCount; i++) {
        const leg = document.createElement('div');
        const legLength = size * (Math.random() * 0.7 + 0.3);
        const legWidth = size * 0.15;
        const rotation = (i * 360 / legCount);
        
        leg.className = 'absolute pointer-events-none';
        leg.style.width = `${legWidth}px`;
        leg.style.height = `${legLength}px`;
        leg.style.backgroundColor = creature.style.backgroundColor;
        leg.style.transformOrigin = 'top center';
        leg.style.transform = `rotate(${rotation}deg)`;
        leg.style.top = '50%';
        leg.style.left = '50%';
        leg.style.marginLeft = `-${legWidth/2}px`;
        
        creature.appendChild(leg);
      }
      
      container.appendChild(creature);
      
      // Random crawling animation
      const crawl = () => {
        const newX = initialX + (Math.random() * 100 - 50);
        const newY = initialY + (Math.random() * 100 - 50);
        const duration = Math.random() * 5000 + 3000;
        
        creature.animate([
          { left: `${creature.offsetLeft}px`, top: `${creature.offsetTop}px` },
          { left: `${newX}px`, top: `${newY}px` }
        ], {
          duration: duration,
          fill: 'forwards',
          easing: 'ease-in-out'
        });
        
        setTimeout(crawl, duration);
      };
      
      setTimeout(crawl, Math.random() * 1000);
    };
    
    // Create industrial ruins elements
    const createIndustrialElement = () => {
      const element = document.createElement('div');
      const width = Math.random() * 100 + 50;
      const height = Math.random() * 200 + 100;
      const initialX = Math.random() * window.innerWidth;
      const initialY = Math.random() * window.innerHeight * 0.7;
      
      element.className = 'absolute pointer-events-none';
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.style.backgroundColor = '#3d3d3d';
      element.style.left = `${initialX}px`;
      element.style.top = `${initialY}px`;
      element.style.zIndex = '0';
      element.style.opacity = '0.6';
      element.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      
      // Add rust or damage effect
      if (Math.random() > 0.5) {
        element.style.background = 'linear-gradient(to bottom, #3d3d3d, #754C29)';
      }
      
      // Add windows or details to structure
      const detailCount = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < detailCount; i++) {
        const detail = document.createElement('div');
        const detailWidth = width * 0.3;
        const detailHeight = height * 0.1;
        const topPosition = Math.random() * (height - detailHeight);
        const leftPosition = Math.random() * (width - detailWidth);
        
        detail.className = 'absolute';
        detail.style.width = `${detailWidth}px`;
        detail.style.height = `${detailHeight}px`;
        detail.style.backgroundColor = Math.random() > 0.7 ? '#1a1a1a' : '#4a4a4a';
        detail.style.top = `${topPosition}px`;
        detail.style.left = `${leftPosition}px`;
        
        element.appendChild(detail);
      }
      
      container.appendChild(element);
    };

    // Create base shapes
    for (let i = 0; i < 10; i++) {
      createShape();
    }
    
    // Create smoke elements that continuously appear
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createSmoke();
      }, i * 5000);
    }
    
    // Create scattered twigs
    for (let i = 0; i < 15; i++) {
      createTwig();
    }
    
    // Create small creatures
    for (let i = 0; i < 8; i++) {
      createCreature();
    }
    
    // Create industrial ruins in the background
    for (let i = 0; i < 6; i++) {
      createIndustrialElement();
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
