
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
    <div className="min-h-screen flex items-center justify-center morphing-bg overflow-hidden">
      <div className="container relative z-10 max-w-md w-full px-4">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="gap-1 backdrop-blur-sm bg-white/20 hover:bg-white/40">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold relative z-10 gradient-text-dark text-shadow-lg">
            Create an Account
          </h1>
          
          <p className="mt-2 relative z-10 gradient-text-dark text-shadow-sm">
            Join the glass fusion community
          </p>
        </div>
        
        <div className="glass-surface p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Jane Smith" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="bg-white/30 backdrop-blur-md border-white/30 focus:border-primary/50 h-11"
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
                className="bg-white/30 backdrop-blur-md border-white/30 focus:border-primary/50 h-11"
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
                className="bg-white/30 backdrop-blur-md border-white/30 focus:border-primary/50 h-11"
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
                className="bg-white/30 backdrop-blur-md border-white/30 focus:border-primary/50 h-11"
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
