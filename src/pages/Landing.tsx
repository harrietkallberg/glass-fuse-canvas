import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  // Add useEffect to initialize and preserve animation state
  useEffect(() => {
    // Check if we already have a stored animation state
    const storedAnimationTime = sessionStorage.getItem('blobAnimationTime');
    const startTime = storedAnimationTime ? parseInt(storedAnimationTime, 10) : Date.now();
    
    // If no stored state, save the current time
    if (!storedAnimationTime) {
      sessionStorage.setItem('blobAnimationTime', startTime.toString());
    }
    
    // Create a class for the background element to target it with CSS
    const backgroundElement = document.querySelector('.fluid-bg-diagonal');
    if (backgroundElement) {
      // Calculate elapsed time since animation started
      const elapsedTime = Date.now() - startTime;
      // Apply the animation with the correct offset to continue from where it left off
      backgroundElement.setAttribute('style', 
        `animation-delay: -${elapsedTime}ms; z-index: -20;`);
    }
    
    // Update the stored time periodically to keep the animation state fresh
    const intervalId = setInterval(() => {
      sessionStorage.setItem('blobAnimationTime', startTime.toString());
    }, 10000); // Update every 10 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
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
        </div>
        
        {/* Feature grid with slightly lower z-index than title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 w-full relative" style={{ zIndex: 30 }}>
          <div className="bg-orange-500/20 backdrop-blur-md p-6 rounded-xl hover:scale-[1.02] transition-transform shadow-md">
            <h3 className="font-medium text-lg mb-2">Create Precise Curves</h3>
            <p className="text-foreground/80">Design customized firing schedules for your unique glass projects</p>
          </div>
          
          <div className="bg-amber-100/30 backdrop-blur-md p-6 rounded-xl hover:scale-[1.02] transition-transform shadow-md">
            <h3 className="font-medium text-lg mb-2">Document Your Process</h3>
            <p className="text-foreground/80">Track your results with images and maintain version history</p>
          </div>
          
          <div className="bg-cyan-400/20 backdrop-blur-md p-6 rounded-xl hover:scale-[1.02] transition-transform shadow-md">
            <h3 className="font-medium text-lg mb-2">Connect with Artists</h3>
            <p className="text-foreground/80">Share your work and learn from other glass fusion enthusiasts</p>
          </div>
          
          <div className="bg-stone-300/30 backdrop-blur-md p-6 rounded-xl hover:scale-[1.02] transition-transform shadow-md">
            <h3 className="font-medium text-lg mb-2">Perfect Your Craft</h3>
            <p className="text-foreground/80">Refine your techniques through iteration and community feedback</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full relative" style={{ zIndex: 30 }}>
          <Link to="/login" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 h-12 enhanced-glass-card hover:bg-white/20 transition-all backdrop-blur-md shadow-md hover:shadow-lg border-white/30 relative overflow-hidden">
              <span className="relative z-10">Sign In</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
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
