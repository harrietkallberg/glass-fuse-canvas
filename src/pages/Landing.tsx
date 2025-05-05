
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Helper function to generate a random number within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Helper function to generate a random position within the viewport
const randomPosition = () => ({
  left: `${random(5, 95)}%`,
  top: `${random(5, 95)}%`,
});

const FluidArtBackground = () => {
  // Create arrays for our fluid art elements
  const whiteBlobs = Array.from({ length: 15 }, (_, i) => ({
    id: `white-blob-${i}`,
    size: `${random(25, 120)}px`,
    ...randomPosition(),
    opacity: random(0.6, 0.9),
    animationDuration: `${random(15, 25)}s`,
    animationDelay: `${random(0, 10)}s`,
  }));

  const particles = Array.from({ length: 40 }, (_, i) => {
    const colors = ["#FFFFFF", "#FF7A00", "#00A9B5", "#33C3F0"];
    const sizeMin = i % 3 === 0 ? 8 : 3;
    const sizeMax = i % 3 === 0 ? 20 : 12;
    
    return {
      id: `particle-${i}`,
      size: `${random(sizeMin, sizeMax)}px`,
      ...randomPosition(),
      color: colors[Math.floor(random(0, colors.length))],
      opacity: random(0.5, 1),
      animationDuration: `${random(5, 15)}s`,
      animationDelay: `${random(0, 5)}s`,
    };
  });

  const streamlines = Array.from({ length: 10 }, (_, i) => {
    const isTeal = i % 2 === 0;
    
    return {
      id: `streamline-${i}`,
      width: `${random(100, 300)}px`,
      ...randomPosition(),
      angle: `${random(0, 360)}deg`,
      type: isTeal ? "teal" : "orange",
      animationDuration: `${random(15, 30)}s`,
      animationDelay: `${random(0, 8)}s`,
    };
  });

  return (
    <div className="fluid-art-container">
      {/* Render white blobs */}
      {whiteBlobs.map((blob) => (
        <div
          key={blob.id}
          className={`fluid-blob animate-blob-float-${
            Math.random() > 0.5 ? "slow" : "medium"
          }`}
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.left,
            top: blob.top,
            opacity: blob.opacity,
            backgroundColor: "#FFFFFF",
            animationDelay: blob.animationDelay,
          }}
        />
      ))}

      {/* Render colored particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`fluid-particle animate-particle-pulse-${
            Math.random() > 0.7 ? "slow" : Math.random() > 0.4 ? "medium" : "fast"
          }`}
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animationDelay: particle.animationDelay,
          }}
        />
      ))}

      {/* Render flowing streamlines */}
      {streamlines.map((streamline) => (
        <div
          key={streamline.id}
          className={`fluid-streamline animate-streamline-flow-${
            Math.random() > 0.5 ? "slow" : "medium"
          } bg-streamline-${streamline.type}`}
          style={{
            width: streamline.width,
            left: streamline.left,
            top: streamline.top,
            transform: `rotate(${streamline.angle})`,
            animationDelay: streamline.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center morphing-bg overflow-hidden">
      {/* Add our fluid art background */}
      <FluidArtBackground />
      
      <div className="container relative z-10 max-w-2xl w-full px-4">
        {/* Title directly on background with gradient text */}
        <div className="text-center mb-8 relative">
          <div className="mb-4">
            <h1 className="text-5xl sm:text-6xl font-bold relative z-10 gradient-text-dark text-shadow-lg">
              GlassFuse Studio
            </h1>
            
            <p className="text-xl mt-4 relative z-10 gradient-text-dark text-shadow-sm">
              Create, share, and perfect your glass fusion firing curves
            </p>
          </div>
          
          <p className="text-xl text-foreground/80 mt-4 animate-fade-in backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg inline-block">
            Join a community of passionate glass fusion artists
          </p>
        </div>
        
        <div className="glass-surface p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="w-full sm:w-auto gap-2 h-12 bg-gradient-to-r from-[#F97316] to-[#bd8770] hover:opacity-90 transition-all shadow-md hover:shadow-lg backdrop-blur-md bg-white/10">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link to="/register">
              <Button variant="outline" className="w-full sm:w-auto h-12 bg-white/20 border-white/30 hover:bg-white/30 shadow-md hover:shadow-lg transition-all backdrop-blur-md">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
