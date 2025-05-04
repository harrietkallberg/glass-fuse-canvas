
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center morphing-bg overflow-hidden">
      {/* Glass blobs overlay */}
      <div className="glass-blobs-container">
        <div className="glass-blob glass-blob-1"></div>
        <div className="glass-blob glass-blob-2"></div>
        <div className="glass-blob glass-blob-3"></div>
        <div className="glass-blob glass-blob-4"></div>
        <div className="glass-blob glass-blob-5"></div>
        {/* Added new blobs with varied lighting */}
        <div className="glass-blob glass-blob-highlight"></div>
        <div className="glass-blob glass-blob-shadow"></div>
        <div className="glass-blob glass-blob-earthtone"></div>
        
        {/* New animated floating blobs with organic shapes */}
        <div className="floating-blob floating-blob-1"></div>
        <div className="floating-blob floating-blob-2"></div>
        <div className="floating-blob floating-blob-3"></div>
        <div className="floating-blob floating-blob-4"></div>
        <div className="floating-blob floating-blob-5"></div>
        
        {/* New animated light sources */}
        <div className="light-source light-source-1"></div>
        <div className="light-source light-source-2"></div>
        
        {/* New animated dark areas */}
        <div className="dark-area dark-area-1"></div>
        <div className="dark-area dark-area-2"></div>
      </div>
      
      <div className="container relative z-10 max-w-2xl w-full px-4">
        {/* Title directly on background with gradient text - increased z-index */}
        <div className="text-center mb-8 relative z-20">
          <div className="mb-4">
            <h1 className="text-5xl sm:text-6xl font-bold relative z-30 gradient-text-dark text-shadow-lg">
              GlassFuse Studio
            </h1>
            
            <p className="text-xl mt-4 relative z-30 gradient-text-dark text-shadow-sm">
              Create, share, and perfect your glass fusion firing curves
            </p>
          </div>
          
          <p className="text-xl text-foreground/80 mt-4 animate-fade-in backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg inline-block z-30 relative">
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
              <Button className="w-full sm:w-auto gap-2 h-12 bg-[#F97316]/70 hover:bg-[#F97316]/80 transition-all shadow-md hover:shadow-lg backdrop-blur-md">
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
