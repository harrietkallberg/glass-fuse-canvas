
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center fluid-bg overflow-hidden">
      {/* Fluid background shapes */}
      <div 
        className="fluid-shape w-[800px] h-[800px] top-[-100px] left-[-100px]" 
        style={{
          background: "linear-gradient(135deg, #FEC6A1 0%, #FEF7CD 100%)",
          borderRadius: "60% 40% 70% 30% / 40% 50% 50% 60%"
        }}
      />
      
      <div 
        className="fluid-shape w-[600px] h-[600px] bottom-[-100px] right-[-50px] animate-float-slow" 
        style={{
          background: "linear-gradient(135deg, #D3E4FD 0%, #F2FCE2 100%)",
          borderRadius: "30% 70% 50% 50% / 60% 30% 70% 40%"
        }}
      />
      
      <div 
        className="fluid-shape w-[500px] h-[500px] bottom-[10%] left-[5%] animate-float-reverse" 
        style={{
          background: "linear-gradient(135deg, #F2FCE2 0%, #FEF7CD 100%)",
          borderRadius: "40% 60% 30% 70% / 50% 60% 40% 50%"
        }}
      />
      
      <div className="container relative z-10 max-w-2xl w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GlassFuse Studio
          </h1>
          
          <p className="text-xl text-foreground/80 mt-4">
            Create, share, and perfect your glass fusion firing curves within 
            a community of passionate artists.
          </p>
        </div>
        
        <div className="glass-card p-8 backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-orange p-6 rounded-xl">
              <h3 className="font-medium text-lg mb-2">Create Precise Curves</h3>
              <p className="text-foreground/80">Design customized firing schedules for your unique glass projects</p>
            </div>
            
            <div className="glass-yellow p-6 rounded-xl">
              <h3 className="font-medium text-lg mb-2">Document Your Process</h3>
              <p className="text-foreground/80">Track your results with images and maintain version history</p>
            </div>
            
            <div className="glass-green p-6 rounded-xl">
              <h3 className="font-medium text-lg mb-2">Connect with Artists</h3>
              <p className="text-foreground/80">Share your work and learn from other glass fusion enthusiasts</p>
            </div>
            
            <div className="glass-turquoise p-6 rounded-xl">
              <h3 className="font-medium text-lg mb-2">Perfect Your Craft</h3>
              <p className="text-foreground/80">Refine your techniques through iteration and community feedback</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="w-full sm:w-auto gap-2 h-12 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link to="/register">
              <Button variant="outline" className="w-full sm:w-auto h-12 bg-white/50 border-white/30 hover:bg-white/60">
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
