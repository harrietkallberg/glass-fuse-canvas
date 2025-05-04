
import React from "react";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for version history
const mockVersions = [
  { id: "v3", name: "Version 3", date: "Today", current: true },
  { id: "v2", name: "Version 2", date: "Yesterday", current: false },
  { id: "v1", name: "Version 1", date: "3 days ago", current: false },
];

interface CurveVersionHistoryProps {
  className?: string;
}

const CurveVersionHistory = ({ className }: CurveVersionHistoryProps) => {
  const handleSaveVersion = () => {
    // Here you would save a new version in your Supabase database
    toast({
      title: "New version created!",
      description: "Your firing curve version has been saved.",
    });
  };

  return (
    <div className={className}>
      <h3 className="font-medium">Version History</h3>
      <div className="space-y-2 max-h-[250px] overflow-auto pr-2">
        {mockVersions.map((version) => (
          <div
            key={version.id}
            className={`p-3 flex justify-between items-center rounded-lg ${
              version.current 
                ? "bg-secondary/70 border border-secondary" 
                : "bg-muted/30 hover:bg-muted/50 cursor-pointer"
            }`}
          >
            <div>
              <p className="font-medium">{version.name}</p>
              <p className="text-xs text-muted-foreground">{version.date}</p>
            </div>
            {version.current && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                Current
              </span>
            )}
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        className="w-full mt-2 gap-1"
        onClick={handleSaveVersion}
      >
        <BookmarkPlus className="h-4 w-4" />
        Save as New Version
      </Button>
    </div>
  );
};

export default CurveVersionHistory;
