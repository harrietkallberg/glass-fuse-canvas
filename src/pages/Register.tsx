import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !username || !email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    const { error } = await signUp(email, password, username);
    
    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome to GlassFuse!",
        description: "Please check your email to verify your account.",
      });
      navigate("/dashboard");
    }
    setLoading(false);
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
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold relative z-10 text-[#2A6B6B]" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.2)' }}>
            Create an Account
          </h1>
          
          <p className="mt-2 relative z-10 text-[#1D4848]" style={{ textShadow: '1px 2px 3px rgba(0,0,0,0.1)' }}>
            Join the glass fusion community
          </p>
        </div>
        
        <div className="bg-white/25 backdrop-blur-lg rounded-2xl shadow-lg p-8">
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
              disabled={loading}
              className="w-full h-11 enhanced-glass-card hover:bg-white/20 transition-all shadow-md hover:shadow-lg backdrop-blur-md border-white/30 relative overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? "Creating Account..." : "Create Account"}
              </span>
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground/70 mb-4">
              Already have an account?{" "}
              <Link to="/login" className="text-[#bd8770] font-medium hover:underline">
                Sign in
              </Link>
            </p>
            
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1 backdrop-blur-sm bg-white/20 hover:bg-white/40">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
