
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
    <div className="min-h-screen bg-glass-gradient-1 pb-20">
      <Navigation />
      
      <div className="container mx-auto pt-24 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Firing Curves</h1>
            <p className="text-muted-foreground">Create and manage your glass fusion schedules</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search your curves..." className="pl-8" />
            </div>
            
            <Link to="/create">
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                New Curve
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCurves.map(curve => (
            <CurveCard
              key={curve.id}
              id={curve.id}
              title={curve.title}
              description={curve.description}
              lastUpdated={curve.lastUpdated}
              isPrivate={curve.isPrivate}
              colorClass={curve.colorClass}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
