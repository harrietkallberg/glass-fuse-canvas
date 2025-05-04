
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Moon, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import TypingAnimation from "@/components/TypingAnimation";
import AlienShapes from "@/components/AlienShapes";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "ERROR_",
        description: "ENTITY VERIFICATION FAILED: INCOMPLETE DATA PATTERN",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "ACCESS_GRANTED",
      description: "ESTABLISHING NEURAL INTERFACE CONNECTION...",
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] via-[#221F26] to-[#221C24] relative overflow-hidden">
      {/* Strange alien shapes in the background */}
      <AlienShapes />
      
      {/* Additional bizarre organic elements */}
      <div className="alien-organism w-[250px] h-[250px] top-[10%] left-[20%] opacity-40"></div>
      <div className="alien-organism w-[300px] h-[300px] bottom-[5%] right-[15%] opacity-50"></div>
      
      {/* Atmospheric overlay */}
      <div className="planet-atmosphere"></div>
      
      {/* Scanline effect */}
      <div className="planet-scanline"></div>
      
      {/* Animated typing in top corner */}
      <TypingAnimation />
      
      {/* Top status bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#1A1F2C] border-b border-[#5B81B1]/30 p-1 flex justify-between items-center z-30 font-mono text-xs">
        <div className="flex items-center">
          <span className="text-[#5B81B1] mx-2">ENTITY:</span>
          <span className="text-[#A1C4F0]">UNIDENTIFIED</span>
        </div>
        <div className="text-[#5B81B1]">{new Date().toLocaleTimeString()} - AUTHENTICATION MODULE</div>
        <div className="flex items-center">
          <span className="text-[#5B81B1] mr-1">COSMIC ENERGY:</span>
          <span className="text-[#A1C4F0]">24%</span>
        </div>
      </div>
      
      <div className="container relative z-10 max-w-md w-full px-4">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="font-mono text-xs text-[#A1C4F0] hover:text-[#5B81B1] hover:bg-[#403E43] flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            RETURN_TO_MAIN
          </Button>
        </Link>
        
        <div className="bizarre-frame p-6">
          <div className="bizarre-screen p-4">
            <div className="mb-6 text-center">
              <div className="inline-block border-2 border-[#5B81B1] p-1 mb-4">
                <Star className="h-8 w-8 text-[#5B81B1] mx-auto" />
              </div>
              <h1 className="text-2xl font-mono uppercase text-[#5B81B1] tracking-widest alien-shadow">
                Entity Access
              </h1>
              
              <div className="mt-2 font-mono text-xs text-[#A1C4F0] flex items-center justify-center">
                <span className="alien-eye"></span>
                CONSCIOUSNESS LINK AVAILABLE
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="alien-display p-3">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#A1C4F0] font-mono text-xs uppercase block mb-1">
                    ENTITY_ID
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#5B81B1] p-2 flex items-center justify-center border-r border-[#1A1F2C]">
                      <Moon size={16} />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="identity@cosmic.ext" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="alien-input flex-1 font-mono text-sm bg-[#1A1F2C] text-[#A1C4F0]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-[#A1C4F0] font-mono text-xs uppercase">
                      CONSCIOUSNESS_KEY
                    </Label>
                    <Link to="/forgot-password" className="text-xs text-[#5B81B1]/70 hover:text-[#5B81B1] transition-colors font-mono">
                      RESET_KEY?
                    </Link>
                  </div>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#5B81B1] p-2 flex items-center justify-center border-r border-[#1A1F2C]">
                      <Star size={16} />
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="************" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="alien-input flex-1 font-mono text-sm bg-[#1A1F2C] text-[#A1C4F0]"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="alien-button w-full h-12 font-mono uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(91,129,177,0.5)]"
              >
                NEURAL LINK <span className="ml-2 blink-text">█</span>
              </Button>
            </form>
            
            <div className="alien-display mt-8 p-3">
              <div className="text-center">
                <p className="text-xs text-[#A1C4F0] font-mono">
                  NEW_ENTITY? 
                  <Link to="/register" className="text-[#5B81B1] ml-2 hover:underline font-mono">
                    INITIALIZE_PROFILE
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center font-mono text-xs text-[#5B81B1]">
          © 2025 FANTASTIC PLANET SYSTEMS • ALL DIMENSIONS PRESERVED
        </div>
      </div>
    </div>
  );
};

export default Login;
