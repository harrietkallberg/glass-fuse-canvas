
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
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">{title}</h3>
          {isPrivate && (
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              Private
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="w-full h-[60px] mt-4 flex items-center justify-center overflow-hidden rounded-md bg-muted/50">
          <div className="w-full h-[2px] bg-primary/30 relative">
            <div className="absolute h-2 w-2 bg-primary rounded-full -top-[3px]" style={{ left: '20%' }}></div>
            <div className="absolute h-2 w-2 bg-primary rounded-full -top-[3px]" style={{ left: '50%' }}></div>
            <div className="absolute h-2 w-2 bg-primary rounded-full -top-[3px]" style={{ left: '80%' }}></div>
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
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurveCard;
