
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-white">
      {/* Organic watercolor blob background */}
      <div className="absolute inset-0 bg-white overflow-hidden">
        {/* Primary large blobs */}
        <div className="watercolor-blob absolute w-[60vw] h-[60vw] rounded-full filter blur-[80px] 
            bg-gradient-to-r from-[#F97316]/40 to-[#F97316]/20
            animate-blob-float-large opacity-60"
            style={{ top: "10%", left: "15%", animationDelay: "0s" }}>
        </div>
        
        <div className="watercolor-blob absolute w-[50vw] h-[50vw] rounded-full filter blur-[60px] 
            bg-gradient-to-r from-[#33C3F0]/40 to-[#33C3F0]/20 
            animate-blob-float-large opacity-60"
            style={{ bottom: "5%", right: "10%", animationDelay: "-5s" }}>
        </div>
        
        {/* Medium floating blobs */}
        <div className="watercolor-blob absolute w-[40vw] h-[40vw] rounded-full filter blur-[50px] 
            bg-gradient-to-tr from-[#F97316]/30 to-[#33C3F0]/20 
            animate-blob-float-medium opacity-50"
            style={{ top: "30%", right: "25%", animationDelay: "-10s" }}>
        </div>
        
        <div className="watercolor-blob absolute w-[45vw] h-[45vw] rounded-full filter blur-[60px] 
            bg-gradient-to-br from-[#33C3F0]/30 to-[#F97316]/20 
            animate-blob-float-medium opacity-50"
            style={{ bottom: "25%", left: "20%", animationDelay: "-15s" }}>
        </div>
        
        {/* Smaller accent blobs */}
        <div className="watercolor-blob absolute w-[25vw] h-[25vw] rounded-full filter blur-[40px] 
            bg-gradient-to-r from-[#F97316]/50 to-[#F97316]/30 
            animate-blob-float-small opacity-70"
            style={{ top: "20%", right: "15%", animationDelay: "-7s" }}>
        </div>
        
        <div className="watercolor-blob absolute w-[30vw] h-[30vw] rounded-full filter blur-[45px] 
            bg-gradient-to-r from-[#33C3F0]/50 to-[#33C3F0]/30 
            animate-blob-float-small opacity-70"
            style={{ bottom: "15%", left: "25%", animationDelay: "-12s" }}>
        </div>
        
        {/* Subtle color nuance blobs */}
        <div className="watercolor-blob absolute w-[20vw] h-[20vw] rounded-full filter blur-[30px] 
            bg-gradient-to-tr from-[#F97316]/60 to-transparent 
            animate-blob-float-subtle opacity-60"
            style={{ top: "40%", left: "40%", animationDelay: "-8s" }}>
        </div>
        
        <div className="watercolor-blob absolute w-[15vw] h-[15vw] rounded-full filter blur-[25px] 
            bg-gradient-to-br from-[#33C3F0]/60 to-transparent 
            animate-blob-float-subtle opacity-60"
            style={{ bottom: "35%", right: "30%", animationDelay: "-3s" }}>
        </div>
        
        {/* Blend points with higher saturation */}
        <div className="watercolor-blob absolute w-[10vw] h-[10vw] rounded-full filter blur-[15px] 
            bg-[#F97316]/70 animate-blob-pulse opacity-40"
            style={{ top: "30%", left: "35%" }}>
        </div>
        
        <div className="watercolor-blob absolute w-[12vw] h-[12vw] rounded-full filter blur-[18px] 
            bg-[#33C3F0]/70 animate-blob-pulse opacity-40"
            style={{ bottom: "25%", right: "35%" }}>
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
        
        <div className="glass-panel p-8 rounded-3xl border border-white/50 shadow-glow bg-white/70 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card-orange p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#F97316]/40 bg-white/60 backdrop-blur-sm">
              <h3 className="font-medium text-lg mb-2 text-[#F97316]">Create Precise Curves</h3>
              <p className="text-gray-700">Design customized firing schedules for your unique glass projects</p>
            </div>
            
            <div className="glass-card-blue p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#33C3F0]/40 bg-white/60 backdrop-blur-sm">
              <h3 className="font-medium text-lg mb-2 text-[#33C3F0]">Document Your Process</h3>
              <p className="text-gray-700">Track your results with images and maintain version history</p>
            </div>
            
            <div className="glass-card-blue p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#33C3F0]/40 bg-white/60 backdrop-blur-sm">
              <h3 className="font-medium text-lg mb-2 text-[#33C3F0]">Connect with Artists</h3>
              <p className="text-gray-700">Share your work and learn from other glass fusion enthusiasts</p>
            </div>
            
            <div className="glass-card-orange p-6 rounded-xl hover:scale-[1.02] transition-transform border border-[#F97316]/40 bg-white/60 backdrop-blur-sm">
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
