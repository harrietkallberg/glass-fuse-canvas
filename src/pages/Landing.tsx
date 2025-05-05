
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-white">
      {/* Fluid art background inspired by the reference image */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#02b3c9]/80 via-white/40 to-[#f97316]/80 opacity-30"></div>
        
        {/* Large color pools */}
        <div className="color-pool absolute w-[60vw] h-[60vw] rounded-full bg-[#33C3F0]/60 filter blur-3xl left-[-10vw] top-[20vh] animate-fluid-morph"></div>
        <div className="color-pool absolute w-[70vw] h-[70vw] rounded-full bg-[#F97316]/60 filter blur-3xl right-[-15vw] bottom-[10vh] animate-fluid-morph-alt"></div>
        <div className="color-pool absolute w-[40vw] h-[40vw] rounded-full bg-white/70 filter blur-2xl left-[30vw] top-[10vh] animate-fluid-morph-slow"></div>
        
        {/* Medium organic forms */}
        {Array.from({ length: 15 }).map((_, index) => (
          <div
            key={`medium-bubble-${index}`}
            className="absolute rounded-full opacity-60 animate-bubble-float"
            style={{
              width: `${10 + Math.random() * 25}vw`,
              height: `${10 + Math.random() * 25}vw`,
              left: `${Math.random() * 90}vw`,
              top: `${Math.random() * 90}vh`,
              background: Math.random() > 0.5 
                ? `radial-gradient(circle, rgba(51,195,240,${0.4 + Math.random() * 0.5}) 0%, rgba(255,255,255,0.2) 70%)`
                : `radial-gradient(circle, rgba(249,115,22,${0.4 + Math.random() * 0.5}) 0%, rgba(255,255,255,0.2) 70%)`,
              filter: `blur(${2 + Math.random() * 5}px)`,
              transform: `scale(${0.8 + Math.random() * 0.4})`,
              animationDuration: `${30 + Math.random() * 40}s`,
              animationDelay: `${Math.random() * -40}s`,
            }}
          />
        ))}
        
        {/* Small bubbles - varied sizes and colors */}
        {Array.from({ length: 120 }).map((_, index) => (
          <div
            key={`bubble-${index}`}
            className="absolute rounded-full animate-bubble-float-small"
            style={{
              width: `${1 + Math.random() * 6}vw`,
              height: `${1 + Math.random() * 6}vw`,
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              background: Math.random() > 0.6
                ? `radial-gradient(circle, white 0%, rgba(255,255,255,0.7) 70%)`
                : Math.random() > 0.5
                  ? `radial-gradient(circle, rgba(51,195,240,0.9) 0%, rgba(51,195,240,0.4) 70%)`
                  : `radial-gradient(circle, rgba(249,115,22,0.9) 0%, rgba(249,115,22,0.4) 70%)`,
              boxShadow: Math.random() > 0.7 
                ? `0 0 10px 2px rgba(255,255,255,0.7)` 
                : 'none',
              animationDuration: `${15 + Math.random() * 25}s`,
              animationDelay: `${Math.random() * -20}s`,
              opacity: 0.7 + Math.random() * 0.3,
              filter: `blur(${Math.random() > 0.7 ? 2 : 0}px)`,
            }}
          />
        ))}
        
        {/* Tiny droplets/particles */}
        {Array.from({ length: 200 }).map((_, index) => (
          <div
            key={`droplet-${index}`}
            className="absolute rounded-full animate-droplet-float"
            style={{
              width: `${Math.random() * 0.5 + 0.2}vw`,
              height: `${Math.random() * 0.5 + 0.2}vw`,
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              background: Math.random() > 0.6 
                ? 'white' 
                : Math.random() > 0.5 
                  ? '#33C3F0' 
                  : '#F97316',
              boxShadow: `0 0 ${Math.random() * 3 + 1}px ${Math.random() > 0.6 ? 'white' : Math.random() > 0.5 ? '#33C3F0' : '#F97316'}`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * -15}s`,
              opacity: 0.8 + Math.random() * 0.2,
            }}
          />
        ))}
        
        {/* Color blend swirls */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`swirl-${index}`}
            className="absolute rounded-full opacity-30 animate-color-swirl"
            style={{
              width: `${30 + Math.random() * 30}vw`,
              height: `${30 + Math.random() * 30}vw`,
              left: `${Math.random() * 80}vw`,
              top: `${Math.random() * 80}vh`,
              background: `linear-gradient(${Math.random() * 360}deg, 
                rgba(51,195,240,${0.3 + Math.random() * 0.3}) 0%, 
                rgba(255,255,255,0.2) 50%, 
                rgba(249,115,22,${0.3 + Math.random() * 0.3}) 100%)`,
              filter: `blur(${10 + Math.random() * 15}px)`,
              animationDuration: `${50 + Math.random() * 40}s`,
              animationDelay: `${Math.random() * -30}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
        
        {/* Depth-enhancing overlay with subtle radial gradient */}
        <div className="absolute inset-0 bg-radial-subtle pointer-events-none"></div>
      </div>

      <div className="container relative z-30 max-w-2xl w-full px-4">
        {/* Title with subtle glass effect */}
        <div className="text-center mb-8 relative">
          <div className="mb-4">
            <h1 className="text-5xl sm:text-6xl font-bold relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#02b3c9] to-[#f97316] animate-shine-sweep">
              GlassFuse Studio
            </h1>
            
            <p className="text-xl mt-4 relative z-10 text-gray-800 font-medium">
              Create, share, and perfect your glass fusion firing curves
            </p>
          </div>
          
          <p className="text-xl text-gray-700 mt-4 animate-fade-in backdrop-blur-sm bg-white/60 px-4 py-2 rounded-lg inline-block border border-white/30 shadow-glow">
            Join a community of passionate glass fusion artists
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-3xl border border-white/50 shadow-glow bg-white/60 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#02b3c9]/30 bg-white/70">
              <h3 className="font-medium text-lg mb-2 text-[#02b3c9]">Create Precise Curves</h3>
              <p className="text-gray-700">Design customized firing schedules for your unique glass projects</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#f97316]/30 bg-white/70">
              <h3 className="font-medium text-lg mb-2 text-[#f97316]">Document Your Process</h3>
              <p className="text-gray-700">Track your results with images and maintain version history</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#02b3c9]/30 bg-white/70">
              <h3 className="font-medium text-lg mb-2 text-[#02b3c9]">Connect with Artists</h3>
              <p className="text-gray-700">Share your work and learn from other glass fusion enthusiasts</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#f97316]/30 bg-white/70">
              <h3 className="font-medium text-lg mb-2 text-[#f97316]">Perfect Your Craft</h3>
              <p className="text-gray-700">Refine your techniques through iteration and community feedback</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="w-full sm:w-auto gap-2 h-12 bg-gradient-to-r from-[#f97316] to-[#f97316]/80 hover:opacity-90 transition-all shadow-glow backdrop-blur-md border border-[#f97316]/30">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link to="/register">
              <Button variant="outline" className="w-full sm:w-auto h-12 bg-[#02b3c9]/10 border-[#02b3c9]/30 hover:bg-[#02b3c9]/20 shadow-blue-glow transition-all backdrop-blur-md">
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
