
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center fluid-bg overflow-hidden">
      {/* Flowing gradient background shapes */}
      <div 
        className="fluid-shape w-[800px] h-[800px] top-[-100px] left-[-100px] animate-float-slow animate-wave" 
        style={{
          background: "linear-gradient(135deg, #FF8A50 0%, #FEC6A1 100%)",
          opacity: "0.7"
        }}
      />
      
      <div 
        className="fluid-shape w-[700px] h-[700px] bottom-[-150px] right-[-50px] animate-float-medium animate-wave" 
        style={{
          background: "linear-gradient(135deg, #1EAEDB 0%, #A5D8E2 100%)",
          opacity: "0.75"
        }}
      />
      
      <div 
        className="fluid-shape w-[600px] h-[600px] bottom-[5%] left-[0%] animate-float-reverse animate-wave" 
        style={{
          background: "linear-gradient(135deg, #FFBB00 0%, #FEF7CD 100%)",
          opacity: "0.65"
        }}
      />
      
      {/* Enhanced turquoise gradient shape */}
      <div 
        className="fluid-shape w-[550px] h-[550px] top-[10%] right-[5%] animate-pulse-float animate-wave" 
        style={{
          background: "linear-gradient(135deg, #33C3F0 0%, #A5D8E2 100%)",
          opacity: "0.6"
        }}
      />
      
      {/* Enhanced orange gradient shape */}
      <div 
        className="fluid-shape w-[500px] h-[500px] bottom-[15%] right-[20%] animate-float-slow-reverse animate-wave" 
        style={{
          background: "linear-gradient(135deg, #F97316 0%, #FEC6A1 100%)",
          opacity: "0.65"
        }}
      />
      
      <div className="container relative z-10 max-w-2xl w-full px-4">
        {/* Frosted glass title container with carved text effect */}
        <div className="text-center mb-8 relative">
          <div className="frosted-glass-container rounded-2xl p-6 mb-4 backdrop-blur-sm bg-white/15 relative overflow-hidden shadow-lg">
            {/* Dark overlay for the title area */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[4px] z-0"></div>
            
            <h1 className="text-5xl sm:text-6xl font-bold relative z-10 frosted-title">
              GlassFuse Studio
            </h1>
            
            <p className="text-xl text-white/90 mt-4 relative z-10">
              Create, share, and perfect your glass fusion firing curves
            </p>
          </div>
          
          <p className="text-xl text-foreground/80 mt-4 animate-fade-in backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg inline-block">
            Join a community of passionate glass fusion artists
          </p>
        </div>
        
        <div className="glass-surface p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-orange p-6 rounded-xl hover:scale-[1.02] transition-transform">
              <h3 className="font-medium text-lg mb-2">Create Precise Curves</h3>
              <p className="text-foreground/80">Design customized firing schedules for your unique glass projects</p>
            </div>
            
            <div className="glass-yellow p-6 rounded-xl hover:scale-[1.02] transition-transform">
              <h3 className="font-medium text-lg mb-2">Document Your Process</h3>
              <p className="text-foreground/80">Track your results with images and maintain version history</p>
            </div>
            
            <div className="glass-green p-6 rounded-xl hover:scale-[1.02] transition-transform">
              <h3 className="font-medium text-lg mb-2">Connect with Artists</h3>
              <p className="text-foreground/80">Share your work and learn from other glass fusion enthusiasts</p>
            </div>
            
            <div className="glass-turquoise p-6 rounded-xl hover:scale-[1.02] transition-transform">
              <h3 className="font-medium text-lg mb-2">Perfect Your Craft</h3>
              <p className="text-foreground/80">Refine your techniques through iteration and community feedback</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="w-full sm:w-auto gap-2 h-12 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all shadow-md hover:shadow-lg backdrop-blur-md bg-white/10">
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
