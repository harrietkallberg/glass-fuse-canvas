
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Share2, Check, Pencil, Globe } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface CurveCardProps {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  isPrivate: boolean;
  glassType?: string;
  ovenType?: string;
  thickness?: string;
  projectType?: string;
  isModified?: boolean;
  curveData?: Array<{time: number, temperature: number}>;
  colorClass?: string;
}

const CurveCard = ({
  id,
  title,
  description,
  lastUpdated,
  isPrivate,
  glassType = "Standard",
  ovenType = "Electric",
  thickness = "6mm",
  projectType = "Full Fuse",
  isModified = false,
  curveData = [
    {time: 0, temperature: 20},
    {time: 60, temperature: 200},
    {time: 120, temperature: 500},
    {time: 180, temperature: 750},
    {time: 240, temperature: 500},
    {time: 300, temperature: 100},
    {time: 360, temperature: 20}
  ],
  colorClass = "glass-card"
}: CurveCardProps) => {
  // Format oven type to match editor options
  const formatOvenType = (type: string) => {
    if (type === "t" || type.toLowerCase().includes("top")) {
      return "Top Heated";
    } else if (type === "s" || type.toLowerCase().includes("side")) {
      return "Side Heated";
    } else if (type.toLowerCase().includes("gas")) {
      return "Gas Kiln";
    } else if (type.toLowerCase().includes("electric")) {
      return "Electric Kiln";
    } else if (type.toLowerCase().includes("ceramic")) {
      return "Ceramic Kiln";
    }
    return type;
  };

  return (
    <Card className={`${colorClass} border-white border overflow-hidden backdrop-blur-sm bg-white/40`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg md:text-xl">{title}</h3>
          <div className="flex items-center gap-2">
            <span className={`flex items-center text-xs md:text-sm font-medium ${isModified ? 'bg-white/80' : 'bg-white/60'} px-2 py-1 rounded-full border border-white/80 shadow-sm`}>
              {isModified ? (
                <>
                  <Pencil className="w-3 h-3 mr-1" /> Modified
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 mr-1" /> Standard
                </>
              )}
            </span>
            {isPrivate ? (
              <span className="text-xs md:text-sm font-medium bg-white/80 px-2 py-1 rounded-full border border-white/80 shadow-sm">
                Private
              </span>
            ) : (
              <span className="text-xs md:text-sm font-medium bg-white/60 px-2 py-1 rounded-full flex items-center border border-white/80 shadow-sm">
                <Globe className="w-3 h-3 mr-1" /> Public
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm md:text-base text-foreground">{description}</p>
        <div className="flex gap-4 mt-4">
          {/* Curve visualization with fixed display */}
          <div className="w-1/2 h-[80px] bg-white/20 backdrop-blur-sm rounded-md overflow-hidden border border-white/50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curveData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`colorTemp-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA07A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFA07A" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#FFA07A" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill={`url(#colorTemp-${id})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Glass and oven settings with improved readability */}
          <div className="w-1/2">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs md:text-sm">
              <div>
                <span className="text-muted-foreground font-medium">Glass</span>
                <p className="font-medium text-foreground">{glassType}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-medium">Oven</span>
                <p className="font-medium text-foreground">{formatOvenType(ovenType)}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-medium">Thickness</span>
                <p className="font-medium text-foreground">{thickness}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-medium">Project</span>
                <p className="font-medium text-foreground">{projectType}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <span className="text-xs md:text-sm text-muted-foreground font-medium">Updated {lastUpdated}</span>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
          <Link to={`/edit/${id}`}>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full bg-white/60 backdrop-blur-sm border-white hover:bg-white/70 ring-1 ring-white/70 shadow-lg"
              aria-label="Edit curve"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurveCard;
