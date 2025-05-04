
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated fluid background container */}
      <div className="absolute inset-0 z-0">
        {/* Large orange gradient blob */}
        <div 
          className="fluid-shape w-[900px] h-[900px] absolute top-[-150px] left-[-200px] animate-float-slow" 
          style={{
            background: "linear-gradient(135deg, #F97316 0%, #FDBA74 100%)",
            borderRadius: "60% 40% 70% 30% / 40% 50% 50% 60%"
          }}
        />
        
        {/* Medium turquoise gradient blob */}
        <div 
          className="fluid-shape w-[700px] h-[700px] absolute bottom-[-150px] right-[-100px] animate-float-medium" 
          style={{
            background: "linear-gradient(135deg, #0EA5E9 0%, #22D3EE 100%)",
            borderRadius: "30% 70% 50% 50% / 60% 30% 70% 40%"
          }}
        />
        
        {/* Secondary orange blob */}
        <div 
          className="fluid-shape w-[500px] h-[500px] absolute top-[40%] left-[-100px] animate-float-reverse" 
          style={{
            background: "linear-gradient(135deg, #FB923C 0%, #FED7AA 100%)",
            borderRadius: "40% 60% 30% 70% / 50% 60% 40% 50%",
            opacity: "0.7"
          }}
        />
        
        {/* Small turquoise blob */}
        <div 
          className="fluid-shape w-[400px] h-[400px] absolute top-[15%] right-[10%] animate-pulse-float" 
          style={{
            background: "linear-gradient(135deg, #06B6D4 0%, #67E8F9 100%)",
            borderRadius: "50% 50% 30% 70% / 40% 40% 60% 60%",
            opacity: "0.8"
          }}
        />
        
        {/* Additional vibrant orange blob */}
        <div 
          className="fluid-shape w-[350px] h-[350px] absolute bottom-[20%] right-[25%] animate-float-slow-reverse" 
          style={{
            background: "linear-gradient(135deg, #EA580C 0%, #FED7AA 100%)",
            borderRadius: "70% 30% 50% 50% / 30% 60% 40% 70%",
            opacity: "0.9"
          }}
        />
        
        {/* Extra turquoise accent blob */}
        <div 
          className="fluid-shape w-[250px] h-[250px] absolute bottom-[40%] left-[15%] animate-float-medium" 
          style={{
            background: "linear-gradient(135deg, #0891B2 0%, #A5F3FC 100%)",
            borderRadius: "40% 60% 60% 40% / 60% 30% 70% 40%",
            opacity: "0.7"
          }}
        />
      </div>
      
      <div className="container relative z-10 max-w-2xl w-full px-4">
        <div className="text-center mb-8 p-6 rounded-2xl bg-foreground/15 backdrop-blur-md border border-white/10">
          <h1 className="text-5xl sm:text-6xl font-bold text-white shadow-sm">
            GlassFuse Studio
          </h1>
          
          <p className="text-xl text-white mt-4 animate-fade-in">
            Create, share, and perfect your glass fusion firing curves within 
            a community of passionate artists.
          </p>
        </div>
        
        <div className="glass-card p-8 backdrop-blur-xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
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
              <Button className="w-full sm:w-auto gap-2 h-12 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link to="/register">
              <Button variant="outline" className="w-full sm:w-auto h-12 bg-white/50 border-white/30 hover:bg-white/60 shadow-md hover:shadow-lg transition-all">
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
