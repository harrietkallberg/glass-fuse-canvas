
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import CurveEditor from "@/components/CurveEditor";
import { BookmarkPlus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const mockVersions = [
  { id: "v3", name: "Version 3", date: "Today", current: true },
  { id: "v2", name: "Version 2", date: "Yesterday", current: false },
  { id: "v1", name: "Version 1", date: "3 days ago", current: false },
];

const mockPhases = [
  { id: "1", targetTemp: 350, duration: 45, holdTime: 0 },
  { id: "2", targetTemp: 675, duration: 60, holdTime: 20 },
  { id: "3", targetTemp: 800, duration: 30, holdTime: 10 },
  { id: "4", targetTemp: 480, duration: 90, holdTime: 60 },
];

const CurveEditPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const [title, setTitle] = useState("Standard Bowl Fuse");
  const [description, setDescription] = useState("Full fuse schedule for 10mm thick glass bowl project");
  const [isPrivate, setIsPrivate] = useState(false);
  
  return (
    <div className="min-h-screen bg-glass-gradient-1 pb-20">
      <Navigation />
      
      <div className="container mx-auto pt-24 px-4">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="glass-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
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
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Version History</h3>
              <div className="space-y-2">
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
              
              <Button variant="outline" className="w-full mt-2 gap-1">
                <BookmarkPlus className="h-4 w-4" />
                Save as New Version
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="curve">
          <TabsList className="mb-6">
            <TabsTrigger value="curve">Curve Editor</TabsTrigger>
            <TabsTrigger value="notes">Notes & Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curve" className="space-y-6">
            <CurveEditor initialPhases={mockPhases} />
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-6">
            <div className="glass p-6 rounded-2xl space-y-6">
              <div>
                <Label htmlFor="notes">Project Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add notes about your glass project..." 
                  className="mt-1 min-h-[150px]"
                />
              </div>
              
              <div>
                <Label>Project Images</Label>
                <div className="mt-2 border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <p className="text-muted-foreground mb-2">
                    Drop images here or click to upload
                  </p>
                  <Button variant="outline" size="sm">
                    Upload Images
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="materials">Materials Used</Label>
                <Textarea 
                  id="materials" 
                  placeholder="List the glass materials used in this project..." 
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Add tags separated by commas (e.g. fused, bowl, blue)"
                  className="mt-1"
                />
              </div>
              
              <Button className="w-full md:w-auto">Save Project Details</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CurveEditPage;
