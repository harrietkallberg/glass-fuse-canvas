import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Share2, Check, Pencil, Globe, Trash2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  onDelete?: (id: string) => void;
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
  colorClass = "glass-card",
  onDelete
}: CurveCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Failed to delete curve:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`${colorClass} border-white/70 border overflow-hidden backdrop-blur-sm bg-white/30`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg md:text-xl">{title}</h3>
          <div className="flex items-center gap-2">
            <span className={`flex items-center text-xs md:text-sm font-medium ${isModified ? 'bg-white/70' : 'bg-white/50'} px-2 py-1 rounded-full border border-white/60 shadow-sm`}>
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
              <span className="text-xs md:text-sm font-medium bg-white/70 px-2 py-1 rounded-full border border-white/60 shadow-sm">
                Private
              </span>
            ) : (
              <span className="text-xs md:text-sm font-medium bg-white/50 px-2 py-1 rounded-full flex items-center border border-white/60 shadow-sm">
                <Globe className="w-3 h-3 mr-1" /> Public
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm md:text-base text-foreground font-medium">{description}</p>
        <div className="flex gap-4 mt-4">
          {/* Curve visualization with overflow visible on sides */}
          <div className="w-1/2 h-[85px] bg-white/15 backdrop-blur-sm rounded-md overflow-hidden border border-white/40 relative">
            <div className="absolute inset-0 -mx-2">
              <ResponsiveContainer width="110%" height="100%">
                <AreaChart data={curveData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`colorTemp-${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#F97316" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill={`url(#colorTemp-${id})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-8 w-8 rounded-full bg-red-50/50 backdrop-blur-sm border-red-200/70 hover:bg-red-100/60 ring-1 ring-red-200/50 shadow-lg text-red-600 hover:text-red-700"
                aria-label="Delete curve"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Firing Curve</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{title}"? This action cannot be undone and will permanently remove the curve and all its versions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Curve'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Link to={`/edit/${id}`}>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full bg-white/50 backdrop-blur-sm border-white/70 hover:bg-white/60 ring-1 ring-white/50 shadow-lg"
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
