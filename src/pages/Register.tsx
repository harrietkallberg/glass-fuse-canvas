
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Factory, Leaf, Mountain, Flame } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import TypingAnimation from "@/components/TypingAnimation";
import AlienShapes from "@/components/AlienShapes";

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
        description: "OPERATOR CREATION FAILED: INSUFFICIENT DATA PROVIDED",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "OPERATOR_REGISTERED",
      description: "INITIALIZING KILN ACCESS CREDENTIALS...",
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C2822] via-[#2F2A1F] to-[#343021] relative overflow-hidden">
      {/* Organic shapes and industrial elements in the background */}
      <AlienShapes />
      
      {/* Atmospheric overlay */}
      <div className="planet-atmosphere"></div>
      
      {/* Scanline effect */}
      <div className="planet-scanline"></div>
      
      {/* Animated typing in top corner */}
      <TypingAnimation />
      
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
              <div className="inline-block border-2 border-[#A0C1A3] p-1 mb-4 rounded-full">
                <Factory className="h-8 w-8 text-[#A0C1A3] mx-auto" />
              </div>
              <h1 className="text-2xl font-mono uppercase text-[#A0C1A3] tracking-widest alien-shadow">
                New Operator
              </h1>
              
              <div className="mt-2 font-mono text-xs text-[#D2A976]">
                INTERFACING WITH ACCESS CONTROL DATABASE...
              </div>
            </div>
            
            <div className="alien-display p-3 mb-6 metal-texture">
              <div className="font-mono text-xs text-[#A0C1A3] mb-1">&gt; OPERATOR_REGISTRATION_PORTAL</div>
              <div className="h-[1px] bg-[#403E43] w-full mb-2"></div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#D2A976] font-mono text-xs uppercase">
                    FULL_NAME
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#A0C1A3] p-2 flex items-center justify-center border-r border-[#2C2822]">
                      <Factory size={16} />
                    </div>
                    <Input 
                      id="name" 
                      placeholder="Glass Artisan" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                      className="alien-input flex-1 font-mono text-sm bg-[#2C2822] text-[#D2A976]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[#D2A976] font-mono text-xs uppercase">
                    OPERATOR_CODE
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#A0C1A3] p-2 flex items-center justify-center border-r border-[#2C2822]">
                      <span className="font-mono text-[#A0C1A3]">@</span>
                    </div>
                    <Input 
                      id="username" 
                      placeholder="glass_artisan42" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                      className="alien-input flex-1 font-mono text-sm bg-[#2C2822] text-[#D2A976]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#D2A976] font-mono text-xs uppercase">
                    CONTACT_PATH
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#A0C1A3] p-2 flex items-center justify-center border-r border-[#2C2822]">
                      <Leaf size={16} />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="operator@glassfuse.zone" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="alien-input flex-1 font-mono text-sm bg-[#2C2822] text-[#D2A976]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#D2A976] font-mono text-xs uppercase">
                    ACCESS_KEY
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#A0C1A3] p-2 flex items-center justify-center border-r border-[#2C2822]">
                      <Flame size={16} />
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="************" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="alien-input flex-1 font-mono text-sm bg-[#2C2822] text-[#D2A976]"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="alien-button w-full h-12 mt-4 font-mono uppercase tracking-widest text-sm"
                >
                  REGISTER ACCESS <span className="ml-2 blink-text">█</span>
                </Button>
              </form>
            </div>
            
            <div className="alien-display p-3 metal-texture">
              <div className="text-center">
                <p className="text-xs text-[#D2A976] font-mono">
                  EXISTING OPERATOR? 
                  <Link to="/login" className="text-[#A0C1A3] ml-2 hover:underline font-mono">
                    ACCESS_KILN
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 font-mono text-[10px] text-[#A0C1A3]">
          <div>RECLAMATION v2.5.1</div>
          <div>SYSTEMS: ONLINE</div>
          <div>ZONE STATUS: CLEAR</div>
        </div>
      </div>
    </div>
  );
};

export default Register;
