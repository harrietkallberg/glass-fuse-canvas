
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center hot-oven-bg relative overflow-hidden">
      {/* Hot oven sparkles - slowed down */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Generate orange sparkles/gnisters for the hot oven effect */}
        {Array.from({ length: 80 }).map((_, index) => (
          <div 
            key={index}
            className={`absolute w-1 h-1 rounded-full hot-sparkle z-0 ${
              index % 3 === 0 ? 'bg-orange-500' : index % 3 === 1 ? 'bg-orange-400' : 'bg-amber-300'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${4 + Math.random() * 6}s` // Slowed down animation
            }}
          />
        ))}
        
        {/* Larger ember particles - slowed down */}
        {Array.from({ length: 30 }).map((_, index) => (
          <div 
            key={`ember-${index}`}
            className={`absolute w-2 h-2 rounded-full hot-ember z-0 ${
              index % 2 === 0 ? 'bg-orange-600' : 'bg-amber-500'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${6 + Math.random() * 8}s` // Slowed down animation
            }}
          />
        ))}
      </div>

      {/* Main content blob - completely opaque with dynamic gradient */}
      <div className="glass-blob-container relative z-10">
        {/* Using the new dynamic-gradient-blob class for the internal gradient animation */}
        <div className="glass-blob glass-blob-inward-shadow-only opaque-blob dynamic-gradient-blob">
          <div className="container relative z-10 max-w-2xl w-full px-4">
            {/* Title directly on background with gradient text matching the dark to orange theme */}
            <div className="text-center mb-8 relative">
              <div className="mb-4">
                <h1 className="text-5xl sm:text-6xl font-bold relative z-10 text-gradient-dark-orange">
                  GlassFuse Studio
                </h1>
                
                <p className="text-xl mt-4 relative z-10 text-gradient-dark-orange">
                  Create, share, and perfect your glass fusion firing curves
                </p>
              </div>
              
              <p className="text-xl text-foreground/80 mt-4 animate-fade-in backdrop-blur-sm bg-black/20 px-4 py-2 rounded-lg inline-block text-amber-100">
                Join a community of passionate glass fusion artists
              </p>
            </div>
            
            {/* Inner dynamic content - preserved from before */}
            <div className="p-4">
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
      </div>
    </div>
  );
};

export default Landing;
