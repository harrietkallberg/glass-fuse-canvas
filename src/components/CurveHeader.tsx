
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import CurveVersionHistory from "./CurveVersionHistory";

interface CurveHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  isPrivate: boolean;
  setIsPrivate: (isPrivate: boolean) => void;
  phases?: any[]; // Added to pass to version history
}

const CurveHeader = ({
  title,
  setTitle,
  description,
  setDescription,
  isPrivate,
  setIsPrivate,
  phases = []
}: CurveHeaderProps) => {
  // Version history state
  const [versions, setVersions] = useState([
    { id: "v3", name: "Version 3", date: "Today", current: true },
    { id: "v2", name: "Version 2", date: "Yesterday", current: false },
    { id: "v1", name: "Version 1", date: "3 days ago", current: false },
  ]);
  
  const handleSave = () => {
    // Generate a new version ID
    const newVersionId = `v${versions.length + 1}`;
    
    // Create a new version entry
    const newVersion = {
      id: newVersionId,
      name: `Version ${versions.length + 1}`,
      date: "Just now",
      current: true,
      // Store relevant data for this version
      data: {
        title,
        description,
        isPrivate,
        phases: [...phases]
      }
    };
    
    // Update version list - set current version as active, previous ones as inactive
    const updatedVersions = versions.map(version => ({
      ...version,
      current: false
    }));
    
    // Add the new version to the beginning of the list
    setVersions([newVersion, ...updatedVersions]);
    
    // Here you would save the curve data to your Supabase database
    toast({
      title: "Curve saved!",
      description: "Your firing curve has been saved successfully.",
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Curve Name</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          rows={3}
          className="mt-1 resize-none"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Switch 
          id="private" 
          checked={isPrivate} 
          onCheckedChange={setIsPrivate}
        />
        <Label htmlFor="private">Private Curve</Label>
      </div>
      
      <Button onClick={handleSave} className="w-full gap-1">
        <Save className="h-4 w-4" />
        Save Curve
      </Button>
      
      {/* Version history section */}
      <div className="pt-4 border-t border-white/10">
        <h3 className="font-medium mb-2 text-sm">Version History</h3>
        <ScrollArea className="h-[180px] pr-2">
          <CurveVersionHistory versions={versions} compact={true} />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CurveHeader;
