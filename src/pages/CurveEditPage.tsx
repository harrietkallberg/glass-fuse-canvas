import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import CurveEditor from "@/components/CurveEditor";
import { BookmarkPlus, ArrowLeft, Save } from "lucide-react";

// Mock data for version history
const mockVersions = [
  { id: "v3", name: "Version 3", date: "Today", current: true },
  { id: "v2", name: "Version 2", date: "Yesterday", current: false },
  { id: "v1", name: "Version 1", date: "3 days ago", current: false },
];

interface Phase {
  id: string;
  targetTemp: number;
  duration: number;
  holdTime: number;
}

// Default phases for new curves, now with explicit hold time for top temperature
const defaultPhases = [
  { id: "1", targetTemp: 540, duration: 60, holdTime: 0 },
  { id: "2", targetTemp: 800, duration: 30, holdTime: 10 }, // Top temp with hold time
  { id: "3", targetTemp: 520, duration: 60, holdTime: 30 },
  { id: "4", targetTemp: 460, duration: 60, holdTime: 0 },
  { id: "5", targetTemp: 20, duration: 60, holdTime: 0 }
];

const CurveEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const isNewCurve = !id || id === "new";
  
  const [title, setTitle] = useState(isNewCurve ? "New Firing Curve" : "Standard Bowl Fuse");
  const [description, setDescription] = useState(
    isNewCurve 
      ? "Describe your curve..." 
      : "Full fuse schedule for 10mm thick glass bowl project"
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [phases, setPhases] = useState<Phase[]>(defaultPhases);
  const [notes, setNotes] = useState("");
  const [materials, setMaterials] = useState("");
  const [tags, setTags] = useState("");
  
  const handleSave = () => {
    // Here you would save the curve data to your Supabase database
    toast({
      title: "Curve saved!",
      description: "Your firing curve has been saved successfully.",
    });
  };
  
  const handleSaveVersion = () => {
    // Here you would save a new version in your Supabase database
    toast({
      title: "New version created!",
      description: "Your firing curve version has been saved.",
    });
  };
  
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
        
        <div className="glass-card p-6 mb-6 bg-glass-100/20 backdrop-blur-sm rounded-2xl border border-white/10">
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
              
              <Button onClick={handleSave} className="gap-1">
                <Save className="h-4 w-4" />
                Save Curve
              </Button>
            </div>
            
            <div className="space-y-4">
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
          </div>
        </div>
        
        <Tabs defaultValue="curve">
          <TabsList className="mb-6">
            <TabsTrigger value="curve">Curve Editor</TabsTrigger>
            <TabsTrigger value="notes">Notes & Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curve" className="space-y-6">
            <CurveEditor initialPhases={phases} onSave={setPhases} />
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-6">
            <div className="glass p-6 rounded-2xl bg-glass-100/20 backdrop-blur-sm space-y-6">
              <div>
                <Label htmlFor="notes">Project Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add notes about your glass project..." 
                  className="mt-1 min-h-[150px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Add tags separated by commas (e.g. fused, bowl, blue)"
                  className="mt-1"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              
              <Button className="w-full md:w-auto" onClick={handleSave}>Save Project Details</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CurveEditPage;
