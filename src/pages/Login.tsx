
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
    // Example:
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    
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
    <div className="min-h-screen flex items-center justify-center fluid-bg overflow-hidden">
      {/* Fluid background shapes with wave animation and more intense colors */}
      <div 
        className="fluid-shape w-[800px] h-[800px] top-[-100px] left-[-100px] animate-float-slow animate-wave" 
        style={{
          background: "linear-gradient(135deg, #FF8A50 0%, #FEC6A1 100%)",
          opacity: "0.7"
        }}
      />
      
      <div 
        className="fluid-shape w-[600px] h-[600px] bottom-[-100px] right-[-50px] animate-float-medium animate-wave" 
        style={{
          background: "linear-gradient(135deg, #1EAEDB 0%, #A5D8E2 100%)",
          opacity: "0.75"
        }}
      />
      
      <div 
        className="fluid-shape w-[550px] h-[550px] bottom-[10%] left-[5%] animate-float-reverse animate-wave" 
        style={{
          background: "linear-gradient(135deg, #FFBB00 0%, #FEF7CD 100%)",
          opacity: "0.65"
        }}
      />
      
      <div 
        className="fluid-shape w-[500px] h-[500px] top-[10%] right-[5%] animate-pulse-float animate-wave" 
        style={{
          background: "linear-gradient(135deg, #33C3F0 0%, #A5D8E2 100%)",
          opacity: "0.6"
        }}
      />
      
      <div 
        className="fluid-shape w-[450px] h-[450px] bottom-[20%] right-[25%] animate-float-slow-reverse animate-wave" 
        style={{
          background: "linear-gradient(135deg, #F97316 0%, #FEC6A1 100%)",
          opacity: "0.65"
        }}
      />
      
      <div className="container relative z-10 max-w-md w-full px-4">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="gap-1 backdrop-blur-sm bg-white/20 hover:bg-white/40">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="glass-surface p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold relative inline-block">
              <span className="absolute inset-0 bg-clip-text text-transparent backdrop-blur-sm bg-white/20" style={{ WebkitBackgroundClip: "text" }}>
                Sign In
              </span>
              <span className="relative text-white/70 mix-blend-overlay">
                Sign In
              </span>
            </h1>
            <p className="text-foreground/80 mt-2 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-lg inline-block">Welcome back to the GlassFuse Studio</p>
          </div>
          
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
                className="bg-white/30 backdrop-blur-md border-white/30 focus:border-primary/50 h-11"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-foreground/90">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
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
                className="bg-white/30 backdrop-blur-md border-white/30 focus:border-primary/50 h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all shadow-md hover:shadow-lg backdrop-blur-md bg-white/10"
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground/80">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
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
