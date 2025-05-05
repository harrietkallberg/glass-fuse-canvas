
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center fluid-bg-diagonal overflow-hidden relative">
      {/* Background fluid shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* First layer of fluid shapes - larger elements */}
        <div className="fluid-shape w-[40vw] h-[40vw] rounded-full animate-float-slow bg-[#F97316]/20 left-[-10vw] top-[20vh]"></div>
        <div className="fluid-shape w-[35vw] h-[35vw] rounded-full animate-float-medium bg-[#FEC6A1]/25 right-[-5vw] top-[10vh]"></div>
        <div className="fluid-shape w-[30vw] h-[30vw] animate-float-reverse animate-wave bg-[#bd8770]/20 left-[60vw] bottom-[15vh]"></div>
        <div className="fluid-shape w-[25vw] h-[25vw] animate-float-slow-reverse animate-wave bg-[#33C3F0]/15 left-[20vw] bottom-[-10vh]"></div>
        
        {/* Additional moving elements - medium elements */}
        <div className="fluid-shape w-[20vw] h-[20vw] rounded-full animate-pulse-float bg-[#F97316]/10 right-[25vw] top-[40vh]"></div>
        <div className="fluid-shape w-[18vw] h-[18vw] animate-wave animate-float-medium bg-[#FEC6A1]/15 left-[30vw] top-[15vh]"></div>
        <div className="fluid-shape w-[22vw] h-[22vw] rounded-full animate-float-reverse bg-[#bd8770]/15 right-[10vw] bottom-[20vh]"></div>
        
        {/* New additional fluid shapes - more variety */}
        <div className="fluid-shape w-[15vw] h-[15vw] animate-float-medium animate-wave bg-[#F97316]/15 left-[15vw] top-[60vh]"></div>
        <div className="fluid-shape w-[12vw] h-[12vw] rounded-full animate-float-slow bg-[#FEC6A1]/20 right-[20vw] top-[70vh]"></div>
        <div className="fluid-shape w-[18vw] h-[18vw] animate-float-reverse animate-wave bg-[#bd8770]/15 left-[45vw] top-[-5vh]"></div>
        <div className="fluid-shape w-[14vw] h-[14vw] rounded-full animate-pulse-float bg-[#33C3F0]/10 right-[40vw] bottom-[10vh]"></div>
        <div className="fluid-shape w-[16vw] h-[16vw] animate-wave animate-float-slow-reverse bg-[#F97316]/20 left-[10vw] top-[30vh]"></div>
        
        {/* Small background elements - for finer details */}
        <div className="fluid-shape w-[8vw] h-[8vw] rounded-full animate-float-slow bg-[#FEC6A1]/30 left-[75vw] top-[25vh]"></div>
        <div className="fluid-shape w-[10vw] h-[10vw] animate-wave animate-float-medium bg-[#F97316]/25 right-[30vw] bottom-[30vh]"></div>
        <div className="fluid-shape w-[7vw] h-[7vw] rounded-full animate-pulse-float bg-[#bd8770]/20 left-[50vw] top-[45vh]"></div>
        
        {/* Sparkle particles - small orange particles */}
        <div className="absolute inset-0">
          {/* Small sparkles - first layer */}
          {Array.from({ length: 50 }).map((_, index) => (
            <div 
              key={index}
              className="absolute w-1 h-1 rounded-full bg-[#F97316] opacity-70 animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
          
          {/* Medium sparkles */}
          {Array.from({ length: 30 }).map((_, index) => (
            <div 
              key={`lg-${index}`}
              className="absolute w-2 h-2 rounded-full bg-[#FEC6A1] opacity-60 animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 5}s`
              }}
            />
          ))}
          
          {/* Large sparkles - fewer but more impactful */}
          {Array.from({ length: 15 }).map((_, index) => (
            <div 
              key={`xl-${index}`}
              className="absolute w-3 h-3 rounded-full bg-[#F97316] opacity-50 animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 6}s`
              }}
            />
          ))}
          
          {/* Tiny subtle sparkles - creates depth */}
          {Array.from({ length: 40 }).map((_, index) => (
            <div 
              key={`tiny-${index}`}
              className="absolute w-0.5 h-0.5 rounded-full bg-[#FEC6A1] opacity-80 animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-10 max-w-2xl w-full px-4">
        {/* Title directly on background with gradient text */}
        <div className="text-center mb-8 relative">
          <div className="mb-4">
            <h1 className="text-5xl sm:text-6xl font-bold relative z-10 gradient-text-dark">
              GlassFuse Studio
            </h1>
            
            <p className="text-xl mt-4 relative z-10 gradient-text-dark">
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
