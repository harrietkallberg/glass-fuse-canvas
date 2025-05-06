
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import CurveCard from "@/components/CurveCard";
import { Link } from "react-router-dom";

// Mock data for curves
const mockCurves = [
  {
    id: "1",
    title: "Standard Bowl Fuse",
    description: "Full fuse for 10mm thick glass bowl project",
    lastUpdated: "2 days ago",
    isPrivate: false,
  },
  {
    id: "2",
    title: "Tack Fuse Experiment",
    description: "Light tack fuse preserving texture for wall art",
    lastUpdated: "1 week ago",
    isPrivate: true,
    colorClass: "glass-yellow"
  },
  {
    id: "3",
    title: "Casting Schedule",
    description: "Slow schedule for thick cast glass sculptures",
    lastUpdated: "3 days ago",
    isPrivate: false,
    colorClass: "glass-orange"
  },
  {
    id: "4",
    title: "Slumping Profile",
    description: "Gentle slumping for decorative plate",
    lastUpdated: "yesterday",
    isPrivate: false,
    colorClass: "glass-green"
  },
  {
    id: "5",
    title: "Delicate Drape",
    description: "Careful schedule for thin glass draping",
    lastUpdated: "3 hours ago",
    isPrivate: true,
    colorClass: "glass-turquoise"
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen fluid-bg dashboard-bg-animated relative overflow-hidden">
      {/* Animated background blob shapes */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div 
          className="fluid-shape bg-[#F97316]/15 w-[40rem] h-[40rem] rounded-full 
                    absolute -top-[10rem] -left-[15rem] animate-float-slow"
        ></div>
        <div 
          className="fluid-shape bg-[#33C3F0]/20 w-[50rem] h-[50rem] rounded-full 
                    absolute -bottom-[15rem] -right-[10rem] animate-float-medium"
        ></div>
        <div 
          className="fluid-shape bg-[#FEC6A1]/15 w-[25rem] h-[25rem] rounded-full 
                    absolute top-[20%] right-[15%] animate-float-slow-reverse"
        ></div>
        <div 
          className="fluid-shape bg-[#A5D8E2]/20 w-[30rem] h-[30rem] rounded-full 
                    absolute bottom-[25%] left-[10%] animate-float-reverse"
        ></div>
        <div 
          className="fluid-shape bg-[#F97316]/10 w-[20rem] h-[20rem] rounded-full 
                    absolute top-[40%] left-[40%] animate-pulse-float"
        ></div>
        
        {/* Dynamic light source effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-diagonal-wave"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-diagonal-reverse-wave"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-cross-diagonal-wave"></div>
      </div>
      
      <Navigation />
      
      <div className="container mx-auto pt-24 px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2A6B6B]" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.1)' }}>
              Your Firing Curves
            </h1>
            <p className="text-muted-foreground">Create and manage your glass fusion schedules</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search your curves..." className="pl-8 glass-surface backdrop-blur-md bg-white/30" />
            </div>
            
            <Link to="/create">
              <Button className="gap-1 glass-vibrant-orange backdrop-blur-md shadow-md hover:shadow-lg">
                <Plus className="h-4 w-4" />
                New Curve
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCurves.map(curve => (
            <div key={curve.id} className="transform transition-all hover:scale-102 hover:-translate-y-1 duration-300">
              <CurveCard
                id={curve.id}
                title={curve.title}
                description={curve.description}
                lastUpdated={curve.lastUpdated}
                isPrivate={curve.isPrivate}
                colorClass={curve.colorClass}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
