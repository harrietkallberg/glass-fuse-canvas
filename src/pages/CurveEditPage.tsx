
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import CurveEditor from "@/components/CurveEditor";
import CurveHeader from "@/components/CurveHeader";
import ProjectDetailsTab from "@/components/ProjectDetailsTab";
import { ArrowLeft } from "lucide-react";

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
  
  const handleProjectDetailsSave = () => {
    // Here you would save the project details to your database
    toast({
      title: "Project details saved!",
      description: "Your project details have been saved successfully.",
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
        
        <CurveHeader 
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
        />
        
        <Tabs defaultValue="curve">
          <TabsList className="mb-6">
            <TabsTrigger value="curve">Curve Editor</TabsTrigger>
            <TabsTrigger value="notes">Notes & Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curve" className="space-y-6">
            <CurveEditor initialPhases={phases} onSave={setPhases} />
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-6">
            <ProjectDetailsTab 
              notes={notes} 
              setNotes={setNotes}
              materials={materials}
              setMaterials={setMaterials}
              tags={tags}
              setTags={setTags}
              handleSave={handleProjectDetailsSave}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CurveEditPage;
