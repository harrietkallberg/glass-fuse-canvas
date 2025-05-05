
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
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
        {/* Title section with isolation to prevent background bleed */}
        <div className="text-center w-full mb-6 relative">
          <div className="bg-transparent p-6 rounded-xl mb-6 relative isolation-auto" style={{ zIndex: 40 }}>
            {/* Using a pseudo-element to create an invisible backdrop */}
            <div className="relative isolation-auto">
              <h1 className="text-5xl sm:text-6xl font-bold gradient-text-dark mb-3 relative">
                GlassFuse Studio
              </h1>
              
              <p className="text-xl gradient-text-dark relative">
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
            <Button className="w-full sm:w-auto gap-2 h-12 bg-gradient-to-r from-[#F97316] to-[#bd8770] hover:opacity-90 transition-all shadow-md hover:shadow-lg backdrop-blur-md bg-white/10">
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
