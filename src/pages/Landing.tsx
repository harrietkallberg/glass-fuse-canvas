
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Server, Database, HardDrive } from "lucide-react";
import TypingAnimation from "@/components/TypingAnimation";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] relative overflow-hidden">
      {/* Tech grid background */}
      <div className="tech-grid-bg"></div>
      
      {/* Scanlines overlay */}
      <div className="screen-scanline"></div>
      
      {/* Animated typing text in top corner */}
      <TypingAnimation />
      
      {/* Status indicators */}
      <div className="fixed top-4 right-4 flex gap-4 items-center">
        <div className="flex items-center">
          <span className="led"></span>
          <span className="font-mono text-xs text-gray-400">SYS</span>
        </div>
        <div className="flex items-center">
          <span className="led"></span>
          <span className="font-mono text-xs text-gray-400">NET</span>
        </div>
        <div className="flex items-center">
          <span className="led-off"></span>
          <span className="font-mono text-xs text-gray-400">AUX</span>
        </div>
      </div>
      
      <div className="container relative z-10 max-w-4xl w-full px-4 py-12">
        <div className="crt-frame p-8">
          <div className="crt-screen p-6">
            {/* Header with tech style */}
            <div className="mb-8 text-center">
              <h1 className="text-6xl font-mono text-red-500 retro-shadow tracking-wider uppercase crt-glitch">
                GlassFuse_
              </h1>
              <div className="flex items-center justify-center mt-2 mb-6">
                <div className="h-[1px] bg-red-500/50 w-16"></div>
                <span className="font-mono text-red-500 mx-3 text-xs">v1.0.2</span>
                <div className="h-[1px] bg-red-500/50 w-16"></div>
              </div>
              <p className="font-mono text-gray-300 mt-1 crt-glitch">
                &gt; PRECISION GLASS FUSION CONTROL SYSTEM
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="tech-panel p-4 flex items-start space-x-3 bg-[#2A2A2A]">
                <Terminal className="text-red-500 mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-red-500 tracking-wider text-lg">Parameters</h3>
                  <p className="font-mono text-gray-300 text-sm mt-1">Design precise temperature curves with engineered control systems</p>
                </div>
              </div>
              
              <div className="tech-panel p-4 flex items-start space-x-3 bg-[#2A2A2A]">
                <Server className="text-red-500 mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-red-500 tracking-wider text-lg">Archive</h3>
                  <p className="font-mono text-gray-300 text-sm mt-1">Document firing results with image database functionality</p>
                </div>
              </div>
              
              <div className="tech-panel p-4 flex items-start space-x-3 bg-[#2A2A2A]">
                <Database className="text-red-500 mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-red-500 tracking-wider text-lg">Network</h3>
                  <p className="font-mono text-gray-300 text-sm mt-1">Connect with other glass fusion technicians worldwide</p>
                </div>
              </div>
              
              <div className="tech-panel p-4 flex items-start space-x-3 bg-[#2A2A2A]">
                <HardDrive className="text-red-500 mt-1" size={20} />
                <div>
                  <h3 className="font-mono uppercase text-red-500 tracking-wider text-lg">Analytics</h3>
                  <p className="font-mono text-gray-300 text-sm mt-1">Refine techniques through iteration and data analysis</p>
                </div>
              </div>
            </div>
            
            <div className="text-center tech-display mb-6 bg-[#2A2A2A]">
              <div className="font-mono text-xs text-gray-400 mb-2">
                SYSTEM STATUS: <span className="text-green-500">ONLINE</span> | USERS: <span className="text-red-500">724</span> | LAST UPDATE: <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="tech-button w-full sm:w-auto gap-2 h-12 bg-red-600 hover:bg-red-700 shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                  ACCESS_SYSTEM
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="outline" className="tech-button w-full sm:w-auto h-12 bg-[#333333] border-red-600/50 hover:bg-[#444444]">
                  CREATE_ACCOUNT
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 font-mono text-xs text-center text-gray-400">
              &gt; <span className="blink-text">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
