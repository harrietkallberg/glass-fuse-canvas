
import React from "react";
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

// Helper to check if a position would overlap with the center content area
const isOverlappingContent = (left: string, top: string) => {
  const leftNum = parseFloat(left);
  const topNum = parseFloat(top);
  
  // Avoid the center of the screen where content is located
  return (leftNum > 30 && leftNum < 70 && topNum > 30 && topNum < 70);
};

const FluidArtBackground = () => {
  // Create arrays for our fluid art elements
  const whiteBlobs = Array.from({ length: 15 }, (_, i) => {
    let position;
    // Generate positions until we find one that doesn't overlap with content
    do {
      position = randomPosition();
    } while (isOverlappingContent(position.left, position.top));
    
    return {
      id: `white-blob-${i}`,
      size: `${random(15, 60)}px`, // Smaller sizes to be less intrusive
      ...position,
      opacity: random(0.65, 0.95),
      animationDelay: `${random(0, 10)}s`,
      zIndex: 25 // Higher z-index to ensure they're on top
    };
  });

  const particles = Array.from({ length: 50 }, (_, i) => {
    // More subtle color palette with only orange, white and teal/turquoise
    const colors = [
      "#FFFFFF", // White
      "#FFF5EE", // Almost white
      "#FF9B2B", // Light orange
      "#F97316", // Bright orange
      "#FD8D14", // Medium orange
      "#00A9B5", // Medium teal
      "#0EA5E9", // Ocean blue
      "#33C3F0", // Sky blue
    ];
    
    let position;
    // Generate positions until we find one that doesn't overlap with content
    do {
      position = randomPosition();
    } while (isOverlappingContent(position.left, position.top));
    
    const sizeMin = i % 3 === 0 ? 6 : 3;
    const sizeMax = i % 3 === 0 ? 15 : 10;
    
    return {
      id: `particle-${i}`,
      size: `${random(sizeMin, sizeMax)}px`,
      ...position,
      color: colors[Math.floor(random(0, colors.length))],
      opacity: random(0.6, 0.9),
      animationDelay: `${random(0, 5)}s`,
      blur: `${random(0, 2)}px`, // Minimal blur
      zIndex: Math.floor(random(15, 20))
    };
  });

  const streamlines = Array.from({ length: 35 }, (_, i) => {
    // Streamline colors limited to teal and orange tones
    const types = [
      "dark-teal", // #00757F
      "medium-teal", // #00A9B5
      "light-teal", // #14B8A6
      "vibrant-orange", // #FF7A00
      "bright-orange", // #F97316
      "light-orange", // #FF9B2B
    ];
    
    const type = types[Math.floor(random(0, types.length))];
    
    return {
      id: `streamline-${i}`,
      width: `${random(200, 450)}px`, // Much longer streamlines
      ...randomPosition(), // Random positions all over
      angle: `${random(25, 45)}deg`, // Diagonal angles
      type: type,
      animationDelay: `${random(0, 8)}s`,
      animationClass: random(0, 1) > 0.3 ? "slow" : random(0, 1) > 0.5 ? "medium" : "fast",
      zIndex: Math.floor(random(10, 15))
    };
  });

  // Create morphing large bubbles
  const morphingBubbles = Array.from({ length: 8 }, (_, i) => {
    const colors = [
      "rgba(255,255,255,0.8)", // White
      "rgba(255,122,0,0.4)",   // Vibrant orange
      "rgba(249,115,22,0.4)",  // Bright orange
      "rgba(0,169,181,0.4)",   // Medium teal
      "rgba(14,165,233,0.4)",  // Ocean blue
    ];
    
    let position;
    // Generate positions until we find one that doesn't overlap with content
    do {
      position = randomPosition();
    } while (isOverlappingContent(position.left, position.top));
    
    return {
      id: `morph-bubble-${i}`,
      size: `${random(80, 120)}px`,
      ...position,
      color: colors[Math.floor(random(0, colors.length))],
      opacity: random(0.4, 0.7),
      animationDelay: `${random(0, 15)}s`,
      animationDuration: `${random(25, 40)}s`,
      transformScale: random(0.9, 1.1),
      blur: `${random(3, 6)}px`,
      zIndex: Math.floor(random(12, 15))
    };
  });

  return (
    <div className="fluid-art-container">
      {/* Render morphing bubbles (behind everything else) */}
      {morphingBubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="fluid-morph-bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            top: bubble.top,
            opacity: bubble.opacity,
            backgroundColor: bubble.color,
            filter: `blur(${bubble.blur})`,
            animationDelay: bubble.animationDelay,
            animationDuration: bubble.animationDuration,
            transform: `scale(${bubble.transformScale})`,
            zIndex: bubble.zIndex,
          }}
        />
      ))}

      {/* Render flowing streamlines */}
      {streamlines.map((streamline) => {
        // Create gradient based on the streamline type
        let gradient;
        switch(streamline.type) {
          case "dark-teal":
            gradient = "linear-gradient(90deg, rgba(0,117,127,0), rgba(0,117,127,0.8), rgba(0,117,127,0))";
            break;
          case "medium-teal":
            gradient = "linear-gradient(90deg, rgba(0,169,181,0), rgba(0,169,181,0.8), rgba(0,169,181,0))";
            break;
          case "light-teal":
            gradient = "linear-gradient(90deg, rgba(20,184,166,0), rgba(20,184,166,0.8), rgba(20,184,166,0))";
            break;
          case "vibrant-orange":
            gradient = "linear-gradient(90deg, rgba(255,122,0,0), rgba(255,122,0,0.8), rgba(255,122,0,0))";
            break;
          case "bright-orange":
            gradient = "linear-gradient(90deg, rgba(249,115,22,0), rgba(249,115,22,0.8), rgba(249,115,22,0))";
            break;
          case "light-orange":
            gradient = "linear-gradient(90deg, rgba(255,155,43,0), rgba(255,155,43,0.8), rgba(255,155,43,0))";
            break;
          default:
            gradient = "linear-gradient(90deg, rgba(0,117,127,0), rgba(0,117,127,0.8), rgba(0,117,127,0))";
        }
        
        return (
          <div
            key={streamline.id}
            className={`fluid-streamline animate-streamline-flow-${streamline.animationClass}`}
            style={{
              width: streamline.width,
              left: streamline.left,
              top: streamline.top,
              transform: `rotate(${streamline.angle})`,
              animationDelay: streamline.animationDelay,
              backgroundImage: gradient,
              zIndex: streamline.zIndex,
            }}
          />
        );
      })}

      {/* Render white blobs with crystal clear edges (no blur) */}
      {whiteBlobs.map((blob) => (
        <div
          key={blob.id}
          className={`fluid-blob animate-blob-float-${
            random(0, 1) > 0.7 ? "slow" : random(0, 1) > 0.4 ? "medium" : "fast"
          }`}
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.left,
            top: blob.top,
            opacity: blob.opacity,
            backgroundColor: "#FFFFFF",
            animationDelay: `${random(0, 15)}s`,
            zIndex: blob.zIndex,
          }}
        />
      ))}

      {/* Render colored particles with enhanced visibility */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`fluid-particle animate-particle-pulse-${
            random(0, 1) > 0.7 ? "slow" : random(0, 1) > 0.4 ? "medium" : "fast"
          }`}
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            filter: `blur(${particle.blur})`,
            animationDelay: `${random(0, 10)}s`,
            zIndex: particle.zIndex,
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
