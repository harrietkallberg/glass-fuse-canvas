
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Share2 } from "lucide-react";

interface CurveCardProps {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  isPrivate: boolean;
  colorClass?: string;
}

const CurveCard = ({
  id,
  title,
  description,
  lastUpdated,
  isPrivate,
  colorClass = "glass-card"
}: CurveCardProps) => {
  return (
    <Card className={`${colorClass} border-none overflow-hidden`}>
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg text-white text-shadow-sm">{title}</h3>
          {isPrivate && (
            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white/90">
              Private
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2 relative z-10">
        <p className="text-sm text-white/80">{description}</p>
        <div className="w-full h-[60px] mt-4 flex items-center justify-center overflow-hidden rounded-md bg-white/10 backdrop-blur-md">
          <div className="w-full h-[2px] bg-white/50 relative">
            <div className="absolute h-2 w-2 bg-white/80 rounded-full -top-[3px] glow-dot" style={{ left: '20%' }}></div>
            <div className="absolute h-2 w-2 bg-white/80 rounded-full -top-[3px] glow-dot" style={{ left: '50%' }}></div>
            <div className="absolute h-2 w-2 bg-white/80 rounded-full -top-[3px] glow-dot" style={{ left: '80%' }}></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between relative z-10">
        <span className="text-xs text-white/70">Updated {lastUpdated}</span>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white">
            <Share2 className="h-4 w-4" />
          </Button>
          <Link to={`/edit/${id}`}>
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white/20 border-white/30 hover:bg-white/30 text-white">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurveCard;
