
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Lock, Mail, FileCode } from "lucide-react";
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
        title: "ERROR_",
        description: "ACCOUNT CREATION FAILED: INCOMPLETE DATA",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "ACCOUNT_CREATED",
      description: "INITIALIZING USER PROFILE...",
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
      {/* Tech grid background */}
      <div className="tech-grid-bg"></div>
      
      {/* Scanlines overlay */}
      <div className="screen-scanline"></div>
      
      {/* Code-like animation in the background */}
      <div className="fixed inset-0 flex flex-wrap overflow-hidden pointer-events-none opacity-10 z-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-full text-green-500 font-mono text-xs" style={{ animationDelay: `${i * 0.5}s` }}>
            &gt; {Array.from({ length: 15 }).map((_, j) => (
              <span key={j}>
                {Math.random().toString(36).substring(2, 8)} 
              </span>
            ))}
          </div>
        ))}
      </div>
      
      <div className="container relative z-10 max-w-md w-full px-4">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="font-mono text-xs text-gray-400 hover:text-red-500 hover:bg-[#1A1A1A] flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            RETURN_TO_MAIN
          </Button>
        </Link>
        
        <div className="crt-frame p-6">
          <div className="crt-screen p-4">
            <div className="mb-6 text-center">
              <div className="inline-block border-2 border-red-500 p-1 mb-4">
                <FileCode className="h-8 w-8 text-red-500 mx-auto" />
              </div>
              <h1 className="text-2xl font-mono uppercase text-red-500 tracking-widest retro-shadow">
                New Account
              </h1>
              
              <div className="mt-2 font-mono text-xs text-gray-400">
                INITIALIZING USER DATABASE CONNECTION...
              </div>
            </div>
            
            <div className="tech-display p-3 mb-6">
              <div className="font-mono text-xs text-green-500 mb-1">&gt; USER_CREATION_MODULE</div>
              <div className="h-[1px] bg-[#333] w-full mb-2"></div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-400 font-mono text-xs uppercase">
                    NAME
                  </Label>
                  <div className="flex">
                    <div className="bg-[#222] text-red-500 p-2 flex items-center justify-center border-r border-[#333]">
                      <User size={16} />
                    </div>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                      className="tech-input flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-400 font-mono text-xs uppercase">
                    USERNAME
                  </Label>
                  <div className="flex">
                    <div className="bg-[#222] text-red-500 p-2 flex items-center justify-center border-r border-[#333]">
                      <span className="font-mono text-red-500">@</span>
                    </div>
                    <Input 
                      id="username" 
                      placeholder="technician42" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                      className="tech-input flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-400 font-mono text-xs uppercase">
                    EMAIL
                  </Label>
                  <div className="flex">
                    <div className="bg-[#222] text-red-500 p-2 flex items-center justify-center border-r border-[#333]">
                      <Mail size={16} />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="user@domain.ext" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="tech-input flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-400 font-mono text-xs uppercase">
                    PASSWORD
                  </Label>
                  <div className="flex">
                    <div className="bg-[#222] text-red-500 p-2 flex items-center justify-center border-r border-[#333]">
                      <Lock size={16} />
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="************" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="tech-input flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="tech-button w-full h-12 mt-4 font-mono uppercase tracking-widest text-sm bg-red-600/80 hover:bg-red-600"
                >
                  INITIALIZE ACCOUNT <span className="ml-2 blink-text">█</span>
                </Button>
              </form>
            </div>
            
            <div className="tech-display p-3">
              <div className="text-center">
                <p className="text-xs text-gray-400 font-mono">
                  ALREADY REGISTERED? 
                  <Link to="/login" className="text-red-500 ml-2 hover:underline font-mono">
                    LOGIN
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 font-mono text-[10px] text-gray-500">
          <div>SYSTEM v2.5.1</div>
          <div>MEMORY: 64MB</div>
          <div>I/O PORT: ACTIVE</div>
        </div>
      </div>
    </div>
  );
};

export default Register;
