
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Main flowing background gradient - lighter with white base */}
      <div className="absolute inset-0 bg-white overflow-hidden">
        {/* Glass fluid elements with sharper blue-orange contrast */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large primary glass flows */}
          <div className="glass-flow w-[60vw] h-[60vw] animate-glass-morph opacity-70 bg-vibrant-gradient-1 left-[20vw] top-[10vh] absolute rounded-full"></div>
          <div className="glass-flow w-[65vw] h-[65vw] animate-glass-morph-reverse opacity-60 bg-vibrant-gradient-2 right-[-20vw] bottom-[-10vh] absolute rounded-full"></div>
          
          {/* Medium swirling elements */}
          <div className="glass-flow w-[40vw] h-[40vw] animate-glass-swirl opacity-50 bg-vibrant-gradient-3 left-[-10vw] top-[30vh] absolute"></div>
          <div className="glass-flow w-[35vw] h-[35vw] animate-glass-swirl-reverse opacity-40 bg-vibrant-gradient-2 right-[5vw] top-[20vh] absolute"></div>
          <div className="glass-flow w-[45vw] h-[45vw] animate-glass-flow-medium opacity-50 bg-vibrant-gradient-1 left-[50vw] bottom-[5vh] absolute"></div>
          
          {/* Smaller organic bubble formations with sharper contrasts */}
          <div className="glass-orb w-[25vw] h-[25vw] animate-orb-float opacity-60 bg-glass-shine right-[30vw] top-[15vh] absolute rounded-full"></div>
          <div className="glass-orb w-[20vw] h-[20vw] animate-orb-float-reverse opacity-50 bg-glass-shine left-[25vw] bottom-[20vh] absolute rounded-full"></div>
          <div className="glass-orb w-[18vw] h-[18vw] animate-orb-pulse opacity-40 bg-glass-orange-blue right-[15vw] bottom-[25vh] absolute rounded-full"></div>
          
          {/* Fine detail glass forms */}
          <div className="glass-ripple w-[15vw] h-[15vw] animate-ripple opacity-70 bg-vibrant-gradient-1 left-[40vw] top-[25vh] absolute rounded-full"></div>
          <div className="glass-ripple w-[12vw] h-[12vw] animate-ripple-reverse opacity-60 bg-vibrant-gradient-2 right-[40vw] bottom-[35vh] absolute rounded-full"></div>
          <div className="glass-ripple w-[10vw] h-[10vw] animate-ripple-slow opacity-50 bg-vibrant-gradient-3 left-[20vw] bottom-[15vh] absolute rounded-full"></div>
          
          {/* Multiple small dynamic glass pieces - increased count */}
          {Array.from({ length: 25 }).map((_, index) => (
            <div 
              key={`glass-small-${index}`}
              className="glass-small absolute rounded-full animate-glass-morph"
              style={{
                width: `${5 + Math.random() * 10}vw`,
                height: `${5 + Math.random() * 10}vw`,
                left: `${Math.random() * 90}vw`,
                top: `${Math.random() * 90}vh`,
                opacity: 0.3 + Math.random() * 0.4,
                animationDuration: `${15 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 5}s`,
                filter: `blur(${3 + Math.random() * 8}px)`,
                background: `linear-gradient(${Math.random() * 360}deg, 
                  rgba(249,115,22,${0.3 + Math.random() * 0.4}) 0%, 
                  rgba(51,195,240,${0.3 + Math.random() * 0.4}) 100%)`,
              }}
            />
          ))}
          
          {/* Edge reflection highlights - sharp edges with brighter colors */}
          {Array.from({ length: 40 }).map((_, index) => (
            <div 
              key={`glass-edge-${index}`}
              className="glass-edge absolute animate-edge-shine"
              style={{
                width: `${1 + Math.random() * 3}vw`,
                height: `${5 + Math.random() * 20}vh`,
                left: `${Math.random() * 95}vw`,
                top: `${Math.random() * 90}vh`,
                opacity: 0.6 + Math.random() * 0.4,
                background: `linear-gradient(${Math.random() * 360}deg, 
                  ${Math.random() > 0.5 ? 'rgba(249,115,22,0.9)' : 'rgba(51,195,240,0.9)'} 0%, 
                  transparent 100%)`,
                transform: `rotate(${Math.random() * 180}deg) skew(${Math.random() * 40}deg)`,
                filter: `blur(${1 + Math.random() * 3}px)`,
                borderRadius: '50%',
              }}
            />
          ))}
        </div>
        
        {/* Particles overlay layer - increased count and brightness */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Smaller bright particles */}
          {Array.from({ length: 200 }).map((_, index) => (
            <div 
              key={`particle-small-${index}`}
              className="particle absolute rounded-full"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                background: Math.random() > 0.3 ? '#F97316' : '#33C3F0',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.7 + Math.random() * 0.3,
                boxShadow: `0 0 ${Math.random() * 5 + 2}px ${Math.random() > 0.3 ? '#F97316' : '#33C3F0'}`,
                animation: `particle-float ${5 + Math.random() * 15}s ease-in-out ${Math.random() * 5}s infinite alternate`
              }}
            />
          ))}
          
          {/* Medium glow particles with sharper colors */}
          {Array.from({ length: 70 }).map((_, index) => (
            <div 
              key={`particle-medium-${index}`}
              className="particle absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                background: Math.random() > 0.4 ? '#F97316' : '#33C3F0',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.6 + Math.random() * 0.4,
                boxShadow: `0 0 ${Math.random() * 8 + 3}px ${Math.random() > 0.4 ? '#F97316' : '#33C3F0'}`,
                animation: `particle-pulse ${8 + Math.random() * 12}s ease-in-out ${Math.random() * 5}s infinite alternate`
              }}
            />
          ))}
          
          {/* Large bright sparkles with enhanced glow */}
          {Array.from({ length: 40 }).map((_, index) => (
            <div 
              key={`sparkle-${index}`}
              className="sparkle absolute"
              style={{
                width: `${Math.random() * 4 + 3}px`,
                height: `${Math.random() * 4 + 3}px`,
                background: '#FFFFFF',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.8 + Math.random() * 0.2,
                boxShadow: `0 0 ${Math.random() * 12 + 8}px ${Math.random() > 0.6 ? '#F97316' : '#33C3F0'}`,
                animation: `sparkle ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-30 max-w-2xl w-full px-4">
        {/* Title with enhanced contrast on white background */}
        <div className="text-center mb-8 relative">
          <div className="mb-4">
            <h1 className="text-5xl sm:text-6xl font-bold relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#33C3F0] animate-shine-sweep">
              GlassFuse Studio
            </h1>
            
            <p className="text-xl mt-4 relative z-10 text-gray-800 font-medium">
              Create, share, and perfect your glass fusion firing curves
            </p>
          </div>
          
          <p className="text-xl text-gray-700 mt-4 animate-fade-in backdrop-blur-sm bg-white/40 px-4 py-2 rounded-lg inline-block border border-[#33C3F0]/20 shadow-glow">
            Join a community of passionate glass fusion artists
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-3xl border border-white/50 shadow-glow bg-white/70">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card-orange p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#F97316]/40 bg-white/60">
              <h3 className="font-medium text-lg mb-2 text-[#F97316]">Create Precise Curves</h3>
              <p className="text-gray-700">Design customized firing schedules for your unique glass projects</p>
            </div>
            
            <div className="glass-card-blue p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#33C3F0]/40 bg-white/60">
              <h3 className="font-medium text-lg mb-2 text-[#33C3F0]">Document Your Process</h3>
              <p className="text-gray-700">Track your results with images and maintain version history</p>
            </div>
            
            <div className="glass-card-blue p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#33C3F0]/40 bg-white/60">
              <h3 className="font-medium text-lg mb-2 text-[#33C3F0]">Connect with Artists</h3>
              <p className="text-gray-700">Share your work and learn from other glass fusion enthusiasts</p>
            </div>
            
            <div className="glass-card-orange p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#F97316]/40 bg-white/60">
              <h3 className="font-medium text-lg mb-2 text-[#F97316]">Perfect Your Craft</h3>
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
