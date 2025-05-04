
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app with Supabase integration, we would authenticate here
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password
    // });
    
    // if (error) {
    //   toast({
    //     title: "Authentication error",
    //     description: error.message,
    //     variant: "destructive"
    //   });
    //   return;
    // }
    
    toast({
      title: "Welcome back!",
      description: "Successfully logged in to GlassFuse",
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated fluid background shapes with more intense colors */}
      <div className="absolute inset-0 z-0">
        <div 
          className="fluid-shape w-[800px] h-[800px] absolute top-[-100px] left-[-100px] animate-float-slow" 
          style={{
            background: "linear-gradient(135deg, #FF8A3D 0%, #FEC6A1 100%)",
            borderRadius: "60% 40% 70% 30% / 40% 50% 50% 60%"
          }}
        />
        
        <div 
          className="fluid-shape w-[600px] h-[600px] absolute bottom-[-100px] right-[-50px] animate-float-medium" 
          style={{
            background: "linear-gradient(135deg, #0EA5E9 0%, #33C3F0 100%)",
            borderRadius: "30% 70% 50% 50% / 60% 30% 70% 40%"
          }}
        />
        
        <div 
          className="fluid-shape w-[500px] h-[500px] absolute bottom-[10%] left-[5%] animate-float-reverse" 
          style={{
            background: "linear-gradient(135deg, #F2FCE2 0%, #FEF7CD 100%)",
            borderRadius: "40% 60% 30% 70% / 50% 60% 40% 50%"
          }}
        />

        <div 
          className="fluid-shape w-[400px] h-[400px] absolute top-[15%] right-[10%] animate-pulse-float" 
          style={{
            background: "linear-gradient(135deg, #00B4D8 0%, #90E0EF 100%)",
            borderRadius: "50% 50% 30% 70% / 40% 40% 60% 60%"
          }}
        />
        
        <div 
          className="fluid-shape w-[350px] h-[350px] absolute bottom-[20%] right-[25%] animate-float-slow-reverse" 
          style={{
            background: "linear-gradient(135deg, #F97316 0%, #FDBA74 100%)",
            borderRadius: "70% 30% 50% 50% / 30% 60% 40% 70%"
          }}
        />
      </div>
      
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
