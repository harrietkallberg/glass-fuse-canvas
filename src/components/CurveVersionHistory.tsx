
import React from "react";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Version {
  id: string;
  name: string;
  date: string;
  current: boolean;
  data?: any;
}

interface CurveVersionHistoryProps {
  compact?: boolean;
  versions?: Version[];
}

const CurveVersionHistory = ({ compact = false, versions }: CurveVersionHistoryProps) => {
  // Use provided versions or fallback to default mock data
  const versionsList = versions || [
    { id: "v3", name: "Version 3", date: "Today", current: true },
    { id: "v2", name: "Version 2", date: "Yesterday", current: false },
    { id: "v1", name: "Version 1", date: "3 days ago", current: false },
  ];

  const handleSaveVersion = () => {
    // Here you would save a new version in your Supabase database
    toast({
      title: "New version created!",
      description: "Your firing curve version has been saved.",
    });
  };

  const handleViewVersion = (versionId: string) => {
    // Here you would load the selected version
    toast({
      title: "Version loaded",
      description: `Loading version ${versionId}...`,
    });
  };

  return (
    <div>
      {!compact && <h3 className="font-medium mb-3">Version History</h3>}
      
      <div className="space-y-2">
        {versionsList.map((version) => (
          <div
            key={version.id}
            className={`p-3 flex justify-between items-center rounded-lg ${
              version.current 
                ? "bg-secondary/70 border border-secondary" 
                : "bg-muted/30 hover:bg-muted/50"
            }`}
          >
            <div>
              <p className={`font-medium ${compact ? "text-sm" : ""}`}>{version.name}</p>
              <p className="text-xs text-muted-foreground">{version.date}</p>
            </div>
            
            <div className="flex gap-2 items-center">
              {version.current && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  Current
                </span>
              )}
              
              {!version.current && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8"
                  onClick={() => handleViewVersion(version.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {compact ? "" : "View"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {!compact && (
        <Button 
          variant="outline" 
          className="w-full gap-1 mt-3"
          onClick={handleSaveVersion}
        >
          <BookmarkPlus className="h-4 w-4" />
          Save as New Version
        </Button>
      )}
    </div>
  );
};

export default CurveVersionHistory;
