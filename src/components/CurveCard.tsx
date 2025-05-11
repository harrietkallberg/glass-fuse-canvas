
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Share2, Check, Pencil } from "lucide-react";
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
  return (
    <Card className={`${colorClass} border-none overflow-hidden backdrop-blur-sm bg-white/10`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center text-xs bg-white/20 px-2 py-1 rounded-full">
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
            {isPrivate && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                Private
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-4 mt-4">
          {/* Miniature curve plot */}
          <div className="w-1/2 h-[80px] bg-black/10 backdrop-blur-sm rounded-md overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curveData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id={`colorTemp-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FEC6A1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FEC6A1" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#FEC6A1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#colorTemp-${id})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Glass and oven settings */}
          <div className="w-1/2">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <span className="text-white/70">Glass</span>
                <p className="font-medium text-white">{glassType}</p>
              </div>
              <div>
                <span className="text-white/70">Oven</span>
                <p className="font-medium text-white">{ovenType}</p>
              </div>
              <div>
                <span className="text-white/70">Thickness</span>
                <p className="font-medium text-white">{thickness}</p>
              </div>
              <div>
                <span className="text-white/70">Project</span>
                <p className="font-medium text-white">{projectType}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <span className="text-xs text-muted-foreground">Updated {lastUpdated}</span>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
          <Link to={`/edit/${id}`}>
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurveCard;
