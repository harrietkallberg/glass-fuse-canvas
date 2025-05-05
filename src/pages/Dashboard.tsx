
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import CurveCard from "@/components/CurveCard";
import { Link } from "react-router-dom";

// Mock data for curves
const mockCurves = [
  {
    id: "1",
    title: "Standard Bowl Fuse",
    description: "Full fuse for 10mm thick glass bowl project",
    lastUpdated: "2 days ago",
    isPrivate: false,
  },
  {
    id: "2",
    title: "Tack Fuse Experiment",
    description: "Light tack fuse preserving texture for wall art",
    lastUpdated: "1 week ago",
    isPrivate: true,
    colorClass: "glass-yellow"
  },
  {
    id: "3",
    title: "Casting Schedule",
    description: "Slow schedule for thick cast glass sculptures",
    lastUpdated: "3 days ago",
    isPrivate: false,
    colorClass: "glass-orange"
  },
  {
    id: "4",
    title: "Slumping Profile",
    description: "Gentle slumping for decorative plate",
    lastUpdated: "yesterday",
    isPrivate: false,
    colorClass: "glass-green"
  },
  {
    id: "5",
    title: "Delicate Drape",
    description: "Careful schedule for thin glass draping",
    lastUpdated: "3 hours ago",
    isPrivate: true,
    colorClass: "glass-turquoise"
  },
];

// Particle animation component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    // Particle properties
    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
      opacityChange: number;
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 50; // Adjust for more or fewer particles

    const colors = ['#33C3F0', '#F97316', '#A5D8E2', '#FEC6A1'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 0.5, // Size between 0.5 and 3.5
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.3, // Slow horizontal movement
        speedY: (Math.random() - 0.5) * 0.3, // Slow vertical movement
        opacity: Math.random() * 0.5, // Start with random opacity for variety
        opacityChange: Math.random() * 0.01 - 0.005 // Random change direction
      });
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with slight persistence for trailing effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Update opacity (glistening effect)
        particle.opacity += particle.opacityChange;
        
        // Reverse opacity change if reaching bounds
        if (particle.opacity > 0.6 || particle.opacity < 0.1) {
          particle.opacityChange = -particle.opacityChange;
        }
        
        // Reset position if off canvas
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.x = Math.random() * canvas.width;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.y = Math.random() * canvas.height;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Use the color with changing opacity
        const rgba = particle.color.replace('rgb', 'rgba').replace(')', `, ${particle.opacity})`);
        ctx.fillStyle = rgba;
        
        // Add glow effect for sparkle
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        
        ctx.fill();
        ctx.closePath();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#A5D8E2]/30 to-[#FEC6A1]/40 z-0" />
      
      {/* Particle background */}
      <ParticleBackground />
      
      <Navigation />
      
      <div className="container mx-auto pt-24 px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2A6B6B]" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.1)' }}>
              Your Firing Curves
            </h1>
            <p className="text-muted-foreground">Create and manage your glass fusion schedules</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search your curves..." className="pl-8 glass-surface backdrop-blur-md bg-white/30" />
            </div>
            
            <Link to="/create">
              <Button className="gap-1 glass-vibrant-orange backdrop-blur-md shadow-md hover:shadow-lg">
                <Plus className="h-4 w-4" />
                New Curve
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCurves.map(curve => (
            <div key={curve.id} className="transform transition-all hover:scale-102 hover:-translate-y-1 duration-300">
              <CurveCard
                id={curve.id}
                title={curve.title}
                description={curve.description}
                lastUpdated={curve.lastUpdated}
                isPrivate={curve.isPrivate}
                colorClass={curve.colorClass}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
