import React, { useState, useEffect } from "react";
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
  
  // Add useEffect to initialize and preserve animation state
  useEffect(() => {
    // Use the same stored animation state from Landing page
    const storedAnimationTime = sessionStorage.getItem('blobAnimationTime');
    const startTime = storedAnimationTime ? parseInt(storedAnimationTime, 10) : Date.now();
    
    // If no stored state, save the current time (shouldn't happen if coming from Landing)
    if (!storedAnimationTime) {
      sessionStorage.setItem('blobAnimationTime', startTime.toString());
    }
    
    // Target the background element
    const backgroundElement = document.querySelector('.fluid-bg-diagonal');
    if (backgroundElement) {
      // Calculate elapsed time since animation started
      const elapsedTime = Date.now() - startTime;
      // Apply the animation with the correct offset to continue from where it left off
      backgroundElement.setAttribute('style', 
        `animation-delay: -${elapsedTime}ms; z-index: -20;`);
    }
    
    // Update the stored time periodically to keep the animation state fresh
    const intervalId = setInterval(() => {
      sessionStorage.setItem('blobAnimationTime', startTime.toString());
    }, 10000); // Update every 10 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
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
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Background blob with lower z-index to ensure it stays behind all content */}
      <div 
        className="absolute inset-0 fluid-bg-diagonal" 
        style={{ zIndex: -20 }}
      >
        {/* This ensures all animation and gradient effects stay in this background layer */}
      </div>
      
      <div className="container relative z-10 max-w-md w-full px-4">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="gap-1 backdrop-blur-sm bg-white/20 hover:bg-white/40">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold relative z-10 text-[#2A6B6B]" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.2)' }}>
            Sign In
          </h1>
          
          <p className="mt-2 relative z-10 text-[#1D4848]" style={{ textShadow: '1px 2px 3px rgba(0,0,0,0.1)' }}>
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
              className="w-full h-11 glass-vibrant-orange hover:opacity-90 transition-all shadow-md hover:shadow-lg backdrop-blur-md"
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
