
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Main flowing background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0e] via-[#1a1a2e] to-[#16213e] overflow-hidden">
        {/* Glass fluid elements with blue-orange contrast */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large primary glass flows */}
          <div className="glass-flow w-[60vw] h-[60vw] animate-glass-flow-slow opacity-70 bg-gradient-to-r from-[#F97316]/40 to-[#33C3F0]/40 left-[20vw] top-[10vh] absolute rounded-full"></div>
          <div className="glass-flow w-[65vw] h-[65vw] animate-glass-flow-reverse opacity-60 bg-gradient-to-r from-[#33C3F0]/30 to-[#F97316]/30 right-[-20vw] bottom-[-10vh] absolute rounded-full"></div>
          
          {/* Medium swirling elements */}
          <div className="glass-flow w-[40vw] h-[40vw] animate-glass-swirl opacity-50 bg-gradient-to-br from-[#F97316]/30 to-[#33C3F0]/30 left-[-10vw] top-[30vh] absolute"></div>
          <div className="glass-flow w-[35vw] h-[35vw] animate-glass-swirl-reverse opacity-40 bg-gradient-to-tl from-[#33C3F0]/25 to-[#F97316]/25 right-[5vw] top-[20vh] absolute"></div>
          <div className="glass-flow w-[45vw] h-[45vw] animate-glass-flow-medium opacity-50 bg-gradient-to-tr from-[#bd8770]/30 to-[#A5D8E2]/30 left-[50vw] bottom-[5vh] absolute"></div>
          
          {/* Smaller organic bubble formations */}
          <div className="glass-orb w-[25vw] h-[25vw] animate-orb-float opacity-60 bg-gradient-to-r from-[#F97316]/20 to-transparent right-[30vw] top-[15vh] absolute rounded-full"></div>
          <div className="glass-orb w-[20vw] h-[20vw] animate-orb-float-reverse opacity-50 bg-gradient-to-r from-[#33C3F0]/20 to-transparent left-[25vw] bottom-[20vh] absolute rounded-full"></div>
          <div className="glass-orb w-[18vw] h-[18vw] animate-orb-pulse opacity-40 bg-gradient-to-br from-[#F97316]/15 to-[#33C3F0]/15 right-[15vw] bottom-[25vh] absolute rounded-full"></div>
          
          {/* Fine detail glass forms */}
          <div className="glass-ripple w-[15vw] h-[15vw] animate-ripple opacity-70 bg-gradient-to-r from-[#F97316]/25 to-transparent left-[40vw] top-[25vh] absolute rounded-full"></div>
          <div className="glass-ripple w-[12vw] h-[12vw] animate-ripple-reverse opacity-60 bg-gradient-to-r from-[#33C3F0]/25 to-transparent right-[40vw] bottom-[35vh] absolute rounded-full"></div>
          <div className="glass-ripple w-[10vw] h-[10vw] animate-ripple-slow opacity-50 bg-gradient-to-br from-[#bd8770]/25 to-transparent left-[20vw] bottom-[15vh] absolute rounded-full"></div>
          
          {/* Multiple small dynamic glass pieces */}
          {Array.from({ length: 15 }).map((_, index) => (
            <div 
              key={`glass-small-${index}`}
              className="glass-small absolute rounded-full bg-gradient-to-r from-[#F97316]/30 to-[#33C3F0]/30"
              style={{
                width: `${5 + Math.random() * 10}vw`,
                height: `${5 + Math.random() * 10}vw`,
                left: `${Math.random() * 90}vw`,
                top: `${Math.random() * 90}vh`,
                opacity: 0.3 + Math.random() * 0.4,
                animationDuration: `${15 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 5}s`,
                filter: `blur(${10 + Math.random() * 30}px)`,
              }}
            />
          ))}
          
          {/* Edge reflection highlights - sharp edges */}
          {Array.from({ length: 20 }).map((_, index) => (
            <div 
              key={`glass-edge-${index}`}
              className="glass-edge absolute"
              style={{
                width: `${1 + Math.random() * 3}vw`,
                height: `${10 + Math.random() * 30}vh`,
                left: `${Math.random() * 95}vw`,
                top: `${Math.random() * 90}vh`,
                opacity: 0.4 + Math.random() * 0.5,
                background: `linear-gradient(${Math.random() * 360}deg, 
                  ${Math.random() > 0.5 ? '#F97316' : '#33C3F0'} 0%, 
                  transparent 100%)`,
                transform: `rotate(${Math.random() * 180}deg) skew(${Math.random() * 40}deg)`,
                filter: `blur(${3 + Math.random() * 5}px)`,
                borderRadius: '50%',
                animation: `edge-shine ${10 + Math.random() * 15}s ease-in-out ${Math.random() * 10}s infinite alternate`
              }}
            />
          ))}
        </div>
        
        {/* Particles overlay layer */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Smaller bright particles */}
          {Array.from({ length: 150 }).map((_, index) => (
            <div 
              key={`particle-small-${index}`}
              className="particle absolute rounded-full"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                background: Math.random() > 0.3 ? '#FEC6A1' : '#33C3F0',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.6 + Math.random() * 0.4,
                boxShadow: `0 0 ${Math.random() * 5 + 2}px ${Math.random() > 0.3 ? '#F97316' : '#33C3F0'}`,
                animation: `particle-float ${5 + Math.random() * 15}s ease-in-out ${Math.random() * 5}s infinite alternate`
              }}
            />
          ))}
          
          {/* Medium glow particles */}
          {Array.from({ length: 50 }).map((_, index) => (
            <div 
              key={`particle-medium-${index}`}
              className="particle absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                background: Math.random() > 0.4 ? '#F97316' : '#33C3F0',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.5 + Math.random() * 0.3,
                boxShadow: `0 0 ${Math.random() * 8 + 3}px ${Math.random() > 0.4 ? '#F97316' : '#33C3F0'}`,
                animation: `particle-pulse ${8 + Math.random() * 12}s ease-in-out ${Math.random() * 5}s infinite alternate`
              }}
            />
          ))}
          
          {/* Large bright sparkles */}
          {Array.from({ length: 30 }).map((_, index) => (
            <div 
              key={`sparkle-${index}`}
              className="sparkle absolute"
              style={{
                width: `${Math.random() * 4 + 3}px`,
                height: `${Math.random() * 4 + 3}px`,
                background: '#FFF',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.7 + Math.random() * 0.3,
                boxShadow: `0 0 ${Math.random() * 10 + 5}px ${Math.random() > 0.6 ? '#F97316' : '#33C3F0'}`,
                animation: `sparkle ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-30 max-w-2xl w-full px-4">
        {/* Title directly on background with gradient text */}
        <div className="text-center mb-8 relative">
          <div className="mb-4">
            <h1 className="text-5xl sm:text-6xl font-bold relative z-10 text-white text-shadow-lg">
              GlassFuse Studio
            </h1>
            
            <p className="text-xl mt-4 relative z-10 text-white/90 text-shadow-lg">
              Create, share, and perfect your glass fusion firing curves
            </p>
          </div>
          
          <p className="text-xl text-white/80 mt-4 animate-fade-in backdrop-blur-sm bg-white/5 px-4 py-2 rounded-lg inline-block border border-white/10 shadow-glow">
            Join a community of passionate glass fusion artists
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-3xl border border-white/20 shadow-glow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card-orange p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#F97316]/20">
              <h3 className="font-medium text-lg mb-2 text-white">Create Precise Curves</h3>
              <p className="text-white/80">Design customized firing schedules for your unique glass projects</p>
            </div>
            
            <div className="glass-card-blue p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#33C3F0]/20">
              <h3 className="font-medium text-lg mb-2 text-white">Document Your Process</h3>
              <p className="text-white/80">Track your results with images and maintain version history</p>
            </div>
            
            <div className="glass-card-orange p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#F97316]/20">
              <h3 className="font-medium text-lg mb-2 text-white">Connect with Artists</h3>
              <p className="text-white/80">Share your work and learn from other glass fusion enthusiasts</p>
            </div>
            
            <div className="glass-card-blue p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#33C3F0]/20">
              <h3 className="font-medium text-lg mb-2 text-white">Perfect Your Craft</h3>
              <p className="text-white/80">Refine your techniques through iteration and community feedback</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="w-full sm:w-auto gap-2 h-12 bg-gradient-to-r from-[#F97316] to-[#bd8770] hover:opacity-90 transition-all shadow-glow backdrop-blur-md border border-[#F97316]/30">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link to="/register">
              <Button variant="outline" className="w-full sm:w-auto h-12 bg-[#33C3F0]/10 border-[#33C3F0]/30 hover:bg-[#33C3F0]/20 shadow-blue-glow transition-all backdrop-blur-md">
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
