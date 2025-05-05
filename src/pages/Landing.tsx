
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Canvas setup for particles
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class with glass-like effect
    class Particle {
      x: number;
      y: number;
      size: number;
      baseColor: string;
      speedX: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
      glowRadius: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2; // Much smaller sizes (was 20 + 8)
        this.baseColor = Math.random() > 0.5 ? '#F97316' : '#33C3F0'; // Orange or Teal
        this.speedX = (Math.random() - 0.5) * 0.3; // Slower movement
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2; // More visible
        this.pulseSpeed = Math.random() * 0.002 + 0.001; // Speed of pulsing effect
        this.glowRadius = this.size * 0.7; // Size of the inner glow
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundary check with smooth turning
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX * 0.9; // Slow down slightly when bouncing
          // Ensure particle stays within bounds
          if (this.x < 0) this.x = 1;
          if (this.x > canvas.width) this.x = canvas.width - 1;
        }
        
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY * 0.9;
          // Ensure particle stays within bounds
          if (this.y < 0) this.y = 1;
          if (this.y > canvas.height) this.y = canvas.height - 1;
        }

        // Pulsing opacity for morphing effect
        this.opacity = 0.2 + Math.sin(Date.now() * this.pulseSpeed) * 0.1 + 0.2;
      }

      draw() {
        if (!ctx) return;
        
        // Create glass-like effect with gradient
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        // Get the base color components for manipulating
        const isOrange = this.baseColor === '#F97316';
        let r = isOrange ? 249 : 51;
        let g = isOrange ? 115 : 195;
        let b = isOrange ? 22 : 240;
        
        // Create lighter center, darker edge gradient
        // Inner light center - almost white tint of the base color
        gradient.addColorStop(0, `rgba(${r + (255-r)*0.7}, ${g + (255-g)*0.7}, ${b + (255-b)*0.7}, ${this.opacity * 1.2})`);
        
        // Middle - base color
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        
        // Outer - darker edge
        gradient.addColorStop(1, `rgba(${r*0.6}, ${g*0.6}, ${b*0.6}, ${this.opacity * 0.6})`);
        
        // Draw the main particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add subtle blur effect
        ctx.shadowColor = this.baseColor;
        ctx.shadowBlur = 5; // Reduced shadow blur for smaller particles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) { // Increased count since particles are smaller
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      // Clear with slight opacity to create trailing effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Background canvas for particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0"
        style={{ zIndex: -30 }}
      />
      
      {/* Background blob with lower z-index to ensure it stays behind all content */}
      <div 
        className="absolute inset-0 fluid-bg-diagonal" 
        style={{ zIndex: -20 }}
      >
        {/* This ensures all animation and gradient effects stay in this background layer */}
      </div>
      
      <div className="container relative max-w-2xl w-full px-4 flex flex-col items-center pt-0 md:pt-4" style={{ zIndex: 30 }}>
        {/* Title section with solid color instead of gradient */}
        <div className="text-center w-full mb-6 relative">
          <div className="bg-transparent p-6 rounded-xl mb-6 relative">
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl font-bold text-[#2A6B6B] mb-3 relative" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.2)' }}>
                GlassFuse Studio
              </h1>
              
              <p className="text-xl text-[#1D4848] relative" style={{ textShadow: '1px 2px 3px rgba(0,0,0,0.1)' }}>
                Create, share, and perfect your glass fusion firing curves
              </p>
            </div>
          </div>
          
          <div className="glass-vibrant-cream p-4 rounded-xl inline-block" style={{ position: 'relative', zIndex: 35 }}>
            <p className="text-xl text-foreground/80 animate-fade-in">
              Join a community of passionate glass fusion artists
            </p>
          </div>
        </div>
        
        {/* Feature grid with slightly lower z-index than title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 w-full relative" style={{ zIndex: 30 }}>
          <div className="glass-vibrant-orange p-6 rounded-xl hover:scale-[1.02] transition-transform">
            <h3 className="font-medium text-lg mb-2">Create Precise Curves</h3>
            <p className="text-foreground/80">Design customized firing schedules for your unique glass projects</p>
          </div>
          
          <div className="glass-vibrant-cream p-6 rounded-xl hover:scale-[1.02] transition-transform">
            <h3 className="font-medium text-lg mb-2">Document Your Process</h3>
            <p className="text-foreground/80">Track your results with images and maintain version history</p>
          </div>
          
          <div className="glass-vibrant-sage p-6 rounded-xl hover:scale-[1.02] transition-transform">
            <h3 className="font-medium text-lg mb-2">Connect with Artists</h3>
            <p className="text-foreground/80">Share your work and learn from other glass fusion enthusiasts</p>
          </div>
          
          <div className="glass-vibrant-taupe p-6 rounded-xl hover:scale-[1.02] transition-transform">
            <h3 className="font-medium text-lg mb-2">Perfect Your Craft</h3>
            <p className="text-foreground/80">Refine your techniques through iteration and community feedback</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full relative" style={{ zIndex: 30 }}>
          <Link to="/login" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 h-12 glass-vibrant-orange hover:opacity-90 transition-all shadow-md hover:shadow-lg backdrop-blur-md">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-12 bg-white/20 border-white/30 hover:bg-white/30 shadow-md hover:shadow-lg transition-all backdrop-blur-md">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
