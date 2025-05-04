
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden relative bg-glass-gradient-1">
      {/* Glass bubbles */}
      <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-glass-orange/30 blur-3xl animate-float"></div>
      <div className="absolute top-40 right-[15%] w-72 h-72 rounded-full bg-glass-yellow/20 blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-40 left-[20%] w-80 h-80 rounded-full bg-glass-green/20 blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-20 right-[10%] w-60 h-60 rounded-full bg-glass-turquoise/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }}></div>
      
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GlassFuse Studio
          </h1>
          
          <p className="text-xl text-foreground/80">
            Create, share, and perfect your glass fusion firing curves within 
            a community of passionate artists.
          </p>
          
          <div className="glass-card p-8 space-y-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-orange p-4 rounded-xl">
                <h3 className="font-medium mb-2">Create Precise Curves</h3>
                <p className="text-sm">Design customized firing schedules for your unique glass projects</p>
              </div>
              
              <div className="glass-yellow p-4 rounded-xl">
                <h3 className="font-medium mb-2">Document Your Process</h3>
                <p className="text-sm">Track your results with images and maintain version history</p>
              </div>
              
              <div className="glass-green p-4 rounded-xl">
                <h3 className="font-medium mb-2">Connect with Artists</h3>
                <p className="text-sm">Share your work and learn from other glass fusion enthusiasts</p>
              </div>
              
              <div className="glass-turquoise p-4 rounded-xl">
                <h3 className="font-medium mb-2">Perfect Your Craft</h3>
                <p className="text-sm">Refine your techniques through iteration and community feedback</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="w-full sm:w-auto gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="outline" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
