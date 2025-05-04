
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Flame, Factory } from "lucide-react";
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
        description: "VALIDATION FAILED: INCOMPLETE OPERATOR DATA",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "ACCESS_GRANTED",
      description: "ESTABLISHING KILN CONTROL CONNECTION...",
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C2822] via-[#2F2A1F] to-[#343021] relative overflow-hidden">
      {/* Organic shapes in the background */}
      <AlienShapes />
      
      {/* Atmospheric overlay */}
      <div className="planet-atmosphere"></div>
      
      {/* Scanline effect */}
      <div className="planet-scanline"></div>
      
      {/* Animated typing in top corner */}
      <TypingAnimation />
      
      {/* Top status bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#2C2822] border-b border-[#A67F5D]/30 p-1 flex justify-between items-center z-30 font-mono text-xs metal-texture">
        <div className="flex items-center">
          <span className="text-[#A0C1A3] mx-2">OPERATOR:</span>
          <span className="text-[#D2A976]">UNVERIFIED</span>
        </div>
        <div className="text-[#A0C1A3]">{new Date().toLocaleTimeString()} - KILN ACCESS MODULE</div>
        <div className="flex items-center">
          <span className="text-[#A0C1A3] mr-1">FURNACE TEMP:</span>
          <span className="text-[#D2A976]">24°C</span>
        </div>
      </div>
      
      <div className="container relative z-10 max-w-md w-full px-4">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="font-mono text-xs text-[#D2A976] hover:text-[#A0C1A3] hover:bg-[#403E43] flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            RETURN_TO_MAIN
          </Button>
        </Link>
        
        <div className="bizarre-frame p-6">
          <div className="bizarre-screen p-4">
            <div className="mb-6 text-center">
              <div className="inline-block border-2 border-[#A0C1A3] p-1 mb-4">
                <Factory className="h-8 w-8 text-[#A0C1A3] mx-auto" />
              </div>
              <h1 className="text-2xl font-mono uppercase text-[#A0C1A3] tracking-widest alien-shadow">
                Kiln Access
              </h1>
              
              <div className="mt-2 font-mono text-xs text-[#D2A976] flex items-center justify-center">
                <span className="alien-eye"></span>
                CONTROL SYSTEM READY
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="alien-display p-3 metal-texture">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#D2A976] font-mono text-xs uppercase block mb-1">
                    OPERATOR_ID
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#A0C1A3] p-2 flex items-center justify-center border-r border-[#2C2822]">
                      <Factory size={16} />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="operator@glassfuse.zone" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="alien-input flex-1 font-mono text-sm bg-[#2C2822] text-[#D2A976]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-[#D2A976] font-mono text-xs uppercase">
                      ACCESS_KEY
                    </Label>
                    <Link to="/forgot-password" className="text-xs text-[#A0C1A3]/70 hover:text-[#A0C1A3] transition-colors font-mono">
                      RESET_KEY?
                    </Link>
                  </div>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#A0C1A3] p-2 flex items-center justify-center border-r border-[#2C2822]">
                      <Flame size={16} />
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="************" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="alien-input flex-1 font-mono text-sm bg-[#2C2822] text-[#D2A976]"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="alien-button w-full h-12 font-mono uppercase tracking-widest text-sm"
              >
                ACTIVATE KILN <span className="ml-2 blink-text">█</span>
              </Button>
            </form>
            
            <div className="alien-display mt-8 p-3 metal-texture">
              <div className="text-center">
                <p className="text-xs text-[#D2A976] font-mono">
                  NEW_OPERATOR? 
                  <Link to="/register" className="text-[#A0C1A3] ml-2 hover:underline font-mono">
                    REQUEST_ACCESS
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center font-mono text-xs text-[#A0C1A3]">
          © 2025 GLASSFUSE RECLAMATION SYSTEM • ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
};

export default Login;
