
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Planet, Cloud, Star, Moon } from "lucide-react";
import TypingAnimation from "@/components/TypingAnimation";
import AlienShapes from "@/components/AlienShapes";
import FloatingEyes from "@/components/FloatingEyes";

const Landing = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Animation effect for alien text hover
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = title.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      title.style.textShadow = `
        ${(x - rect.width / 2) / 20}px ${(y - rect.height / 2) / 20}px 5px rgba(91, 129, 177, 0.7),
        ${-(x - rect.width / 2) / 40}px ${-(y - rect.height / 2) / 40}px 5px rgba(121, 45, 84, 0.7)
      `;
    };
    
    title.addEventListener('mousemove', handleMouseMove);
    return () => title.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] via-[#221F26] to-[#221C24] relative overflow-hidden">
      {/* Strange alien shapes in the background */}
      <AlienShapes />
      
      {/* Additional bizarre organic elements */}
      <div className="alien-organism w-[300px] h-[300px] top-[-50px] left-[10%] opacity-70"></div>
      <div className="alien-organism w-[400px] h-[400px] bottom-[-100px] right-[5%] opacity-60"></div>
      <div className="alien-organism w-[250px] h-[250px] top-[30%] right-[15%] opacity-40"></div>
      <div className="alien-organism w-[350px] h-[350px] bottom-[20%] left-[5%] opacity-50"></div>
      
      {/* Atmospheric overlay */}
      <div className="planet-atmosphere"></div>
      
      {/* Scanline effect */}
      <div className="planet-scanline"></div>
      
      {/* Watching eyes */}
      <FloatingEyes />
      
      {/* Animated typing code */}
      <TypingAnimation />
      
      {/* Status indicators */}
      <div className="fixed top-4 right-4 flex gap-4 items-center z-20">
        <div className="flex items-center">
          <span className="alien-eye"></span>
          <span className="font-mono text-xs text-[#5B81B1]">DRAAG</span>
        </div>
        <div className="flex items-center">
          <span className="alien-eye"></span>
          <span className="font-mono text-xs text-[#5B81B1]">OM</span>
        </div>
        <div className="flex items-center">
          <span className="alien-eye-dim"></span>
          <span className="font-mono text-xs text-[#5B81B1]">TERR</span>
        </div>
      </div>
      
      <div className="container relative z-10 max-w-4xl w-full px-4 py-12">
        <div className="bizarre-frame p-8">
          <div className="bizarre-screen p-6">
            {/* Header with alien style */}
            <div className="mb-8 text-center">
              <h1 ref={titleRef} className="text-6xl font-mono text-[#5B81B1] tracking-wider uppercase alien-glitch cursor-default">
                GlassFuse_
              </h1>
              <div className="flex items-center justify-center mt-2 mb-6">
                <div className="h-[1px] bg-[#5B81B1]/50 w-16"></div>
                <span className="font-mono text-[#5B81B1] mx-3 text-xs">PLANET.v2.4</span>
                <div className="h-[1px] bg-[#5B81B1]/50 w-16"></div>
              </div>
              <p className="font-mono text-[#A1C4F0] mt-1 alien-glitch">
                &gt; ALIEN GLASS FUSION CONTROL SYSTEM
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="alien-panel p-4 flex items-start space-x-3">
                <Planet className="text-[#5B81B1] mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-[#5B81B1] tracking-wider text-lg">Parameters</h3>
                  <p className="font-mono text-[#A1C4F0] text-sm mt-1">Design precise temperature curves for alien glass fusion</p>
                </div>
              </div>
              
              <div className="alien-panel p-4 flex items-start space-x-3">
                <Star className="text-[#5B81B1] mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-[#5B81B1] tracking-wider text-lg">Archive</h3>
                  <p className="font-mono text-[#A1C4F0] text-sm mt-1">Document firing results in the cosmic database</p>
                </div>
              </div>
              
              <div className="alien-panel p-4 flex items-start space-x-3">
                <Moon className="text-[#5B81B1] mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-[#5B81B1] tracking-wider text-lg">Network</h3>
                  <p className="font-mono text-[#A1C4F0] text-sm mt-1">Connect with glass artisans across the cosmos</p>
                </div>
              </div>
              
              <div className="alien-panel p-4 flex items-start space-x-3">
                <Cloud className="text-[#5B81B1] mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-[#5B81B1] tracking-wider text-lg">Analytics</h3>
                  <p className="font-mono text-[#A1C4F0] text-sm mt-1">Analyze methods through dimensional iterations</p>
                </div>
              </div>
            </div>
            
            <div className="text-center alien-display mb-6">
              <div className="font-mono text-xs text-[#5B81B1] mb-2">
                SYSTEM STATUS: <span className="text-[#5B81B1]">OPERATIONAL</span> | ENTITIES: <span className="text-[#991B1B]">724</span> | COSMIC CYCLE: <span className="text-[#5B81B1]">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="alien-button w-full sm:w-auto gap-2 h-12 shadow-[0_0_15px_rgba(91,129,177,0.5)]">
                  ACCESS_SYSTEM
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="outline" className="alien-button w-full sm:w-auto h-12 bg-[#1A1F2C] border-[#5B81B1]/50 hover:bg-[#403E43]">
                  CREATE_ENTITY
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 font-mono text-xs text-center text-[#5B81B1]">
              &gt; <span className="blink-text">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
