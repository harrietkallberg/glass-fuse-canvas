
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would handle authentication here with Supabase
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Welcome back!",
      description: "Successfully logged in to GlassFuse",
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center morphing-bg overflow-hidden">
      {/* Glass blobs overlay */}
      <div className="glass-blobs-container">
        {/* Sharp-edged glass blobs */}
        <div className="sharp-glass-blob sharp-glass-blob-1"></div>
        <div className="sharp-glass-blob sharp-glass-blob-2"></div>
        <div className="sharp-glass-blob sharp-glass-blob-3"></div>
        <div className="sharp-glass-blob sharp-glass-blob-4"></div>
        <div className="sharp-glass-blob sharp-glass-blob-5"></div>
        
        {/* Small glass fragments */}
        <div className="sharp-glass-fragment sharp-glass-fragment-1"></div>
        <div className="sharp-glass-fragment sharp-glass-fragment-2"></div>
        <div className="sharp-glass-fragment sharp-glass-fragment-3"></div>
        
        {/* New animated floating blobs with organic shapes */}
        <div className="floating-blob floating-blob-1"></div>
        <div className="floating-blob floating-blob-2"></div>
        <div className="floating-blob floating-blob-3"></div>
        <div className="floating-blob floating-blob-4"></div>
        <div className="floating-blob floating-blob-5"></div>
        
        {/* Enhanced animated light sources */}
        <div className="light-source light-source-1"></div>
        <div className="light-source light-source-2"></div>
        <div className="light-source light-source-3"></div>
        <div className="light-source light-source-4"></div>
        
        {/* Animated dark areas */}
        <div className="dark-area dark-area-1"></div>
        <div className="dark-area dark-area-2"></div>
      </div>
      
      <div className="container relative z-10 max-w-md w-full px-4">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="gap-1 backdrop-blur-sm bg-white/20 hover:bg-white/40">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold relative z-30 gradient-text-dark text-shadow-lg">
            Sign In
          </h1>
          
          <p className="mt-2 relative z-30 gradient-text-dark text-shadow-sm">
            Welcome back to the GlassFuse Studio
          </p>
        </div>
        
        <div className="glass-surface p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/90">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/30 backdrop-blur-md border-white/30 focus:border-[#745641]/50 h-11"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-foreground/90">Password</Label>
                <Link to="/forgot-password" className="text-sm text-[#bd8770] hover:text-[#745641]/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/30 backdrop-blur-md border-white/30 focus:border-[#745641]/50 h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-[#F97316]/70 hover:bg-[#F97316]/80 transition-all shadow-md hover:shadow-lg backdrop-blur-md"
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground/80">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#bd8770] font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
