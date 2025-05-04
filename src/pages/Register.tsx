
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !username || !email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would handle registration here
    toast({
      title: "Welcome to GlassFuse!",
      description: "Your account has been created successfully.",
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center fluid-bg overflow-hidden">
      {/* Fluid background shapes */}
      <div 
        className="fluid-shape w-[800px] h-[800px] top-[-100px] right-[-100px]" 
        style={{
          background: "linear-gradient(135deg, #D3E4FD 0%, #F2FCE2 100%)",
          borderRadius: "60% 40% 70% 30% / 40% 50% 50% 60%"
        }}
      />
      
      <div 
        className="fluid-shape w-[600px] h-[600px] bottom-[-100px] left-[-50px] animate-float-slow" 
        style={{
          background: "linear-gradient(135deg, #FEC6A1 0%, #FEF7CD 100%)",
          borderRadius: "30% 70% 50% 50% / 60% 30% 70% 40%"
        }}
      />
      
      <div 
        className="fluid-shape w-[500px] h-[500px] top-[10%] right-[5%] animate-float-reverse" 
        style={{
          background: "linear-gradient(135deg, #FEF7CD 0%, #F2FCE2 100%)",
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Create an Account</h1>
            <p className="text-muted-foreground mt-2">Join the glass fusion community</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Jane Smith" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="bg-white/50 border-white/30 focus:border-primary/50 h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground/80">Username</Label>
              <Input 
                id="username" 
                placeholder="glassartist" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="bg-white/50 border-white/30 focus:border-primary/50 h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="bg-white/50 border-white/30 focus:border-primary/50 h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-white/50 border-white/30 focus:border-primary/50 h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all"
            >
              Create Account
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground/70">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
