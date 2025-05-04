
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Factory, Leaf, Mountain, Flame } from "lucide-react";
import TypingAnimation from "@/components/TypingAnimation";
import AlienShapes from "@/components/AlienShapes";
import FloatingEyes from "@/components/FloatingEyes";

const Landing = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Animation effect for title hover
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = title.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      title.style.textShadow = `
        ${(x - rect.width / 2) / 20}px ${(y - rect.height / 2) / 20}px 5px rgba(160, 193, 163, 0.7),
        ${-(x - rect.width / 2) / 40}px ${-(y - rect.height / 2) / 40}px 5px rgba(126, 77, 58, 0.7)
      `;
    };
    
    title.addEventListener('mousemove', handleMouseMove);
    return () => title.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C2822] via-[#2F2A1F] to-[#343021] relative overflow-hidden">
      {/* Strange organic shapes in the background */}
      <AlienShapes />
      
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
          <span className="font-mono text-xs text-[#A0C1A3]">Zone</span>
        </div>
        <div className="flex items-center">
          <span className="alien-eye"></span>
          <span className="font-mono text-xs text-[#A0C1A3]">HEAT</span>
        </div>
        <div className="flex items-center">
          <span className="alien-eye-dim"></span>
          <span className="font-mono text-xs text-[#A0C1A3]">SILO</span>
        </div>
      </div>
      
      <div className="container relative z-10 max-w-4xl w-full px-4 py-12">
        <div className="bizarre-frame p-8">
          <div className="bizarre-screen p-6">
            {/* Header with ruins style */}
            <div className="mb-8 text-center">
              <h1 ref={titleRef} className="text-6xl font-mono text-[#A0C1A3] tracking-wider uppercase alien-glitch cursor-default">
                GlassFuse_
              </h1>
              <div className="flex items-center justify-center mt-2 mb-6">
                <div className="h-[1px] bg-[#A0C1A3]/50 w-16"></div>
                <span className="font-mono text-[#A0C1A3] mx-3 text-xs">FUSION.v2.4</span>
                <div className="h-[1px] bg-[#A0C1A3]/50 w-16"></div>
              </div>
              <p className="font-mono text-[#D2A976] mt-1 alien-glitch">
                &gt; RECLAIMED GLASS FUSION CONTROL SYSTEM
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="alien-panel p-4 flex items-start space-x-3 moss-overlay">
                <Factory className="text-[#A0C1A3] mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-[#A0C1A3] tracking-wider text-lg">Kiln Control</h3>
                  <p className="font-mono text-[#D2A976] text-sm mt-1">Design precise temperature curves for your glass firing projects</p>
                </div>
              </div>
              
              <div className="alien-panel p-4 flex items-start space-x-3 moss-overlay">
                <Leaf className="text-[#A0C1A3] mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-[#A0C1A3] tracking-wider text-lg">Materials</h3>
                  <p className="font-mono text-[#D2A976] text-sm mt-1">Document firing results with different raw materials</p>
                </div>
              </div>
              
              <div className="alien-panel p-4 flex items-start space-x-3 moss-overlay">
                <Mountain className="text-[#A0C1A3] mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-[#A0C1A3] tracking-wider text-lg">Projects</h3>
                  <p className="font-mono text-[#D2A976] text-sm mt-1">Track multiple firings across different projects</p>
                </div>
              </div>
              
              <div className="alien-panel p-4 flex items-start space-x-3 moss-overlay">
                <Flame className="text-[#A0C1A3] mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-[#A0C1A3] tracking-wider text-lg">Analysis</h3>
                  <p className="font-mono text-[#D2A976] text-sm mt-1">Analyze firing outcomes through multiple iterations</p>
                </div>
              </div>
            </div>
            
            <div className="text-center alien-display mb-6 metal-texture">
              <div className="font-mono text-xs text-[#A0C1A3] mb-2">
                FURNACE STATUS: <span className="text-[#A0C1A3]">STANDBY</span> | ARTIFACTS: <span className="text-[#CB8F7E]">724</span> | BATCH: <span className="text-[#A0C1A3]">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="alien-button w-full sm:w-auto gap-2 h-12">
                  ACCESS_KILN
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="outline" className="alien-button w-full sm:w-auto h-12 bg-[#2C2822] border-[#A0C1A3]/50 hover:bg-[#403E43]">
                  NEW_OPERATOR
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 font-mono text-xs text-center text-[#A0C1A3]">
              &gt; <span className="blink-text">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
