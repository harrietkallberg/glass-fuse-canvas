
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, TerminalSquare, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import TypingAnimation from "@/components/TypingAnimation";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "ERROR_",
        description: "AUTHENTICATION FAILED: MISSING CREDENTIALS",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "ACCESS_GRANTED",
      description: "CONNECTING TO SYSTEM MAINFRAME...",
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] relative overflow-hidden">
      {/* Tech grid background */}
      <div className="tech-grid-bg"></div>
      
      {/* Scanlines overlay */}
      <div className="screen-scanline"></div>
      
      {/* Animated typing in top corner */}
      <TypingAnimation />
      
      {/* Top status bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#2A2A2A] border-b border-red-500/30 p-1 flex justify-between items-center z-30 font-mono text-xs">
        <div className="flex items-center">
          <span className="text-red-500 mx-2">SYS:</span>
          <span className="text-green-500">ONLINE</span>
        </div>
        <div className="text-gray-400">{new Date().toLocaleTimeString()} - AUTH MODULE v2.3.1</div>
        <div className="flex items-center">
          <span className="text-red-500 mr-1">CPU:</span>
          <span className="text-gray-400">24%</span>
        </div>
      </div>
      
      <div className="container relative z-10 max-w-md w-full px-4">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="font-mono text-xs text-gray-300 hover:text-red-500 hover:bg-[#2A2A2A] flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            RETURN_TO_MAIN
          </Button>
        </Link>
        
        <div className="crt-frame p-6">
          <div className="crt-screen p-4">
            <div className="mb-6 text-center">
              <div className="inline-block border-2 border-red-500 p-1 mb-4">
                <Lock className="h-8 w-8 text-red-500 mx-auto" />
              </div>
              <h1 className="text-2xl font-mono uppercase text-red-500 tracking-widest retro-shadow">
                System Access
              </h1>
              
              <div className="mt-2 font-mono text-xs text-gray-300 flex items-center justify-center">
                <span className="led"></span>
                SECURE CONNECTION ESTABLISHED
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="tech-display p-3 bg-[#2A2A2A]">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-mono text-xs uppercase block mb-1">
                    USER_ID
                  </Label>
                  <div className="flex">
                    <div className="bg-[#333] text-red-500 p-2 flex items-center justify-center border-r border-[#444]">
                      <TerminalSquare size={16} />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="user@domain.ext" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="tech-input flex-1 font-mono text-sm bg-[#222] text-gray-300"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-300 font-mono text-xs uppercase">
                      ACCESS_KEY
                    </Label>
                    <Link to="/forgot-password" className="text-xs text-red-500/70 hover:text-red-500 transition-colors font-mono">
                      RESET_KEY?
                    </Link>
                  </div>
                  <div className="flex">
                    <div className="bg-[#333] text-red-500 p-2 flex items-center justify-center border-r border-[#444]">
                      <Lock size={16} />
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="************" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="tech-input flex-1 font-mono text-sm bg-[#222] text-gray-300"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="tech-button w-full h-12 font-mono uppercase tracking-widest text-sm bg-red-600 hover:bg-red-700 shadow-[0_0_10px_rgba(255,0,0,0.5)]"
              >
                AUTHENTICATE <span className="ml-2 blink-text">█</span>
              </Button>
            </form>
            
            <div className="tech-display mt-8 p-3 bg-[#2A2A2A]">
              <div className="text-center">
                <p className="text-xs text-gray-300 font-mono">
                  NEW_USER? 
                  <Link to="/register" className="text-red-500 ml-2 hover:underline font-mono">
                    CREATE_ACCOUNT
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center font-mono text-xs text-gray-400">
          © 2025 TECHNODYNE SYSTEMS • ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
};

export default Login;
