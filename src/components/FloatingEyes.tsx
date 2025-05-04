
import React, { useEffect, useRef } from 'react';

// Component to create floating, watching eyes that follow the cursor
const FloatingEyes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // Create eyes
    const container = containerRef.current;
    if (container) {
      const eyeCount = 5;
      
      for (let i = 0; i < eyeCount; i++) {
        // Create eye container
        const eyeContainer = document.createElement('div');
        eyeContainer.className = 'absolute';
        eyeContainer.style.width = '40px';
        eyeContainer.style.height = '40px';
        eyeContainer.style.borderRadius = '50%';
        eyeContainer.style.backgroundColor = '#5B81B1'; // Pale blue alien eyes
        eyeContainer.style.boxShadow = '0 0 10px rgba(91, 129, 177, 0.7)';
        eyeContainer.style.left = `${Math.random() * 80 + 10}%`;
        eyeContainer.style.top = `${Math.random() * 80 + 10}%`;
        eyeContainer.style.opacity = '0.7';
        eyeContainer.style.zIndex = '5';
        
        // Create eye pupil (red)
        const pupil = document.createElement('div');
        pupil.className = 'absolute';
        pupil.style.width = '15px';
        pupil.style.height = '15px';
        pupil.style.borderRadius = '50%';
        pupil.style.backgroundColor = '#991B1B'; // Red pupil
        pupil.style.left = '50%';
        pupil.style.top = '50%';
        pupil.style.transform = 'translate(-50%, -50%)';
        
        eyeContainer.appendChild(pupil);
        container.appendChild(eyeContainer);
        eyesRef.current.push(eyeContainer);
        
        // Random slow floating animation for eye position
        const animatePosition = () => {
          const newX = Math.random() * 80 + 10;
          const newY = Math.random() * 80 + 10;
          
          eyeContainer.animate([
            { left: eyeContainer.style.left, top: eyeContainer.style.top },
            { left: `${newX}%`, top: `${newY}%` }
          ], {
            duration: 20000 + Math.random() * 20000,
            fill: 'forwards',
            easing: 'ease-in-out'
          });
          
          setTimeout(animatePosition, 20000 + Math.random() * 20000);
        };
        
        animatePosition();
      }
      
      // Animate pupils to follow cursor
      const animateEyes = () => {
        eyesRef.current.forEach(eye => {
          const pupil = eye.firstChild as HTMLElement;
          if (!pupil) return;
          
          // Get eye position
          const eyeRect = eye.getBoundingClientRect();
          const eyeCenterX = eyeRect.left + eyeRect.width / 2;
          const eyeCenterY = eyeRect.top + eyeRect.height / 2;
          
          // Calculate angle between eye and cursor
          const angle = Math.atan2(
            mousePosition.current.y - eyeCenterY,
            mousePosition.current.x - eyeCenterX
          );
          
          // Max distance pupil can move from center (px)
          const maxDistance = 8;
          
          // Calculate pupil position
          const pupilX = Math.cos(angle) * maxDistance;
          const pupilY = Math.sin(angle) * maxDistance;
          
          // Position pupil
          pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
        });
        
        requestAnimationFrame(animateEyes);
      };
      
      animateEyes();
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      const container = containerRef.current;
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, []);
  
  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10"></div>;
};

export default FloatingEyes;
