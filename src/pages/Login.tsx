
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
    // In a real app, we would handle authentication here
    
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
      
      <div className="container relative z-10 max-w-md w-full px-4">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="gap-1 backdrop-blur-sm bg-white/20 hover:bg-white/40">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="glass-card p-8 backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sign In</h1>
            <p className="text-muted-foreground mt-2">Welcome back to the GlassFuse Studio</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50 border-white/30 focus:border-primary/50 h-11"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
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
                className="bg-white/50 border-white/30 focus:border-primary/50 h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all"
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground/70">
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
