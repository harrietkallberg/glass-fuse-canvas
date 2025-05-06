import React, { useEffect } from "react";
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

// Generate random sparkling particles
const generateParticles = (count: number) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      size: Math.random() * 4 + 1, // 1-5px
      x: Math.random() * 100, // 0-100%
      y: Math.random() * 100, // 0-100%
      opacity: Math.random() * 0.5 + 0.1, // 0.1-0.6
      delay: Math.random() * 15, // 0-15s delay for animation
      duration: Math.random() * 20 + 10, // 10-30s animation duration
    });
  }
  return particles;
};

const Dashboard = () => {
  // Add useEffect to initialize and preserve animation state
  useEffect(() => {
    // Use the same stored animation state from Landing/Auth pages
    const storedAnimationTime = sessionStorage.getItem('blobAnimationTime');
    const startTime = storedAnimationTime ? parseInt(storedAnimationTime, 10) : Date.now();
    
    // If no stored state, save the current time
    if (!storedAnimationTime) {
      sessionStorage.setItem('blobAnimationTime', startTime.toString());
    }
    
    // Target the background element
    const backgroundElement = document.querySelector('.fluid-bg-diagonal');
    if (backgroundElement) {
      // Calculate elapsed time since animation started
      const elapsedTime = Date.now() - startTime;
      // Apply the animation with the correct offset to continue from where it left off
      backgroundElement.setAttribute('style', 
        `animation-delay: -${elapsedTime}ms; z-index: 0;`);
    }
    
    // Update the stored time periodically to keep the animation state fresh
    const intervalId = setInterval(() => {
      sessionStorage.setItem('blobAnimationTime', startTime.toString());
    }, 10000); // Update every 10 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Generate 50 sparkling particles
  const particles = generateParticles(50);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Use the same fluid-bg-diagonal from auth pages */}
      <div className="absolute inset-0 fluid-bg-diagonal z-0"></div>
      
      {/* Animated background blob shapes */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div 
          className="fluid-shape bg-[#F97316]/15 w-[40rem] h-[40rem] rounded-full 
                    absolute -top-[10rem] -left-[15rem] animate-float-slow"
        ></div>
        <div 
          className="fluid-shape bg-[#33C3F0]/20 w-[50rem] h-[50rem] rounded-full 
                    absolute -bottom-[15rem] -right-[10rem] animate-float-medium"
        ></div>
        <div 
          className="fluid-shape bg-[#FEC6A1]/15 w-[25rem] h-[25rem] rounded-full 
                    absolute top-[20%] right-[15%] animate-float-slow-reverse"
        ></div>
        <div 
          className="fluid-shape bg-[#A5D8E2]/20 w-[30rem] h-[30rem] rounded-full 
                    absolute bottom-[25%] left-[10%] animate-float-reverse"
        ></div>
        <div 
          className="fluid-shape bg-[#F97316]/10 w-[20rem] h-[20rem] rounded-full 
                    absolute top-[40%] left-[40%] animate-pulse-float"
        ></div>
        
        {/* Dynamic light source effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-diagonal-wave"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-diagonal-reverse-wave"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-cross-diagonal-wave"></div>
        
        {/* Sparkling particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white animate-float-particle pointer-events-none"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.size/2}px rgba(255, 255, 255, ${particle.opacity + 0.2})`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      
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
