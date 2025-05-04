
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plane, Moon, Star, Cloud } from "lucide-react";
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
        description: "ENTITY CREATION FAILED: INSUFFICIENT CONSCIOUSNESS DATA",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "ENTITY_CREATED",
      description: "MATERIALIZING CONSCIOUSNESS PATTERN...",
    });
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] via-[#221F26] to-[#221C24] relative overflow-hidden">
      {/* Strange alien shapes in the background */}
      <AlienShapes />
      
      {/* Additional bizarre organic elements */}
      <div className="alien-organism w-[320px] h-[320px] top-[5%] right-[10%] opacity-50"></div>
      <div className="alien-organism w-[280px] h-[280px] bottom-[15%] left-[5%] opacity-40"></div>
      
      {/* Atmospheric overlay */}
      <div className="planet-atmosphere"></div>
      
      {/* Scanline effect */}
      <div className="planet-scanline"></div>
      
      {/* Animated typing in top corner */}
      <TypingAnimation />
      
      {/* Weird code-like animation in the background */}
      <div className="fixed inset-0 flex flex-wrap overflow-hidden pointer-events-none opacity-10 z-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-full text-[#5B81B1] font-mono text-xs" style={{ animationDelay: `${i * 0.5}s` }}>
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
          <Button variant="ghost" size="sm" className="font-mono text-xs text-[#A1C4F0] hover:text-[#5B81B1] hover:bg-[#403E43] flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            RETURN_TO_MAIN
          </Button>
        </Link>
        
        <div className="bizarre-frame p-6">
          <div className="bizarre-screen p-4">
            <div className="mb-6 text-center">
              <div className="inline-block border-2 border-[#5B81B1] p-1 mb-4 rounded-full">
                <Plane className="h-8 w-8 text-[#5B81B1] mx-auto" />
              </div>
              <h1 className="text-2xl font-mono uppercase text-[#5B81B1] tracking-widest alien-shadow">
                New Entity
              </h1>
              
              <div className="mt-2 font-mono text-xs text-[#A1C4F0]">
                INTERFACING WITH COSMIC CONSCIOUSNESS DATABASE...
              </div>
            </div>
            
            <div className="alien-display p-3 mb-6">
              <div className="font-mono text-xs text-[#5B81B1] mb-1">&gt; ENTITY_CREATION_PORTAL</div>
              <div className="h-[1px] bg-[#403E43] w-full mb-2"></div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#A1C4F0] font-mono text-xs uppercase">
                    DESIGNATION
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#5B81B1] p-2 flex items-center justify-center border-r border-[#1A1F2C]">
                      <Moon size={16} />
                    </div>
                    <Input 
                      id="name" 
                      placeholder="Cosmic Entity" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                      className="alien-input flex-1 font-mono text-sm bg-[#1A1F2C] text-[#A1C4F0]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[#A1C4F0] font-mono text-xs uppercase">
                    ENTITY_CODE
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#5B81B1] p-2 flex items-center justify-center border-r border-[#1A1F2C]">
                      <span className="font-mono text-[#5B81B1]">@</span>
                    </div>
                    <Input 
                      id="username" 
                      placeholder="cosmic_being42" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                      className="alien-input flex-1 font-mono text-sm bg-[#1A1F2C] text-[#A1C4F0]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#A1C4F0] font-mono text-xs uppercase">
                    NEURAL_PATH
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#5B81B1] p-2 flex items-center justify-center border-r border-[#1A1F2C]">
                      <Cloud size={16} />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="entity@cosmos.void" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="alien-input flex-1 font-mono text-sm bg-[#1A1F2C] text-[#A1C4F0]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#A1C4F0] font-mono text-xs uppercase">
                    CONSCIOUSNESS_KEY
                  </Label>
                  <div className="flex">
                    <div className="bg-[#403E43] text-[#5B81B1] p-2 flex items-center justify-center border-r border-[#1A1F2C]">
                      <Star size={16} />
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="************" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="alien-input flex-1 font-mono text-sm bg-[#1A1F2C] text-[#A1C4F0]"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="alien-button w-full h-12 mt-4 font-mono uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(91,129,177,0.5)]"
                >
                  MATERIALIZE ENTITY <span className="ml-2 blink-text">█</span>
                </Button>
              </form>
            </div>
            
            <div className="alien-display p-3">
              <div className="text-center">
                <p className="text-xs text-[#A1C4F0] font-mono">
                  ENTITY ALREADY EXISTS? 
                  <Link to="/login" className="text-[#5B81B1] ml-2 hover:underline font-mono">
                    ACCESS_CONSCIOUSNESS
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 font-mono text-[10px] text-[#5B81B1]">
          <div>DIMENSIONAL GATE v2.5.1</div>
          <div>TELEPATHY: ACTIVE</div>
          <div>VOID CONNECTION: OPEN</div>
        </div>
      </div>
    </div>
  );
};

export default Register;
